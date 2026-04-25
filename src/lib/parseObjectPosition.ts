/**
 * Parse CSS `object-position` (e.g. `50% 50%`, `0% 18%`) to 0–1 alignment
 * for canvas drawing that matches `object-fit: cover` cropping.
 * If a single value is given, the second axis defaults to 50% (per CSS).
 */
export function parseObjectPosition(s: string): { x: number; y: number } {
  const parts = s.trim().split(/\s+/);
  const p = (part: string | undefined, def: number): number => {
    if (!part) return def;
    const m = part.match(/^(-?[\d.]+)%$/);
    if (m) {
      const n = parseFloat(m[1]);
      if (Number.isFinite(n)) {
        return Math.min(1, Math.max(0, n / 100));
      }
    }
    return def;
  };
  const x = p(parts[0], 0.5);
  const y = parts.length >= 2 ? p(parts[1], 0.5) : 0.5;
  return { x, y };
}
