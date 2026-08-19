-- =====================================================
-- SEED DATA — Portofolio Heykel Prayogi Timanta G.s
-- Jalankan SETELAH schema.sql berhasil
-- =====================================================

-- =====================================================
-- PROJECTS
-- =====================================================
insert into projects (title, slug, short_description, full_description, category, tech_stack, thumbnail_url, gallery_urls, live_url, github_url, is_featured, display_order) values

-- 1. FocusAI — Proyek Skripsi (Featured)
(
  'FocusAI — Student Focus Detection System',
  'focusai',
  'Aplikasi fullstack real-time untuk mendeteksi tingkat fokus siswa berbasis facial expression recognition menggunakan MobileNetV2 dan MTCNN face detection.',
  'FocusAI adalah implementasi nyata dari riset skripsi D4 Software Engineering Technology. Sistem mendeteksi ekspresi wajah siswa secara real-time melalui webcam, mengklasifikasikan tingkat fokus (Focused, Distracted, Drowsy) menggunakan model deep learning MobileNetV2 yang dilatih pada dataset ekspresi wajah.

**Arsitektur Sistem:**
- Frontend: Vanilla JavaScript dengan WebRTC untuk akses kamera real-time
- Backend: Python Flask REST API untuk inferensi model
- Face Detection: MTCNN (Multi-task Cascaded Convolutional Networks)
- Classification Model: MobileNetV2 fine-tuned pada dataset custom
- Data Pipeline: OpenCV untuk preprocessing frame kamera

**Tantangan & Solusi:**
- Latency real-time: Optimasi pipeline dengan frame skipping dan model quantization
- Akurasi deteksi: Transfer learning dari ImageNet, augmentasi dataset, class balancing
- Deployment: Dockerized Flask API untuk konsistensi environment

**Hasil:**
- Akurasi klasifikasi: 87% pada test set
- Latency rata-rata: <200ms per frame
- FPS: 15-20 FPS pada hardware standar',
  'ai_ml',
  ARRAY['Python', 'Flask', 'TensorFlow', 'Keras', 'MobileNetV2', 'MTCNN', 'OpenCV', 'JavaScript', 'WebRTC', 'HTML/CSS'],
  '/images/projects/focusai-thumb.jpg',
  ARRAY['/images/projects/focusai-1.jpg', '/images/projects/focusai-2.jpg', '/images/projects/focusai-3.jpg'],
  null,
  'https://github.com/heykelprayogi/focusai',
  true,
  1
),

-- 2. Facial Expression Recognition Research
(
  'Facial Expression Recognition — Deep Learning Research',
  'facial-expression-recognition',
  'Pipeline riset computer vision untuk klasifikasi 7 ekspresi wajah dasar menggunakan CNN arsitektur custom dan transfer learning.',
  'Proyek riset deep learning untuk mengenali 7 ekspresi wajah dasar (happy, sad, angry, fear, disgust, surprise, neutral) dari dataset FER2013 dan RAF-DB.

**Pipeline Riset:**
- Data Preprocessing: Normalisasi, augmentasi (flip, rotate, brightness), face alignment
- Model Arsitektur: CNN custom + fine-tuning MobileNetV2, VGG16, ResNet50
- Training: Keras/TensorFlow, early stopping, learning rate scheduler
- Evaluation: Confusion matrix, per-class F1-score, Grad-CAM visualisasi

**Tools & Libraries:**
- TensorFlow 2.x / Keras
- OpenCV, PIL untuk image processing
- Matplotlib, Seaborn untuk visualisasi
- Scikit-learn untuk metrics
- Jupyter Notebook untuk eksperimen',
  'ai_ml',
  ARRAY['Python', 'TensorFlow', 'Keras', 'OpenCV', 'scikit-learn', 'Jupyter', 'NumPy', 'Pandas', 'Matplotlib'],
  '/images/projects/fer-thumb.jpg',
  ARRAY['/images/projects/fer-1.jpg', '/images/projects/fer-2.jpg'],
  null,
  'https://github.com/heykelprayogi/facial-expression-recognition',
  true,
  2
),

