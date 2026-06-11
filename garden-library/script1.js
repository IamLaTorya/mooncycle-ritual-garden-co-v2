// Define the first oracle subset called "calmMode"
// Each object represents a card with an emoji, name, meaning, and message
const calmMode = [
  // Card 1: Represents growth and unfolding
  { emoji: "🌸", card: "The Bloom", meaning: "Growth and unfolding", message: "You are becoming who you were always meant to be." },

  // Card 2: Represents emotional movement
  { emoji: "🌊", card: "The Tide", meaning: "Emotional movement", message: "Do not resist the flow of your feelings." },

  // Card 3: Represents clarity and warmth
  { emoji: "☀️", card: "The Light", meaning: "Clarity and warmth", message: "Something hidden is beginning to reveal itself." },

  // Card 4: Represents release and freedom
  { emoji: "🍃", card: "The Wind", meaning: "Release and freedom", message: "Let go of what keeps pulling you backward." },

  // Card 5: Represents transformation
  { emoji: "🦋", card: "The Wings", meaning: "Transformation", message: "You are in the middle of a powerful change." },

  // Card 6: Represents intuition and dreams
  { emoji: "🌙", card: "The Moon", meaning: "Intuition and dreams", message: "Your inner voice already knows the answer." }
];


// Define the second oracle subset called "reflectionMode"
// This deck focuses on introspection, guidance, and awareness
const reflectionMode = [
  // Card 1: Represents vision and possibility
  { emoji: "🔮", card: "The Seer", meaning: "Vision and possibility", message: "The future shifts with every decision you make." },

  // Card 2: Represents truth and guidance
  { emoji: "🕯️", card: "The Flame", meaning: "Truth and guidance", message: "A truth is illuminating itself slowly." },

  // Card 3: Represents protection and awareness
  { emoji: "🧿", card: "The Eye", meaning: "Protection and awareness", message: "Not everything around you is meant to stay." },

  // Card 4: Represents hope and direction
  { emoji: "⭐", card: "The Star", meaning: "Hope and direction", message: "Even in uncertainty, you are still guided." },

  // Card 5: Represents listening inward
  { emoji: "🐚", card: "The Shell", meaning: "Listening inward", message: "Silence may reveal more than noise." },

  // Card 6: Represents grounding and connection
  { emoji: "🍄", card: "The Root", meaning: "Grounding and connection", message: "Reconnect with what nourishes your spirit." },

  // Card 7: Represents healing and restoration
  { emoji: "🌿", card: "The Herb", meaning: "Healing and restoration", message: "Healing is happening even when unseen." },

  // Card 8: Represents messages and signs
  { emoji: "🪶", card: "The Feather", meaning: "Messages and signs", message: "Pay attention to recurring signs around you." }
];


// Define the third oracle subset called "deepJourney"
// This deck focuses on shadow work, transformation, and spiritual depth
const deepJourney = [
  // Card 1: Represents beginnings found in uncertainty
  { emoji: "🌑", card: "The Void", meaning: "Shadow work and beginnings", message: "There is wisdom hidden inside uncertainty." },

  // Card 2: Represents completion and revelation
  { emoji: "🌕", card: "The Full Moon", meaning: "Completion and revelation", message: "A cycle in your life is reaching fulfillment." },

  // Card 3: Represents rebirth through struggle
  { emoji: "🔥", card: "The Phoenix Fire", meaning: "Rebirth through struggle", message: "Transformation often arrives disguised as difficulty." },

  // Card 4: Represents shedding and renewal
  { emoji: "🐍", card: "The Serpent", meaning: "Shedding and renewal", message: "You are evolving beyond an older version of yourself." },

  // Card 5: Represents wisdom and perception
  { emoji: "🦉", card: "The Watcher", meaning: "Wisdom and perception", message: "Observe carefully before making your next move." },

  // Card 6: Represents unlocking hidden truths
  { emoji: "🗝️", card: "The Key", meaning: "Unlocking hidden truths", message: "A door is opening that was once closed to you." },

  // Card 7: Represents self-reflection and truth
  { emoji: "🪞", card: "The Mirror", meaning: "Self-reflection and truth", message: "Face yourself honestly and gently." },

  // Card 8: Represents sudden realization
  { emoji: "⚡", card: "The Awakening", meaning: "Sudden realization", message: "A shift in perspective is changing everything." },

  // Card 9: Represents infinite possibility
  { emoji: "🌌", card: "The Cosmos", meaning: "Infinite possibility", message: "You are more connected than you realize." },

  // Card 10: Represents spiritual ascension
  { emoji: "🪷", card: "The Lotus", meaning: "Spiritual ascension", message: "Growth can emerge from difficult waters." }
];


