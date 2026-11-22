<#
    Clinisys - service de generation de video (Flask + Pillow, port 5000).

    Choisit un interpreteur Python qui possede reellement Flask, flask-cors,
    Pillow et requests. Le Python 3.15 alpha du PATH a un Pillow incompatible
    ("module PIL._imaging uses unknown slot ID"), il est donc ignore.

    Si aucun interpreteur ne convient, cree un environnement virtuel .venv
    et installe les dependances.

    Exemple :
        .\start-video.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$serviceScript = Join-Path $root 'video_service.py'
$port = 5000

function Write-Step { param($Message) Write-Host "[..] $Message" -ForegroundColor Cyan }
function Write-Ok   { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Note { param($Message) Write-Host "[!]  $Message" -ForegroundColor Yellow }
function Write-Fail { param($Message) Write-Host "[X]  $Message" -ForegroundColor Red }

function Test-PortOpen {
    param([int]$Port)
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
        return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
    }
    $netstat = & netstat -ano 2>$null
    return [bool]($netstat | Select-String -Pattern ":$Port\s+.*LISTENING")
}

# Execute un Python sans que ses messages stderr n'interrompent le script.
function Invoke-PythonQuiet {
    param([string]$Python, [string[]]$PythonArgs = @())
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & $Python @PythonArgs 2>$null
        return [pscustomobject]@{ ExitCode = $LASTEXITCODE; Output = $output }
    }
    catch {
        return [pscustomobject]@{ ExitCode = 1; Output = $null }
    }
    finally {
        $ErrorActionPreference = $previous
    }
}

function Get-PythonCandidates {
    $candidates = New-Object System.Collections.Generic.List[string]

    # 1) Tous les Python connus du lanceur "py" (py -0p)
    $listing = Invoke-PythonQuiet -Python 'py' -PythonArgs @('-0p')
    if ($listing.ExitCode -eq 0) {
        foreach ($line in $listing.Output) {
            if ($line -match '([A-Za-z]:\\.*?python\.exe)\s*$') {
                $candidates.Add($Matches[1])
            }
        }
    }

    # 2) Python du PATH
    foreach ($name in @('python', 'python3')) {
        $command = Get-Command $name -ErrorAction SilentlyContinue
        if ($command -and $command.Source) {
            $candidates.Add($command.Source)
        }
    }

    return $candidates | Select-Object -Unique
}

function Get-PythonInfo {
    param([string]$Python)
    $result = Invoke-PythonQuiet -Python $Python -PythonArgs @(
        '-c', "import sys; print('%d.%d.%s' % (sys.version_info[0], sys.version_info[1], sys.version_info[3]))"
    )
    if ($result.ExitCode -ne 0 -or -not $result.Output) { return $null }

    $parts = "$($result.Output)".Trim() -split '\.'
    if ($parts.Count -lt 3) { return $null }

    return [pscustomobject]@{
        Version = "$($parts[0]).$($parts[1])"
        Level   = $parts[2]
    }
}

function Test-PythonModules {
    param([string]$Python)
    $result = Invoke-PythonQuiet -Python $Python -PythonArgs @(
        '-c', 'import flask, flask_cors, PIL, requests'
    )
    return ($result.ExitCode -eq 0)
}

function Start-VideoProcess {
    param([string]$Python)
    Start-Process -FilePath $Python `
                  -ArgumentList "`"$serviceScript`"" `
                  -WorkingDirectory $root | Out-Null
}

if (-not (Test-Path $serviceScript)) {
    Write-Fail "Fichier introuvable : $serviceScript"
    exit 1
}

Write-Host ''
Write-Host '  Clinisys - service video' -ForegroundColor Cyan
Write-Host ''

if (Test-PortOpen $port) {
    Write-Ok "Le service video est deja en ligne sur http://localhost:$port"
    exit 0
}

$candidates = @(Get-PythonCandidates)
if ($candidates.Count -eq 0) {
    Write-Fail 'Python est introuvable. Installez Python 3.11 ou plus recent (https://www.python.org).'
    exit 1
}

$working = $null
foreach ($candidate in $candidates) {
    if (Test-PythonModules -Python $candidate) {
        $working = $candidate
        break
    }
}

if ($working) {
    Write-Step "Demarrage avec $working"
    Start-VideoProcess -Python $working
}
else {
    # Aucun interpreteur pret : on cree .venv avec une version stable.
    $base = $null
    foreach ($candidate in $candidates) {
        $info = Get-PythonInfo -Python $candidate
        if ($info -and $info.Level -eq 'final') {
            $base = $candidate
            break
        }
    }

    if (-not $base) {
        Write-Fail 'Aucun Python stable (final) installe. Installez Python 3.11+ puis relancez.'
        exit 1
    }

    $venv = Join-Path $root '.venv'
    $venvPython = Join-Path $venv 'Scripts\python.exe'

    if (-not (Test-Path $venvPython)) {
        Write-Step "Creation de l'environnement virtuel .venv avec $base"
        $creation = Invoke-PythonQuiet -Python $base -PythonArgs @('-m', 'venv', $venv)
        if ($creation.ExitCode -ne 0) {
            Write-Fail "Creation du venv impossible avec $base"
            exit 1
        }
    }

    Write-Step 'Installation de Flask, flask-cors, Pillow et requests...'
    $install = Invoke-PythonQuiet -Python $venvPython -PythonArgs @(
        '-m', 'pip', 'install', '--quiet', 'flask', 'flask-cors', 'Pillow', 'requests'
    )
    if ($install.ExitCode -ne 0) {
        Write-Fail "Installation des dependances impossible (connexion Internet requise)."
        exit 1
    }

    if (-not (Test-PythonModules -Python $venvPython)) {
        Write-Fail 'Les dependances Python ne se chargent pas dans .venv.'
        exit 1
    }

    Write-Step "Demarrage avec $venvPython"
    Start-VideoProcess -Python $venvPython
}

for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Seconds 1
    if (Test-PortOpen $port) {
        Write-Ok "Service video pret sur http://localhost:$port"
        Write-Host ''
        exit 0
    }
}

Write-Fail "Le service video n'a pas demarre. Lancez 'start-video.cmd' dans un terminal pour voir l'erreur."
exit 1
