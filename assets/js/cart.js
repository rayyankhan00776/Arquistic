import { CONFIG } from './config.js';
import { clampInt } from './utils.js';

function readCart() {
  const raw = localStorage.getItem(CONFIG.cartStorageKey);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(items));
}

export const cartStore = {
  getItems() {
    return readCart();
  },
  addItem(productId, quantity = 1) {
    const items = readCart();
    const existing = items.find((i) => i.productId === productId);
    const nextQuantity = clampInt((existing?.quantity || 0) + quantity, 0, 99);
    writeCart(
      existing
        ? items.map((i) => (i.productId === productId ? { ...i, quantity: nextQuantity } : i))
        : [...items, { productId, quantity: nextQuantity }]
    );
    window.dispatchEvent(new CustomEvent('cart:changed'));
  },
  getCount() {
    return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
  },
  setQuantity(productId, quantity) {
    const items = readCart();
    const nextQty = clampInt(quantity, 0, 99);

    const existingIndex = items.findIndex((i) => i.productId === productId);
    if (existingIndex === -1 && nextQty > 0) {
      items.push({ productId, quantity: nextQty });
    } else if (existingIndex !== -1) {
      if (nextQty <= 0) items.splice(existingIndex, 1);
      else items[existingIndex].quantity = nextQty;
    }

    writeCart(items);
    window.dispatchEvent(new CustomEvent('cart:changed'));
  },
  removeItem(productId) {
    const items = readCart();
    writeCart(items.filter((i) => i.productId !== productId));
    window.dispatchEvent(new CustomEvent('cart:changed'));
  },
  clear() {
    writeCart([]);
    window.dispatchEvent(new CustomEvent('cart:changed'));
  },
};

// Cart Page Rendering
export function renderCartItems(products) {
  const container = document.querySelector('[data-cart-items]');
  if (!container) return;

  const items = cartStore.getItems();
  if (items.length === 0) {
    showEmptyCart();
    return;
  }

  showCartFilled();
  container.innerHTML = '';

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img class="cart-item-image" src="${product.image}" alt="${product.name}" />
      <div class="cart-item-details">
        <div class="cart-item-name">${product.name}</div>
        <span class="cart-item-type">${product.type}</span>
        <div class="cart-item-volume">${product.volume}</div>
        <div class="cart-item-price">PKR ${product.price.toLocaleString()}</div>
        <div class="quantity-selector">
          <button class="qty-minus" data-product-id="${product.id}">−</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" data-product-id="${product.id}" />
          <button class="qty-plus" data-product-id="${product.id}">+</button>
        </div>
      </div>
      <button class="delete-btn" data-product-id="${product.id}" aria-label="Remove item">×</button>
    `;

    // Quantity controls
    const minusBtn = cartItem.querySelector('.qty-minus');
    const plusBtn = cartItem.querySelector('.qty-plus');
    const qtyInput = cartItem.querySelector('.qty-input');
    const deleteBtn = cartItem.querySelector('.delete-btn');

    minusBtn.addEventListener('click', () => {
      const newQty = Math.max(1, item.quantity - 1);
      cartStore.setQuantity(product.id, newQty);
      renderCartUI(products);
    });

    plusBtn.addEventListener('click', () => {
      const newQty = Math.min(99, item.quantity + 1);
      cartStore.setQuantity(product.id, newQty);
      renderCartUI(products);
    });

    qtyInput.addEventListener('change', () => {
      const newQty = Math.max(1, Math.min(99, parseInt(qtyInput.value) || 1));
      cartStore.setQuantity(product.id, newQty);
      renderCartUI(products);
    });

    deleteBtn.addEventListener('click', () => {
      cartStore.removeItem(product.id);
      renderCartUI(products);
    });

    container.appendChild(cartItem);
  });

  updateCartSummary(products);
}

export function updateCartSummary(products) {
  const items = cartStore.getItems();
  
  let subtotal = 0;
  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  // Check if all 4 products are in cart
  const allProductIds = new Set(items.map((i) => i.productId));
  const hasAll4Products = allProductIds.size === 4 && allProductIds.size === products.length;
  
  const delivery = hasAll4Products ? 0 : (subtotal > 0 ? 300 : 0);
  const tax = 5;
  const total = subtotal + delivery + tax;

  const countEl = document.querySelector('[data-cart-item-count]');
  if (countEl) {
    countEl.textContent = `(${items.length})`;
  }

  const subtotalEl = document.querySelector('[data-summary-subtotal]');
  if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;

  const deliveryEl = document.querySelector('[data-summary-delivery]');
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Free' : `PKR ${delivery}`;

  const taxEl = document.querySelector('[data-summary-tax]');
  if (taxEl) taxEl.textContent = `PKR ${tax.toLocaleString()}`;

  const totalEl = document.querySelector('[data-summary-total]');
  if (totalEl) totalEl.textContent = `PKR ${total.toLocaleString()}`;
}

export function showEmptyCart() {
  const emptyEl = document.querySelector('[data-empty-cart]');
  const filledEl = document.querySelector('[data-cart-filled]');
  if (emptyEl) emptyEl.style.display = 'block';
  if (filledEl) filledEl.style.display = 'none';
}

export function showCartFilled() {
  const emptyEl = document.querySelector('[data-empty-cart]');
  const filledEl = document.querySelector('[data-cart-filled]');
  if (emptyEl) emptyEl.style.display = 'none';
  if (filledEl) filledEl.style.display = 'block';
}

export function renderCartUI(products) {
  const items = cartStore.getItems();
  if (items.length === 0) {
    showEmptyCart();
  } else {
    renderCartItems(products);
  }
}

// Checkout Page Rendering
export function renderCheckoutSummary(products) {
  const container = document.querySelector('[data-checkout-items]');
  if (!container) return;

  const items = cartStore.getItems();
  let subtotal = 0;

  container.innerHTML = '';
  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    subtotal += product.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'checkout-item';
    itemEl.innerHTML = `
      <span class="checkout-item-name">${product.name}</span>
      <span class="checkout-item-qty">x${item.quantity}</span>
      <span class="checkout-item-price">PKR ${(product.price * item.quantity).toLocaleString()}</span>
    `;
    container.appendChild(itemEl);
  });

  // Check if all 4 products are in cart
  const allProductIds = new Set(items.map((i) => i.productId));
  const hasAll4Products = allProductIds.size === 4 && allProductIds.size === products.length;

  // Update summary
  const delivery = hasAll4Products ? 0 : (subtotal > 0 ? 300 : 0);
  const tax = 5;
  const total = subtotal + delivery + tax;

  const subtotalEl = document.querySelector('[data-summary-subtotal]');
  if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;

  const deliveryEl = document.querySelector('[data-summary-delivery]');
  if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Free' : `PKR ${delivery}`;

  const taxEl = document.querySelector('[data-summary-tax]');
  if (taxEl) taxEl.textContent = `PKR ${tax.toLocaleString()}`;

  const totalEl = document.querySelector('[data-summary-total]');
  if (totalEl) totalEl.textContent = `PKR ${total.toLocaleString()}`;
}
