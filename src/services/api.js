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
