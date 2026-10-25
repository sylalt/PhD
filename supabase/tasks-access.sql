-- Run in your new project's SQL Editor. Safe to run again.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  due_date date,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);
alter table public.tasks enable row level security;
revoke all on table public.tasks from anon;
grant select, insert, update, delete on table public.tasks to authenticated;
drop policy if exists "Silvia can manage tasks" on public.tasks;
create policy "Silvia can manage tasks" on public.tasks for all to authenticated
using ((select auth.uid()) = '6e9fd2bb-70b5-4e82-b056-a4ae02e340bc'::uuid)
with check ((select auth.uid()) = '6e9fd2bb-70b5-4e82-b056-a4ae02e340bc'::uuid);
