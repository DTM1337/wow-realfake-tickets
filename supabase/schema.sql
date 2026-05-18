-- WOW Real Fake Tickets — Supabase schema
-- Kor detta i SQL-editorn i ditt Supabase-projekt.

-- 1. Tabell for ansokningar
create table if not exists public.scam_applications (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  name               text,
  city               text,
  country            text,
  story              text not null,
  artist             text,
  email              text,
  attachment_paths   text[] not null default '{}',
  ticket_image_path  text,
  terms_accepted     boolean not null default false,
  status             text not null default 'pending'
                       check (status in ('pending', 'approved', 'rejected'))
);

-- 1b. Migration for existing projects created from the earlier scaffold.
alter table public.scam_applications add column if not exists name text;
alter table public.scam_applications add column if not exists city text;
alter table public.scam_applications add column if not exists country text;
alter table public.scam_applications add column if not exists attachment_paths text[] not null default '{}';

-- 2. RLS pa — men inga policies.
-- Ingen anon-atkomst alls. API-routen (/api/submit) och adminvyn anvander
-- service_role-nyckeln, som kringgar RLS. Det ar avsiktligt: allmanheten ska
-- aldrig lasa eller skriva direkt mot tabellen.
alter table public.scam_applications enable row level security;

-- 3. Privat storage-bucket for fejkbiljett-bilderna.
insert into storage.buckets (id, name, public)
values ('scam-proof', 'scam-proof', false)
on conflict (id) do nothing;
