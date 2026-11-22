<#
    Clinisys - arrete les serveurs de developpement
    (backend 8080, frontend 5173, service video 5000).
#>
[CmdletBinding()]
param(
    [int[]]$Ports = @(8080, 5173, 5000)
)

Write-Host ''
Write-Host '  Arret des serveurs Clinisys' -ForegroundColor Cyan
Write-Host ''

foreach ($port in $Ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        Write-Host "[--] Rien n'ecoute sur le port $port" -ForegroundColor DarkGray
        continue
    }

    $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processIds) {
        try {
            $process = Get-Process -Id $processId -ErrorAction Stop
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "[OK] Port $port : $($process.ProcessName) (PID $processId) arrete" -ForegroundColor Green
        }
        catch {
            Write-Host "[!]  Impossible d'arreter le PID $processId sur le port $port" -ForegroundColor Yellow
        }
    }
}

# Flask tourne avec le rechargeur de debug : tuer l'enfant relance un nouveau
# processus. On arrete donc aussi les Python qui executent video_service.py.
$videoProcesses = Get-CimInstance Win32_Process -Filter "Name='python.exe'" -ErrorAction SilentlyContinue |
                  Where-Object { $_.CommandLine -like '*video_service.py*' }
foreach ($videoProcess in $videoProcesses) {
    Stop-Process -Id $videoProcess.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Service video : python (PID $($videoProcess.ProcessId)) arrete" -ForegroundColor Green
}

Write-Host ''
