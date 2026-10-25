# Quotes from Google Sheets

The dashboard requests `?sheet=QUOTES` from the same Apps Script deployment as papers. It expects `{ "sheet": "QUOTES", "rows": [...] }`. The default papers request still expects an array from `Lit review`.

## One-time setup

1. In the existing papers spreadsheet, create a tab named **QUOTES**. Use these headers in row 1: `Quote`, `Authors`, `Year`, `Paper Title`, `DOI/Link`, `Page`.
2. Open **Extensions → Apps Script** in that spreadsheet. Back up your existing code. Replace its existing `doGet` handler with the one in `Code.gs`, and add `sheetsJson_`. Preserve any unrelated functions. If the existing handler serves other clients or routes, integrate the `QUOTES` branch into it instead of replacing those routes.
3. Choose **Deploy → Manage deployments → Edit** on the deployment whose URL is configured in `src/services/api.js`. Select **New version**, then **Deploy**. Keep its existing execution and access settings; do not create a different deployment URL or broaden spreadsheet sharing.
4. Open the existing deployment URL with `?sheet=QUOTES`. Confirm it returns an object with `sheet: "QUOTES"` and `rows`. Check the original URL still returns your papers array.
5. Reload the dashboard. Blank quote rows are skipped. An empty QUOTES tab with headers displays an empty state; a missing tab or outdated deployment displays an error. No fictional quotes are used.

The GitHub deployment cannot update Google's separate Apps Script deployment. Complete step 3 before expecting quotations to appear. Quotes delivered by the existing public web app have the same access exposure as papers; include only content you intend to serve through that endpoint.
