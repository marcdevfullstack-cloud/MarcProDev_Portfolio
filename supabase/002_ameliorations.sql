-- ════════════════════════════════════════════════════════════════════
--  Portfolio MarcProDev — améliorations (à exécuter après schema.sql)
--
--  SQL Editor > New query > Run. Peut être relancé sans risque.
--  Ajoute : photo, pastilles du hero, titres de section, SEO, pages
--  projet (problème / solution / galerie), lien des témoignages,
--  messages de contact, statistiques, double authentification.
-- ════════════════════════════════════════════════════════════════════

-- ─── Nouveaux champs ────────────────────────────────────────────────
alter table public.portfolio_profile
  add column if not exists photo_url          text   not null default '',
  add column if not exists hero_pills         text[] not null default '{}',
  add column if not exists skills_title       text   not null default '',
  add column if not exists experience_title   text   not null default '',
  add column if not exists projects_title     text   not null default '',
  add column if not exists testimonials_title text   not null default '',
  add column if not exists contact_title      text   not null default '',
  add column if not exists seo_title          text   not null default '',
  add column if not exists seo_description    text   not null default '',
  add column if not exists site_url           text   not null default '',
  add column if not exists og_image_url       text   not null default '';

alter table public.portfolio_projects
  add column if not exists problem  text   not null default '',
  add column if not exists solution text   not null default '',
  add column if not exists gallery  text[] not null default '{}';

alter table public.portfolio_testimonials
  add column if not exists author_url text not null default '';

-- Valeurs actuelles du site pour les nouveaux champs (seulement s'ils sont vides)
update public.portfolio_profile set
  hero_pills         = case when hero_pills = '{}' then array['Flutter', 'Laravel', 'Next.js', 'Firebase', 'MySQL', 'API REST'] else hero_pills end,
  skills_title       = case when skills_title = '' then E'Ce avec quoi\nje construis.' else skills_title end,
  experience_title   = case when experience_title = '' then E'Expérience\n& formation.' else experience_title end,
  projects_title     = case when projects_title = '' then E'Ce que j''ai\nconstruit.' else projects_title end,
  testimonials_title = case when testimonials_title = '' then E'Ce qu''ils disent\nde mon travail.' else testimonials_title end,
  contact_title      = case when contact_title = '' then E'Travaillons\nensemble.' else contact_title end,
  seo_title          = case when seo_title = '' then 'Marc-Aurèle Adou — Développeur Full-Stack Web & Mobile (Flutter, Laravel) · Abidjan' else seo_title end,
  seo_description    = case when seo_description = '' then 'Développeur Full-Stack Web & Mobile basé à Abidjan. 3 ans d''expérience, 10+ projets livrés, applications Flutter et Laravel utilisées par plus de 35 000 personnes. Ouvert aux opportunités CDI, freelance et remote.' else seo_description end,
  og_image_url       = case when og_image_url = '' then 'assets/og-image.png' else og_image_url end
where id = 1;

-- ─── Messages du formulaire de contact ──────────────────────────────
create table if not exists public.portfolio_messages (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200 and email like '%_@_%'),
  company    text not null default '' check (char_length(company) <= 160),
  message    text not null check (char_length(message) between 1 and 5000),
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.portfolio_messages enable row level security;

-- Les visiteurs peuvent déposer un message, jamais en lire.
drop policy if exists "depot public" on public.portfolio_messages;
create policy "depot public" on public.portfolio_messages
  for insert to anon, authenticated with check (read = false);

drop policy if exists "gestion admin" on public.portfolio_messages;
create policy "gestion admin" on public.portfolio_messages
  for all to authenticated
  using (public.portfolio_is_admin()) with check (public.portfolio_is_admin());

-- ─── Statistiques (aucune donnée personnelle : un type et une date) ──
create table if not exists public.portfolio_events (
  id         bigint generated always as identity primary key,
  type       text not null check (type in ('visit', 'cv_download', 'project_view')),
  created_at timestamptz not null default now()
);
create index if not exists portfolio_events_type_date on public.portfolio_events (type, created_at);
alter table public.portfolio_events enable row level security;

drop policy if exists "depot public" on public.portfolio_events;
create policy "depot public" on public.portfolio_events
  for insert to anon, authenticated with check (true);

drop policy if exists "lecture admin" on public.portfolio_events;
create policy "lecture admin" on public.portfolio_events
  for select to authenticated using (public.portfolio_is_admin());

-- ─── Double authentification ────────────────────────────────────────
-- Si le compte admin a activé un code à usage unique, les droits admin
-- ne sont accordés qu'après la saisie de ce code (niveau « aal2 »).
create or replace function public.portfolio_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.portfolio_admins where user_id = auth.uid())
    and (
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (
        select 1 from auth.mfa_factors
        where user_id = auth.uid() and status = 'verified'
      )
    );
$$;
