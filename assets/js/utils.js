export function formatMoney(amount, currency = 'PKR') {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `${currency} ${safeAmount.toLocaleString('en-PK')}`;
}

export function clampInt(value, min, max) {
  const parsed = Number.parseInt(String(value), 10);
  const safeValue = Number.isNaN(parsed) ? min : parsed;
  return Math.min(max, Math.max(min, safeValue));
}
