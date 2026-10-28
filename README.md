# Pulse — System Monitor & Security Guard

Tauri 2 + Rust + React per Windows + landing Cyber-Glass.

- Agent: `agent-desktop/` — snapshot, threat engine, SHA-256 + VirusTotal, Startup HKCU/HKLM, One-Click Clean
- Landing: `src/` — Vite + Tailwind, sezione #sicurezza con guida anti-virus

```sh
cd agent-desktop && npm install && npm run tauri:dev
```

VT_API_KEY solo in locale, mai nel repo.
