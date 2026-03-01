import { cartStore } from './cart.js';

function setBodyScrollLocked(locked) {
  if (locked) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
}

export function initMobileNav() {
  const overlay = document.querySelector('[data-mobile-nav]');
  if (!overlay) return;

  const panel = overlay.querySelector('.mobile-nav-panel');
  const openBtn = document.querySelector('[data-mobile-nav-open]');
  const closeBtn = overlay.querySelector('[data-mobile-nav-close]');
  if (!panel || !openBtn || !closeBtn) return;

  function open() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    setBodyScrollLocked(true);
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    setBodyScrollLocked(false);
    openBtn.focus();
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => close());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
}

export function updateYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

export function updateCartBadges() {
  const count = cartStore.getCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
  });
}
