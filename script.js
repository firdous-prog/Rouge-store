/* ================================================================
   ROUGE — script.js
   All site interactivity: splash, nav, products, cart, checkout.
   Edit the `products` array below to add your Teespring items.
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. PRODUCT DATA
   Add, remove, or edit items in this array.
   - id:         Unique identifier (any string/number)
   - name:       Product name shown on cards and modals
   - category:   Used for filter buttons (e.g. "T-Shirts", "Hoodies")
   - price:      Number (USD) — displayed as $xx.xx
   - image:      Relative path to your image, e.g. "image/product1.png"
                 Use a square or portrait image for best results.
   - description:Short description shown in quick-view modal
   - badge:      Optional string (e.g. "New", "Sale") — shown as red pill
   - teespringUrl: Direct link to this product on your Teespring store
   - isNew:      true/false — adds "New" badge if badge is empty
   ────────────────────────────────────────────────────────────── */
const products = [
];


/* ──────────────────────────────────────────────────────────────
   2. CART STATE
   Stored as an array of cart item objects.
   Each item: { product, size, quantity }
   ────────────────────────────────────────────────────────────── */
let cart = [];

/* Currently open product in the modal */
let activeProduct = null;
let modalSize = 'M';
let modalQty  = 1;

/* Active category filter ('All' shows everything) */
let activeFilter = 'All';

/* Current search query */
let searchQuery = '';


/* ──────────────────────────────────────────────────────────────
   3. ELEMENT REFERENCES
   ────────────────────────────────────────────────────────────── */
const splashEl          = document.getElementById('splash');
const splashLogoEl      = document.getElementById('splashLogo');
const splashWordmarkEl  = document.getElementById('splashWordmark');
const mainSiteEl        = document.getElementById('mainSite');

const siteHeaderEl      = document.getElementById('siteHeader');
const navLogoImgEl      = document.getElementById('navLogoImg');
const navLogoTextEl     = document.getElementById('navLogoText');
const hamburgerBtn      = document.getElementById('hamburger');
const mobileMenuEl      = document.getElementById('mobileMenu');
const searchToggleBtn   = document.getElementById('searchToggle');
const searchBarEl       = document.getElementById('searchBar');
const searchInputEl     = document.getElementById('searchInput');
const searchCloseBtn    = document.getElementById('searchClose');
const cartToggleBtn     = document.getElementById('cartToggle');
const cartBadgeEl       = document.getElementById('cartBadge');
const cartSidebarEl     = document.getElementById('cartSidebar');
const cartCloseBtn      = document.getElementById('cartClose');
const cartItemsEl       = document.getElementById('cartItems');
const cartEmptyEl       = document.getElementById('cartEmpty');
const cartFooterEl      = document.getElementById('cartFooter');
const cartTotalEl       = document.getElementById('cartTotal');
const overlayEl         = document.getElementById('overlay');
const productGridEl     = document.getElementById('productGrid');
const filterRowEl       = document.getElementById('filterRow');
const checkoutBtn       = document.getElementById('checkoutBtn');
const toastEl           = document.getElementById('toast');

/* Product modal */
const productModalEl    = document.getElementById('productModal');
const modalCloseBtn     = document.getElementById('modalClose');
const modalImgEl        = document.getElementById('modalImg');
const modalCategoryEl   = document.getElementById('modalCategory');
const modalTitleEl      = document.getElementById('modalTitle');
const modalPriceEl      = document.getElementById('modalPrice');
const modalDescEl       = document.getElementById('modalDesc');
const sizeBtnsEl        = document.getElementById('sizeButtons');
const qtyMinusBtn       = document.getElementById('qtyMinus');
const qtyPlusBtn        = document.getElementById('qtyPlus');
const qtyDisplayEl      = document.getElementById('qtyDisplay');
const addToCartBtn      = document.getElementById('addToCartBtn');
const teespringLinkEl   = document.getElementById('teespringLink');

/* Checkout modal */
const checkoutModalEl       = document.getElementById('checkoutModal');
const checkoutModalCloseBtn = document.getElementById('checkoutModalClose');
const step1El               = document.getElementById('checkoutStep1');
const step2El               = document.getElementById('checkoutStep2');
const step3El               = document.getElementById('checkoutStep3');
const step1Indicator        = document.getElementById('step1Indicator');
const step2Indicator        = document.getElementById('step2Indicator');
const step3Indicator        = document.getElementById('step3Indicator');
const toStep2Btn            = document.getElementById('toStep2Btn');
const backToStep1Btn        = document.getElementById('backToStep1Btn');
const toStep3Btn            = document.getElementById('toStep3Btn');
const confirmDoneBtn        = document.getElementById('confirmDoneBtn');
const reviewItemsEl         = document.getElementById('reviewItems');
const reviewSubtotalEl      = document.getElementById('reviewSubtotal');
const reviewTotalEl         = document.getElementById('reviewTotal');
const confirmNameEl         = document.getElementById('confirmName');
const confirmEmailEl        = document.getElementById('confirmEmail');


