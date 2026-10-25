export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzTi_991e6AwPOciCg-HTz0MJ0Ab6JAnPkWrCIBURTlyjHsO51GCVkLcKo3obTel1QJtg/exec';

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let detail = '';
    try { detail = (await response.json()).error || ''; } catch { /* HTTP status still explains the failure. */ }
    throw new Error(detail || `Request failed (HTTP ${response.status}).`);
  }
  if (options.method === 'DELETE') return;
  return response.json();
}

export async function loadTasks(signal) {
  const url = new URL(GOOGLE_SHEETS_API);
  url.searchParams.set('sheet', 'TASKS');
  const payload = await request(url.href, { signal });
  if (payload?.sheet !== 'TASKS' || !Array.isArray(payload.rows)) {
    throw new Error(payload?.error || 'The Google Sheets API must expose the TASKS tab with the required task columns.');
  }

  return payload.rows.map((row, index) => ({
    id: `${index}-${String(row.Task ?? '').trim()}`,
    title: String(row.Task ?? '').trim(),
    status: String(row.Status ?? '').trim(),
    priority: String(row.Priority ?? '').trim(),
    due_date: String(row['Due date'] ?? '').trim(),
    category: String(row.Category ?? '').trim(),
    milestone: String(row.Milestone ?? '').trim(),
    notes: String(row.Notes ?? '').trim()
  })).filter((task) => task.title);
}

export async function loadPapers(signal) {
  const rows = await request(GOOGLE_SHEETS_API, { signal });
  if (!Array.isArray(rows)) throw new Error('Google Sheets returned an unexpected papers response.');
  return rows.map((row) => {
    const status = String(row['Read?'] ?? '').trim().toLowerCase();
    return {
      author: row['Author(s)'] ?? '', year: row.Year ?? '', title: row.Title ?? '',
      journal: row['Journal/Book'] ?? '', link: row['DOI/Link'] ?? '',
      stream: row['Literature stream'] ?? '', subtopic: row['Sub-topic'] ?? '',
      read: status === 'read' ? 'Read' : status === 'reading' ? 'Reading' : 'Unread'
    };
  });
}

export async function loadQuotes(signal) {
  const url = new URL(GOOGLE_SHEETS_API);
  url.searchParams.set('sheet', 'QUOTES');
  const payload = await request(url.href, { signal });
  // Require the sheet name so an older deployment returning papers cannot
  // silently masquerade as an empty quotations list.
  if (payload?.sheet !== 'QUOTES' || !Array.isArray(payload.rows)) {
    throw new Error(payload?.error || 'The Google Sheets API must expose the QUOTES tab. Deploy google-apps-script/Code.gs using the setup instructions in the repository.');
  }
  return payload.rows.map((row) => ({
    quote: String(row.Quote ?? row.QUOTE ?? '').trim(),
    authors: String(row.Authors ?? row['Author(s)'] ?? '').trim(),
    year: String(row.Year ?? '').trim(),
    paperTitle: String(row['Paper Title'] ?? row.Title ?? '').trim(),
    paperUrl: String(row['DOI/Link'] ?? row['DOI / URL'] ?? '').trim(),
    page: String(row.Page ?? row['Quote Page'] ?? '').trim()
  })).filter((row) => row.quote);
}
