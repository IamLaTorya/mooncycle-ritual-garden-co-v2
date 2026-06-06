/* ============================================================
   🌌 PAIRED & REVEALED — ORACLE MEMORY GAME
   - Fixed deck: 6 pairs (12 cards)
   - No responsiveness in JS (CSS handles layout)
   - Readings at:
       • 1st match  → Opening reading
       • 3rd match  → Midway reading
       • 6th match  → Final reading
   - Matched cards are removed from the board
   - No sound effects
   - At the end:
       • Show a confirm dialog summarizing all 3 readings
       • OK  → start a new reading
       • Cancel → show “Reading Complete” message on the page
=========================================================== */


/* ---------------------------------------------------------
   1. ORACLE DECK DEFINITIONS
   These are the symbolic cards the game can draw from.
   We will randomly pick 6 unique cards from this full deck
   each time a new reading begins.
--------------------------------------------------------- */

const calmMode = [
  { emoji: "🌸", card: "The Bloom", meaning: "Growth and unfolding", message: "You are becoming who you were always meant to be." },
  { emoji: "🌊", card: "The Tide", meaning: "Emotional movement", message: "Do not resist the flow of your feelings." },
  { emoji: "☀️", card: "The Light", meaning: "Clarity and warmth", message: "Something hidden is beginning to reveal itself." },
  { emoji: "🍃", card: "The Wind", meaning: "Release and freedom", message: "Let go of what keeps pulling you backward." },
  { emoji: "🦋", card: "The Wings", meaning: "Transformation", message: "You are in the middle of a powerful change." },
  { emoji: "🌙", card: "The Moon", meaning: "Intuition and dreams", message: "Your inner voice already knows the answer." }
];

const reflectionMode = [
  { emoji: "🔮", card: "The Seer", meaning: "Vision and possibility", message: "The future shifts with every decision you make." },
  { emoji: "🕯️", card: "The Flame", meaning: "Truth and guidance", message: "A truth is illuminating itself slowly." },
  { emoji: "🧿", card: "The Eye", meaning: "Protection and awareness", message: "Not everything around you is meant to stay." },
  { emoji: "⭐", card: "The Star", meaning: "Hope and direction", message: "Even in uncertainty, you are still guided." },
  { emoji: "🐚", card: "The Shell", meaning: "Listening inward", message: "Silence may reveal more than noise." },
  { emoji: "🍄", card: "The Root", meaning: "Grounding and connection", message: "Reconnect with what nourishes your spirit." },
  { emoji: "🌿", card: "The Herb", meaning: "Healing and restoration", message: "Healing is happening even when unseen." },
  { emoji: "🪶", card: "The Feather", meaning: "Messages and signs", message: "Pay attention to recurring signs around you." }
];

const deepJourney = [
  { emoji: "🌑", card: "The Void", meaning: "Shadow work and beginnings", message: "There is wisdom hidden inside uncertainty." },
  { emoji: "🌕", card: "The Full Moon", meaning: "Completion and revelation", message: "A cycle in your life is reaching fulfillment." },
  { emoji: "🔥", card: "The Phoenix Fire", meaning: "Rebirth through struggle", message: "Transformation often arrives disguised as difficulty." },
  { emoji: "🐍", card: "The Serpent", meaning: "Shedding and renewal", message: "You are evolving beyond an older version of yourself." },
  { emoji: "🦉", card: "The Watcher", meaning: "Wisdom and perception", message: "Observe carefully before making your next move." },
  { emoji: "🗝️", card: "The Key", meaning: "Unlocking hidden truths", message: "A door is opening that was once closed to you." },
  { emoji: "🪞", card: "The Mirror", meaning: "Self-reflection and truth", message: "Face yourself honestly and gently." },
  { emoji: "⚡", card: "The Awakening", meaning: "Sudden realization", message: "A shift in perspective is changing everything." },
  { emoji: "🌌", card: "The Cosmos", meaning: "Infinite possibility", message: "You are more connected than you realize." },
  { emoji: "🪷", card: "The Lotus", meaning: "Spiritual ascension", message: "Growth can emerge from difficult waters." }
];

// Combine all subsets into one full oracle deck
const fullDeck = [...calmMode, ...reflectionMode, ...deepJourney];


/* ---------------------------------------------------------
   2. GAME STATE VARIABLES
   These track the current deck, selections, and reading stages.
--------------------------------------------------------- */

// The current shuffled deck of 12 cards (6 pairs)
let currentDeck = [];

// References to the two cards selected in the current turn
let firstCard = null;
let secondCard = null;

// When true, clicks are temporarily disabled (during animations)
let lockBoard = false;