/* ──────────────────────────────────────────────────────────────
   4. SPLASH SCREEN
   ────────────────────────────────────────────────────────────── */
function initSplash() {
  /* Handle splash logo image fallback */
  splashLogoEl.addEventListener('error', () => {
    splashLogoEl.style.display = 'none';
    splashWordmarkEl.classList.add('show');
  });

  /* Total splash duration: animation (≈1.9s) + brief hold */
  const splashDuration = 2100; // ms — adjust to taste

  setTimeout(() => {
    /* Fade out splash */
    splashEl.classList.add('splash-out');

    /* Reveal main site */
    mainSiteEl.style.transition = 'opacity 0.6s ease';
    mainSiteEl.style.opacity = '1';
    mainSiteEl.style.pointerEvents = 'auto';
    mainSiteEl.classList.remove('site-hidden');

    /* Remove splash from DOM after transition */
    splashEl.addEventListener('transitionend', () => {
      splashEl.remove();
    }, { once: true });
  }, splashDuration);
}


/* ──────────────────────────────────────────────────────────────
   5. NAVIGATION
   ────────────────────────────────────────────────────────────── */

/* Sticky header shadow on scroll */
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    siteHeaderEl.classList.add('scrolled');
  } else {
    siteHeaderEl.classList.remove('scrolled');
  }
}, { passive: true });

/* Nav logo image fallback */
navLogoImgEl.addEventListener('error', () => {
  navLogoImgEl.style.display = 'none';
  navLogoTextEl.classList.add('show');
});

/* Hamburger toggle */
hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenuEl.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

/* Close mobile menu when a link is clicked */
mobileMenuEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuEl.classList.remove('open');
    hamburgerBtn.classList.remove('open');
  });
});

/* Search toggle */
searchToggleBtn.addEventListener('click', () => {
  searchBarEl.classList.toggle('open');
  if (searchBarEl.classList.contains('open')) {
    searchInputEl.focus();
  }
});

searchCloseBtn.addEventListener('click', () => {
  searchBarEl.classList.remove('open');
  searchInputEl.value = '';
  searchQuery = '';
  renderProducts();
});

/* Live search filtering */
searchInputEl.addEventListener('input', () => {
  searchQuery = searchInputEl.value.toLowerCase().trim();
  renderProducts();
});

/* Close search on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
    searchBarEl.classList.remove('open');
    mobileMenuEl.classList.remove('open');
    hamburgerBtn.classList.remove('open');
  }
});


/* ──────────────────────────────────────────────────────────────
   6. OVERLAY — closes cart or any open modal
   ────────────────────────────────────────────────────────────── */
overlayEl.addEventListener('click', closeAllModals);

function closeAllModals() {
  closeCart();
  closeProductModal();
  closeCheckoutModal();
}

function showOverlay() {
  overlayEl.classList.add('active');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function hideOverlay() {
  overlayEl.classList.remove('active');
  document.body.style.overflow = '';
}


/* ──────────────────────────────────────────────────────────────
   7. PRODUCT RENDERING
   ────────────────────────────────────────────────────────────── */

/* Build the category filter buttons */
function buildFilters() {
  const categories = ['All', ...new Set(products.map(p => p.category))];

  filterRowEl.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === activeFilter ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeFilter = cat;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
    filterRowEl.appendChild(btn);
  });
}

/* Format price as $xx.xx */
function formatPrice(num) {
  return '$' + num.toFixed(2);
}

/* Render (or re-render) the product grid */
function renderProducts() {
  let filtered = products;

  /* Apply category filter */
  if (activeFilter !== 'All') {
    filtered = filtered.filter(p => p.category === activeFilter);
  }

  /* Apply search query */
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  productGridEl.innerHTML = '';

  if (filtered.length === 0) {
    productGridEl.innerHTML = '<div class="no-results">No products found. Try a different search.</div>';
    return;
  }

  filtered.forEach((product, i) => {
    const card = createProductCard(product, i);
    productGridEl.appendChild(card);
  });
}

/* Create a single product card DOM element */
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  /* Stagger entrance animations */
  card.style.animationDelay = `${index * 60}ms`;

  /* Badge HTML */
  const badgeHTML = product.badge
    ? `<span class="product-card__badge">${product.badge}</span>`
    : '';

  card.innerHTML = `
    <div class="product-card__img-wrap">
      ${badgeHTML}
      <img
        class="product-card__img"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.parentNode.innerHTML+='<div class=\\'product-placeholder\\'>🧢</div>';this.remove()"
      />
      <div class="product-card__quick-add">Quick View</div>
    </div>
    <div class="product-card__info">
      <p class="product-card__category">${product.category}</p>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__price">${formatPrice(product.price)}</p>
    </div>
  `;

  /* Open product modal on click */
  card.addEventListener('click', () => openProductModal(product));

  return card;
}


