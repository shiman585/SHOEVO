// navbar sec start
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const dropdowns = document.querySelectorAll('.dropdown');
  const dropdownLinks = document.querySelectorAll('.dropdown-content a');
  const navItems = document.querySelectorAll('.nav-links > li:not(.dropdown)');
  const isMobile = () => window.innerWidth <= 992;

  // Toggle mobile menu
  menuToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    toggleMenuIcon();
  });

  // Handle dropdowns
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');

    link.addEventListener('click', function (e) {
      if (isMobile()) {
        e.preventDefault();
        e.stopPropagation();
        const isActive = dropdown.classList.contains('active');
        dropdowns.forEach(d => d.classList.remove('active'));
        if (!isActive) dropdown.classList.add('active');
      }
    });

    if (!isMobile()) {
      dropdown.addEventListener('mouseenter', function () {
        dropdown.classList.add('active');
      });
      dropdown.addEventListener('mouseleave', function () {
        dropdown.classList.remove('active');
      });
    }
  });

  // Close dropdowns when clicking on nav items
  navItems.forEach(item => {
    item.addEventListener('click', function () {
      if (isMobile()) {
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  });

  dropdownLinks.forEach(link => {
    link.addEventListener('click', function () {
      if (isMobile()) {
        dropdowns.forEach(d => d.classList.remove('active'));
        navLinks.classList.remove('active');
        toggleMenuIcon(false);
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (isMobile() && !e.target.closest('.navbar')) {
      dropdowns.forEach(d => d.classList.remove('active'));
      navLinks.classList.remove('active');
      toggleMenuIcon(false);
    }
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      navLinks.classList.remove('active');
      dropdowns.forEach(d => d.classList.remove('active'));
      toggleMenuIcon(false);
    }
  });

  function toggleMenuIcon(active) {
    const icon = menuToggle.querySelector('i');
    if (typeof active === 'undefined') {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    } else {
      icon.classList.remove('fa-bars', 'fa-times');
      icon.classList.add(active ? 'fa-times' : 'fa-bars');
    }
  }
});
// navbar sec end



// Cart counter functionality for header
document.addEventListener('DOMContentLoaded', function() {
    // Function to update cart count in header
    function updateHeaderCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('headerCartCount');
        
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Initialize cart count on page load
    updateHeaderCartCount();
    
    // Listen for storage events to update cart count when cart changes in other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            updateHeaderCartCount();
        }
    });
    
    // Custom event to update cart count when changes happen on the same page
    document.addEventListener('cartUpdated', updateHeaderCartCount);
});
// cart sec end