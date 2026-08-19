# 📖 Panduan Setup Supabase — Portofolio Heykel Prayogi

> Panduan step-by-step untuk setup database Supabase dan menghubungkannya ke portofolio.

---

## LANGKAH 1 — Login ke Supabase

1. Buka **[supabase.com](https://supabase.com)**
2. Klik **Sign In** → login dengan akun kamu (GitHub/Google/Email)
3. Jika lupa password → klik **Forgot Password** di halaman login

---

## LANGKAH 2 — Buat Project Baru

1. Klik tombol **New Project** (pojok kanan atas atau dashboard)
2. Isi form:
   - **Name**: `heykel-portfolio`
   - **Database Password**: buat password yang kuat — **simpan di tempat aman!**
   - **Region**: pilih yang paling dekat → `Southeast Asia (Singapore)`
3. Klik **Create new project**
4. Tunggu ~2 menit sampai project siap (ada loading bar)

---

## LANGKAH 3 — Jalankan Schema SQL

1. Di sidebar kiri, klik **SQL Editor** (ikon database)
2. Klik **New query**
3. Copy seluruh isi file `supabase/schema.sql` dari folder project
4. Paste ke SQL Editor
5. Klik tombol **Run** (atau tekan `Ctrl+Enter`)
6. Pastikan muncul pesan **Success** tanpa error merah

> ⚠️ **Jika ada error RLS policy** yang sudah exist, itu normal jika dijalankan 2x. Hapus dan run ulang.

---

## LANGKAH 4 — Jalankan Seed Data

1. Masih di SQL Editor, klik **New query** lagi
2. Copy isi file `supabase/seed.sql`
3. Paste dan klik **Run**
4. Cek di **Table Editor** (sidebar) → tabel `projects`, `experiences`, `certificates` sudah ada data

> 📝 **Sebelum run seed.sql**, update data ini sesuai fakta kamu:
> - `institution` di tabel `experiences` (nama kampus asli)
> - Sertifikat-sertifikat yang kamu punya
> - URL GitHub project yang asli

---

## LANGKAH 5 — Ambil API Keys

1. Di sidebar kiri, klik **Project Settings** (ikon gear ⚙️)
2. Klik menu **API**
3. Salin 3 nilai ini:

```
Project URL  →  PUBLIC_SUPABASE_URL
anon public  →  PUBLIC_SUPABASE_ANON_KEY
service_role →  SUPABASE_SERVICE_ROLE_KEY  ⚠️ RAHASIA!
```

4. Buka file `.env.local` di folder project dan isi:

```env
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **JANGAN commit `.env.local` ke GitHub!** File ini sudah ada di `.gitignore`.

---

## LANGKAH 6 — Verifikasi RLS Policies

1. Di sidebar, klik **Authentication** → **Policies**
2. Pastikan tiap tabel punya policy yang benar:

| Tabel | Policy yang Harus Ada |
|---|---|
| `projects` | `projects_public_select` — anon dapat SELECT |
| `experiences` | `experiences_public_select` — anon dapat SELECT |
| `certificates` | `certificates_public_select` — anon dapat SELECT |
| `contact_messages` | `contact_messages_anon_insert` — anon hanya INSERT |
| `guestbook_entries` | `guestbook_public_select` + `guestbook_anon_insert` |

Jika ada yang hilang, jalankan ulang bagian RLS dari `schema.sql`.

---

## LANGKAH 7 — Test Koneksi Lokal

Setelah mengisi `.env.local`, jalankan dev server:

```bash
npm run dev
```

Buka **http://localhost:4321** — seharusnya:
- ✅ Section **Projects** tampil data dari Supabase
- ✅ Section **Timeline** tampil data pengalaman
- ✅ Section **Certificates** tampil sertifikat
- ✅ **Guestbook** bisa menerima dan menampilkan pesan

---

## LANGKAH 8 — Setup Resend (Email Notifikasi)

1. Buka **[resend.com](https://resend.com)**
2. Sign Up / Login
3. Klik **API Keys** → **Create API Key**
4. Nama: `portfolio-contact`
5. Copy API key → isi di `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
   ```
6. Untuk production: **verify domain** kamu di Resend agar email tidak masuk spam
   - Atau gunakan domain Resend gratis: `onboarding@resend.dev` (untuk testing)

> ⚠️ Untuk testing lokal, email Resend butuh domain yang terverifikasi.
> Sementara bisa skip — form contact tetap berfungsi (pesan tersimpan di DB), hanya notifikasi email yang belum jalan.

---

## Struktur File yang Sudah Dibuat

```
supabase/
├── schema.sql   ← Jalankan ini PERTAMA
└── seed.sql     ← Jalankan ini KEDUA (setelah schema)
```

---

## Troubleshooting

**Q: Error "Missing Supabase environment variables"**
→ Pastikan `.env.local` sudah diisi dan dev server di-restart.

**Q: Data projects tidak muncul**
→ Cek apakah `schema.sql` dan `seed.sql` sudah dijalankan di SQL Editor Supabase.

**Q: Error RLS policy saat insert ke guestbook**
→ Pastikan policy `guestbook_anon_insert` ada di table `guestbook_entries`.

**Q: Contact form tidak mengirim email**
→ Cek `RESEND_API_KEY` di `.env.local` dan pastikan domain sudah diverifikasi di Resend.
