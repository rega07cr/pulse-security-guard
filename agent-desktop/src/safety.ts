// Safety Tag — stessa lista del backend Rust. Non killare mai questi.
export const PROTECTED = new Set([
  'explorer.exe', 'csrss.exe', 'dwm.exe', 'lsass.exe', 'wininit.exe',
  'services.exe', 'smss.exe', 'winlogon.exe', 'fontdrvhost.exe',
  'system', 'registry', 'memory compression',
]);

export function isProtected(name: string): boolean {
  const n = name.toLowerCase().trim();
  for (const p of PROTECTED) if (n === p || n.startsWith(p)) return true;
  return false;
}

export function healthColor(score: number): string {
  if (score >= 75) return '#10b981';
  if (score >= 45) return '#f59e0b';
  return '#ff6b5e';
}
