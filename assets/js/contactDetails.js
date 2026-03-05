import { fetchText } from './api.js';
import { CONFIG } from './config.js';

function normalizeKey(rawKey) {
  const key = String(rawKey || '').trim().toLowerCase();
  if (key === 'insta' || key === 'instagram') return 'instagram';
  if (key === 'tiktok') return 'tiktok';
  if (key === 'email' || key === 'e-mail') return 'email';
  if (key === 'contact' || key === 'phone' || key === 'number') return 'contact';
  return key;
}

function extractWhatsAppLink(text) {
  const match = String(text).match(/https?:\/\/wa\.link\/[^\s]+/i);
  return match ? match[0] : null;
}

function extractPhoneNumber(text) {
  const match = String(text).match(/\+?\d[\d\s-]{7,}/);
  return match ? match[0].replace(/\s+/g, ' ').trim() : null;
}

function parseContactDetails(markdownText) {
  const lines = String(markdownText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  /** @type {Array<{type: string, label: string, href: string, display?: string, icon: string}>} */
  const items = [];

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length < 2) continue;

    const key = normalizeKey(parts[0]);
    const value = parts.slice(1).join(':').trim();

    if (key === 'contact') {
      const phone = extractPhoneNumber(value);
      const whatsapp = extractWhatsAppLink(value);

      if (phone) {
        items.push({
          type: 'phone',
          label: 'Phone',
          href: `tel:${phone.replace(/[^\d+]/g, '')}`,
          display: phone,
          icon: 'phone',
        });
      }

      if (whatsapp) {
        items.push({
          type: 'whatsapp',
          label: 'WhatsApp',
          href: whatsapp,
          display: 'Chat on WhatsApp',
          icon: 'whatsapp',
        });
      }

      continue;
    }

    if (key === 'email') {
      const email = value;
      items.push({
        type: 'email',
        label: 'Email',
        href: `mailto:${email}`,
        display: email,
        icon: 'email',
      });
      continue;
    }

    if (key === 'instagram') {
      items.push({
        type: 'instagram',
        label: 'Instagram',
        href: value,
        display: 'Open Instagram',
        icon: 'instagram',
      });
      continue;
    }

    if (key === 'tiktok') {
      items.push({
        type: 'tiktok',
        label: 'TikTok',
        href: value,
        display: 'Open TikTok',
        icon: 'tiktok',
      });
      continue;
    }
  }

  return items;
}

function buildContactList(items) {
  const list = document.createElement('div');
  list.className = 'contact-list';

  for (const item of items) {
    const a = document.createElement('a');
    a.className = 'contact-item';
    a.href = item.href;
    if (item.href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noreferrer';
    }

    const icon = document.createElement('span');
    icon.className = `contact-icon contact-icon-${item.icon}`;
    icon.setAttribute('aria-hidden', 'true');

    const textWrap = document.createElement('span');
    textWrap.className = 'contact-text';
    const label = document.createElement('span');
    label.className = 'contact-label';
    label.textContent = item.label;

    const value = document.createElement('span');
    value.className = 'contact-value';
    value.textContent = item.display || item.href;

    textWrap.appendChild(label);
    textWrap.appendChild(value);

    a.appendChild(icon);
    a.appendChild(textWrap);
    list.appendChild(a);
  }

  return list;
}

export async function renderContactDetails() {
  const containers = document.querySelectorAll('[data-contact-details]');
  if (!containers.length) return;

  try {
    const text = await fetchText(CONFIG.contactDetailsUrl);
    const allItems = parseContactDetails(text);

    containers.forEach((container) => {
      const hideWhatsApp = container.getAttribute('data-hide-whatsapp') === 'true';
      const items = hideWhatsApp ? allItems.filter((item) => item.type !== 'whatsapp') : allItems;

      container.textContent = '';
      if (!items.length) {
        const empty = document.createElement('p');
        empty.className = 'text-secondary';
        empty.textContent = 'No contact details found.';
        container.appendChild(empty);
        return;
      }

      container.appendChild(buildContactList(items));
    });
  } catch {
    containers.forEach((container) => {
      container.textContent = '';
      const error = document.createElement('p');
      error.className = 'text-secondary';
      error.textContent = 'Failed to load contact details.';
      container.appendChild(error);
    });
  }
}

