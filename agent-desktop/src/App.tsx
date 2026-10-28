import { useEffect, useMemo, useState } from 'react';
import { healthColor, isProtected } from './safety';
import { RISK_META, VIRUS_GUIDE, assessThreat, type RiskLevel } from './security';
type Proc = { pid: number; name: string; cpu: number; ram_mb: number; gpu: number; disk: number; exe_path?: string; sha256?: string; signed?: boolean; net_conns?: number; risk_score?: number; risk_level?: RiskLevel; protected?: boolean; };
type SortKey = 'cpu' | 'ram_mb' | 'gpu' | 'disk' | 'risk_score';
const MOCK: Proc[] = [
  { pid: 8420, name: 'Cyberpunk2077.exe', cpu: 42.8, ram_mb: 3204, gpu: 78, disk: 12, signed: true, net_conns: 2 },
  { pid: 9133, name: 'x86_svchost_check.exe', cpu: 61.2, ram_mb: 890, gpu: 72, disk: 3, exe_path: 'C:/Users/you/AppData/Local/Temp/x86_svchost_check.exe', signed: false, net_conns: 9 },
  { pid: 5124, name: 'chrome.exe', cpu: 18.4, ram_mb: 1840, gpu: 12, disk: 4, signed: true, net_conns: 12 },
  { pid: 1024, name: 'explorer.exe', cpu: 0.8, ram_mb: 180, gpu: 1, disk: 0, signed: true, protected: true },
];
export default function App() {
  const [tab, setTab] = useState<'monitor'|'security'|'startup'>('monitor');
  const [procs, setProcs] = useState<Proc[]>(MOCK);
  const [sort, setSort] = useState<SortKey>('risk_score');
  const [msg, setMsg] = useState<string|null>(null);
  const [health, setHealth] = useState(62);
  const [vtKey, setVtKey] = useState('');
  const [vtOut, setVtOut] = useState<string|null>(null);
  useEffect(()=>{ let a=true; async function tick(){ try{ const {invoke}=await import('@tauri-apps/api/core'); const s=await invoke<{procs:Proc[];health:number}>('snapshot'); if(!a) return; setProcs(s.procs.length?s.procs:MOCK); setHealth(s.health);}catch{ if(!a) return; setProcs(p=>p.map(x=>({...x,cpu:Math.max(0,x.cpu+(Math.random()*4-2))}))); } } const id=setInterval(tick,1500); return ()=>{a=false;clearInterval(id);}; },[]);
  const enriched = useMemo(()=>procs.map(p=>{ const v=assessThreat({name:p.name,path:p.exe_path,signed:p.signed,hasWindow:true,cpu:p.cpu,gpu:p.gpu,systemIdle:p.cpu>30,netConns:p.net_conns??0}); return {...p,risk_level:(p.risk_level as RiskLevel)??v.level,risk_score:p.risk_score??v.score,reasons:v.reasons}; }),[procs]);
  const sorted = useMemo(()=>([...enriched].sort((a,b)=>(b[sort]??0)-(a[sort]??0))),[enriched,sort]);
  const threats = enriched.filter(p=>p.risk_level==='malicious'||p.risk_level==='suspicious');
  const color = healthColor(health);
  async function kill(p: Proc){ if(p.protected||isProtected(p.name)){ setMsg(p.name+' protetto dal Safety Tag.'); return; } if(!confirm('Terminare '+p.name+'?')) return; try{ const {invoke}=await import('@tauri-apps/api/core'); setMsg(String(await invoke('kill_process',{pid:p.pid}))); }catch{ setMsg(p.name+' terminato (mock).'); } setProcs(pr=>pr.filter(x=>x.pid!==p.pid)); setTimeout(()=>setMsg(null),3500); }
  async function clean(){ if(!confirm('One-Click Clean?')) return; try{ const {invoke}=await import('@tauri-apps/api/core'); setMsg(String(await invoke('one_click_clean'))); }catch{ setMsg('Pulizia mock completata.'); } setProcs(pr=>pr.filter(p=>p.protected||(p.cpu<=15))); setTimeout(()=>setMsg(null),4000); }
  async function checkVT(p: Proc){ if(!vtKey){ setVtOut('Incolla la VT_API_KEY gratuita.'); return; } try{ const {invoke}=await import('@tauri-apps/api/core'); setVtOut(String(await invoke('virustotal_lookup',{cfg:{api_key:vtKey,sha256:p.sha256||('mock-'+p.pid)}}))); }catch{ setVtOut('Copia lo SHA-256 su virustotal.com/gui/file/SHA256.'); } }
  return (<div style={{background:'#0D0D0F',color:'#fff',minHeight:'100vh',padding:24,fontFamily:'Inter,sans-serif'}}>
    <h1>Pulse Security Guard — {threats.length?threats.length+' minacce':'Sistema sicuro'} — Health {health}</h1>
    <div style={{display:'flex',gap:8}}><button onClick={()=>setTab('monitor')}>Monitor</button><button onClick={()=>setTab('security')}>Sicurezza</button><button onClick={()=>setTab('startup')}>Startup</button><button onClick={clean}>One-Click Clean</button></div>
    {tab==='monitor'&&<ul>{sorted.map(p=>(<li key={p.pid}>{p.name} — CPU {p.cpu.toFixed(1)}% — {RISK_META[p.risk_level].label} {p.risk_score} <button onClick={()=>kill(p)}>Isola</button> <button onClick={()=>checkVT(p)}>VT</button></li>))}</ul>}
    {tab==='security'&&<div><input value={vtKey} onChange={e=>setVtKey(e.target.value)} placeholder='VT_API_KEY' />{vtOut&&<p>{vtOut}</p>}{threats.map(p=>(<div key={p.pid}>{p.name} rischio {p.risk_score}<ul>{p.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul></div>))}<b>{VIRUS_GUIDE.title}</b><ol>{VIRUS_GUIDE.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></div>}
    {tab==='startup'&&<p>HKCU/HKLM Run letti via Rust winreg (solo Windows). Disabilita voci da Temp.</p>}
    {msg&&<p>{msg}</p>}
    <p style={{color:'#888'}}>{color}</p>
  </div>);
}
