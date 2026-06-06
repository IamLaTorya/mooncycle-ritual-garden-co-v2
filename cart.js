// create a cart variable, check the browser's memory for a saved cart text. Turn that text into a working array(this means they've shopped here). If nothing is there, start with a fresh, empty array [](this means they've never shopped here).
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Create an arrow function (a repeatable recipe) that takes an item and adds it to the cart. The "export" lets other script files use this recipe too.
export const addToCart = (product) => {
    // Add the new item into the very end of the cart array.
    cart.push(product);
    // Run the saving recipe below so the browser remembers the change.
    saveCart();
    // Run the counting recipe below to update the screen.
    loadCartCount();
}

// Create an arrow function as a private recipe just for saving. No "export" means only this file can use it.
const saveCart = () => {
    // Lock the array into the browser's memory to a varible named "cart". We must smash it into plain text string format first because the box only holds text.
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Create another arrow function that is a repeatable recipe to update the website's cart number bubble.
export const loadCartCount = () => {
    // Scan the web page to find the exact text element with the ID label "cart-count".
    const count = document.getElementById("cart-count");
    // use a single-line if statement: If the page actually has that element, change its text to match the total count of items sitting in our array.
    if (count) count.textContent = cart.length;
}