/* ──────────────────────────────────────────────────────────────
   8. PRODUCT MODAL (Quick-View)
   ────────────────────────────────────────────────────────────── */
function openProductModal(product) {
  activeProduct = product;
  modalQty  = 1;
  modalSize = 'M';

  /* Populate modal fields */
  modalImgEl.src     = product.image;
  modalImgEl.alt     = product.name;
  modalCategoryEl.textContent = product.category;
  modalTitleEl.textContent    = product.name;
  modalPriceEl.textContent    = formatPrice(product.price);
  modalDescEl.textContent     = product.description;
  qtyDisplayEl.textContent    = modalQty;

  /* Teespring link */
  teespringLinkEl.href = product.teespringUrl || 'https://teespring.com';

  /* Reset size buttons */
  sizeBtnsEl.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === modalSize);
  });

  /* Open modal */
  productModalEl.classList.add('open');
  showOverlay();
}

function closeProductModal() {
  productModalEl.classList.remove('open');
  if (!cartSidebarEl.classList.contains('open') && !checkoutModalEl.classList.contains('open')) {
    hideOverlay();
  }
}

modalCloseBtn.addEventListener('click', closeProductModal);

/* Size selection */
sizeBtnsEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.size-btn');
  if (!btn) return;
  modalSize = btn.dataset.size;
  sizeBtnsEl.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

/* Quantity controls */
qtyMinusBtn.addEventListener('click', () => {
  if (modalQty > 1) modalQty--;
  qtyDisplayEl.textContent = modalQty;
});

qtyPlusBtn.addEventListener('click', () => {
  if (modalQty < 10) modalQty++;
  qtyDisplayEl.textContent = modalQty;
});

/* Add to cart from modal */
addToCartBtn.addEventListener('click', () => {
  if (!activeProduct) return;
  addToCart(activeProduct, modalSize, modalQty);
  closeProductModal();
  showToast(`${activeProduct.name} added to bag`);
});


/* ──────────────────────────────────────────────────────────────
   9. CART
   ────────────────────────────────────────────────────────────── */

/* Add a product to the cart (or increment if already there) */
function addToCart(product, size, quantity) {
  const existingIndex = cart.findIndex(
    item => item.product.id === product.id && item.size === size
  );

  if (existingIndex > -1) {
    /* Item already in cart — increase quantity */
    cart[existingIndex].quantity += quantity;
  } else {
    /* New item */
    cart.push({ product, size, quantity });
  }

  updateCart();
}

/* Remove an item from cart by index */
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

/* Recalculate totals, update badge, re-render items */
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  /* Update badge */
  cartBadgeEl.textContent = totalItems;
  cartBadgeEl.classList.toggle('visible', totalItems > 0);

  /* Update total label */
  cartTotalEl.textContent = formatPrice(totalPrice);

  /* Show/hide footer */
  cartFooterEl.style.display = cart.length > 0 ? 'flex' : 'none';
  cartEmptyEl.style.display  = cart.length === 0 ? 'flex' : 'none';

  /* Re-render item list */
  renderCartItems();
}