// Combine all three oracle subsets into one large deck
// This full deck is used as the pool to randomly draw 6 cards for each reading
const fullDeck = [...calmMode, ...reflectionMode, ...deepJourney];
// This variable will hold the final 12‑card deck used in the game
// It gets rebuilt every time a new reading starts
let currentDeck = [];

// This will store the first card the player clicks during a turn
let firstCard = null;

// This will store the second card the player clicks during a turn
let secondCard = null;

// This flag temporarily disables clicking when animations are happening
let lockBoard = false;

// This constant defines how many pairs the game always uses (6 pairs = 12 cards)
const totalPairs = 6;

// This tracks how many pairs the player has successfully matched so far
let matchedPairs = 0;

// These three booleans ensure each reading stage only triggers once
let openingReadingShown = false;
let midpointReadingShown = false;
let finalReadingShown = false;

// This object stores the actual card data for the three reading stages
// so we can summarize them at the end of the game
let readingCards = {
  opening: null,   // Will hold the card revealed on the 1st match
  midpoint: null,  // Will hold the card revealed on the 3rd match
  final: null      // Will hold the card revealed on the 6th match
};

// This selects the game board container from the HTML
// All cards will be rendered inside this element
const board = document.querySelector(".game-board");

// This will hold a reference to the "Reading Complete" message element
// if the player chooses not to continue after finishing the game
let completionMessageElement = null;
// This function shuffles an array in place using the Fisher–Yates algorithm
// It ensures the deck is randomized every time
function shuffle(array) {

  // Start from the last index and move backward through the array
  for (let i = array.length - 1; i > 0; i--) {

    // Pick a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap the elements at positions i and j
    // This is the core of the Fisher–Yates shuffle
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// This function returns a new array containing "count" random cards
// It does NOT modify the original deck
function getRandomCards(deck, count) {

  // Make a shallow copy of the deck so we don't mutate the original
  const copy = [...deck];

  // Shuffle the copy to randomize card order
  shuffle(copy);

  // Return only the first "count" cards from the shuffled copy
  return copy.slice(0, count);
}
// This function builds a brand‑new 12‑card deck for each reading
// It resets all progress, selects 6 random oracle cards, duplicates them into pairs,
// assigns pair IDs, shuffles them, and stores the result globally
function createGameDeck() {

  // Reset the number of matched pairs back to zero for a fresh game
  matchedPairs = 0;

  // Reset all three reading stage flags so they can trigger again
  openingReadingShown = false;
  midpointReadingShown = false;
  finalReadingShown = false;

  // Clear out any previously stored reading cards from the last game
  readingCards.opening = null;
  readingCards.midpoint = null;
  readingCards.final = null;

  // Randomly select 6 unique oracle cards from the full deck
  // These will become the 6 pairs used in this reading
  const selected = getRandomCards(fullDeck, totalPairs);

  // Duplicate each selected card to create a matching pair
  // flatMap lets us return two objects for each card:
  // one copy for the first card, one for the second
  // Each pair gets a shared "id" so the game knows they match
  const paired = selected.flatMap((card, index) => [
    // First copy of the card with its assigned pair ID
    { ...card, id: index },

    // Second copy of the same card with the same pair ID
    { ...card, id: index }
  ]);

  // Shuffle the final 12‑card deck so the pairs are not next to each other
  shuffle(paired);

  // Store the shuffled deck globally so other functions can access card data
  currentDeck = paired;

  // Return the finished deck so the board renderer can use it
  return paired;
}
// This function takes the prepared deck and displays all 12 cards on the board
// It creates the card elements, attaches click handlers, and resets turn state
function renderBoard(deck) {

  // Clear out any previous cards or messages from the board
  board.innerHTML = "";

  // Loop through each card object in the deck
  deck.forEach((cardData) => {

    // Create a new <div> element to represent the card
    const card = document.createElement("div");

    // Add the "card" class so CSS can style it properly
    card.classList.add("card");

    // Store the card's pair ID in a data attribute for matching logic
    card.dataset.id = cardData.id;

    // Insert the card's inner HTML structure:
    // - card-inner wraps both sides
    // - card-front shows the emoji
    // - card-back is the hidden side
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><span>${cardData.emoji}</span></div>
        <div class="card-back"></div>
      </div>
    `;

    // Add a click event listener so the card can be flipped and matched
    card.addEventListener("click", handleCardClick);

    // Add the card element to the game board
    board.appendChild(card);
  });

  // Reset the click state so the player can start selecting cards
  resetTurnState();
}
// This function runs every time a player clicks a card
function handleCardClick() {

  // If the board is locked (usually during animations), ignore the click
  if (lockBoard) return;

  // Prevent the player from clicking the same card twice in a row
  if (this === firstCard) return;

  // Add the "flip" class so the card visually flips over
  this.classList.add("flip");

  // If no card has been selected yet, store this as the first card
  if (!firstCard) {
    firstCard = this;
    return; // Wait for the second card
  }

  // If we reach this point, this click is the second card
  secondCard = this;

  // Now that we have two cards, check if they match
  checkMatch();
}

// This function compares the two flipped cards to see if they form a pair
function checkMatch() {

  // A match happens when both cards share the same pair ID
  const match = firstCard.dataset.id === secondCard.dataset.id;

  // If they match, handle the match logic
  if (match) {
    handleMatch();
  } else {
    // If they don't match, flip them back over
    unflipCards();
  }
}
// This function handles everything that happens when two cards match
function handleMatch() {

  // Lock the board so the player can't click during animations
  lockBoard = true;

  // Add a "matched" class so CSS can fade or shrink the cards
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  // Increase the number of matched pairs
  matchedPairs++;

  // Get the pair ID from the first card
  const id = firstCard.dataset.id;

  // Find the card data in the current deck using the pair ID
  const cardData = currentDeck.find(c => c.id == id);

  // This variable will store which reading stage (if any) should trigger
  let stage = null;

  // If this is the first match and the opening reading hasn't been shown yet
  if (!openingReadingShown && matchedPairs === 1) {
    openingReadingShown = true;   // Mark the stage as used
    stage = "opening";            // Set the stage name
    readingCards.opening = cardData; // Store the card for the summary
  }

  // If this is the third match and the midpoint reading hasn't been shown yet
  if (!midpointReadingShown && matchedPairs === 3) {
    midpointReadingShown = true;
    stage = "midpoint";
    readingCards.midpoint = cardData;
  }

  // If this is the sixth match (the final pair)
  if (!finalReadingShown && matchedPairs === totalPairs) {
    finalReadingShown = true;
    stage = "final";
    readingCards.final = cardData;
  }

  // If this match triggers a reading stage, show the reading modal
  if (stage) {
    showReading(cardData, stage);
  } else {
    // Otherwise, just remove the matched cards normally
    removeMatchedCards();
  }
}

// This function handles the case where the two selected cards do NOT match
function unflipCards() {

  // Lock the board so the player can't click during the flip-back animation
  lockBoard = true;

  // Wait a moment so the player can see the second card before it flips back
  setTimeout(() => {

    // Remove the "flip" class so both cards turn face-down again
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    // Reset the turn so the player can try again
    resetTurnState();

  }, 900); // 900ms delay for visual clarity
}

// This function removes matched cards from the board after a short delay
function removeMatchedCards() {

  // Wait briefly so the match animation can play
  setTimeout(() => {

    // Remove the first matched card from the DOM
    if (firstCard) firstCard.remove();

    // Remove the second matched card from the DOM
    if (secondCard) secondCard.remove();

    // If all pairs are matched, trigger the end-of-game flow
    if (matchedPairs === totalPairs) {
      handleGameComplete();
    } else {
      // Otherwise, unlock the board so the player can continue
      lockBoard = false;
    }

    // Reset the turn state for the next round
    resetTurnState();

  }, 600); // 600ms delay for smooth animation
}

// This function resets the turn state so the player can select new cards
function resetTurnState() {
  firstCard = null;   // Clear the first card
  secondCard = null;  // Clear the second card
  lockBoard = false;  // Unlock the board
}
// This function creates and displays the oracle reading popup
// It shows the card's emoji, name, meaning, and message
// After the player clicks "Continue", the matched cards are removed
function showReading(card, stage) {

  // Create a new <div> element that will act as the modal overlay
  const modal = document.createElement("div");

  // Add a CSS class so the modal gets styled and centered on the screen
  modal.classList.add("reading-modal");

  // Build the inner HTML for the modal:
  // - Icon (emoji)
  // - Card title
  // - Meaning text
  // - Message text
  // - Continue button
  modal.innerHTML = `
    <div class="reading-content">
      <div class="reading-icon">${card.emoji}</div>
      <h2>${card.card}</h2>
      <p class="meaning">${card.meaning}</p>
      <p class="message">${card.message}</p>
      <button class="continue-btn">Continue</button>
    </div>
  `;

  // Add the modal to the page so it becomes visible
  document.body.appendChild(modal);

  // Select the "Continue" button inside the modal
  const button = modal.querySelector(".continue-btn");

  // Add a click event listener to the button
  button.addEventListener("click", () => {

    // Remove the modal from the page when the player continues
    modal.remove();

    // After the reading is acknowledged, remove the matched cards
    removeMatchedCards();
  });
}
// This function runs when all 6 pairs have been matched
// It summarizes the three reading cards and asks the player if they want another reading
function handleGameComplete() {

  // Retrieve the three reading cards from earlier in the game
  const opening = readingCards.opening;
  const midpoint = readingCards.midpoint;
  const final = readingCards.final;

  // Build fallback text in case something is missing (should not happen)
  const openingText = opening
    ? `Opening: ${opening.emoji} ${opening.card} — ${opening.meaning}`
    : "Opening: (no card)";

  const midpointText = midpoint
    ? `Midway: ${midpoint.emoji} ${midpoint.card} — ${midpoint.meaning}`
    : "Midway: (no card)";

  const finalText = final
    ? `Final: ${final.emoji} ${final.card} — ${final.meaning}`
    : "Final: (no card)";

  // Build the full summary message shown in the confirm dialog
  const summaryMessage =
    `${openingText}\n` +
    `${midpointText}\n` +
    `${finalText}\n\n` +
    `Would you like another reading?`;

  // Show a confirm dialog so the player can choose to continue or stop
  const wantsAnother = window.confirm(summaryMessage);

  // If the player clicks OK → start a new reading
  if (wantsAnother) {
    startNewReading();
  } else {
    // If the player clicks Cancel → show a "Reading Complete" message
    showCompletionMessage();
  }
}

// This function displays a simple "Reading Complete" message on the board
function showCompletionMessage() {

  // Clear the board so no cards remain
  board.innerHTML = "";

  // Create a new <div> to hold the completion message
  completionMessageElement = document.createElement("div");

  // Add a CSS class so it gets styled properly
  completionMessageElement.classList.add("reading-complete");

  // Insert the message text
  completionMessageElement.innerHTML = `
    <p>✨ Reading complete. Your journey is finished for now. ✨</p>
  `;

  // Add the message to the board area
  board.appendChild(completionMessageElement);
}
// This function resets the game state and starts a brand‑new reading
function startNewReading() {

  // If a completion message exists from a previous game, remove it
  if (completionMessageElement) {
    completionMessageElement.remove();
    completionMessageElement = null;
  }

  // Create a new shuffled 12‑card deck
  const deck = createGameDeck();

  // Render the new deck onto the board
  renderBoard(deck);
}
// Start the very first reading as soon as the page loads
startNewReading();
