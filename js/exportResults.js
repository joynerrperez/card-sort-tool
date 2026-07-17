const CSV_HEADERS = [
  "participant_id", "study_name", "sort_mode", "card_id", "card_label",
  "category_id", "category_label", "category_source",
  "started_at", "completed_at", "duration_seconds"
];

function slugify(text) {
  const slug = String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "untitled";
}

function escapeCsvField(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function buildCsv(sortResult) {
  const rows = sortResult.placements.map(function (placement) {
    return [
      sortResult.participantId,
      sortResult.studyName,
      sortResult.mode,
      placement.cardId,
      placement.cardLabel,
      placement.categoryId,
      placement.categoryLabel,
      placement.categorySource,
      sortResult.startedAt,
      sortResult.completedAt,
      sortResult.durationSeconds
    ].map(escapeCsvField).join(",");
  });
  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const linkEl = document.createElement("a");
  linkEl.href = url;
  linkEl.download = filename;
  document.body.appendChild(linkEl);
  linkEl.click();
  document.body.removeChild(linkEl);
  URL.revokeObjectURL(url);
}

function exportSortResult(sortResult) {
  const filename = "cardsort_" + slugify(sortResult.studyName) + "_" +
    slugify(sortResult.participantId) + "_" + Date.now() + ".csv";
  downloadCsv(filename, buildCsv(sortResult));
}
