<#
    Clinisys - lanceur de developpement

    Demarre le backend Spring Boot (port 8080) et le frontend Vite (port 5173),
    puis ouvre le navigateur.

    Exemples :
        .\start.ps1                  # backend + frontend + navigateur
        .\start.ps1 -BackendOnly     # backend seul
        .\start.ps1 -FrontendOnly    # frontend seul
        .\start.ps1 -NoBrowser       # ne pas ouvrir le navigateur
#>
[CmdletBinding()]
param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$root         = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$backendDir   = Join-Path $root 'clinicsystem\clinicsystem'
$frontendDir  = Join-Path $root 'menu-app'
$backendPort  = 8080
$frontendPort = 5173
$mysqlPort    = 3306

function Write-Step { param($Message) Write-Host "[..] $Message" -ForegroundColor Cyan }
function Write-Ok   { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Note { param($Message) Write-Host "[!]  $Message" -ForegroundColor Yellow }
function Write-Fail { param($Message) Write-Host "[X]  $Message" -ForegroundColor Red }

function Test-PortOpen {
    param([int]$Port)
    # Vite ecoute sur ::1 (IPv6) et Tomcat sur 0.0.0.0 : Get-NetTCPConnection
    # couvre les deux familles d'adresses, contrairement a un TcpClient IPv4.
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        return [bool]$listening
    }

    $netstat = & netstat -ano 2>$null
    return [bool]($netstat | Select-String -Pattern ":$Port\s+.*LISTENING")
}

function Wait-PortOpen {
    param([int]$Port, [int]$TimeoutSeconds = 120)
    for ($i = 0; $i -lt $TimeoutSeconds; $i++) {
        Start-Sleep -Seconds 1
        if (Test-PortOpen $Port) { return $true }
    }
    return $false
}

function Get-JdkMajor {
    param([string]$JavaHome)
    $releaseFile = Join-Path $JavaHome 'release'
    if (Test-Path $releaseFile) {
        $line = Get-Content $releaseFile -ErrorAction SilentlyContinue |
                Where-Object { $_ -match '^JAVA_VERSION=' } |
                Select-Object -First 1
        if ($line -match 'JAVA_VERSION="(\d+)') { return [int]$Matches[1] }
    }
    $javaExe = Join-Path $JavaHome 'bin\java.exe'
    if (Test-Path $javaExe) {
        $out = (& $javaExe -version 2>&1 | Select-Object -First 1)
        if ("$out" -match 'version "(\d+)') { return [int]$Matches[1] }
    }
    return 0
}

function Find-Jdk {
    $candidates = New-Object System.Collections.Generic.List[string]
    if ($env:JAVA_HOME) { $candidates.Add($env:JAVA_HOME) }

    $searchRoots = @(
        'C:\Program Files\Java',
        'C:\Program Files\Eclipse Adoptium',
        'C:\Program Files\Microsoft',
        'C:\Program Files\Amazon Corretto',
        'C:\Program Files\Zulu',
        'C:\Program Files\BellSoft'
    )
    foreach ($searchRoot in $searchRoots) {
        if (Test-Path $searchRoot) {
            Get-ChildItem -Path $searchRoot -Directory -ErrorAction SilentlyContinue |
                ForEach-Object { $candidates.Add($_.FullName) }
        }
    }

    $best = $null
    $bestMajor = 0
    foreach ($candidate in $candidates) {
        if (-not (Test-Path (Join-Path $candidate 'bin\java.exe'))) { continue }
        $major = Get-JdkMajor -JavaHome $candidate
        if ($major -ge 17 -and $major -gt $bestMajor) {
            $bestMajor = $major
            $best = $candidate
        }
    }

    if ($best) { return [pscustomobject]@{ Path = $best; Major = $bestMajor } }
    return $null
}

Write-Host ''
Write-Host '  ============================================' -ForegroundColor DarkCyan
Write-Host '    CLINISYS  -  environnement de dev' -ForegroundColor Cyan
Write-Host '  ============================================' -ForegroundColor DarkCyan
Write-Host ''

# --------------------------------------------------------------------------
# 1. Java 17+ (obligatoire pour le backend Spring Boot 4)
# --------------------------------------------------------------------------
if (-not $FrontendOnly) {
    if (-not (Test-Path $backendDir)) {
        Write-Fail "Dossier backend introuvable : $backendDir"
        exit 1
    }

    $jdk = Find-Jdk
    if (-not $jdk) {
        Write-Fail "Aucun JDK 17 ou superieur detecte sur cette machine."
        Write-Host '     Le "java" du PATH est peut-etre Java 8 : le backend ne peut pas demarrer avec.'
        Write-Host '     Installez un JDK 17+ (https://adoptium.net) ou lancez :'
        Write-Host '         winget install EclipseAdoptium.Temurin.21.JDK'
        exit 1
    }

    Write-Ok "JDK $($jdk.Major) : $($jdk.Path)"
    $env:JAVA_HOME = $jdk.Path
    $env:PATH = "$($jdk.Path)\bin;$env:PATH"

    if (-not (Test-PortOpen $mysqlPort)) {
        Write-Note "MySQL ne repond pas sur le port $mysqlPort : demarrez MySQL (XAMPP/WAMP) sinon la connexion echouera."
    }
}

