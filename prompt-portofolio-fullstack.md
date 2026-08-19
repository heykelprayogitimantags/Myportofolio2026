# PROMPT MASTER — Portofolio Fullstack Developer (AI/Computer Vision Specialist)

> Cara pakai: dokumen ini adalah *system prompt* / project brief lengkap. Copy-paste seluruh isi ke AI coding assistant (Claude Code, Cursor, Antigravity, dsb) sebagai instruksi awal proyek, atau jalankan per-section kalau mau build bertahap (setup → DB → komponen → halaman → API → polish).

---

## 0. Ringkasan Proyek

Bangun website portofolio **fullstack** untuk seorang Software Engineer fresh graduate dengan spesialisasi **AI/Computer Vision**. Website harus terasa profesional, cepat, modern, dan punya bagian dinamis (data dari database, bukan hardcode) supaya menunjukkan kemampuan fullstack — bukan cuma landing page statis.

Persona pemilik portofolio: lulusan D4 Software Engineering Technology, fokus riset di facial expression recognition (computer vision) untuk skripsi, dan pernah membangun aplikasi fullstack AI (deteksi wajah real-time). Portofolio harus mencerminkan identitas ini di seluruh copywriting dan pemilihan proyek unggulan.

---

## 1. Tech Stack & Arsitektur

| Layer | Pilihan |
|---|---|
| Frontend Framework | Astro 4+ (mode `server` / SSR, islands architecture untuk komponen interaktif) |
| Styling | Tailwind CSS + CSS variables untuk theming |
| Icon | Lucide Icons |
| Animasi | Framer Motion (untuk komponen React island), View Transitions API bawaan Astro untuk page transition |
| Backend / API | Astro API Routes (`/src/pages/api/*.ts`) |
| Database & Auth | Supabase (PostgreSQL) — pakai Supabase JS Client di server-side, opsional Drizzle ORM kalau mau type-safety lebih ketat |
| Email transaksional | Resend API |
| Deployment | Vercel (`@astrojs/vercel` adapter, serverless functions) |
| Version Control | GitHub (branch `main` = production, `dev` untuk staging) |
| Validasi form | Zod (validasi schema di client & server) |
| Rate limiting / anti-spam | Honeypot field + Upstash Redis rate limit (opsional) atau Supabase Edge Function |

**Prinsip arsitektur:**
- Semua data proyek, sertifikat, pesan, dan guestbook disimpan di Supabase — bukan file JSON statis. Ini yang membuktikan sisi "fullstack".
- Astro islands: hanya komponen yang butuh interaktivitas (filter proyek, form, toggle tema, lightbox) yang di-hydrate sebagai React/Vue island. Sisanya statis untuk performa maksimal.
- Server-side rendering untuk data proyek (SEO-friendly, cepat first load) + client-side fetch untuk update real-time (guestbook baru masuk tanpa reload).

---

## 2. Skema Database (Supabase / PostgreSQL)

```sql
-- Tabel proyek (Projects Showcase)
create table projects (
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
  created_at timestamptz default now()
);

-- Tabel pengalaman & pendidikan (Timeline)
create table experiences (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('education', 'work', 'organization')),
  title text not null,
  institution text not null,
  location text,
  start_date date not null,
  end_date date, -- null = masih berlangsung
  description text,
  display_order int default 0
);

-- Tabel sertifikat (untuk modal lightbox)
create table certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date,
  image_url text not null,
  credential_url text,
  display_order int default 0
);

-- Tabel pesan kontak
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Tabel guestbook
create table guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null check (char_length(message) <= 280),
  created_at timestamptz default now()
);
```

**Row Level Security (RLS) — wajib diaktifkan:**
- `projects`, `experiences`, `certificates`: public **read-only** (anon boleh `select`, tidak boleh `insert/update/delete`).
- `contact_messages`: anon boleh `insert` saja, **tidak boleh** `select` (privasi pesan masuk). Read hanya lewat service role key di server.
- `guestbook_entries`: anon boleh `insert` dan `select` (publik), tapi rate-limited di API layer untuk cegah spam.

