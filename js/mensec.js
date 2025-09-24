document.addEventListener('DOMContentLoaded', function () {
  // ==============================
  // Dropdown functionality for mobile
  // ==============================
  const dropdownLinks = document.querySelectorAll('.dropdown > a');

  dropdownLinks.forEach(dropdown => {
    const toggleDropdown = function (e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        e.stopPropagation();

        const parent = this.parentElement;

        // دوسرے تمام dropdown بند کرو
        document.querySelectorAll('.dropdown').forEach(item => {
          if (item !== parent) item.classList.remove('active');
        });

        // current dropdown toggle کرو
        parent.classList.toggle('active');
      }
    };

    dropdown.addEventListener('click', toggleDropdown);
    dropdown.addEventListener('touchstart', toggleDropdown);
  });

  // Outer click پر dropdown بند کریں
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown') && window.innerWidth <= 992) {
      document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('active');
      });
    }
  });

  // ==============================
  // Cart functionality
  // ==============================
  let cart = [];

  function loadCart() {
    const savedCart = localStorage.getItem('cart'); // use unified key
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartCount();
    } else {
      localStorage.setItem('cart', JSON.stringify([]));
    }
  }

  function updateCartCount() {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
      el.textContent = totalItems;
      el.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    document.dispatchEvent(new CustomEvent('cartUpdated'));
    return totalItems;
  }

  function addToCart(product, size = 'M', quantity = 1) {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = currentCart.findIndex(item =>
      item.id === product.id && item.size === size
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    updateCartCount();
    return currentCart;
  }

  // ==============================
  // Filters
  // ==============================
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFrom = document.getElementById('priceFrom');
  const priceTo = document.getElementById('priceTo');
  const searchInputMain = document.getElementById('searchInputMain');

  if (priceFrom) priceFrom.value = '0';
  if (priceTo) priceTo.value = '500';

  [categoryFilter, priceFrom, priceTo, searchInputMain].forEach(el => {
    if (el) el.addEventListener('input', filterProducts);
  });

  function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const minPrice = parseInt(priceFrom.value) || 0;
    const maxPrice = parseInt(priceTo.value) || 500;
    const searchTerm = searchInputMain.value.toLowerCase();

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      const category = card.closest('.product-grid').id;
      const price = parseInt(card.querySelector('.current-price').textContent.replace('$', ''));
      const name = card.querySelector('h3').textContent.toLowerCase();

      const show = 
        (selectedCategory === 'all' || category === selectedCategory) &&
        price >= minPrice && price <= maxPrice &&
        name.includes(searchTerm);

      card.style.display = show ? 'flex' : 'none';
    });

    document.querySelectorAll('.product-grid').forEach(section => {
      const visible = section.querySelectorAll('.product-card[style="display: flex;"]').length;
      const container = section.closest('section');
      const titleElement = container.querySelector('.section-title');
      if (visible === 0) {
        container.style.display = 'none';
      } else {
        container.style.display = 'block';
        const baseTitle = titleElement.textContent.split(' (')[0];
        titleElement.textContent = `${baseTitle} (${visible})`;
      }
    });
  }

  // ==============================
  // Load Products from JSON
  // ==============================
  fetch('json/mensec.json')
    .then(response => response.json())
    .then(data => {
      const categories = ['sneakers', 'loafers', 'Chappals', 'sandals', 'formal'];
      categories.forEach(category => {
        const container = document.getElementById(category);
        if (!container || !data[category]) return;

        data[category].forEach(product => {
          const card = `
            <div class="product-card">
              <img class="product-image" src="${product.image}" alt="${product.name}">
              <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price-section">
                  <span class="current-price">$${product.price}</span>
                </div>
              </div>
              <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-shopping-cart"></i> Buy Now
              </button>
            </div>
          `;
          container.innerHTML += card;
        });
      });
    })
    .catch(err => console.error('Failed to load product data:', err));

  // ==============================
  // Buy Now click event
  // ==============================
  document.addEventListener('click', function (e) {
    if (e.target.closest('.add-to-cart')) {
      const button = e.target.closest('.add-to-cart');
      const productId = parseInt(button.getAttribute('data-id'));

      fetch('json/mensec.json')
        .then(response => response.json())
        .then(data => {
          let foundProduct = null;
          for (const category in data) {
            foundProduct = data[category].find(p => p.id === productId);
            if (foundProduct) break;
          }

          if (foundProduct) {
            localStorage.setItem('selectedProduct', JSON.stringify(foundProduct));
            window.location.href = `product-detail.html?id=${productId}`;
          }
        });
    }
  });

  // Initialize cart
  loadCart();
});