/* Render cart line items */
function renderCartItems() {
  /* Remove existing items (keep empty state element) */
  cartItemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  cart.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}"
           onerror="this.style.background='var(--gray-200)'"/>
      <div>
        <p class="cart-item-name">${item.product.name}</p>
        <p class="cart-item-meta">Size: ${item.size} · Qty: ${item.quantity}</p>
        <p class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</p>
      </div>
      <div class="cart-item-remove">
        <button class="remove-btn" aria-label="Remove ${item.product.name}" data-index="${index}">✕</button>
      </div>
    `;
    cartItemsEl.insertBefore(el, cartEmptyEl);
  });

  /* Remove buttons */
  cartItemsEl.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = parseInt(e.currentTarget.dataset.index, 10);
      removeFromCart(i);
    });
  });
}

/* Open cart */
function openCart() {
  cartSidebarEl.classList.add('open');
  showOverlay();
}

/* Close cart */
function closeCart() {
  cartSidebarEl.classList.remove('open');
  if (!productModalEl.classList.contains('open') && !checkoutModalEl.classList.contains('open')) {
    hideOverlay();
  }
}

cartToggleBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);

/* Proceed to checkout from cart */
checkoutBtn.addEventListener('click', () => {
  closeCart();
  openCheckoutModal();
});


/* ──────────────────────────────────────────────────────────────
   10. CHECKOUT MODAL
   Three-step: Info → Review → Confirmation
   ────────────────────────────────────────────────────────────── */

function openCheckoutModal() {
  /* Reset to step 1 */
  showCheckoutStep(1);
  checkoutModalEl.classList.add('open');
  showOverlay();
}

function closeCheckoutModal() {
  checkoutModalEl.classList.remove('open');
  hideOverlay();
}

checkoutModalCloseBtn.addEventListener('click', closeCheckoutModal);

/* Switch between checkout steps */
function showCheckoutStep(stepNum) {
  [step1El, step2El, step3El].forEach((el, i) => {
    el.classList.toggle('hidden', i + 1 !== stepNum);
  });

  /* Update step indicators */
  [step1Indicator, step2Indicator, step3Indicator].forEach((indicator, i) => {
    indicator.classList.remove('active', 'done');
    if (i + 1 < stepNum)   indicator.classList.add('done');
    if (i + 1 === stepNum) indicator.classList.add('active');
  });
}

/* Step 1 → Step 2: validate form then show review */
toStep2Btn.addEventListener('click', () => {
  if (!validateStep1()) return;
  populateReview();
  showCheckoutStep(2);
});

/* Step 2 → Step 1: go back */
backToStep1Btn.addEventListener('click', () => {
  showCheckoutStep(1);
});

/* Step 2 → Step 3: "place order" */
toStep3Btn.addEventListener('click', () => {
  /* ── INTEGRATION POINT ────────────────────────────────────
     Replace this block to connect to a real payment processor.
     Options:
       • Stripe Checkout: redirect to stripe.com/pay with your session
       • Teespring API:   POST cart data to Teespring orders endpoint
       • Custom backend:  POST form data + cart to your server
     For now we show a confirmation screen and clear the cart.
  ─────────────────────────────────────────────────────────── */
  const name  = document.getElementById('firstName').value.trim();
  const email = document.getElementById('email').value.trim();

  confirmNameEl.textContent  = name;
  confirmEmailEl.textContent = email;

  /* Clear the cart after order */
  cart = [];
  updateCart();

  showCheckoutStep(3);
});

/* Confirmation → close modal */
confirmDoneBtn.addEventListener('click', () => {
  closeCheckoutModal();
  /* Reset form fields */
  ['firstName','lastName','email','address','city','zip','country'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
});

/* Validate step 1 required fields */
function validateStep1() {
  const fields = [
    { id: 'firstName', label: 'First name' },
    { id: 'lastName',  label: 'Last name' },
    { id: 'email',     label: 'Email', type: 'email' },
    { id: 'address',   label: 'Address' },
    { id: 'city',      label: 'City' },
    { id: 'zip',       label: 'ZIP' },
    { id: 'country',   label: 'Country' },
  ];

  let valid = true;

  fields.forEach(field => {
    const el = document.getElementById(field.id);
    const val = el.value.trim();
    el.classList.remove('error');

    if (!val) {
      el.classList.add('error');
      valid = false;
      return;
    }

    /* Basic email validation */
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      el.classList.add('error');
      valid = false;
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields');
  }

  return valid;
}

/* Populate the review step with current cart + form data */
function populateReview() {
  reviewItemsEl.innerHTML = '';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'review-item';
    el.innerHTML = `
      <img src="${item.product.image}" alt="${item.product.name}"
           onerror="this.style.background='var(--gray-200)'"/>
      <div class="review-item-info">
        <p class="review-item-name">${item.product.name}</p>
        <p class="review-item-meta">Size: ${item.size} · Qty: ${item.quantity}</p>
      </div>
      <span class="review-item-price">${formatPrice(item.product.price * item.quantity)}</span>
    `;
    reviewItemsEl.appendChild(el);
  });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  reviewSubtotalEl.textContent = formatPrice(subtotal);
  reviewTotalEl.textContent    = formatPrice(subtotal); /* Shipping added at Teespring */
}


/* ──────────────────────────────────────────────────────────────
   11. TOAST NOTIFICATION
   ────────────────────────────────────────────────────────────── */
let toastTimer = null;

function showToast(message, duration = 2800) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}


/* ──────────────────────────────────────────────────────────────
   12. SMOOTH SCROLL for nav links
   ────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────────────────────────
   13. INTERSECTION OBSERVER — fade-in product cards on scroll
   ────────────────────────────────────────────────────────────── */
function observeCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.product-card').forEach(card => {
    /* Set initial hidden state */
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}


/* ──────────────────────────────────────────────────────────────
   14. INIT — run everything on DOMContentLoaded
   ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSplash();       /* Start splash animation */
  buildFilters();     /* Build category filter buttons */
  renderProducts();   /* Render product grid */
  updateCart();       /* Initialise cart state */

  /* Observe cards once they've been rendered */
  requestAnimationFrame(() => observeCards());
});
