@echo off
chcp 65001 >nul
title Pulse Security Guard v1.1.1
color 0A
:menu
cls
echo PULSE SECURITY GUARD v1.1.1 — Monitor + Threat scan (100% locale)
echo [1] Monitor Top 15 CPU  [2] Scansione minacce  [3] One-Click Clean  [4] Startup  [5] Hash VirusTotal  [6] Guida virus  [0] Esci
set /p c="Scelta: "
if "%c%"=="1" powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 Name,Id,CPU,@{n='RAM(MB)';e={[math]::Round($_.WorkingSet64/1MB,0)}} | Format-Table -AutoSize" & pause & goto menu
if "%c%"=="2" powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Process | Where-Object { $_.CPU -gt 60 -and $_.Path -like '*Temp*' } | Select-Object Name,Id,Path | Format-Table -AutoSize" & pause & goto menu
if "%c%"=="3" powershell -NoProfile -ExecutionPolicy Bypass -Command "$safe='explorer','csrss','dwm','lsass','wininit','services','smss','winlogon','fontdrvhost';$k=0;foreach($p in (Get-Process|Sort-Object CPU -Descending)){if($k -ge 10){break};if($p.CPU -gt 60 -and $safe -notcontains $p.ProcessName){try{Stop-Process -Id $p.Id -Force -ErrorAction Stop;'Killato: '+$p.ProcessName;$k++}catch{}}} 'Finito. Killati: '+$k" & pause & goto menu
if "%c%"=="4" reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" & reg query "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" & pause & goto menu
if "%c%"=="6" echo Isola, firma/percorso, hash su virustotal.com, disabilita Startup, Defender offline. & pause & goto menu
if "%c%"=="0" exit /b
goto menu