# --------------------------------------------------------------------------
# 2. Backend
# --------------------------------------------------------------------------
$backendReady = $false
if (-not $FrontendOnly) {
    if (Test-PortOpen $backendPort) {
        Write-Ok "Backend deja en ligne sur http://localhost:$backendPort"
        $backendReady = $true
    }
    else {
        Write-Step 'Demarrage du backend Spring Boot...'
        $backendCommand = "cd /d `"$backendDir`" && call .\mvnw.cmd spring-boot:run"
        Start-Process -FilePath 'cmd.exe' `
                      -ArgumentList '/k', $backendCommand `
                      -WorkingDirectory $backendDir | Out-Null

        if (Wait-PortOpen -Port $backendPort -TimeoutSeconds 180) {
            Write-Ok "Backend pret sur http://localhost:$backendPort"
            $backendReady = $true
        }
        else {
            Write-Note "Le backend n'a pas repondu dans le delai prevu. Verifiez la fenetre du backend (erreur MySQL ou compilation)."
        }
    }
}

# --------------------------------------------------------------------------
# 3. Frontend
# --------------------------------------------------------------------------
if (-not $BackendOnly) {
    if (-not (Test-Path $frontendDir)) {
        Write-Fail "Dossier frontend introuvable : $frontendDir"
        exit 1
    }

    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Fail "npm est introuvable. Installez Node.js (https://nodejs.org)."
        exit 1
    }

    if (-not (Test-Path (Join-Path $frontendDir 'node_modules'))) {
        Write-Step 'Installation des dependances du frontend (npm install)...'
        Push-Location $frontendDir
        try {
            & npm install
            if ($LASTEXITCODE -ne 0) {
                Write-Fail 'npm install a echoue.'
                exit 1
            }
        }
        finally {
            Pop-Location
        }
        Write-Ok 'Dependances installees.'
    }

    if (Test-PortOpen $frontendPort) {
        Write-Ok "Frontend deja en ligne sur http://localhost:$frontendPort"
    }
    else {
        Write-Step 'Demarrage du frontend Vite...'
        $frontendCommand = "cd /d `"$frontendDir`" && npm run dev"
        Start-Process -FilePath 'cmd.exe' `
                      -ArgumentList '/k', $frontendCommand `
                      -WorkingDirectory $frontendDir | Out-Null

        if (Wait-PortOpen -Port $frontendPort -TimeoutSeconds 90) {
            Write-Ok "Frontend pret sur http://localhost:$frontendPort"
        }
        else {
            Write-Note "Le frontend n'a pas repondu dans le delai prevu. Verifiez la fenetre du frontend."
        }
    }

    if (-not $NoBrowser) {
        Start-Process "http://localhost:$frontendPort" | Out-Null
        Write-Ok "Navigateur ouvert sur http://localhost:$frontendPort"
    }
}

# --------------------------------------------------------------------------
# 4. Service video (Python, port 5000) - necessaire pour "Generer la video"
# --------------------------------------------------------------------------
if (-not $BackendOnly -and -not $FrontendOnly) {
    $videoLauncher = Join-Path $root 'start-video.cmd'
    if (Test-Path $videoLauncher) {
        if (Test-PortOpen 5000) {
            Write-Ok 'Service video deja en ligne sur http://localhost:5000'
        }
        else {
            Write-Step 'Demarrage du service video (Python, port 5000)...'
            Start-Process -FilePath 'cmd.exe' `
                          -ArgumentList '/k', "call `"$videoLauncher`"" `
                          -WorkingDirectory $root | Out-Null

            if (Wait-PortOpen -Port 5000 -TimeoutSeconds 60) {
                Write-Ok 'Service video pret sur http://localhost:5000'
            }
            else {
                Write-Note 'Service video indisponible : "Generer la video" echouera. Lancez start-video.cmd pour voir l''erreur.'
            }
        }
    }
}

Write-Host ''
Write-Host '  Compte admin : zouba123@gmail.com / 12345' -ForegroundColor Gray
Write-Host '  Arreter le projet : .\stop.cmd' -ForegroundColor Gray
Write-Host ''

if ($backendReady -and -not $FrontendOnly) {
    Write-Host '  Le backend tourne dans sa propre fenetre : laissez-la ouverte.' -ForegroundColor DarkGray
    Write-Host ''
}
