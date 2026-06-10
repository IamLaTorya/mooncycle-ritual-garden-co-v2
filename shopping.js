// shopping.js
// Shared cart array
export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add item to cart
export const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    loadCartCount();
};

// Save cart
export const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Update badge
export const loadCartCount = () => {
    const count = document.getElementById("cart-count");
    if (!count) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    count.textContent = totalQty;
};


// localStorage.removeItem("cart"); // Clear cart for testing