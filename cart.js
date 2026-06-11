// cart.js
// global function for "Buy Now" button in catalog
import { cart, saveCart, loadCartCount } from "./shopping.js";

// Detect if we are on the cart page
const cartRoot = document.getElementById("cart-root");

// If NOT on the cart page, only expose buyNow and STOP running cart.js logic
if (!cartRoot) {

    // Global Buy Now function for catalog + quick view
    window.buyNow = function (product) {

        // Check if this product already exists in the cart
        const existing = cart.find(item => item.id === product.id);

        // If it exists, increase quantity
        if (existing) {
            existing.qty += 1;

            // Otherwise add it as a new item
        } else {
            cart.push({ ...product, qty: 1 });
        }

        // Save updated cart to localStorage
        saveCart();

        // Redirect to cart page where ritual will run
        window.location.href = "cart.html?ritual=true";
    };

    // IMPORTANT: Do NOT run any more cart.js code
} else {

    // -----------------------------
    // Everything below ONLY runs on cart.html
    // -----------------------------

    // Function to render all cart items and totals
    function renderCart() {

        // If cart is empty, show empty message
        if (cart.length === 0) {
            cartRoot.innerHTML = `
                <div class="text-center py-5">
                    <h2>Your cart is empty</h2>
                    <p>Return to the garden to gather more treasures.</p>
                </div>
            `;
            return;
        }

        // Build HTML for each item in the cart
        let itemsHTML = "";
        cart.forEach(item => {
            itemsHTML += `
                <div class="cart-item d-flex justify-content-end align-items-right mb-3 p-2 border rounded">
                    <img src="${item.image}" class="cart-img-fluid w-25 me-2" alt="${item.name}">
                    <div class="flex-grow-1">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(2)}</p>

                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-dark" onclick="changeQty('${item.id}', -1)">−</button>
                            <span>${item.qty}</span>
                            <button class="btn btn-sm btn-outline-dark" onclick="changeQty('${item.id}', 1)">+</button>
                        </div>

                        <button class="btn btn-sm btn-link text-danger mt-1" onclick="removeItem('${item.id}')">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        });

        // Calculate subtotal cost
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        // Calculate tax amount
        const tax = subtotal * 0.0725;

        // Add shipping if cart has items
        const shipping = subtotal > 0 ? 5.99 : 0;

        // Calculate final total
        const total = subtotal + tax + shipping;

        // Insert items + totals into the cart page
        cartRoot.innerHTML = `
            <div class="cart-items">${itemsHTML}</div>
            <div class="cart-totals mt-4">
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>7.25% Tax</p>
                <p>Tax: $${tax.toFixed(2)}</p>
                <p>Shipping: $${shipping.toFixed(2)}</p>
                <h4>Total: $${total.toFixed(2)}</h4>

                <button id="pay-now-btn" class="btn btn-dark w-100 mt-3">
                    Pay Now
                </button>
            </div>
        `;

        // Add click event to start ritual checkout
        document.getElementById("pay-now-btn")
            .addEventListener("click", startGardenGateReader);
    }

    // Function to change quantity of an item
    window.changeQty = function (id, amount) {

        // Find the item in the cart
        const item = cart.find(p => p.id === id);

        // If item doesn't exist, stop
        if (!item) return;

        // Adjust quantity
        item.qty += amount;

        // If quantity becomes zero or less, remove item
        if (item.qty <= 0) {
            removeItem(id);
            return;
        }

        // Save cart and re-render
        saveCart();
        renderCart();
        loadCartCount();
    };

    // Function to remove an item from the cart
    window.removeItem = function (id) {

        // Find index of item in cart
        const index = cart.findIndex(item => item.id === id);

        // Remove item if found
        if (index !== -1) {
            cart.splice(index, 1);
        }

        // Save cart and re-render
        saveCart();
        renderCart();
        loadCartCount();
    };

    // Function to run the ritual checkout animation
    function startGardenGateReader() {

        // Generate random terminal number
        const terminal = Math.floor(1000 + Math.random() * 9000);

        // Generate random BloomCode
        const bloomCode = Math.floor(10000 + Math.random() * 90000);

        // Generate random order number
        const orderNumber = "G-" + Math.floor(100000 + Math.random() * 900000);

        // Recalculate subtotal
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        // Recalculate tax
        const tax = subtotal * 0.0725;

        // Recalculate shipping
        const shipping = subtotal > 0 ? 5.99 : 0;

        // Calculate final total
        const total = subtotal + tax + shipping;

        // Build HTML for order summary
        let summaryHTML = "";
        cart.forEach(item => {
            summaryHTML += `
                <div class="d-flex justify-content-between">
                    <span>${item.name} x${item.qty}</span>
                    <span>$${(item.price * item.qty).toFixed(2)}</span>
                </div>
            `;
        });

        // Replace cart with ritual checkout screen
        cartRoot.innerHTML = `
            <div class="garden-gate-exit text-center py-5">

                <h2 class="mb-4">🌿 Garden Gate Exit #${terminal}</h2>

                <p class="processing mb-1">Preparing your ritual departure…</p>

                <div class="exit-box mx-auto p-3">

                    <p><strong>Order Number:</strong> ${orderNumber}</p>
                    <p>Use this <strong>BloomCode</strong> for a discount on your next purchase: #${bloomCode}</p>

                    <div class="order-summary text-start mt-2">
                        <h5>Order Summary</h5>
                        ${summaryHTML}
                        <hr>
                        <div class="d-flex justify-content-between">
                            <strong>Total</strong>
                            <strong>$${total.toFixed(2)}</strong>
                        </div>
                    </div>

                    <p id="approval-msg" class="mt-1" style="opacity:0; transition:0.6s;">
                        Approved ✨
                    </p>

                    <p id="exit-msg" class="mt-2" style="opacity:0; transition:0.6s;">
                        The Garden Gate opens for you…
                    </p>
                </div>
            </div>
        `;

        // Fade in approval message
        setTimeout(() => {
            document.getElementById("approval-msg").style.opacity = 1;
        }, 2000);

        // Fade in exit message
        setTimeout(() => {
            document.getElementById("exit-msg").style.opacity = 1;
        }, 3500);

        // Clear cart and redirect home
        setTimeout(() => {
            localStorage.removeItem("cart");
            window.location.href = "index.html";
        }, 8500);
    }

    // Render cart when page loads
    renderCart();

    // Update cart count in header
    loadCartCount();
}
