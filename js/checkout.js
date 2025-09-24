  document.addEventListener('DOMContentLoaded', function () {
            // Payment method toggle
            const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
            const creditCardDetails = document.getElementById('creditCardDetails');
            
            paymentOptions.forEach(option => {
                option.addEventListener('change', function() {
                    if (this.value === 'creditCard') {
                        creditCardDetails.style.display = 'block';
                    } else {
                        creditCardDetails.style.display = 'none';
                    }
                });
            });
            
            // Load cart items for checkout
            function getCart() {
                try {
                    return JSON.parse(localStorage.getItem('cart')) || [];
                } catch {
                    return [];
                }
            }
            
            function updateCheckoutItems() {
                const cart = getCart();
                const checkoutItems = document.getElementById('checkoutItems');
                const subtotalEl = document.getElementById('subtotal');
                const totalEl = document.getElementById('total');
                
                if (cart.length === 0) {
                    checkoutItems.innerHTML = '<p>Your cart is empty</p>';
                    subtotalEl.textContent = '$0.00';
                    totalEl.textContent = '$0.00';
                    return;
                }
                
                let subtotal = 0;
                checkoutItems.innerHTML = '';
                
                cart.forEach(item => {
                    const itemTotal = Number(item.price) * (Number(item.quantity) || 1);
                    subtotal += itemTotal;
                    
                    const itemElement = document.createElement('div');
                    itemElement.className = 'checkout-item';
                    itemElement.innerHTML = `
                        <span class="item-name">${item.name} (${item.size})</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-price">$${itemTotal.toFixed(2)}</span>
                    `;
                    
                    checkoutItems.appendChild(itemElement);
                });
                
                const shipping = 5.00;
                const total = subtotal + shipping;
                
                subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
                totalEl.textContent = `$${total.toFixed(2)}`;
            }
            
            // Place order button
            document.getElementById('placeOrderBtn').addEventListener('click', function() {
                const form = document.getElementById('checkoutForm');
                if (form.checkValidity()) {
                   showToast('🎉 Your order has been placed successfully!');
                    // Clear cart
                    localStorage.removeItem('cart');
                    // Redirect to confirmation page (you can create this later)
                    window.location.href = 'index.html';
                } else {
                    form.reportValidity();
                }
            });
            
            // Initialize checkout items
            updateCheckoutItems();
        });
        // ✅ Toast Function
function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}
