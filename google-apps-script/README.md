# Papers, quotes, and tasks from Google Sheets

The app reads papers, quotations and tasks from tabs in the same Google spreadsheet through one Apps Script deployment. The default papers request still expects an array from `Lit review`; `?sheet=QUOTES` and `?sheet=TASKS` return `{ "sheet": "<TAB>", "rows": [...] }`.

## One-time setup

1. In the existing papers spreadsheet, create a tab named **QUOTES** with these headers in row 1: `Quote`, `Authors`, `Year`, `Paper Title`, `DOI/Link`, `Page`.
2. Create a tab named **TASKS** with these headers in row 1, spelled exactly: `Task`, `Status`, `Priority`, `Due date`, `Category`, `Milestone`, `Notes(description)`. Add task records below the headers. Use `Not started`, `In progress`, `On hold` or `Done` for Status; `High`, `Medium` or `Low` for Priority; and `Research`, `Writing`, `Training`, `Administration` or `Events` for Category. The Tasks page shows five table columns; each milestone appears below its task name, and the `Notes(description)` cell is revealed by clicking the task title. The page is read-only; add and edit task rows directly in this spreadsheet.
3. Open **Extensions → Apps Script** in that spreadsheet. Back up your existing code. Replace its existing `doGet` handler with the one in `Code.gs`, and add `sheetsJson_`. Preserve any unrelated functions. If the existing handler serves other clients or routes, integrate the `QUOTES` and `TASKS` branches into it instead of replacing those routes.
4. Choose **Deploy → Manage deployments → Edit** on the deployment whose URL is configured in `src/services/api.js`. Select **New version**, then **Deploy**. Keep its existing execution and access settings; do not create a different deployment URL or broaden spreadsheet sharing.
5. Open the existing deployment URL with `?sheet=QUOTES` and `?sheet=TASKS`. Confirm each returns its matching `sheet` name and a `rows` array. Check that the original URL still returns the papers array.
6. Reload the app. Blank task rows are skipped, and the Tasks page filters by status, priority and category. For example, enter `Prepare documents` as a task directly in the spreadsheet. Missing tabs, required headers or an outdated deployment produce a visible error.

The GitHub deployment cannot update Google's separate Apps Script deployment. Complete the Apps Script redeployment before expecting new task or quote tabs to load. Papers, quotes and tasks served by this web app are readable by anyone who can access the existing Apps Script deployment; include only content you intend to serve through that endpoint.
