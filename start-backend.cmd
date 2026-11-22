@echo off
rem Clinisys - demarre uniquement le backend (Spring Boot, port 8080)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" -BackendOnly %*
if errorlevel 1 pause
