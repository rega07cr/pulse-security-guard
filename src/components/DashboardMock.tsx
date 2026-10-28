import { useState } from 'react'
type P = { name: string; pid: number; cpu: number; risk: string }
const initial: P[] = [{name:'x86_svchost_check.exe',pid:9133,cpu:61.2,risk:'Alto rischio'},{name:'Cyberpunk2077.exe',pid:8420,cpu:42.8,risk:'Sicuro'},{name:'chrome.exe',pid:5124,cpu:18.4,risk:'Sicuro'},{name:'explorer.exe',pid:1024,cpu:0.8,risk:'Sistema'}]
export function Monogram({ initials }: { initials: string }) { return <span>{initials}</span> }
export function DashboardMock() {
  const [procs,setProcs]=useState(initial)
  return <div><h3>Pulse live — Health 62 — 1 minaccia attiva</h3><ul>{procs.map(p=><li key={p.pid}>{p.name} #{p.pid} — CPU {p.cpu}% — {p.risk} <button onClick={()=>setProcs(pr=>pr.filter(x=>x.pid!==p.pid))}>Isola</button></li>)}</ul><p>Safety Tag: explorer.exe protetto. One-Click Clean: max 10/ciclo.</p></div>
}
