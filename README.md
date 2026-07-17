# Card Sort Tool

A lightweight, no-backend webapp for running card sort studies (open, closed, or hybrid).

Live tool: https://joynerrperez.github.io/card-sort-tool/

## For researchers: running a study

1. Open [**Create a New Study**](https://joynerrperez.github.io/card-sort-tool/setup.html).
2. Enter a study name and (optionally) instructions for participants.
3. Choose a sort mode:
   - **Closed** — you provide the categories; participants only sort cards into them.
   - **Open** — participants create their own categories as they sort.
   - **Hybrid** — you provide starter categories; participants can also add their own.
4. Add your cards (and categories, if not using Open mode) using **Add Card** / **Add Category**. Remove a row with its **Remove** button.
5. Click **Generate Study Config**. If anything's missing, you'll see a list of what to fix.
6. Once it succeeds, click **Copy Link** and send that link to your participants (email, Slack, etc.) — anyone who opens it runs this exact study. No participant needs an account or has to install anything.
   - If the link is very long (40+ cards or long labels), you'll see a warning — some email/chat apps mishandle very long links. If a participant reports the link not working, try trimming the card/category count or labels.
7. Each participant downloads their own results as a CSV file when they finish. **Collect these files yourself** (e.g. ask participants to reply-all or upload to a shared folder) — there's no server, so results aren't collected automatically anywhere.
8. Combine participants' CSVs (they share the same columns, so you can just stack the rows) and analyze in Excel/Sheets or a card-sort analysis tool.

### CSV columns

One row per card placement:

```
participant_id, study_name, sort_mode, card_id, card_label,
category_id, category_label, category_source, started_at, completed_at, duration_seconds
```

`category_source` is `researcher` for categories you predefined, or `participant` for ones a participant created during an open/hybrid sort — useful for seeing which categories people invented themselves.

## For contributors: running this locally

No build step, no dependencies — it's plain HTML/CSS/JavaScript. To test changes before pushing:

```
cd card-sort-tool
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` in a browser. `setup.html` and `sort.html` work the same locally as they do on the live site — generate a link on `setup.html` locally, then paste it into a new tab (or incognito window, to simulate a separate participant) to test the full pipeline.

## How it works

There's no backend or database. A study's configuration (cards, categories, mode) is encoded as base64 JSON directly in the shareable link's URL hash (the part after `#`) — the link *is* the data. When a participant opens it, `sort.html` decodes that hash to render the study. Results are built entirely in the participant's browser and exported as a CSV download — nothing is transmitted anywhere.

Key files:
- `js/studyConfig.js` — study configuration data model and validation
- `js/urlConfig.js` — encodes/decodes a study configuration to and from the shareable link
- `js/sortEngine.js` — renders and drives the sort interaction (shared by open/closed/hybrid modes)
- `js/exportResults.js` — builds and downloads the results CSV
- `js/setup.js` — study setup screen logic
