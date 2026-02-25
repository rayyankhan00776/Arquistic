import { CONFIG } from './config.js';
import { fetchJson } from './api.js';
import { formatMoney } from './utils.js';
import { createProductCard, setupProductModal } from './product.js';
import { updateCartBadges, updateYear } from './ui.js';
import { renderContactDetails } from './contactDetails.js';
import { cartStore, renderCartUI, renderCheckoutSummary } from './cart.js';
import { initCheckoutOrderForm } from './orders.js';

async function loadProducts() {
  const data = await fetchJson(CONFIG.productsUrl);
  return Array.isArray(data.products) ? data.products : [];
}

function renderProductsGrids(products) {
  const grids = document.querySelectorAll('[data-products-grid]');
  grids.forEach((grid) => {
    if (!Array.isArray(products) || products.length === 0) {
      grid.innerHTML = '<p class="text-secondary">Products are coming soon.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const product of products) {
      const viewModel = {
        ...product,
        formattedPrice: formatMoney(product.price, product.currency || CONFIG.currency),
      };
      fragment.appendChild(createProductCard(viewModel));
    }
    grid.replaceChildren(fragment);
  });
}

function init() {
  updateYear();
  updateCartBadges();
  window.addEventListener('cart:changed', updateCartBadges);
  renderContactDetails();

  (async () => {
    try {
      const products = await loadProducts();
      renderProductsGrids(products);
      setupProductModal({ products, formatMoney, cartStore });

      // Initialize cart page if on cart.html
      if (document.querySelector('[data-cart-items]')) {
        renderCartUI(products);
        window.addEventListener('cart:changed', () => renderCartUI(products));
      }

      // Initialize checkout page if on checkout.html
      if (document.querySelector('[data-checkout-items]')) {
        renderCheckoutSummary(products);
        initCheckoutOrderForm(products);
      }
    } catch {
      document.querySelectorAll('[data-products-grid]').forEach((grid) => {
        grid.innerHTML = '<p class="text-secondary">Failed to load products.</p>';
      });
    }
  })();
}

init();
