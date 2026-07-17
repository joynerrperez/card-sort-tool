function renderSort(config, elements) {
  elements.studyNameEl.textContent = config.studyName;
  elements.instructionsEl.textContent = config.instructions || "";

  elements.pileEl.innerHTML = "";
  config.cards.forEach(function (card) {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.cardId = card.id;
    cardEl.textContent = card.label;
    elements.pileEl.appendChild(cardEl);
  });

  elements.boardEl.innerHTML = "";
  config.categories.forEach(function (category) {
    elements.boardEl.appendChild(buildCategoryColumn(category));
  });
}

function buildCategoryColumn(category) {
  const columnEl = document.createElement("div");
  columnEl.className = "category-column";
  columnEl.dataset.categoryId = category.id;

  const headerEl = document.createElement("h3");
  headerEl.textContent = category.label;
  columnEl.appendChild(headerEl);

  const cardsEl = document.createElement("div");
  cardsEl.className = "category-cards";
  columnEl.appendChild(cardsEl);

  return columnEl;
}
