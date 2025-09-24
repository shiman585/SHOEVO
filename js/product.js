
// ✅ Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load product data from localStorage
  const productData = JSON.parse(localStorage.getItem('selectedProduct'));
  
  if (productData) {
      // Main product info
      document.getElementById('productImage').src = productData.image;
      document.getElementById('productName').textContent = productData.name;
      document.getElementById('productPrice').textContent = `$${productData.price}`;
      document.getElementById('productSKU').textContent = `SHOE${productData.id.toString().padStart(4, '0')}`;
      
      // Descriptions
      document.getElementById('productDescription').textContent = productData.description;
      document.getElementById('productFullDescription').textContent = productData.fullDescription;
      
      // Old price & discount
      if (productData.oldPrice) {
          document.getElementById('productOldPrice').textContent = `$${productData.oldPrice}`;
          const discount = Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100);
          document.getElementById('productDiscount').textContent = `-${discount}%`;
      } else {
          document.getElementById('productOldPrice').style.display = 'none';
          document.getElementById('productDiscount').style.display = 'none';
      }
      
      // Size selection
      document.querySelectorAll('.size-options button').forEach(btn => {
          btn.addEventListener('click', function() {
              const selected = document.querySelector('.size-options button.selected');
              if (selected) selected.classList.remove('selected');
              this.classList.add('selected');
          });
      });
      
      // Quantity selector
      document.querySelectorAll('.quantity-selector .qty-btn').forEach(btn => {
          btn.addEventListener('click', function() {
              const input = this.parentElement.querySelector('input');
              let value = parseInt(input.value);
              if (this.classList.contains('minus') && value > 1) input.value = value - 1;
              if (this.classList.contains('plus') && value < 10) input.value = value + 1;
          });
      });
      
      // Accordion functionality
      document.querySelectorAll('.accordion-header').forEach(header => {
          header.addEventListener('click', function() {
              const content = this.nextElementSibling;
              const icon = this.querySelector('i');
              this.classList.toggle('active');
              icon.classList.toggle('fa-chevron-down');
              icon.classList.toggle('fa-chevron-up');
              content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
          });
      });
      
      // Add to cart
      document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
          const selectedSizeBtn = document.querySelector('.size-options button.selected');
          if (!selectedSizeBtn) { alert('Please select a size'); return; }
          const selectedSize = selectedSizeBtn.dataset.size;
          const quantity = parseInt(document.querySelector('.quantity-selector input').value);
          
          const cartItem = {
              id: productData.id,
              name: productData.name,
              price: productData.price,
              image: productData.image,
              size: selectedSize,
              quantity: quantity
          };
          
          let cart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
          if (existingIndex >= 0) {
              cart[existingIndex].quantity += cartItem.quantity;
          } else {
              cart.push(cartItem);
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
          showToast(`${quantity} ${productData.name} (Size: ${selectedSize}) Added To Cart!`);
      });
      
      // Wishlist button
      document.querySelector('.wishlist-btn').addEventListener('click', function() {
          let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
          const index = wishlist.findIndex(item => item.id === productData.id);
          if (index >= 0) {
              wishlist.splice(index, 1);
              this.innerHTML = '<i class="far fa-heart"></i>';
              alert(`${productData.name} removed from wishlist!`);
          } else {
              wishlist.push({
                  id: productData.id,
                  name: productData.name,
                  price: productData.price,
                  image: productData.image
              });
              this.innerHTML = '<i class="fas fa-heart" style="color:#ff4136"></i>';
              alert(`${productData.name} added to wishlist!`);
          }
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
      });
      
      // Check wishlist icon
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (wishlist.some(item => item.id === productData.id)) {
          document.querySelector('.wishlist-btn').innerHTML = '<i class="fas fa-heart" style="color:#ff4136"></i>';
      }
      
      // Related products
      loadRelatedProducts(productData.category, productData.id);
  } else {
      document.querySelector('.product-detail-section').innerHTML = `
          <div class="product-not-found">
              <i class="fas fa-exclamation-circle"></i>
              <h2>Product Not Found</h2>
              <p>We couldn't find the product you're looking for.</p>
              <a href="index.html" class="btn">Back to Home</a>
          </div>
      `;
  }
  
  // Update cart count
  function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);
  }
  updateCartCount();
  
  // Load related products
  function loadRelatedProducts(category, currentId) {
      fetch('json/mensec.json')
          .then(res => res.json())
          .then(data => {
              const products = data[category] || [];
              const related = products.filter(p => p.id !== currentId).sort(() => 0.5 - Math.random()).slice(0, 3);
              const container = document.getElementById('relatedProducts');
              container.innerHTML = '';
              related.forEach(p => {
                  const card = document.createElement('div');
                  card.className = 'product-card';
                  card.innerHTML = `
                      <img src="${p.image}" alt="${p.name}">
                      <h3>${p.name}</h3>
                      <div class="price">
                          ${p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : ''} $${p.price}
                      </div>
                  `;
                  card.addEventListener('click', () => {
                      localStorage.setItem('selectedProduct', JSON.stringify({...p, category}));
                      window.location.reload();
                  });
                  container.appendChild(card);
              });
          })
          .catch(() => document.getElementById('relatedProducts').innerHTML = '<p>Unable to load related products.</p>');
  }
  
  // Social share
  document.querySelectorAll('.social-share a').forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const platform = this.querySelector('i').className.split(' ')[1].split('-')[1];
          const url = window.location.href;
          const name = document.getElementById('productName').textContent;
          let shareUrl = '';
          switch(platform) {
              case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.html?u=${encodeURIComponent(url)}`; break;
              case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${name} at `)}&url=${encodeURIComponent(url)}`; break;
              case 'pinterest': shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(name)}`; break;
              case 'instagram': shareUrl = 'https://www.instagram.com/'; break;
          }
          window.open(shareUrl, '_blank', 'width=600,height=400');
      });
  });

  // Force button stability ONLY inside product section (fix dropdown conflict)
  document.querySelectorAll('.product-detail-section button').forEach(button => {
      button.style.transform = 'translate(0, 0)';
      button.addEventListener('mouseenter', function() {
          this.style.transform = 'translate(0, 0)';
      });
      button.addEventListener('mouseleave', function() {
          this.style.transform = 'translate(0, 0)';
      });
  });
});
// ✅ Toast Notification Function
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // show animation
    setTimeout(() => toast.classList.add('show'), 100);

    // hide after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

