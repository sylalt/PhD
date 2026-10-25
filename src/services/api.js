import { supabase } from './supabase';

export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzrX9ILnV2CAUEywzkYn4iNASyx9XGfwbVSjg1CYuq9ennyf2XcbO9_j1Uc0gJDDumPZA/exec';

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
  const { data, error } = await supabase.from('tasks').select('*')
    .order('created_at', { ascending: false }).abortSignal(signal);
  if (error) throw new Error(error.message);
  return data.map(taskRecord);
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

export async function createTask(task) {
  const { data, error } = await supabase.from('tasks').insert(task).select().single();
  if (error) throw new Error(error.message);
  return taskRecord(data);
}

export async function patchTask(id, updates) {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return taskRecord(data);
}

export async function removeTask(id) {
  const { data, error } = await supabase.from('tasks').delete().eq('id', id).select('id').single();
  if (error) throw new Error(error.message);
  return data;
}
