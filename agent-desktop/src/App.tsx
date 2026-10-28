import { useEffect, useMemo, useState } from 'react';
import { healthColor, isProtected } from './safety';
import { RISK_META, VIRUS_GUIDE, assessThreat, type RiskLevel } from './security';
type Proc = { pid: number; name: string; cpu: number; ram_mb: number; gpu: number; disk: number; exe_path?: string; signed?: boolean; net_conns?: number; risk_score?: number; risk_level?: RiskLevel; protected?: boolean; };
type SortKey = 'cpu' | 'ram_mb' | 'gpu' | 'disk' | 'risk_score';
const MOCK: Proc[] = [{ pid: 9133, name: 'x86_svchost_check.exe', cpu: 61.2, ram_mb: 890, gpu: 72, disk: 3, signed: false, net_conns: 9 }];
export default function App() {
  const [procs, setProcs] = useState(MOCK);
  const [health] = useState(62);
  const enriched = useMemo(()=>procs.map(p=>{const v=assessThreat({name:p.name,path:p.exe_path,signed:p.signed,cpu:p.cpu,gpu:p.gpu,systemIdle:true,netConns:p.net_conns});return {...p,risk_level:v.level,risk_score:v.score,reasons:v.reasons};}),[procs]);
  return <div><h1>Pulse {health}</h1><ul>{enriched.map(p=><li key={p.pid}>{p.name} {p.risk_score} {RISK_META[p.risk_level].label}</li>)}</ul><p>{VIRUS_GUIDE.title}</p></div>;
}
