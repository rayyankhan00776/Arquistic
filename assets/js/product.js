export function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${product.name}`);
  if (product.id != null) card.dataset.productId = String(product.id);

  const imageWrap = document.createElement('div');
  imageWrap.className = 'product-image';
  // Add Recommended tag for Celeste and Eclave
  if (product.name && (product.name.toLowerCase() === 'celeste' || product.name.toLowerCase() === 'eclave')) {
    const recommendedTag = document.createElement('div');
    recommendedTag.className = 'recommended-tag';
    recommendedTag.textContent = 'Recommended';
    imageWrap.appendChild(recommendedTag);
  }
  const img = document.createElement('img');
  img.alt = product.name;
  img.src = product.image;
  imageWrap.appendChild(img);

  const quickView = document.createElement('div');
  quickView.className = 'product-quickview';
  quickView.setAttribute('aria-hidden', 'true');
  quickView.textContent = 'QUICK VIEW';
  imageWrap.appendChild(quickView);

  const info = document.createElement('div');
  info.className = 'product-info';
  const name = document.createElement('div');
  name.className = 'product-name';
  name.textContent = product.name;
  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = product.formattedPrice;
  info.appendChild(name);
  info.appendChild(price);

  card.appendChild(imageWrap);
  card.appendChild(info);
  return card;
}

function setBodyScrollLocked(locked) {
  if (locked) document.body.style.overflow = 'hidden';
  else document.body.style.overflow = '';
}

function openModal(overlay) {
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  setBodyScrollLocked(true);
}

function closeModal(overlay) {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  setBodyScrollLocked(false);
}

function renderNotes(container, notes) {
  container.textContent = '';
  
  // Handle new object format with top, middle, base
  if (notes && typeof notes === 'object' && !Array.isArray(notes)) {
    const categories = [
      { key: 'top', label: 'Top Notes' },
      { key: 'middle', label: 'Heart Notes' },
      { key: 'base', label: 'Base Notes' }
    ];
    
    categories.forEach(({ key, label }) => {
      if (notes[key] && Array.isArray(notes[key]) && notes[key].length > 0) {
        const section = document.createElement('div');
        section.className = 'notes-section';
        
        const labelEl = document.createElement('div');
        labelEl.className = 'notes-label';
        labelEl.textContent = label;
        section.appendChild(labelEl);
        
        const notesGroup = document.createElement('div');
        notesGroup.className = 'notes-group';
        
        notes[key].forEach(note => {
          const badge = document.createElement('span');
          badge.className = 'note-badge';
          badge.textContent = String(note);
          notesGroup.appendChild(badge);
        });
        
        section.appendChild(notesGroup);
        container.appendChild(section);
      }
    });
  } else {
    // Handle old array format for backward compatibility
    const safeNotes = Array.isArray(notes) ? notes : [];
    for (const note of safeNotes) {
      const badge = document.createElement('span');
      badge.className = 'note-badge';
      badge.textContent = String(note);
      container.appendChild(badge);
    }
  }
}

export function setupProductModal({ products, formatMoney, cartStore }) {
  const overlay = document.getElementById('productModal');
  if (!overlay) return;

  const closeBtn = overlay.querySelector('.modal-close');
  const mainImage = overlay.querySelector('#mainImage');
  const reviewCount = overlay.querySelector('#reviewCount');
  const productTitle = overlay.querySelector('#productTitle');
  const productType = overlay.querySelector('#productType');
  const productInspiration = overlay.querySelector('#productInspiration');
  const productPrice = overlay.querySelector('#productPrice');
  const productDescription = overlay.querySelector('#productDescription');
  const volume = overlay.querySelector('#volume');
  const concentration = overlay.querySelector('#concentration');
  const notesContainer = overlay.querySelector('#notesContainer');
  const addToCartBtn = overlay.querySelector('#addToCartBtn');

  if (
    !closeBtn ||
    !mainImage ||
    !reviewCount ||
    !productTitle ||
    !productType ||
    !productInspiration ||
    !productPrice ||
    !productDescription ||
    !volume ||
    !concentration ||
    !notesContainer ||
    !addToCartBtn
  ) {
    return;
  }

  const byId = new Map((products || []).map((p) => [String(p.id), p]));
  let activeProductId = null;

  function render(product) {
    activeProductId = String(product.id);
    mainImage.src = product.image;
    mainImage.alt = product.name;
    reviewCount.textContent = String(product.reviews ?? 0);
    productTitle.textContent = product.name;
    productType.textContent = String(product.type || '').toUpperCase();
    if (product.inspiration) {
      productInspiration.textContent = product.inspiration;
      productInspiration.style.display = 'block';
    } else {
      productInspiration.style.display = 'none';
    }
    productPrice.textContent = formatMoney(product.price, product.currency);
    productDescription.textContent = product.description || '';
    volume.textContent = product.volume || '';
    concentration.textContent = product.concentration || '';
    renderNotes(notesContainer, product.notes);
  }

  function onGridClick(event) {
    const card = event.target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.productId;
    if (!id) return;
    const product = byId.get(id);
    if (!product) return;
    render(product);
    openModal(overlay);
  }

  function onGridKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.product-card');
    if (!card) return;
    event.preventDefault();
    const id = card.dataset.productId;
    if (!id) return;
    const product = byId.get(id);
    if (!product) return;
    render(product);
    openModal(overlay);
  }

  document.querySelectorAll('[data-products-grid]').forEach((grid) => {
    grid.addEventListener('click', onGridClick);
    grid.addEventListener('keydown', onGridKeyDown);
  });

  closeBtn.addEventListener('click', () => closeModal(overlay));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal(overlay);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeModal(overlay);
  });

  addToCartBtn.addEventListener('click', () => {
    if (!activeProductId) return;
    const product = byId.get(activeProductId);
    if (!product) return;
    cartStore.addItem(product.id, 1);
    closeModal(overlay);
  });
}
