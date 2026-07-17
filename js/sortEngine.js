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

  const headerRowEl = document.createElement("div");
  headerRowEl.className = "category-header-row";

  const headerEl = document.createElement("h3");
  headerEl.textContent = category.label;
  headerRowEl.appendChild(headerEl);
  columnEl.appendChild(headerRowEl);

  const cardsEl = document.createElement("div");
  cardsEl.className = "category-cards";
  columnEl.appendChild(cardsEl);

  const dropZoneEl = document.createElement("div");
  dropZoneEl.className = "drop-zone";
  dropZoneEl.textContent = "Place selected card here";
  cardsEl.appendChild(dropZoneEl);

  if (categorySource === "participant") {
    headerRowEl.appendChild(buildCategoryControls(category, columnEl, headerEl, cardsEl));
  }

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

function buildCategoryControls(category, columnEl, headerEl, cardsEl) {
  const controlsEl = document.createElement("span");
  controlsEl.className = "category-controls";

  const editButtonEl = document.createElement("button");
  editButtonEl.type = "button";
  editButtonEl.className = "category-control-button";
  editButtonEl.textContent = "Edit";
  editButtonEl.setAttribute("aria-label", "Rename " + category.label);

  const deleteButtonEl = document.createElement("button");
  deleteButtonEl.type = "button";
  deleteButtonEl.className = "category-control-button";
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.setAttribute("aria-label", "Delete " + category.label);

  editButtonEl.addEventListener("click", function (event) {
    event.stopPropagation();
    const newLabel = window.prompt("Rename category", category.label);
    if (newLabel === null) return;
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    category.label = trimmed;
    headerEl.textContent = trimmed;
    columnEl.setAttribute("aria-label", "Place selected card in " + trimmed);
    editButtonEl.setAttribute("aria-label", "Rename " + trimmed);
    deleteButtonEl.setAttribute("aria-label", "Delete " + trimmed);

    Object.keys(placements).forEach(function (cardId) {
      if (placements[cardId].categoryId === category.id) {
        placements[cardId].categoryLabel = trimmed;
      }
    });
  });

  deleteButtonEl.addEventListener("click", function (event) {
    event.stopPropagation();

    cardsEl.querySelectorAll(".card").forEach(function (cardEl) {
      delete placements[cardEl.dataset.cardId];
      engineElements.pileEl.appendChild(cardEl);
    });

    columnEl.remove();
    updateEmptyBoardHint();
    updateSubmitState();
  });

  controlsEl.appendChild(editButtonEl);
  controlsEl.appendChild(deleteButtonEl);
  return controlsEl;
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
