export function formatPremium(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }

  if (value >= 1_000) {
    const k = value / 1_000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
  }

  return value.toString();
}
