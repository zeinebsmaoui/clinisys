@echo off
rem Clinisys - sauvegarde de la base MySQL dans backups\
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup-db.ps1" %*
if errorlevel 1 pause
