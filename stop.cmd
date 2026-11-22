@echo off
rem Clinisys - arrete le backend (8080) et le frontend (5173)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1" %*
if errorlevel 1 pause
