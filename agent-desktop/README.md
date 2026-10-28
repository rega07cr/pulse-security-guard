# Pulse Agent — app desktop Windows (Tauri + React)

System Monitor & Security Guard: processi, Health Score, threat engine, VirusTotal, Startup, One-Click Clean.

```sh
cd agent-desktop
npm install
npm run tauri:dev
npm run tauri:build
```

Safety: explorer.exe, csrss.exe, dwm.exe, lsass.exe, wininit.exe protetti.
Health: 100-(0.45*cpu+0.30*ram+0.15*gpu+0.10*disk).
