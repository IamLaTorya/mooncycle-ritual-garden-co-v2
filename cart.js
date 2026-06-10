// cart.js
// global function for "Buy Now" button in catalog
import { cart, saveCart, loadCartCount } from "./shopping.js";

// Detect if we are on the cart page
const cartRoot = document.getElementById("cart-root");

// If NOT on the cart page, only expose buyNow and STOP running cart.js logic
if (!cartRoot) {

    // Global Buy Now function for catalog + quick view
    window.buyNow = function (product) {
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        saveCart();

        // Redirect to cart page where ritual will run
        window.location.href = "cart.html?ritual=true";
    };

    // IMPORTANT: Do NOT run any more cart.js code
} else {

    // -----------------------------
    // Everything below ONLY runs on cart.html
    // -----------------------------

    function renderCart() {
        if (cart.length === 0) {
            cartRoot.innerHTML = `
                <div class="text-center py-5">
                    <h2>Your cart is empty</h2>
                    <p>Return to the garden to gather more treasures.</p>
                </div>
            `;
            return;
        }

        let itemsHTML = "";
        cart.forEach(item => {
            itemsHTML += `
                <div class="cart-item d-flex align-items-center gap-3 mb-3">
                    <img src="${item.image}" class="cart-img" alt="${item.name}">
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

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const tax = subtotal * 0.0725;
        const shipping = subtotal > 0 ? 5.99 : 0;
        const total = subtotal + tax + shipping;

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

        document.getElementById("pay-now-btn")
            .addEventListener("click", startGardenGateReader);
    }

    window.changeQty = function (id, amount) {
        const item = cart.find(p => p.id === id);
        if (!item) return;

        item.qty += amount;

        if (item.qty <= 0) {
            removeItem(id);
            return;
        }

        saveCart();
        renderCart();
        loadCartCount();
    };

    window.removeItem = function (id) {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
        }

        saveCart();
        renderCart();
        loadCartCount();
    };

    function startGardenGateReader() {
    // Generate codes (kept original logic)
    const terminal = Math.floor(1000 + Math.random() * 9000);
    const bloomCode = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = "G-" + Math.floor(100000 + Math.random() * 900000);

    // Calculate totals again (keeps your original math)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.0725;
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + tax + shipping;

    // Build order summary
    let summaryHTML = "";
    cart.forEach(item => {
        summaryHTML += `
            <div class="d-flex justify-content-between">
                <span>${item.name} x${item.qty}</span>
                <span>$${(item.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    // Garden Gate Exit 
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

    // Reveal approval (kept your timing)
    setTimeout(() => {
        document.getElementById("approval-msg").style.opacity = 1;
    }, 2000);

    // Reveal exit message (kept your timing)
    setTimeout(() => {
        document.getElementById("exit-msg").style.opacity = 1;
    }, 3500);

    // Clear cart + redirect (kept your timing)
    setTimeout(() => {
        localStorage.removeItem("cart");
        window.location.href = "index.html";
    }, 8500);
}

    // Initialize cart page
    renderCart();
    loadCartCount();
}
