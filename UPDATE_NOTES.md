# Supabase login and direct tasks connection

This version uses the new Supabase project dnzakxazxnwqlyympaws and its public publishable key. No password or secret key is included. The old tasks Edge Function is no longer used by the React app.

## Supabase setup

Run supabase/tasks-access.sql in the new project's SQL Editor if you have not already run the table and policy queries. It permits only user 6e9fd2bb-70b5-4e82-b056-a4ae02e340bc to manage tasks. Keep RLS enabled. Sign in using the email/password you created in Authentication > Users.

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

The workspace requires login. Supabase RLS enforces task access independently of the login screen. Tasks read and write directly to the tasks table with the signed-in user's session. The login session uses sessionStorage, survives refresh in the same tab and ends when that tab's storage is cleared. Task and paper records are not stored in browser localStorage.

Google Sheets still supplies papers. Meetings and roadmap retain their existing localStorage behavior; they have not been migrated to Supabase. Existing data is not deleted or migrated. The new Supabase database initially has no tasks.

The unused historical root app.js remains for reference and is not imported by the React app.

## Validation

Production Vite build passed. Mocked Supabase SDK checks passed for password login, bearer-token task requests, table selection, create/update/delete, ID filters, database errors, Sheets column mapping and sign out. No real credentials were used and no live records were changed. Browser UI verification could not run because the browser download failed in this environment. Live login and database-policy verification remain to be checked after deployment.
