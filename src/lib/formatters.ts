export function diffDays(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function mode(arr: string[]): string {
  if (arr.length === 0) return 'N/A';
  const counts: Record<string, number> = {};
  arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  let maxK = arr[0], maxV = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > maxV) { maxK = k; maxV = v; }
  }
  return maxK;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

export function formatPercent(n: number): string {
  return `${round1(n)}%`;
}

export function formatCurrency(n: number): string {
  return `₹ ${round1(n)} L`;
}

export function formatYears(n: number): string {
  return `${round1(n)} Yrs`;
}

export function safeStr(v: any): string | null {
  if (v === null || v === undefined || v === '') return null;
  return String(v).trim();
}

export function safeLower(v: any): string {
  const s = safeStr(v);
  return s ? s.toLowerCase() : '';
}

export function titleCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function parseDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    // Excel serial number
    const d = new Date((value - 25569) * 86400 * 1000);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Try ISO / standard parsing
    let d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
    // Try DD/MM/YYYY or DD-MM-YYYY
    const parts = trimmed.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const [a, b, c] = parts.map(Number);
      if (c > 1900) { d = new Date(c, b - 1, a); if (!isNaN(d.getTime())) return d; }
      if (a > 1900) { d = new Date(a, b - 1, c); if (!isNaN(d.getTime())) return d; }
    }
    return null;
  }
  return null;
}

export function parseNum(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}
