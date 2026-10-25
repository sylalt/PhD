export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzrX9ILnV2CAUEywzkYn4iNASyx9XGfwbVSjg1CYuq9ennyf2XcbO9_j1Uc0gJDDumPZA/exec';
export const SUPABASE_TASKS_API = 'https://ouspoawbetddlhojskxz.supabase.co/functions/v1/tasks';

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

function taskRecord(value) {
  if (!value || Array.isArray(value) || value.id == null || typeof value.title !== 'string') {
    throw new Error('Supabase returned an unexpected task response. Reload before retrying a save.');
  }
  return value;
}

export async function loadTasks(signal) {
  const rows = await request(SUPABASE_TASKS_API, { signal });
  if (!Array.isArray(rows)) throw new Error('Supabase returned an unexpected tasks response.');
  return rows.map(taskRecord);
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

const writeTask = (method, body) => request(SUPABASE_TASKS_API, {
  method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});
export const createTask = async (task) => taskRecord(await writeTask('POST', task));
export const patchTask = async (id, updates) => taskRecord(await writeTask('PATCH', { id, ...updates }));
export const removeTask = (id) => writeTask('DELETE', { id });