// Fixed number of pairs for this game (always 6)
const totalPairs = 6;

// How many pairs have been successfully matched so far
let matchedPairs = 0;

// Flags to ensure each reading stage only triggers once
let openingReadingShown = false;
let midpointReadingShown = false;
let finalReadingShown = false;

// Store the three reading cards so we can summarize them at the end
let readingCards = {
  opening: null,
  midpoint: null,
  final: null
};

// Grab the game board container from the DOM
const board = document.querySelector(".game-board");

// Optional: container for completion message (created later if needed)
let completionMessageElement = null;


/* ---------------------------------------------------------
   3. UTILITY: SHUFFLE + RANDOM CARD SELECTION
   These helpers build the 6-pair deck from the full oracle pool.
--------------------------------------------------------- */

// Shuffle an array in place using the Fisher–Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Return a new array with "count" random cards from the given deck
function getRandomCards(deck, count) {
  const copy = [...deck];
  shuffle(copy);
  return copy.slice(0, count);
}


/* ---------------------------------------------------------
   4. CREATE GAME DECK
   Builds a 12-card deck (6 pairs), assigns pair IDs, and shuffles.
--------------------------------------------------------- */

function createGameDeck() {
  // Reset match counters and reading flags for a fresh game
  matchedPairs = 0;
  openingReadingShown = false;
  midpointReadingShown = false;
  finalReadingShown = false;

  // Clear any stored reading cards from previous games
  readingCards.opening = null;
  readingCards.midpoint = null;
  readingCards.final = null;

  // Pick 6 unique oracle cards from the full deck
  const selected = getRandomCards(fullDeck, totalPairs);

  // Duplicate each selected card to create pairs, and assign an id
  const paired = selected.flatMap((card, index) => [
    { ...card, id: index }, // first copy
    { ...card, id: index }  // second copy
  ]);

  // Shuffle the final 12-card deck
  shuffle(paired);

  // Store globally so we can look up card data by id later
  currentDeck = paired;

  return paired;
}


/* ---------------------------------------------------------
   5. RENDER BOARD
   Creates the card elements and attaches click handlers.
--------------------------------------------------------- */

