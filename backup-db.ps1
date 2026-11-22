<#
    Clinisys - sauvegarde de la base de donnees MySQL.

    Lit les identifiants depuis
    clinicsystem/clinicsystem/src/main/resources/application.properties
    puis cree un dump compresse dans backups/.

    Exemple :
        .\backup-db.ps1
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$propertiesFile = Join-Path $root 'clinicsystem\clinicsystem\src\main\resources\application.properties'
$backupDir = Join-Path $root 'backups'

function Write-Step { param($Message) Write-Host "[..] $Message" -ForegroundColor Cyan }
function Write-Ok   { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Fail { param($Message) Write-Host "[X]  $Message" -ForegroundColor Red }

if (-not (Test-Path $propertiesFile)) {
    Write-Fail "Fichier introuvable : $propertiesFile"
    exit 1
}

$properties = @{}
Get-Content $propertiesFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)$') {
        $properties[$Matches[1]] = $Matches[2].Trim()
    }
}

$jdbcUrl = $properties['spring.datasource.url']
if (-not $jdbcUrl -or $jdbcUrl -notmatch 'jdbc:mysql://([^:/]+)(?::(\d+))?/(\w+)') {
    Write-Fail "URL JDBC illisible dans application.properties : $jdbcUrl"
    exit 1
}
$dbHost = $Matches[1]
$dbPort = if ($Matches[2]) { $Matches[2] } else { '3306' }
$dbName = $Matches[3]
$dbUser = $properties['spring.datasource.username']
$dbPassword = $properties['spring.datasource.password']

$mysqldump = (Get-ChildItem 'C:\Program Files\MySQL\*\bin\mysqldump.exe' -ErrorAction SilentlyContinue |
              Sort-Object FullName -Descending | Select-Object -First 1).FullName
if (-not $mysqldump) {
    $cmd = Get-Command mysqldump -ErrorAction SilentlyContinue
    if ($cmd) { $mysqldump = $cmd.Source }
}
if (-not $mysqldump) {
    Write-Fail "mysqldump.exe introuvable. Installez MySQL ou ajoutez son dossier bin au PATH."
    exit 1
}

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$target = Join-Path $backupDir "clinicsystem-$stamp.sql"

Write-Step "Sauvegarde de la base '$dbName' vers $target"

# mysqldump ecrit ses avertissements sur stderr : on ne doit pas les traiter
# comme des erreurs bloquantes (sinon PowerShell interrompt la sauvegarde).
$previousErrorAction = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$env:MYSQL_PWD = $dbPassword
try {
    & $mysqldump --host=$dbHost --port=$dbPort --user=$dbUser `
        --single-transaction --routines --triggers --default-character-set=utf8mb4 `
        $dbName 1> $target 2> "$target.err"
    $dumpExitCode = $LASTEXITCODE
}
finally {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
    $ErrorActionPreference = $previousErrorAction
}

if ($dumpExitCode -ne 0 -or -not (Test-Path $target) -or (Get-Item $target).Length -eq 0) {
    Write-Fail "La sauvegarde a echoue :"
    Get-Content "$target.err" -ErrorAction SilentlyContinue | Select-Object -Last 5
    Remove-Item $target -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item "$target.err" -ErrorAction SilentlyContinue
$size = [Math]::Round((Get-Item $target).Length / 1KB, 1)
Write-Ok "Sauvegarde creee : $target ($size Ko)"
Write-Host ''
Write-Host '  Pour restaurer un dump :' -ForegroundColor Gray
Write-Host "    mysql -u $dbUser -p $dbName < fichier.sql" -ForegroundColor Gray
Write-Host ''
