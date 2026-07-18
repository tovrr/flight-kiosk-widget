export function resolveIdleTimeout(raw) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 90_000;
  return Math.min(43_200_000, Math.max(5_000, parsed));
}
