-- ════════════════════════════════════════════════════════════════════
--  Portfolio MarcProDev — schéma Supabase
--
--  À exécuter une fois dans Supabase : SQL Editor > New query > Run.
--  Le script peut être relancé sans risque : il ne recrée pas les tables
--  et ne réinsère les contenus de départ que dans les tables vides.
--
--  Tout est préfixé « portfolio_ » pour cohabiter avec les autres tables
--  du projet Supabase sans rien écraser.
--
--  Après l'exécution :
--   1. Authentication > Users > Add user : créez votre compte admin
--      (ou réutilisez un compte existant).
--   2. Exécutez la requête tout en bas de ce fichier pour vous déclarer admin.
--  Seuls les comptes déclarés admin peuvent écrire ; les autres utilisateurs
--  du projet n'ont qu'un accès en lecture, comme les visiteurs du site.
-- ════════════════════════════════════════════════════════════════════

-- ─── Admins ─────────────────────────────────────────────────────────
-- Seuls les comptes listés ici peuvent écrire. Aucune policy : la table
-- n'est pas accessible depuis l'API, uniquement via portfolio_is_admin().
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.portfolio_admins enable row level security;

create or replace function public.portfolio_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.portfolio_admins where user_id = auth.uid());
$$;

-- ─── Tables de contenu ──────────────────────────────────────────────
create table if not exists public.portfolio_profile (
  id               int primary key default 1 check (id = 1),
  first_name       text not null default '',
  headline         text not null default '',
  role_line        text not null default '',
  role_stack       text not null default '',
  availability     text not null default '',
  hero_desc        text not null default '',
  location         text not null default '',
  company          text not null default '',
  experience_label text not null default '',
  about_title      text not null default '',
  about_text       text not null default '',
  about_location   text not null default '',
  full_name        text not null default '',
  cv_title         text not null default '',
  cv_updated       text not null default '',
  cv_url           text not null default '',
  email            text not null default '',
  linkedin_url     text not null default '',
  github_url       text not null default '',
  contact_desc     text not null default '',
  footer_role      text not null default '',
  updated_at       timestamptz not null default now()
);

create table if not exists public.portfolio_stats (
  id       bigint generated always as identity primary key,
  value    text not null,
  label    text not null,
  position int  not null default 0
);

create table if not exists public.portfolio_skills (
  id       bigint generated always as identity primary key,
  title    text   not null,
  icon     text   not null default '',
  color    text   not null default 'blue' check (color in ('blue', 'orange', 'yellow', 'purple')),
  main     text[] not null default '{}',
  other    text[] not null default '{}',
  position int    not null default 0
);

create table if not exists public.portfolio_experiences (
  id       bigint generated always as identity primary key,
  period   text   not null,
  title    text   not null,
  company  text   not null default '',
  bullets  text[] not null default '{}',
  position int    not null default 0
);

create table if not exists public.portfolio_education (
  id       bigint generated always as identity primary key,
  period   text not null,
  name     text not null,
  school   text not null default '',
  position int  not null default 0
);

create table if not exists public.portfolio_projects (
  id          bigint generated always as identity primary key,
  name        text    not null,
  context     text    not null default '',
  description text    not null default '',
  role        text    not null default '',
  result      text    not null default '',
  tags        text[]  not null default '{}',
  url         text    not null default '',
  image_url   text    not null default '',
  image_style text    not null default 'frame' check (image_style in ('frame', 'raw', 'crop')),
  visible     boolean not null default true,
  position    int     not null default 0
);

create table if not exists public.portfolio_testimonials (
  id          bigint generated always as identity primary key,
  quote       text    not null,
  author      text    not null,
  author_role text    not null default '',
  visible     boolean not null default true,
  position    int     not null default 0
);

-- ─── Sécurité (RLS) : lecture publique, écriture réservée aux admins ─
do $rls$
declare
  t text;
begin
  foreach t in array array['portfolio_profile', 'portfolio_stats', 'portfolio_skills', 'portfolio_experiences', 'portfolio_education', 'portfolio_projects', 'portfolio_testimonials']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "lecture publique" on public.%I', t);
    execute format('drop policy if exists "ecriture admin" on public.%I', t);
    if t in ('portfolio_projects', 'portfolio_testimonials') then
      -- les éléments masqués ne sont visibles que de l'admin
      execute format('create policy "lecture publique" on public.%I for select using (visible or public.portfolio_is_admin())', t);
    else
      execute format('create policy "lecture publique" on public.%I for select using (true)', t);
    end if;
    execute format('create policy "ecriture admin" on public.%I for all to authenticated using (public.portfolio_is_admin()) with check (public.portfolio_is_admin())', t);
  end loop;
