@echo off
rem Clinisys - demarre uniquement le frontend (Vite, port 5173)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" -FrontendOnly %*
if errorlevel 1 pause
