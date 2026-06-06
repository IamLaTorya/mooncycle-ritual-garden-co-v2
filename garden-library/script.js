// Get all the hole elements from the page
const holes = document.querySelectorAll(".hole");

// Get the score display element
const scoreDisplay = document.getElementById("score");

// Get the timer display element
const timerDisplay = document.getElementById("timer");

// Get the Start button
const startBtn = document.getElementById("startBtn");

// Get the hit sound element
const hitSound = document.getElementById("hitSound");

// Set the starting score to 0
let score = 0;

// Store which hole is currently glowing
let activeKey = null;

// Set the starting time to 30 seconds
let timeLeft = 30;

// Store the countdown timer interval
let gameInterval = null;

// Store the mole appearance interval
let moleInterval = null;

// Function to show a glowing mole/light in a random hole
function showMole() {

    // Remove glow from all holes before choosing a new one
    holes.forEach(hole => hole.classList.remove("active"));

    // Pick a random hole from the list
    const randomHole = holes[Math.floor(Math.random() * holes.length)];

    // Store the number of the glowing hole
    activeKey = randomHole.dataset.key;

    // Add the glowing effect to the chosen hole
    randomHole.classList.add("active");

    // Remove the glow after 700ms so it doesn't stay forever
    setTimeout(() => {
        randomHole.classList.remove("active");
        activeKey = null;
    }, 700);
}

// Function to start the game
function startGame() {

    // Show a countdown alert before the game begins
    alert("Instructions: Use \n*Number pad 1–9\n*Number row 1-9 \n*Numbers on your screen (double click)\nto capture the glowing light! \n \nGet ready! Game starts in 3... 2... 1...");

    // Reset the score to 0
    score = 0;

    // Reset the timer to 30 seconds
    timeLeft = 30;

    // Update the score display on the screen
    scoreDisplay.textContent = score;

    // Update the timer display on the screen
    timerDisplay.textContent = timeLeft;

    // Disable the Start button so the player can't restart mid‑game
    startBtn.disabled = true;

    // Make the mole appear repeatedly every 900ms
    moleInterval = setInterval(showMole, 900);

    // Start the countdown timer
    gameInterval = setInterval(() => {

        // Reduce the time left by 1 second
        timeLeft--;

        // Update the timer display
        timerDisplay.textContent = timeLeft;

        // If time runs out, end the game
        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);
}

// Function to end the game
function endGame() {

    // Stop the countdown timer
    clearInterval(gameInterval);

    // Stop the mole from appearing
    clearInterval(moleInterval);

    // Remove glow from all holes
    holes.forEach(h => h.classList.remove("active"));

    // Clear the active key
    activeKey = null;

    // Show the final score to the player
    alert("You honored the light, and it answered! \n*****  Your final score is: " + score + "*****  \nYour energy is brighter now. Carry this glow with you.");

    // Re-enable the Start button
    startBtn.disabled = false;
}

// Listen for keyboard presses
document.addEventListener("keydown", (e) => {

    // Create a variable to store the number pressed
    let pressed = null;

    // If the key is from the numpad (Numpad1, Numpad2, etc.)
    if (e.code.startsWith("Numpad")) {
        pressed = e.code.replace("Numpad", "");
    }

    // If the key is from the top row (1–9)
    if (e.key >= "1" && e.key <= "9") {
        pressed = e.key;
    }

    // If the key pressed is not a number, stop here
    if (!pressed) return;

    // Find the hole that matches the number pressed
    const hole = document.querySelector(`.hole[data-key="${pressed}"]`);

    // Add a quick glow effect to show the key was pressed
    if (hole) {
        hole.classList.add("key-pressed");
        setTimeout(() => hole.classList.remove("key-pressed"), 150);
    }

    // If the number pressed matches the glowing hole
    if (pressed === activeKey) {

        // Increase the score by 1
        score++;

        // Update the score display
        scoreDisplay.textContent = score;

        // Restart the sound so it plays instantly
        hitSound.currentTime = 0;

        // Play the hit sound
        hitSound.play();

        // Remove the glow from the hole
        if (hole) hole.classList.remove("active");

        // Clear the active key
        activeKey = null;
    }
});

// Add click/tap support for mobile + desktop
holes.forEach(hole => {

    // When a hole is clicked or tapped
    hole.addEventListener("click", () => {

        // Get the number of the hole that was tapped
        const pressed = hole.dataset.key;

        // Add a quick glow effect
        hole.classList.add("key-pressed");
        setTimeout(() => hole.classList.remove("key-pressed"), 150);

        // If the tapped hole is the glowing one
        if (pressed === activeKey) {

            // Increase the score
            score++;

            // Update the score display
            scoreDisplay.textContent = score;

            // Restart the sound
            hitSound.currentTime = 0;

            // Play the sound
            hitSound.play();

            // Remove the glow
            hole.classList.remove("active");

            // Clear the active key
            activeKey = null;
        }
    });
});

// When the Start button is clicked, begin the game
startBtn.addEventListener("click", startGame);
