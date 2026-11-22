@echo off
rem Clinisys - demarre le backend + le frontend et ouvre le navigateur
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
if errorlevel 1 pause