-- 3. Portfolio Website (proyek ini sendiri!)
(
  'Personal Portfolio — Fullstack Web App',
  'portfolio-website',
  'Website portofolio fullstack ini sendiri! Dibangun dengan Astro v7, Tailwind v4, React islands, dan Supabase PostgreSQL sebagai backend dinamis.',
  'Website portofolio yang sedang kamu lihat ini dibangun sebagai bukti kemampuan fullstack end-to-end.

**Tech Stack:**
- Framework: Astro v7 dengan SSR (Server-Side Rendering)
- Styling: Tailwind CSS v4 + CSS Variables untuk theming
- Interaktivitas: React islands untuk komponen dinamis
- Database: Supabase (PostgreSQL) dengan Row Level Security
- Email: Resend API untuk notifikasi kontak
- Deployment: Vercel (serverless functions)
- Animasi: Framer Motion

**Fitur Fullstack:**
- Dynamic data dari database (bukan hardcode JSON)
- Contact form dengan email notification
- Guestbook realtime dengan rate limiting anti-spam
- Dark/Light mode dengan no-FOUC
- SEO optimized (meta, OG image, sitemap)
- Lighthouse score: Performance 95+',
  'web_app',
  ARRAY['Astro', 'TypeScript', 'React', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Framer Motion', 'Vercel', 'Resend', 'Zod'],
  '/images/projects/portfolio-thumb.jpg',
  ARRAY['/images/projects/portfolio-1.jpg'],
  'https://heykel.dev',
  'https://github.com/heykelprayogi/portfolio',
  false,
  3
),

-- 4. Web App contoh (placeholder — bisa diupdate)
(
  'Smart Attendance System',
  'smart-attendance',
  'Sistem absensi berbasis face recognition untuk lingkungan kampus. Menggunakan face_recognition library dengan Flask backend dan antarmuka web responsif.',
  'Sistem absensi otomatis menggunakan computer vision untuk mengenali wajah mahasiswa dan mencatat kehadiran secara real-time.

**Fitur:**
- Registrasi wajah mahasiswa baru
- Deteksi dan pengenalan wajah real-time via webcam
- Dashboard admin untuk rekap kehadiran
- Export laporan ke Excel
- Notifikasi email untuk absensi

**Stack:**
- Backend: Flask + SQLAlchemy + SQLite
- Face Recognition: face_recognition (dlib-based)
- Frontend: Bootstrap 5 + Jinja2 templates
- Database: SQLite untuk development',
  'ai_ml',
  ARRAY['Python', 'Flask', 'face_recognition', 'dlib', 'OpenCV', 'SQLAlchemy', 'Bootstrap', 'SQLite'],
  '/images/projects/attendance-thumb.jpg',
  ARRAY['/images/projects/attendance-1.jpg'],
  null,
  'https://github.com/heykelprayogi/smart-attendance',
  false,
  4
),

-- 5. Script/Tool
(
  'Dataset Preprocessing Toolkit',
  'dataset-preprocessing-toolkit',
  'Kumpulan script Python untuk preprocessing dataset computer vision: face alignment, background removal, augmentasi, dan konversi format dataset.',
  'Toolkit otomatisasi untuk mempersiapkan dataset image sebelum training model deep learning.

**Fitur:**
- Face alignment menggunakan dlib 68-point landmark
- Background removal dengan rembg library
- Batch augmentasi (flip, rotate, crop, brightness, noise)
- Dataset split (train/val/test) dengan stratified sampling
- Format konversi (YOLO, VOC, COCO, TFRecord)
- Progress bar dan logging

**Use Case:**
Digunakan untuk mempersiapkan dataset FER2013 dan dataset custom ekspresi wajah untuk proyek skripsi.',
  'script_tool',
  ARRAY['Python', 'OpenCV', 'dlib', 'PIL', 'NumPy', 'tqdm', 'rembg', 'scikit-learn'],
  '/images/projects/toolkit-thumb.jpg',
  ARRAY[],
  null,
  'https://github.com/heykelprayogi/dataset-preprocessing-toolkit',
  false,
  5
);

-- =====================================================
-- EXPERIENCES (Timeline)
-- =====================================================
insert into experiences (type, title, institution, location, start_date, end_date, description, tags, display_order) values

-- Pendidikan
(
  'education',
  'D4 Software Engineering Technology',
  'Politeknik / Universitas (sesuaikan)',
  'Indonesia',
  '2020-09-01',
  '2024-08-31',
  'Program D4 (Sarjana Terapan) Teknologi Rekayasa Perangkat Lunak. Fokus pada pengembangan perangkat lunak fullstack dan riset AI/Computer Vision. Skripsi: "Sistem Deteksi Tingkat Fokus Siswa Berbasis Facial Expression Recognition Menggunakan MobileNetV2 dan MTCNN". IPK: 3.8/4.0.',
  ARRAY['Software Engineering', 'Computer Vision', 'AI/ML', 'Fullstack Development'],
  1
),

-- Riset / Skripsi
(
  'work',
  'Skripsi Researcher — Facial Expression Recognition',
  'Laboratorium AI & Computer Vision',
  'Indonesia',
  '2023-09-01',
  '2024-06-30',
  'Penelitian mendalam di bidang computer vision untuk tugas akhir. Mengembangkan pipeline deteksi ekspresi wajah menggunakan deep learning (MobileNetV2 + MTCNN). Proses meliputi pengumpulan dataset, preprocessing, training model, evaluasi, dan implementasi dalam aplikasi FocusAI.',
  ARRAY['Deep Learning', 'TensorFlow', 'Computer Vision', 'Research'],
  2
),

-- Organisasi / Aktivitas (contoh — sesuaikan)
(
  'organization',
  'Anggota Tim Pengembang Aplikasi',
  'UKM / Himpunan Mahasiswa Teknologi (sesuaikan)',
  'Indonesia',
  '2021-09-01',
  '2023-08-31',
  'Aktif di organisasi mahasiswa bidang teknologi. Berkontribusi dalam pengembangan aplikasi internal kampus, pelatihan coding untuk anggota baru, dan penyelenggaraan workshop software development.',
  ARRAY['Team Collaboration', 'Web Development', 'Mentoring'],
  3
);

-- =====================================================
-- CERTIFICATES (contoh — sesuaikan dengan sertifikat asli)
-- =====================================================
insert into certificates (title, issuer, issue_date, image_url, credential_url, category, display_order) values

(
  'TensorFlow Developer Certificate',
  'Google',
  '2023-06-01',
  '/images/certificates/tensorflow-cert.jpg',
  'https://www.credential.net/your-credential-id',
  'ai_ml',
  1
),
(
  'Machine Learning Specialization',
  'DeepLearning.AI / Coursera',
  '2023-03-01',
  '/images/certificates/ml-specialization.jpg',
  'https://coursera.org/your-certificate-link',
  'ai_ml',
  2
),
(
  'Python for Everybody Specialization',
  'University of Michigan / Coursera',
  '2022-08-01',
  '/images/certificates/python-cert.jpg',
  'https://coursera.org/your-certificate-link',
  'programming',
  3
),
(
  'Responsive Web Design',
  'freeCodeCamp',
  '2022-05-01',
  '/images/certificates/fcc-web.jpg',
  'https://freecodecamp.org/your-certificate',
  'web',
  4
);
