@echo off
rem Clinisys - demarre le service de generation de video (port 5000)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-video.ps1" %*
if errorlevel 1 pause