---

## 3. Struktur Folder Proyek

```
src/
├── components/
│   ├── ui/                  # Button, Badge, Card, Modal — reusable primitives
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── TechStack.astro
│   │   ├── Projects.tsx     # island — punya filter interaktif
│   │   ├── Timeline.astro
│   │   ├── Certificates.tsx # island — modal lightbox
│   │   ├── Contact.tsx      # island — form
│   │   └── Guestbook.tsx    # island — realtime-ish
│   └── ThemeToggle.tsx      # island
├── layouts/
│   └── BaseLayout.astro     # meta tags, OG image, dark/light class handler
├── lib/
│   ├── supabase.ts          # client init (anon key, dipakai di server component)
│   ├── supabase-admin.ts    # service role client, HANYA dipakai di API routes
│   ├── resend.ts
│   └── validators.ts        # Zod schemas
├── pages/
│   ├── index.astro
│   ├── api/
│   │   ├── contact.ts       # POST — insert pesan + trigger email Resend
│   │   ├── guestbook.ts     # GET (list) & POST (insert, rate-limited)
│   │   └── projects.ts      # GET — optional, kalau butuh fetch client-side
│   └── projects/[slug].astro # detail page per proyek
└── styles/
    └── global.css           # CSS variables untuk light/dark theme
```

---

## 4. Detail Fitur per Section

### 4.1 Hero Section
- Nama, role title (misal "Software Engineer · AI & Computer Vision Enthusiast"), status badge **"Available for Work"** (dot hijau berdenyut).
- Typewriter effect bergantian menampilkan beberapa role/fokus (contoh: "Fullstack Developer" → "Computer Vision Researcher" → "Machine Learning Enthusiast").
- CTA ganda: **Download CV** (link ke PDF di `/public` atau Supabase Storage) dan **Contact Me** (scroll ke section kontak).
- Background subtle: animated gradient / particle ringan (jangan berlebihan, tetap fast-loading).

### 4.2 Tech Stack & Skills
- Grid kategori: Frontend, Backend, Database, **AI/ML Tools** (kategori keempat ini penting untuk menonjolkan spesialisasi — isi dengan TensorFlow/Keras, OpenCV, MTCNN, MobileNetV2, dsb).
- Tiap item: ikon (Lucide atau simple-icons), nama, level (opsional progress bar/dot).
- Hover interaction ringan (scale + glow) via Framer Motion.

### 4.3 Projects Showcase (Fullstack, dynamic)
- Filter tab: **All / Web App / AI & Machine Learning / Script & Tools** — filtering client-side setelah initial fetch dari Supabase (SSR untuk load awal, biar tetap SEO-friendly).
- Card proyek: thumbnail, judul, deskripsi singkat, badge tech stack, link live demo + GitHub.
- **Proyek unggulan yang wajib di-seed pertama kali** (isi tabel `projects`):
  1. **FocusAI** — kategori `ai_ml`. Aplikasi fullstack Flask + Vanilla JS untuk deteksi tingkat fokus siswa berbasis facial expression recognition (MobileNetV2, MTCNN face detection). Deskripsikan sebagai implementasi nyata dari riset skripsi.
  2. Proyek CV/AI lain kalau ada (preprocessing tool berbasis structured prompt, dsb).
  3. Proyek web app lain sebagai bukti kemampuan fullstack umum (bisa proyek kuliah/pribadi lain).
- Klik card → halaman detail `/projects/[slug]` dengan galeri screenshot, penjelasan arsitektur, dan challenge/solution.

### 4.4 Timeline Pengalaman & Sertifikat
- Vertical timeline (alternating kiri-kanan di desktop, satu kolom di mobile) untuk pendidikan, pengalaman organisasi, dan proyek riset (skripsi masuk di sini juga sebagai milestone).
- Section sertifikat terpisah: grid thumbnail sertifikat → klik membuka **modal lightbox** (gambar full-size + nama issuer + tanggal + link verifikasi kalau ada).

