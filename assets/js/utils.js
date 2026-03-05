export function formatMoney(amount, currency = 'PKR') {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `${currency} ${safeAmount.toLocaleString('en-PK')}`;
}

export function clampInt(value, min, max) {
  const parsed = Number.parseInt(String(value), 10);
  const safeValue = Number.isNaN(parsed) ? min : parsed;
  return Math.min(max, Math.max(min, safeValue));
}

export function showToast(message, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, duration);
}
