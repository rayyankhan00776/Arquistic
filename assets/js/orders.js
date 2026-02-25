import { CONFIG } from './config.js';
import { cartStore } from './cart.js';

function safeText(value) {
  return String(value ?? '').trim();
}

function buildOrderItems(products) {
  const cartItems = cartStore.getItems();
  const items = [];

  for (const cartItem of cartItems) {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) continue;
    const quantity = Number(cartItem.quantity) || 0;
    if (quantity <= 0) continue;
    const unitPrice = Number(product.price) || 0;
    items.push({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
    });
  }

  return items;
}

function formatPkr(amount) {
  const safeAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `PKR ${safeAmount.toLocaleString('en-PK')}`;
}

function buildReadableItems(detailedItems) {
  return detailedItems.map((item) => {
    const lineTotal = Number(item.lineTotal) || 0;
    return `${item.name} x${item.quantity} (${formatPkr(lineTotal)})`;
  });
}

function computeTotals({ items, productsCount }) {
  const subtotal = items.reduce((sum, i) => sum + (Number(i.lineTotal) || 0), 0);
  const uniqueProductIds = new Set(items.map((i) => i.productId));
  const hasAllProducts = uniqueProductIds.size > 0 && uniqueProductIds.size === productsCount;

  // Keep totals consistent with renderCheckoutSummary in cart.js
  const delivery = hasAllProducts ? 0 : subtotal > 0 ? 300 : 0;
  const tax = 5;
  const total = subtotal + delivery + tax;

  return { subtotal, delivery, tax, total };
}

async function sendOrderToWebhook(payload) {
  const url = safeText(CONFIG.ordersWebhookUrl);
  if (!url) throw new Error('Missing CONFIG.ordersWebhookUrl');

  const bodyText = JSON.stringify(payload);

  // Prefer sendBeacon because it works well for static sites + cross-origin.
  if (navigator.sendBeacon) {
    const blob = new Blob([bodyText], { type: 'text/plain;charset=utf-8' });
    const queued = navigator.sendBeacon(url, blob);
    if (!queued) throw new Error('sendBeacon failed to queue request');
    return;
  }

  // Fallback: no-cors fetch (request is sent, but response is opaque).
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: bodyText,
  });
}

export function initCheckoutOrderForm(products) {
  const form = document.querySelector('form.form');
  if (!form) return;
  if (!Array.isArray(products)) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const prevBtnText = submitBtn?.textContent;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'PLACING ORDER...';
    }

    try {
      const formData = new FormData(form);
      const fullName = safeText(formData.get('fullName'));
      const phone = safeText(formData.get('phone'));
      const email = safeText(formData.get('email'));
      const address = safeText(formData.get('address'));
      const city = safeText(formData.get('city'));
      const postal = safeText(formData.get('postal'));
      const payment = safeText(formData.get('payment')) || 'cod';

      const detailedItems = buildOrderItems(products);
      if (detailedItems.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      // Send readable items to Sheets (so it doesn't show as JSON objects).
      const items = buildReadableItems(detailedItems);

      const totals = computeTotals({ items: detailedItems, productsCount: products.length });

      const orderId = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());

      const payload = {
        orderId,
        createdAt: new Date().toISOString(),
        currency: CONFIG.currency,
        fullName,
        phone,
        email,
        address,
        city,
        postal,
        payment,
        items,
        itemsDetailed: detailedItems,
        ...totals,
      };

      await sendOrderToWebhook(payload);

      cartStore.clear();
      window.location.href = 'cart.html';
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevBtnText || 'PLACE ORDER';
      }
    }
  });
}
