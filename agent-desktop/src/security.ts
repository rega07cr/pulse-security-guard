// Pulse Security Guard — euristiche locali + VirusTotal opzionale.
export type RiskLevel = 'safe' | 'unknown' | 'suspicious' | 'malicious';

export interface ThreatVerdict {
  level: RiskLevel;
  score: number;
  reasons: string[];
}

const RANDOM_PATTERNS = [/^[a-z0-9]{10,}\.exe$/i, /svchost.*\.exe$/i, /.*check.*\.exe$/i, /.*update\d+\.exe$/i];
const STRANGE_PATHS = ['\\temp\\', '\\tmp\\', '\\appdata\\local\\temp', ' \public\\', 'startup'];

export function assessThreat(p: {
  name: string; path?: string; signed?: boolean; hasWindow?: boolean;
  cpu: number; gpu: number; systemIdle?: boolean; netConns?: number; vtDetections?: number;
}): ThreatVerdict {
  const reasons: string[] = [];
  let score = 0;
  const push = (pts: number, r: string) => { score += pts; reasons.push(r); };
  if (p.signed === false) push(25, 'Non firmato digitalmente — publisher non verificato.');
  if (p.hasWindow === false && p.cpu > 5) push(15, 'Processo nascosto senza finestra ma attivo.');
  if (p.systemIdle && p.cpu > 30) push(30, 'CPU alta a PC inattivo — tipico crypto-miner.');
  if (p.systemIdle && p.gpu > 50) push(30, 'GPU alta a riposo — possibile miner nascosto.');
  if (RANDOM_PATTERNS.some((re) => re.test(p.name))) push(20, 'Nome generico/casuale tipo malware (es. x86_svchost_check.exe).');
  if (p.path && STRANGE_PATHS.some((s) => p.path!.toLowerCase().includes(s))) push(20, 'Percorso anomalo: ' + p.path);
  if ((p.netConns ?? 0) > 5 && p.signed === false) push(15, 'Molte connessioni di rete da eseguibile non firmato.');
  if (p.vtDetections && p.vtDetections >= 5) push(40, 'VirusTotal: ' + p.vtDetections + ' motori lo segnalano.');
  else if (p.vtDetections && p.vtDetections > 0) push(15, 'VirusTotal: segnalazioni lievi.');
  score = Math.min(100, score);
  const level: RiskLevel =
    score >= 60 ? 'malicious' : score >= 35 ? 'suspicious' : score >= 15 || p.signed === false ? 'unknown' : 'safe';
  if (level === 'safe') reasons.push('Firmato da publisher verificato, comportamento normale.');
  return { level, score, reasons };
}

export const RISK_META: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  safe: { label: 'Sicuro', color: '#10b981', bg: 'rgba(16,185,129,.12)' },
  unknown: { label: 'Non firmato', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' },
  suspicious: { label: 'Sospetto', color: '#fb923c', bg: 'rgba(251,146,60,.14)' },
  malicious: { label: 'Alto rischio', color: '#ff6b5e', bg: 'rgba(255,107,94,.14)' },
};

export const VIRUS_GUIDE: { title: string; steps: string[] } = {
  title: 'Trovato processo ad alto rischio? Fai cosi (in ordine):',
  steps: [
    '1. Isolalo subito con Isola processo (kill + blocco restart).',
    '2. Controlla firma e percorso: Temp non firmato = quasi sempre miner/bloatware.',
    '3. Verifica hash su VirusTotal: virustotal.com/gui/file/SHA256.',
    '4. Rimuovi la persistenza: disabilita la voce Startup, riavvia, poi cancella il file.',
    '5. Scansione Defender offline + cambia password da altro dispositivo se c-erano connessioni attive.',
  ],
};
