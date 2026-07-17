let placements = {}; // cardId -> { cardId, cardLabel, categoryId, categoryLabel, categorySource }
let selectedCardEl = null;
let engineElements = null;
let engineConfig = null;
let participantCategoryCounter = 0;

function renderSort(config, elements) {
  engineConfig = config;
  engineElements = elements;
  placements = {};
  selectedCardEl = null;
  participantCategoryCounter = 0;

  elements.studyNameEl.textContent = config.studyName;
  elements.instructionsEl.textContent = config.instructions || "";

  elements.pileEl.innerHTML = "";
  config.cards.forEach(function (card) {
    elements.pileEl.appendChild(buildCardElement(card));
  });

  elements.boardEl.innerHTML = "";
  config.categories.forEach(function (category) {
    elements.boardEl.appendChild(buildCategoryColumn(category, "researcher"));
  });

  if (elements.addCategoryFormEl) {
    elements.addCategoryFormEl.style.display = config.allowParticipantCategories ? "block" : "none";
  }

  updateEmptyBoardHint();
  updateSubmitState();
}

function addParticipantCategory(label) {
  const trimmed = (label || "").trim();
  if (!trimmed) return;

  participantCategoryCounter += 1;
  const category = { id: "participant-cat-" + participantCategoryCounter, label: trimmed };
  engineElements.boardEl.appendChild(buildCategoryColumn(category, "participant"));
  updateEmptyBoardHint();
}

function updateEmptyBoardHint() {
  if (!engineElements.emptyBoardHintEl) return;
  const hasCategories = engineElements.boardEl.querySelector(".category-column") !== null;
  engineElements.emptyBoardHintEl.style.display = hasCategories ? "none" : "block";
}

function buildCardElement(card) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.dataset.cardId = card.id;
  cardEl.textContent = card.label;
  cardEl.tabIndex = 0;
  cardEl.setAttribute("role", "button");
  cardEl.setAttribute("aria-pressed", "false");

  function activate(event) {
    event.stopPropagation();
    selectCard(cardEl);
  }

  cardEl.addEventListener("click", activate);
  cardEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(event);
    }
  });

  return cardEl;
}

function buildCategoryColumn(category, categorySource) {
  const columnEl = document.createElement("div");
  columnEl.className = "category-column";
  columnEl.dataset.categoryId = category.id;
  columnEl.tabIndex = 0;
  columnEl.setAttribute("role", "button");
  columnEl.setAttribute("aria-label", "Place selected card in " + category.label);

  const headerEl = document.createElement("h3");
  headerEl.textContent = category.label;
  columnEl.appendChild(headerEl);

  const cardsEl = document.createElement("div");
  cardsEl.className = "category-cards";
  columnEl.appendChild(cardsEl);

  function place() {
    placeSelectedCard(category.id, category.label, categorySource, cardsEl);
  }

  columnEl.addEventListener("click", place);
  columnEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      place();
    }
  });

  return columnEl;
}

function selectCard(cardEl) {
  if (selectedCardEl === cardEl) {
    selectedCardEl.classList.remove("selected");
    selectedCardEl.setAttribute("aria-pressed", "false");
    selectedCardEl = null;
    return;
  }
  if (selectedCardEl) {
    selectedCardEl.classList.remove("selected");
    selectedCardEl.setAttribute("aria-pressed", "false");
  }
  selectedCardEl = cardEl;
  cardEl.classList.add("selected");
  cardEl.setAttribute("aria-pressed", "true");
}

function placeSelectedCard(categoryId, categoryLabel, categorySource, cardsEl) {
  if (!selectedCardEl) return;

  const cardId = selectedCardEl.dataset.cardId;
  const cardLabel = selectedCardEl.textContent;
  placements[cardId] = { cardId, cardLabel, categoryId, categoryLabel, categorySource };

  selectedCardEl.classList.remove("selected");
  selectedCardEl.setAttribute("aria-pressed", "false");
  cardsEl.appendChild(selectedCardEl);
  selectedCardEl = null;

  updateSubmitState();
}

function updateSubmitState() {
  if (!engineElements.submitButtonEl) return;
  const allPlaced = engineConfig.cards.every(function (card) {
    return Boolean(placements[card.id]);
  });
  engineElements.submitButtonEl.disabled = !allPlaced;
}

function getPlacements() {
  return Object.values(placements);
}
