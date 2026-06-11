// catalog.js

// Import cart functions for adding items + updating cart badge
import { addToCart, loadCartCount } from "./shopping.js";

// Import product data array
import { storeCatalog } from "./catalogData.js";

// Import cart.js so Buy Now is available globally
import "./cart.js"; // for buyNow function

// Get the product grid container
const productGrid = document.getElementById("product-grid");

// Get the Quick View modal root container
const quickviewRoot = document.getElementById("quickview-root");

// Wait for page to load before rendering catalog
document.addEventListener("DOMContentLoaded", () => {
    // Update cart count in header
    loadCartCount();

    // Build product cards from catalog data
    renderCatalog(storeCatalog);
});

// Function to generate star rating icons
function starsRating(rating) {

    // Create container for star icons
    const starContainer = document.createElement("div");
    starContainer.className = "text-warning mb-2";

    // Count full stars
    const fullStars = Math.floor(rating);

    // Check if rating has a half star
    const halfStar = rating % 1 !== 0;

    // Loop to add full star icons
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement("i");
        star.className = "bi bi-star-fill";
        starContainer.appendChild(star);
    }

    // Add half star if needed
    if (halfStar) {
        const half = document.createElement("i");
        half.className = "bi bi-star-half";
        starContainer.appendChild(half);
    }

    // Add empty stars to reach 5 total
    const totalStars = halfStar ? fullStars + 1 : fullStars;
    for (let i = totalStars; i < 5; i++) {
        const empty = document.createElement("i");
        empty.className = "bi bi-star";
        starContainer.appendChild(empty);
    }

    // Return the full star container
    return starContainer;
}

// Build product cards and insert them into the grid
function renderCatalog(products) {

    // Clear previous items
    productGrid.innerHTML = "";

    // Loop through each product in the catalog
    products.forEach(product => {

        // Create Bootstrap column wrapper
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        // Create card container
        const card = document.createElement("div");
        card.className = "card h-100";

        // Create product image
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.className = "card-img-top";

        // Create card body container
        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";

        // Create product title
        const title = document.createElement("h5");
        title.textContent = product.name;

        // Create product price
        const price = document.createElement("p");
        price.className = "fw-semibold mb-1";
        price.textContent = `$${product.price.toFixed(2)}`;

        // Generate star rating icons
        const stars = starsRating(product.rating);

        // Create button row container
        const btnRow = document.createElement("div");
        btnRow.className = "d-flex gap-2 mt-auto mb-1";

        // Create Add to Cart button
        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-outline-dark btn-sm rounded-pill flex-fill";
        addBtn.classList.add("btn-lavender", "moon-hover");
        addBtn.textContent = "Add to Cart";

        // Add click event to add product to cart
        addBtn.addEventListener("click", () => addToCart(product));

        // Create Buy Now button
        const buyBtn = document.createElement("button");
        buyBtn.className = "btn btn-outline-dark btn-sm rounded-pill flex-fill";
        buyBtn.classList.add("btn-pink", "moon-hover");
        buyBtn.textContent = "Buy Now";

        // Add click event to trigger Buy Now flow
        buyBtn.addEventListener("click", () => {
            buyNow(product);
        });

        // Create Quick View button
        const quickBtn = document.createElement("button");
        quickBtn.className = "btn btn-outline-dark mt-auto";
        quickBtn.classList.add("btn-nightblue", "moon-hover");
        quickBtn.textContent = "Quick View";

        // Open Quick View modal when clicked
        quickBtn.addEventListener("click", () => openQuickView(product));

        // Add Add-to-Cart + Buy Now buttons to row
        btnRow.append(addBtn, buyBtn);

        // Add all card elements to card body
        body.append(title, price, stars, btnRow, quickBtn);

        // Add image + body to card
        card.append(img, body);

        // Add card to column
        col.append(card);

        // Add column to product grid
        productGrid.append(col);
    });
}

/// Quick View Modal
const openQuickView = (product) => {

    // Insert modal HTML into root container
    quickviewRoot.innerHTML = `
    <div class="quickview-overlay active">
        <div class="quickview-modal">

            <button class="quickview-close">&times;</button>

            <img src="${product.image}" alt="${product.name}">

            <div class="quickview-content">
                <h2>${product.name}</h2>
                <p class="quickview-price">$${product.price.toFixed(2)}</p>
                <div class="quickviw-stars">${starsRating(product.rating).outerHTML}</div>
                <p>${product.description}</p>

                <h3>Ingredients</h3>
                <ul class="quickview-list">
                    ${product.details.ingredients.map(i => `<li>${i}</li>`).join("")}
                </ul>

                <h3>Usage</h3>
                <p>${product.details.usage}</p>

                <h3>Affirmation</h3>
                <p class="quickview-affirmation">“${product.details.affirmation}”</p>

                <h3>Included</h3>
                <ul class="quickview-list">
                    ${product.details.included.map(i => `<li>${i}</li>`).join("")}
                </ul>

                <button class="quickview-add btn-lavender moon-hover">Add to Cart</button>
                <button class="quickview-buy btn-pink moon-hover">Buy Now</button>
            </div>
        </div>
    </div>
    `;

    // Close modal when X is clicked
    document.querySelector(".quickview-close").addEventListener("click", closeQuickView);

    // Add to Cart inside modal
    document.querySelector(".quickview-add").addEventListener("click", () => {
        addToCart(product);
        closeQuickView();
    });

    // Buy Now inside modal
    document.querySelector(".quickview-buy").addEventListener("click", () => {
        buyNow(product);
        closeQuickView();
    });
}

// Close Quick View modal by clearing root container
const closeQuickView = () => quickviewRoot.innerHTML = "";