### 4.5 Contact Form & Guestbook (Fullstack)
**Contact form:**
- Field: nama, email, subjek (opsional), pesan. Validasi Zod di client & server.
- Submit → `POST /api/contact` → insert ke `contact_messages` → trigger email notifikasi ke pemilik portofolio via Resend API.
- Honeypot field tersembunyi untuk anti-bot sederhana.
- Feedback UI: loading state → success/error toast.

**Guestbook:**
- Pengunjung isi nama + pesan singkat (max 280 karakter).
- `POST /api/guestbook` → insert ke `guestbook_entries`, rate-limit per IP (misal 1 pesan / 5 menit) untuk cegah spam.
- List guestbook tampil terbaru di atas, auto-refresh ringan (polling interval atau Supabase Realtime subscription kalau mau lebih advanced).

### 4.6 Dark / Light Mode
- Toggle di navbar, simpan preferensi di `localStorage`, default mengikuti `prefers-color-scheme`.
- Implementasi via CSS variables (`--bg-primary`, `--text-primary`, dst) di `:root` dan `.dark`, dikombinasikan dengan Tailwind `dark:` class strategy.
- No flash-of-wrong-theme: set class tema via inline script di `<head>` sebelum render.

---

## 5. SEO, Performa & Aksesibilitas

- Meta tags dinamis per halaman (title, description, OG image) via komponen `<SEO />` di `BaseLayout.astro`.
- Generate OG image otomatis (opsional, pakai `@vercel/og` atau satu gambar OG statis berkualitas tinggi).
- `sitemap.xml` dan `robots.txt` via `@astrojs/sitemap`.
- Semantic HTML, alt text di semua gambar/sertifikat, kontras warna sesuai WCAG AA di kedua tema.
- Lighthouse target: Performance ≥ 90, Accessibility ≥ 95, SEO = 100.
- Lazy-load gambar non-hero, `astro:assets` untuk optimasi otomatis.

---

## 6. Environment Variables

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # hanya dipakai server-side, JANGAN expose ke client
RESEND_API_KEY=
CONTACT_EMAIL_TO=
PUBLIC_SITE_URL=
```

---

## 7. Deployment

1. Push repo ke GitHub.
2. Buat project di Supabase → jalankan SQL schema di atas → aktifkan RLS + policy sesuai section 2.
3. Import project ke Vercel, hubungkan repo, set semua environment variables.
4. Set adapter `@astrojs/vercel` di `astro.config.mjs` dengan `output: 'server'`.
5. Deploy → cek domain custom (opsional) → setup Vercel Analytics untuk tracking pengunjung.

---

## 8. Fitur Bonus (opsional, kalau waktu memungkinkan)

- Command palette (⌘K) untuk navigasi cepat antar section.
- GitHub contribution graph embed di section About.
- Halaman `/resume` dengan CV viewer PDF inline, bukan cuma link download.
- View counter per proyek (kolom `view_count` di tabel `projects`, increment via API saat detail page dibuka).
- Blog/notes ringkas kalau mau dokumentasikan proses riset skripsi (bagus untuk personal branding AI/CV).

---

## 9. Urutan Eksekusi yang Disarankan

1. Setup project Astro + Tailwind + Supabase connection.
2. Buat schema database & seed data awal (termasuk proyek FocusAI).
3. Bangun layout dasar + dark/light mode + navigasi.
4. Bangun section statis dulu (Hero, Tech Stack, Timeline) — cepat terlihat progress.
5. Bangun Projects Showcase dengan fetch dari Supabase + filter.
6. Bangun API routes (contact, guestbook) + integrasi Resend.
7. Bangun form & guestbook UI + validasi + anti-spam.
8. Polish: animasi Framer Motion, SEO, Lighthouse audit, responsive check.
9. Deploy ke Vercel.
