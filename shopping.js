// shopping.js

// Shared cart array
// Load saved cart from localStorage OR start with empty array
export let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add item to cart
export const addToCart = (product) => {

    // Look for this product already in the cart
    const existing = cart.find(item => item.id === product.id);

    // If found, increase quantity
    if (existing) {
        existing.qty += 1;

    // Otherwise add new item with qty 1
    } else {
        cart.push({ ...product, qty: 1 });
    }

    // Save updated cart to localStorage
    saveCart();

    // Update cart badge in header
    loadCartCount();
};

// Save cart
// Store the cart array as text inside localStorage
export const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Update badge
export const loadCartCount = () => {

    // Find the cart-count badge in the header
    const count = document.getElementById("cart-count");

    // If badge doesn't exist on this page, stop
    if (!count) return;

    // Add up all quantities in the cart
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    // Update the badge number
    count.textContent = totalQty;
};

// localStorage.removeItem("cart"); // Clear cart for testing
