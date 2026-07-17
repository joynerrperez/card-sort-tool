function addListRow(containerEl, placeholder) {
  const rowEl = document.createElement("div");
  rowEl.className = "list-row";

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.placeholder = placeholder;
  rowEl.appendChild(inputEl);

  const removeButtonEl = document.createElement("button");
  removeButtonEl.type = "button";
  removeButtonEl.textContent = "Remove";
  removeButtonEl.addEventListener("click", function () {
    rowEl.remove();
  });
  rowEl.appendChild(removeButtonEl);

  containerEl.appendChild(rowEl);
  return rowEl;
}

function collectRowLabels(containerEl) {
  const labels = [];
  containerEl.querySelectorAll("input").forEach(function (inputEl) {
    const value = inputEl.value.trim();
    if (value) {
      labels.push(value);
    }
  });
  return labels;
}

function updateModeVisibility() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  document.getElementById("categories-section").style.display = mode === "open" ? "none" : "block";
}

function buildConfigFromForm() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const studyName = document.getElementById("study-name-input").value.trim();
  const instructions = document.getElementById("instructions-input").value.trim();

  const cards = collectRowLabels(document.getElementById("cards-list")).map(function (label, index) {
    return { id: "c" + (index + 1), label: label };
  });

  let categories = [];
  if (mode !== "open") {
    categories = collectRowLabels(document.getElementById("categories-list")).map(function (label, index) {
      return { id: "cat" + (index + 1), label: label };
    });
  }

  return {
    version: 1,
    studyName: studyName,
    mode: mode,
    instructions: instructions,
    cards: cards,
    categories: categories,
    allowParticipantCategories: mode === "open" || mode === "hybrid"
  };
}

document.querySelectorAll('input[name="mode"]').forEach(function (radioEl) {
  radioEl.addEventListener("change", updateModeVisibility);
});

document.getElementById("add-card-button").addEventListener("click", function () {
  addListRow(document.getElementById("cards-list"), "Card label");
});

document.getElementById("add-category-button").addEventListener("click", function () {
  addListRow(document.getElementById("categories-list"), "Category label");
});

document.getElementById("generate-button").addEventListener("click", function () {
  const config = buildConfigFromForm();
  const result = validateStudyConfig(config);

  const errorsEl = document.getElementById("setup-errors");
  const previewEl = document.getElementById("config-preview");
  const linkSectionEl = document.getElementById("link-section");

  if (!result.valid) {
    errorsEl.innerHTML = "<ul>" + result.errors.map(function (error) {
      return "<li>" + error + "</li>";
    }).join("") + "</ul>";
    errorsEl.style.display = "block";
    previewEl.style.display = "none";
    linkSectionEl.style.display = "none";
    return;
  }

  errorsEl.style.display = "none";
  document.getElementById("config-preview-json").textContent = JSON.stringify(config, null, 2);
  previewEl.style.display = "block";

  document.getElementById("shareable-link").value = encodeConfigToUrl(config);
  linkSectionEl.style.display = "block";
});

for (let i = 0; i < 2; i++) {
  addListRow(document.getElementById("cards-list"), "Card label");
  addListRow(document.getElementById("categories-list"), "Category label");
}
updateModeVisibility();
