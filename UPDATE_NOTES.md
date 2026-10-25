# Supabase login and Google Sheets tasks

Supabase is used for account authentication only. Task records are loaded read-only from the `TASKS` tab in the same Google spreadsheet used for papers and quotes. No task changes are sent to Supabase or GitHub.

Sign in using the email/password created in Supabase Authentication > Users.

## Update GitHub

Extract this archive and upload the contents of PhD-main to the repository root. Include BOTH folders and root files. In particular, package.json and package-lock.json have changed to include the Supabase library; uploading only src will fail the deployment.

Changed files:
- package.json and package-lock.json
- src/main.jsx
- src/services/api.js
- src/services/supabase.js (new)
- src/components/AuthGate.jsx (new)
- src/styles.css
- dist (rebuilt)

The deployment workflow must be at .github/workflows/deploy-pages.yml, not the repository root. GitHub Actions builds and publishes dist. The included dist also supports the existing root page's fallback.

## Behavior

The workspace requires login. The login session uses sessionStorage, survives refresh in the same tab and ends when that tab's storage is cleared. Papers, quotes and tasks are read from the Google Sheets Apps Script deployment. The Tasks page filters by status, priority and category; add or edit task rows directly in the spreadsheet using the columns documented in google-apps-script/README.md. Redeploy the Apps Script after updating its `doGet` handler to enable the `TASKS` tab route.

Meetings and the roadmap retain their existing localStorage behavior. Existing Supabase task rows are not deleted or migrated; they are no longer read by the app.

The unused historical root app.js remains for reference and is not imported by the React app.

## Validation

Verify the production Vite build and Apps Script responses for the original papers route and the `QUOTES` and `TASKS` routes after deployment. The task endpoint must return a `TASKS` sheet name and rows matching the required column headers. No spreadsheet records are changed by the app.
