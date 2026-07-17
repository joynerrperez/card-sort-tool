// StudyConfig shape:
// { version, studyName, mode, instructions, cards: [{id,label}], categories: [{id,label}], allowParticipantCategories }

function validateStudyConfig(config) {
  const errors = [];

  if (!config || typeof config !== "object") {
    return { valid: false, errors: ["Study configuration is missing or invalid."] };
  }
  if (!config.studyName || !config.studyName.trim()) {
    errors.push("Study name is required.");
  }
  if (!["open", "closed", "hybrid"].includes(config.mode)) {
    errors.push("Sort mode must be one of: open, closed, hybrid.");
  }
  if (!Array.isArray(config.cards) || config.cards.length === 0) {
    errors.push("At least one card is required.");
  }
  if (!Array.isArray(config.categories)) {
    errors.push("Categories must be a list (can be empty for open sorts).");
  }
  if (config.mode === "closed" || config.mode === "hybrid") {
    if (!Array.isArray(config.categories) || config.categories.length < 2) {
      errors.push("Closed and hybrid sorts need at least 2 predefined categories.");
    }
  }
  if (config.mode === "open" && config.allowParticipantCategories !== true) {
    errors.push("Open sorts must allow participants to create categories.");
  }

  return { valid: errors.length === 0, errors };
}