function renderBoard(deck) {
  // Clear any previous cards or messages from the board
  board.innerHTML = "";

  // Loop through each card object and create its DOM element
  deck.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = cardData.id;

    // Inner structure matches your CSS:
    // .card-inner → .card-front + .card-back
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"><span>${cardData.emoji}</span></div>
        <div class="card-back"></div>
      </div>
    `;

    // Attach click handler for flipping / matching
    card.addEventListener("click", handleCardClick);

    // Add the card to the board
    board.appendChild(card);
  });

  // Reset click state so the player can start fresh
  resetTurnState();
}


/* ---------------------------------------------------------
   6. CARD CLICK LOGIC
   Handles flipping cards and deciding when to check for a match.
--------------------------------------------------------- */

function handleCardClick() {
  // Ignore clicks while the board is locked (during animations)
  if (lockBoard) return;

  // Prevent clicking the same card twice in a row
  if (this === firstCard) return;

  // Flip this card visually
  this.classList.add("flip");

  // If this is the first card in the pair, store it and wait
  if (!firstCard) {
    firstCard = this;
    return;
  }

  // Otherwise, this is the second card
  secondCard = this;

  // Now that we have two cards, check if they match
  checkMatch();
}

// Compare the two flipped cards to see if they form a pair
function checkMatch() {
  const match = firstCard.dataset.id === secondCard.dataset.id;
  if (match) {
    handleMatch();
  } else {
    unflipCards();
  }
}


/* ---------------------------------------------------------
   7. MATCH LOGIC + READING STAGES
   - Marks cards as matched
   - Removes them from the board
   - Triggers readings at 1st, 3rd, and 6th match
   - On final match, shows summary + restart/complete flow
--------------------------------------------------------- */

function handleMatch() {
  // Lock the board during this sequence
  lockBoard = true;

  // Add a "matched" class so CSS can fade/shrink them
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  // Increase the count of matched pairs
  matchedPairs++;

  // Look up the card data for this pair using its id
  const id = firstCard.dataset.id;
  const cardData = currentDeck.find(c => c.id == id);

  // Decide which reading stage (if any) this match belongs to
  let stage = null;

  // 1st match → Opening reading
  if (!openingReadingShown && matchedPairs === 1) {
    openingReadingShown = true;
    stage = "opening";
    readingCards.opening = cardData;
  }

  // 3rd match → Midpoint reading
  if (!midpointReadingShown && matchedPairs === 3) {
    midpointReadingShown = true;
    stage = "midpoint";
    readingCards.midpoint = cardData;
  }

  // 6th match → Final reading
  if (!finalReadingShown && matchedPairs === totalPairs) {
    finalReadingShown = true;
    stage = "final";
    readingCards.final = cardData;
  }

  // If this match corresponds to one of the three reading stages,
  // show the reading modal for this card
  if (stage) {
    showReading(cardData, stage);
  } else {
    // If no reading is needed for this match, just remove the cards
    removeMatchedCards();
  }
}

// Handle the case where two flipped cards do NOT match
function unflipCards() {
  lockBoard = true;

  // Wait briefly so the player can see the second card
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetTurnState();
  }, 900);
}

// Remove the matched cards from the board after a short delay
function removeMatchedCards() {
  setTimeout(() => {
    if (firstCard) firstCard.remove();
    if (secondCard) secondCard.remove();

    // If all pairs are matched, trigger end-of-game flow
    if (matchedPairs === totalPairs) {
      handleGameComplete();
    } else {
      // Otherwise, unlock the board for the next turn
      lockBoard = false;
    }

    // Reset click state for the next turn
    resetTurnState();
  }, 600);
}

// Reset the state of the current turn (no selected cards, board unlocked)
function resetTurnState() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}


/* ---------------------------------------------------------
   8. ORACLE READING MODAL
   Shows a popup with the card's meaning + message.
   After the player clicks "Continue", we remove the cards.
--------------------------------------------------------- */

function showReading(card, stage) {
  // Create the overlay container
  const modal = document.createElement("div");
  modal.classList.add("reading-modal");

  // Build the inner content with emoji, title, meaning, and message
  modal.innerHTML = `
    <div class="reading-content">
      <div class="reading-icon">${card.emoji}</div>
      <h2>${card.card}</h2>
      <p class="meaning">${card.meaning}</p>
      <p class="message">${card.message}</p>
      <button class="continue-btn">Continue</button>
    </div>
  `;

  // Add the modal to the page
  document.body.appendChild(modal);

  // When "Continue" is clicked:
  const button = modal.querySelector(".continue-btn");
  button.addEventListener("click", () => {
    // Remove the modal from the DOM
    modal.remove();

    // After the reading is acknowledged, remove the matched cards
    removeMatchedCards();
  });
}


/* ---------------------------------------------------------
   9. END-OF-GAME FLOW
   After all 6 pairs are matched:
   - Show a confirm dialog summarizing the three readings
   - OK     → start a new reading
   - Cancel → show "Reading Complete" message on the page
--------------------------------------------------------- */

function handleGameComplete() {
  // Build a summary of the three readings
  const opening = readingCards.opening;
  const midpoint = readingCards.midpoint;
  const final = readingCards.final;

  // Fallback text in case something is missing (shouldn't happen)
  const openingText = opening
    ? `Opening: ${opening.emoji} ${opening.card} — ${opening.meaning}`
    : "Opening: (no card)";
  const midpointText = midpoint
    ? `Midway: ${midpoint.emoji} ${midpoint.card} — ${midpoint.meaning}`
    : "Midway: (no card)";
  const finalText = final
    ? `Final: ${final.emoji} ${final.card} — ${final.meaning}`
    : "Final: (no card)";

  // Create the confirm message shown in the browser dialog
  const summaryMessage =
    `${openingText}\n` +
    `${midpointText}\n` +
    `${finalText}\n\n` +
    `Would you like another reading?`;

  // Use confirm so the player can choose to continue or stop
  const wantsAnother = window.confirm(summaryMessage);

  if (wantsAnother) {
    // Player chose to continue → start a new reading
    startNewReading();
  } else {
    // Player chose to stop → show a "Reading Complete" message on the page
    showCompletionMessage();
  }
}

// Show a simple "Reading Complete" message in the UI
function showCompletionMessage() {
  // Clear the board so no cards remain
  board.innerHTML = "";

  // Create a message element if it doesn't exist yet
  completionMessageElement = document.createElement("div");
  completionMessageElement.classList.add("reading-complete");
  completionMessageElement.innerHTML = `
    <p>✨ Reading complete. Your journey is finished for now. ✨</p>
  `;

  // Append the message below the board
  board.appendChild(completionMessageElement);
}


/* ---------------------------------------------------------
   10. START NEW READING
   Resets state, builds a new deck, and renders the board.
--------------------------------------------------------- */

function startNewReading() {
  // Clear any completion message
  if (completionMessageElement) {
    completionMessageElement.remove();
    completionMessageElement = null;
  }

  const deck = createGameDeck();
  renderBoard(deck);
}


/* ---------------------------------------------------------
   11. INITIALIZE GAME
   Called once when the page loads.
--------------------------------------------------------- */

startNewReading();
