-- =====================================================
-- PORTOFOLIO HEYKEL PRAYOGI — DATABASE SCHEMA
-- Supabase / PostgreSQL
-- Jalankan script ini di Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABEL PROJECTS
-- =====================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text not null,
  full_description text,
  category text not null check (category in ('web_app', 'ai_ml', 'script_tool')),
  tech_stack text[] not null default '{}',
  thumbnail_url text,
  gallery_urls text[] default '{}',
  live_url text,
  github_url text,
  is_featured boolean default false,
  display_order int default 0,
  view_count int default 0,
  created_at timestamptz default now()
);

-- =====================================================
-- 2. TABEL EXPERIENCES (Timeline)
-- =====================================================
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('education', 'work', 'organization')),
  title text not null,
  institution text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  tags text[] default '{}',
  display_order int default 0
);

-- =====================================================
-- 3. TABEL CERTIFICATES
-- =====================================================
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  image_url text not null,
  credential_url text,
  category text default 'general',
  display_order int default 0
);

-- =====================================================
-- 4. TABEL CONTACT MESSAGES
-- =====================================================
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =====================================================
-- 5. TABEL GUESTBOOK ENTRIES
-- =====================================================
create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null check (char_length(message) <= 280),
  created_at timestamptz default now()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Aktifkan RLS untuk semua tabel
alter table projects enable row level security;
alter table experiences enable row level security;
alter table certificates enable row level security;
alter table contact_messages enable row level security;
alter table guestbook_entries enable row level security;

-- ----- projects: public read-only -----
create policy "projects_public_select"
  on projects for select
  to anon, authenticated
  using (true);

-- ----- experiences: public read-only -----
create policy "experiences_public_select"
  on experiences for select
  to anon, authenticated
  using (true);

-- ----- certificates: public read-only -----
create policy "certificates_public_select"
  on certificates for select
  to anon, authenticated
  using (true);

-- ----- contact_messages: anon INSERT only (baca via service role di API) -----
create policy "contact_messages_anon_insert"
  on contact_messages for insert
  to anon
  with check (true);

-- ----- guestbook_entries: anon INSERT + SELECT -----
create policy "guestbook_public_select"
  on guestbook_entries for select
  to anon, authenticated
  using (true);

create policy "guestbook_anon_insert"
  on guestbook_entries for insert
  to anon
  with check (true);

-- =====================================================
-- INDEXES (performa query)
-- =====================================================
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_projects_featured on projects(is_featured);
create index if not exists idx_projects_order on projects(display_order);
create index if not exists idx_experiences_type on experiences(type);
create index if not exists idx_experiences_order on experiences(display_order);
create index if not exists idx_certificates_order on certificates(display_order);
create index if not exists idx_guestbook_created on guestbook_entries(created_at desc);
create index if not exists idx_contact_created on contact_messages(created_at desc);
