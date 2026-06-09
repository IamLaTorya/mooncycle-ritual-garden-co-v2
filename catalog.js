// catalog.js
import { addToCart, loadCartCount } from "./cart.js";
import { storeCatalog } from "./catalogData.js";

// DOM references
const productGrid = document.getElementById("product-grid");
const quickviewRoot = document.getElementById("quickview-root");

// Render catalog on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCartCount();
    renderCatalog(storeCatalog);
});
function starsRating(rating) {
    const starContainer = document.createElement("div");
    starContainer.className = "text-warning mb-2";

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement("i");
        star.className = "bi bi-star-fill";
        starContainer.appendChild(star);
    }

    // Half star
    if (halfStar) {
        const half = document.createElement("i");
        half.className = "bi bi-star-half";
        starContainer.appendChild(half);
    }

    // Empty stars
    const totalStars = halfStar ? fullStars + 1 : fullStars;
    for (let i = totalStars; i < 5; i++) {
        const empty = document.createElement("i");
        empty.className = "bi bi-star";
        starContainer.appendChild(empty);
    }

    return starContainer;
}

// Build product cards
function renderCatalog(products) {
    productGrid.innerHTML = ""; // clear grid

    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

        const card = document.createElement("div");
        card.className = "card h-100";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.className = "card-img-top";

        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";

        const title = document.createElement("h5");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.className = "fw-semibold mb-1";
        price.textContent = `$${product.price.toFixed(2)}`;

        const stars = starsRating(product.rating);

        // Button container (Bootstrap flexbox)
        const btnRow = document.createElement("div");
        btnRow.className = "d-flex gap-2 mt-auto mb-1";

        // Add to Cart button
        const addBtn = document.createElement("button");
        addBtn.className = "btn btn-outline-dark btn-sm rounded-pill flex-fill";
        addBtn.classList.add("btn-lavender", "moon-hover");
        addBtn.textContent = "Add to Cart";
        addBtn.addEventListener("click", () => addToCart(product));

        // Buy Now button
        const buyBtn = document.createElement("button");
        buyBtn.className = "btn btn-outline-dark btn-sm rounded-pill flex-fill";
        buyBtn.classList.add("btn-pink", "moon-hover");
        buyBtn.textContent = "Buy Now";
        buyBtn.addEventListener("click", () => {
            addToCart(product);
            window.location.href = "cart.html";
        });
        // Quick View button
        const quickBtn = document.createElement("button");
        quickBtn.className = "btn btn-outline-dark mt-auto";
        quickBtn.classList.add("btn-nightblue", "moon-hover");
        quickBtn.textContent = "Quick View";
        quickBtn.addEventListener("click", () => openQuickView(product));

        btnRow.append(addBtn, buyBtn);
        body.append(title, price, stars, btnRow, quickBtn);
        card.append(img, body);
        col.append(card);
        productGrid.append(col);
    });
}

/// Quick View Modal
const openQuickView = (product) => {
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

                <button class="quickview-buy btn-lavender moon-hover">Add to Cart</button>
                <button class="quickview-buy btn-pink moon-hover">Buy Now</button>
            </div>
        </div>
    </div>
    `;

    document.querySelector(".quickview-close").addEventListener("click", closeQuickView);

    document.querySelector(".quickview-buy").addEventListener("click", () => {
        addToCart(product);
        closeQuickView();
    });
}

const closeQuickView = () => quickviewRoot.innerHTML = "";