end
$rls$;

-- ─── Stockage : captures et CV ──────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760,
        array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio lecture publique" on storage.objects;
create policy "portfolio lecture publique" on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists "portfolio ecriture admin" on storage.objects;
create policy "portfolio ecriture admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio' and public.portfolio_is_admin())
  with check (bucket_id = 'portfolio' and public.portfolio_is_admin());

-- ─── Contenus de départ (ceux du site actuel) ───────────────────────
-- Dans les textes, **mot** s'affiche en gras.
do $seed$
begin
  if not exists (select 1 from public.portfolio_profile) then
    insert into public.portfolio_profile (
      id, first_name, headline, role_line, role_stack, availability, hero_desc,
      location, company, experience_label, about_title, about_text, about_location,
      full_name, cv_title, cv_updated, cv_url, email, linkedin_url, github_url,
      contact_desc, footer_role
    ) values (
      1,
      'Marc-Aurèle',
      'Développeur.',
      'Full-Stack Web & Mobile',
      'Flutter · Laravel · Next.js',
      'Ouvert aux opportunités — CDI · Freelance · Remote',
      '**3 ans d''expérience**, de l''analyse du besoin à la mise en production. J''ai dirigé la technique d''applications mobiles utilisées par **plus de 35 000 personnes** dans une dizaine de pays d''Afrique.',
      'Abidjan, Côte d''Ivoire',
      'Afrik Novatech',
      '3 ans · 10+ projets livrés',
      E'Du besoin métier\nà la mise en production.',
      E'Développeur full-stack avec **3 ans d''expérience**, je conçois et développe des applications web et mobiles de bout en bout : architecture, API REST, bases de données, sécurité, publication sur l''App Store et le Play Store.\n\nChez Daymond, j''ai occupé le rôle de **Lead Technique** : développement des applications, gestion de l''infrastructure de production et coordination de développeurs freelances. Je travaille aujourd''hui avec **Afrik Novatech**.\n\nJe suis ouvert à un poste en **CDI**, à des missions **freelance** et au travail **à distance**.',
      'Basé à Abidjan — collabore partout dans le monde',
      'Marc-Aurèle Adou',
      'Développeur Full-Stack & Mobile',
      'Mis à jour 2026',
      'assets/CV_Adou_Marc-Aurele_DevFullStack.pdf',
      'marcdevfullstack@gmail.com',
      'https://www.linkedin.com/in/marc-aur%C3%A8le-adou-5860532b1/',
      'https://github.com/marcdevfullstack-cloud',
      'Un poste en CDI, une mission freelance ou un projet à distance ? Parlons de ce que vous construisez.',
      'Développeur Full-Stack'
    );
  end if;

  if not exists (select 1 from public.portfolio_stats) then
    insert into public.portfolio_stats (value, label, position) values
      ('3',     'Années d''expérience',            1),
      ('10+',   'Projets livrés',                  2),
      ('35k+',  'Utilisateurs des apps Daymond',   3),
      ('300k+', 'Documents juridiques numérisés',  4);
  end if;

  if not exists (select 1 from public.portfolio_skills) then
    insert into public.portfolio_skills (title, icon, color, main, other, position) values
      ('Frontend | Mobile & Web', '⚡', 'blue',
        array['Flutter · Dart', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        array['React', 'Vue.js', 'Angular'], 1),
      ('Backend | Mobile & Web', '🔧', 'orange',
        array['Laravel · PHP', 'API REST', 'Paiements Wave · CinetPay'],
        array['FastAPI', 'Python', 'Node.js', 'GraphQL', 'WebSockets', 'API Claude (Anthropic)'], 2),
      ('Base de données', '🗄️', 'yellow',
        array['MySQL', 'Firebase'],
        array['PostgreSQL', 'SQL Server', 'SQLite', 'MongoDB'], 3),
      ('DevOps & Cloud', '☁️', 'purple',
        array['App Store · Play Store', 'AWS S3', 'GitHub Actions · CI/CD'],
        array['Vercel', 'Railway', 'Docker', 'Cloudinary'], 4);
  end if;

  if not exists (select 1 from public.portfolio_experiences) then
    insert into public.portfolio_experiences (period, title, company, bullets, position) values
      ('Actuellement', 'Développeur Full-Stack', 'Afrik Novatech · Abidjan, CI', array[
        'Développement d''**Olave App**, application mobile de gestion de lavage (Flutter, API Laravel, notifications push).',
        'Réalisation du site vitrine de l''entreprise.'], 1),
      ('2026 · Freelance', 'Développeur Full-Stack', 'INSFS · Abidjan, CI', array[
        'Application web de gestion des inscriptions (Next.js, API Laravel, MySQL), déployée en continu sur Vercel et Railway.'], 2),
      ('Mai 2025 — Septembre 2026 · CDI', 'Développeur Full-Stack & Lead Technique', 'DAYMOND · Abidjan, CI', array[
        'Conception et développement des applications de l''entreprise : **Distribution, Fournisseur, Agent Commercial, Agent Commercial IA (WhatsApp Shop), marketplace ChopChap, plateforme Admin**.',
        'Mise en place et maintenance des API backend, administration et optimisation des bases de données.',
        'Intégration des solutions de paiement **Wave** et **CinetPay**.',
        'Publication et maintenance sur l''App Store et le Play Store, gestion des environnements de production.',
        'Coordination et suivi des projets confiés à des développeurs freelances.'], 3),
      ('Novembre 2024 — Avril 2025 · CDD', 'Développeur Full-Stack & Support IT', 'SPA-CI · Abidjan, CI', array[
        'Développement de solutions internes : site internet, outils d''automatisation.',
        'Support IT et formation aux outils numériques pour 10 utilisateurs et partenaires.'], 4),
      ('Janvier — Février 2025 · Freelance', 'Développeur Full-Stack', 'Nappes et Designs · Abidjan, CI', array[
        'Création du site e-commerce nappesetdesigns.com, **livré en 6 semaines**.',
        'Conception de la base de données relationnelle et sécurisation des données sensibles.'], 5),
      ('Septembre — Octobre 2024 · Freelance', 'Développeur Full-Stack — Dématérialisation', 'Groupe Défis et Stratégies · Gagnoa, CI', array[
        'Numérisation de **plus de 300 000 documents juridiques** dans une base de données sécurisée.',
        'Mise en place du traitement, de l''indexation et de la recherche par OCR, dans le respect des contraintes de confidentialité.'], 6),
      ('Septembre 2023 — Avril 2024 · Stage', 'Développeur Full-Stack & Support IT', 'Elite MultiMedia · Abidjan, CI', array[
        'Réalisation et maintenance du site de l''entreprise, participation au développement du CRM interne.',
        'Administration des bases de données MySQL et support IT pour 50 utilisateurs.'], 7);
  end if;

  if not exists (select 1 from public.portfolio_education) then
    insert into public.portfolio_education (period, name, school, position) values
      ('2025 — 2026', 'Licence Professionnelle — Génie Logiciel',       'Groupe Sup'' Formation · Abidjan',      1),
      ('2022 — 2023', 'BTS Informatique — Développeur d''Application',  'École Supérieure de Commerce · Abidjan', 2),
      ('Langues',     'Français — courant',                             'Anglais — notions',                      3);
  end if;

  if not exists (select 1 from public.portfolio_projects) then
    insert into public.portfolio_projects (name, context, description, role, result, tags, url, image_url, image_style, position) values
      ('Daymond Distribution',
        'Application mobile · Daymond · Lead Technique',
        'Application mobile disponible dans une dizaine de pays africains — permet à des revendeurs de commercialiser des produits sans contrainte logistique ni administrative.',
        'développement de l''application Flutter et de l''API Laravel, notifications push, stockage des médias, publication sur les stores.',
        'plus de 35 000 utilisateurs sur les applications Daymond.',
        array['Flutter', 'Laravel · API · MySQL', 'Firebase FCM', 'AWS S3'],
        'https://play.google.com/store/apps/details?id=com.daymondboutique.distribution_frontend',
        'assets/project-daymond-distribution.jpg', 'raw', 1),
      ('Daymond Collaboration',
        'Application mobile · Daymond · Lead Technique',
        'Plateforme dédiée aux collaborateurs de la société Daymond — gestion interne, notifications temps réel et communication unifiée.',
        'développement de l''application Flutter et de l''API Laravel, notifications temps réel, publication sur les stores.',
        '',
        array['Flutter', 'Firebase FCM', 'Twilio', 'Laravel · API · MySQL', 'AWS S3'],
        'https://play.google.com/store/apps/details?id=com.innovat.daymond_collaboration_app',
        'assets/project-collaboration.png', 'crop', 2),
      ('ChopChap',
        'Marketplace e-commerce · Daymond · Lead Technique',
        'Marketplace e-commerce en ligne, avec déploiement CI/CD automatisé via GitHub Actions.',
        'développement de l''application web et de son API, mise en place du déploiement continu.',
        '',
        array['FastAPI', 'Tailwind CSS', 'CI/CD', 'GitHub Actions'],
        'https://chopchap.com/',
        'assets/project-chopchap.png', 'frame', 3),
      ('WhatsApp Shop — Agent IA',
        'Agent commercial IA · Daymond · Lead Technique',
        'Plateforme d''agent commercial IA qui converse avec les clients, crée et gère leurs commandes.',
        'développement de la plateforme (front Next.js, API Laravel) et intégration de l''IA Claude d''Anthropic pour la conversation et la prise de commande.',
        '',
        array['Next.js', 'Laravel', 'Claude · Anthropic', 'Tailwind CSS'],
        '',
        'assets/project-whatsappshop.png', 'frame', 4),
      ('Nappes & Designs',
        'Site e-commerce · Freelance',
        'Boutique en ligne spécialisée dans la vente de nappes de table — interface produit complète avec gestion de catalogue.',
        'création du site, conception de la base de données et sécurisation des données clients.',
        'site responsive livré en 6 semaines.',
        array['Laravel', 'Tailwind CSS', 'MySQL'],
        'https://nappesetdesigns.com/',
        'assets/project-nappesetdesigns.png', 'frame', 5),
      ('INSFS — Gestion des inscriptions',
        'Application web · Freelance',
        'Application web de gestion des inscriptions de l''INSFS-Abidjan — déploiement full CI/CD sur Vercel et Railway.',
        'développement du front Next.js et de l''API Laravel, mise en place du déploiement continu.',
        '',
        array['Next.js', 'Laravel · API · MySQL', 'Tailwind CSS', 'Vercel · Railway'],
        'https://insfs-gestion.vercel.app/',
        '', 'frame', 6),
      ('Olave App — by Afrik Novatech',
        'Application mobile · Afrik Novatech',
        'Application mobile de gestion de lavage intelligent — suivi des commandes, notifications push et tableau de bord opérateur.',
        '', '',
        array['Flutter · Dart', 'Laravel · API REST · MySQL', 'Infomaniak', 'Cloudinary', 'FCM Push'],
        'https://olave-ci.vercel.app/',
        'assets/project-olave.png', 'frame', 7),
      ('Dématérialisation d''archives juridiques',
        'Système documentaire · Freelance · Groupe Défis et Stratégies',
        'Numérisation et structuration d''un fonds de documents juridiques pour le rendre consultable et exploitable.',
        'mise en place du traitement, de l''indexation et de la recherche par OCR dans une base de données sécurisée.',
        'plus de 300 000 documents numérisés, dans le respect des contraintes de confidentialité.',
        array['OCR', 'Indexation', 'Base de données sécurisée'],
        '',
        '', 'frame', 8),
      ('Afrik Novatech — Landing Page',
        'Site vitrine · Afrik Novatech',
        'Site vitrine officiel d''Afrik Novatech présentant les services et l''expertise de l''équipe.',
        '', '',
        array['Web'],
        'https://www.afriknovatech.com/',
        'assets/project-afriknovatech.png', 'frame', 9);
  end if;
end
$seed$;

-- ─── Dernière étape : vous déclarer admin ───────────────────────────
-- Après avoir créé votre compte dans Authentication > Users, exécutez
-- cette requête en remplaçant l'adresse par celle du compte :
--
--   insert into public.portfolio_admins (user_id)
--   select id from auth.users where email = 'VOTRE_EMAIL_ADMIN'
--   on conflict do nothing;
