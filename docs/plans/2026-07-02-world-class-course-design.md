# Design: React Course → Kelas Dunia (Rp 5jt)

**Tanggal:** 2026-07-02
**Status:** Disetujui

## Tujuan

Meng-upgrade course React berbahasa Indonesia (10 bab HTML statis, ~83 lessons, gaya "lo/gue") menjadi course kelas dunia yang membawa orang awam sampai level senior React, dengan nilai jual Rp 5 juta.

## Keputusan kunci

| Keputusan | Pilihan |
|---|---|
| Dimensi upgrade | Konten senior-level **dan** interaktivitas penuh |
| Cakupan kurikulum | Perluas besar: 10 → 15 bab |
| Arsitektur | Tetap HTML statis (CDN + vanilla JS + localStorage), tanpa build step, tanpa server |
| Gaya bahasa | Tetap "lo/gue" santai — pembeda course ini |

## 1. Kurikulum — 15 bab, jalur Awam → Senior

Empat level yang menjadi tulang punggung klaim "dari awam sampai senior":

### 🟢 Fondasi (untuk orang awam)
- **Bab 0 (BARU): JavaScript Essentials untuk React** — variabel, function, array method (map/filter/reduce), destructuring, spread, template literal, async/await, modules, DOM dasar. Menutup gap terbesar: orang awam tidak bisa langsung masuk Bab 1.
- Bab 1: Pengenalan React *(diperdalam)*
- Bab 2: Components & Props *(diperdalam)*
- Bab 3: State & Events *(diperdalam)*

### 🔵 Menengah
- Bab 4: Hooks *(diperdalam)*
- Bab 5: Routing & Forms *(diperdalam)*
- Bab 6: TypeScript *(diperdalam)*
- Bab 7: Next.js *(diperdalam)*

### 🟣 Mahir
- Bab 8: State Management *(diperdalam)*
- Bab 9: Testing *(diperdalam)*
- Bab 10: Performance & Best Practices *(diperdalam)*
- **Bab 11 (BARU): React Internals** — rendering pipeline, reconciliation, Fiber architecture, concurrent features (useTransition, useDeferredValue, Suspense), kenapa `key` penting, batching. Materi pembeda senior.
- **Bab 12 (BARU): Arsitektur & Design Patterns** — struktur folder production, compound components, custom hooks patterns, render optimization patterns, feature-sliced design, dependency boundaries, code review mindset.

### 🔴 Senior
- **Bab 13 (BARU): Capstone Projects** — 3 proyek terpandu bertingkat:
  1. **Habit Tracker** — state, forms, localStorage persistence
  2. **Toko Online Mini** — routing, fetch API, cart state global, checkout flow
  3. **Dashboard Realtime** — WebSocket, charts, memoization, virtual list

  Setiap proyek: milestone, checklist, kode starter, dan solusi bertahap.
- **Bab 14 (BARU): Interview Prep & Career** — pertanyaan interview React yang sering keluar (+jawaban model), frontend system design dasar, live coding tips, membangun portfolio, roadmap karir & gaji junior→senior konteks Indonesia.

### Upgrade bab lama (1–10)
Setiap bab lama ditambah:
- Section **"Kesalahan Umum"** (common mistakes + cara menghindarinya)
- **Exercises** dengan solusi tersembunyi (accordion)
- **Quiz** di akhir bab (5–8 soal)
- **Playground** di lesson-lesson kunci

## 2. Interaktivitas — 4 fitur, tanpa server

Semua vanilla JS + CDN. Jalan di GitHub Pages / Vercel statis.

1. **Live Playground** — CodeMirror (editor) + Babel Standalone (compile JSX) + iframe (preview). Tulis JSX → Run → render langsung. Self-contained, tidak bergantung layanan eksternal. Hanya di lesson kunci; code block biasa tetap statis + tombol Salin.
2. **Quiz engine** — pilihan ganda, feedback instan + penjelasan per jawaban, skor tersimpan di localStorage per bab.
3. **Coding challenges** — soal "lengkapi kode ini", assertion otomatis dijalankan di iframe, badge ✅ saat lulus.
4. **Progress dashboard** — di index: progress per bab (lesson + skor quiz), persentase jalur Awam→Senior, tombol "lanjutkan dari terakhir".

## 3. Refactor teknis

CSS/JS yang terduplikasi di 11 file HTML diekstrak ke `assets/`:
- `assets/course.css` — design tokens, komponen bersama
- `assets/course.js` — progress, checkbox, copy code, nav
- `assets/playground.js` — live playground
- `assets/quiz.js` — quiz + challenge engine

Bab baru tinggal include. Satu perubahan desain = edit satu file.

## 4. Landing page

- Peta jalur belajar 4 level (Awam→Senior) sebagai visual utama
- Statistik baru: 15 bab, ~120 lessons, 3 capstone projects
- Section "kenapa course ini beda" (internals, arsitektur, interview prep, interaktif)
- Progress dashboard terintegrasi
- Framing nilai Rp 5jt

## Urutan pengerjaan

1. **Infrastruktur** — assets bersama, playground, quiz engine, progress system
2. **Bab baru** — Bab 0, 11, 12, 13, 14
3. **Perdalam bab lama** — satu per satu (exercises + quiz + playground)
4. **Landing page** — terakhir, setelah semua angka final

## Alternatif yang ditolak

- **Konten dulu, interaktivitas belakangan** — bab baru harus di-retrofit dua kali.
- **Big-bang paralel semua sekaligus** — konflik antar file besar, sulit di-review.
- **Migrasi ke Next.js/Astro** — memakan waktu besar, mengubah workflow, tidak diperlukan untuk fitur yang direncanakan.
- **Ubah gaya bahasa ke formal** — gaya santai justru diferensiasi; kualitas premium datang dari kedalaman materi.
