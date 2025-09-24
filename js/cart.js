document.addEventListener('DOMContentLoaded', function () {
  // --- NAVBAR MOBILE MENU ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const dropdowns = document.querySelectorAll('.dropdown');
  const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;

  if (menuToggle && navLinks && menuIcon) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      menuIcon.classList.toggle('fa-bars');
      menuIcon.classList.toggle('fa-times');
    });
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('a');
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (
        window.innerWidth <= 992 &&
        navLinks.classList.contains('active') &&
        !e.target.closest('.nav-links') &&
        !e.target.closest('#menuToggle')
      ) {
        navLinks.classList.remove('active');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }

  // --- CART FUNCTIONALITY ---
  const cartIcon = document.querySelector('.cart-icon');
  const cartModal = document.getElementById('cartModal');
  const closeModal = document.getElementById('closeModal');
  const overlay = document.getElementById('overlay');
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const modalCartItems = document.getElementById('modalCartItems');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const modalSubtotalEl = document.getElementById('modalSubtotal');
  const modalTotalEl = document.getElementById('modalTotal');

  if (cartIcon && cartModal && overlay) {
    cartIcon.addEventListener('click', function (e) {
      // Agar <a href="cart.html"> hai to navigation ko roko
      e.preventDefault();
      cartModal.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeCartModal() {
      cartModal.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
    if (closeModal) closeModal.addEventListener('click', closeCartModal);
    overlay.addEventListener('click', closeCartModal);
  }

  // --- HELPERS ---
  const same = (a, b) => String(a) === String(b); // type-safe compare

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function findIndexBy(id, size) {
    const cart = getCart();
    return cart.findIndex(item => same(item.id, id) && same(item.size, size));
  }

  function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((t, it) => t + (Number(it.quantity) || 0), 0);
    if (cartCount) cartCount.textContent = String(totalItems);
  }

  function loadCartItems() {
    const cart = getCart();
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <a href="index.html" class="continue-shopping">Start Shopping</a>
        </div>
      `;
      return;
    }

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Size: ${item.size}</p>
          <p class="cart-item-price">$${Number(item.price).toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="remove-item" data-id="${item.id}" data-size="${item.size}">
            <i class="fas fa-trash"></i> Remove
          </button>
          <div class="quantity-controls">
            <button class="qty-btn minus" data-id="${item.id}" data-size="${item.size}">-</button>
            <input type="number" class="qty-input" value="${Number(item.quantity) || 1}" min="1" data-id="${item.id}" data-size="${item.size}">
            <button class="qty-btn plus" data-id="${item.id}" data-size="${item.size}">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function loadModalCartItems() {
    const cart = getCart();
    if (!modalCartItems) return;

    if (cart.length === 0) {
      modalCartItems.innerHTML = '<p>Your cart is empty</p>';
      return;
    }

    modalCartItems.innerHTML = cart.map(item => {
      const itemTotal = Number(item.price) * (Number(item.quantity) || 1);
      return `
        <div class="modal-cart-item">
          <img src="${item.image}" alt="${item.name}" class="modal-item-img">
          <div class="modal-item-details">
            <h4>${item.name}</h4>
            <p>Size: ${item.size}</p>
            <div class="quantity-controls">
              <button class="qty-btn minus" data-id="${item.id}" data-size="${item.size}">-</button>
              <input type="number" class="qty-input" value="${Number(item.quantity) || 1}" min="1" data-id="${item.id}" data-size="${item.size}">
              <button class="qty-btn plus" data-id="${item.id}" data-size="${item.size}">+</button>
            </div>
          </div>
          <div class="modal-item-price">$${itemTotal.toFixed(2)}</div>
          <button class="remove-item" data-id="${item.id}" data-size="${item.size}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, it) => sum + (Number(it.price) * (Number(it.quantity) || 1)), 0);
    const total = subtotal;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (modalSubtotalEl) modalSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (modalTotalEl) modalTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  function refreshCartUI() {
    updateCartCount();
    loadCartItems();
    loadModalCartItems();
    calculateTotals();
  }

  function removeFromCart(id, size) {
    let cart = getCart();
    cart = cart.filter(item => !(same(item.id, id) && same(item.size, size)));
    saveCart(cart);
    refreshCartUI();
  }

  function updateQuantity(id, size, change, setQuantity = null) {
    const cart = getCart();
    const idx = cart.findIndex(item => same(item.id, id) && same(item.size, size));
    if (idx === -1) return;

    const curr = Number(cart[idx].quantity) || 1;

    if (setQuantity !== null) {
      cart[idx].quantity = Math.max(1, Number(setQuantity) || 1);
    } else {
      cart[idx].quantity = Math.max(1, curr + Number(change || 0));
    }

    saveCart(cart);
    refreshCartUI();
  }

  // --- EVENT DELEGATION (SAFE) ---
  function attachCartListeners(container) {
    if (!container) return;

    container.addEventListener('click', function (e) {
      const removeBtn = e.target.closest('.remove-item');
      const minusBtn  = e.target.closest('.qty-btn.minus');
      const plusBtn   = e.target.closest('.qty-btn.plus');

      if (removeBtn) {
        removeFromCart(removeBtn.dataset.id, removeBtn.dataset.size);
        return; // stop here to avoid double-handling
      }
      if (minusBtn) {
        updateQuantity(minusBtn.dataset.id, minusBtn.dataset.size, -1);
        return;
      }
      if (plusBtn) {
        updateQuantity(plusBtn.dataset.id, plusBtn.dataset.size, 1);
        return;
      }
    });

    container.addEventListener('change', function (e) {
      if (e.target.classList.contains('qty-input')) {
        const input = e.target;
        let newQty = parseInt(input.value, 10);
        if (isNaN(newQty) || newQty < 1) newQty = 1;
        input.value = newQty;
        updateQuantity(input.dataset.id, input.dataset.size, 0, newQty);
      }
    });
  }

  attachCartListeners(cartItems);
  attachCartListeners(modalCartItems);

  // --- INITIALIZE CART ---
  refreshCartUI();

  // OPTIONAL: if your old localStorage had different schema, uncomment once to reset
  // localStorage.removeItem('cart');
});
