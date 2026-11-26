---
name: accesstrade-analytics
description: >
  Skill analisis data performa SEO & Growth untuk Accesstrade Indonesia.
  Gunakan skill ini SETIAP KALI pengguna menyebut kata-kata seperti: "analisis data",
  "mau analisis", "buat report", "lihat performa", "weekly report", "monthly report",
  "quarterly report", "GSC", "Google Search Console", "Google Analytics", "GA",
  "data internal", "registrasi", "publisher aktif", "Click Daftar", atau upload file
  CSV/XLSX yang berhubungan dengan data website Accesstrade.
  Skill ini menjalankan interaction flow wajib: tanya sumber data → tanya rentang waktu
  → checklist file → verifikasi struktur → baru analisis. Jangan skip satupun langkah
  ini meskipun pengguna sudah memberikan sebagian informasi.
---

# Accesstrade Analytics Skill

Skill ini mengelola seluruh alur analisis data performa Accesstrade — dari konfirmasi
sumber data, checklist file, hingga output dashboard + insight.

---

## Aturan Dasar — Wajib Diikuti

**JANGAN mulai analisis sebelum dua kondisi ini terpenuhi:**
1. Sumber data sudah dikonfirmasi (GSC / GA / Internal)
2. File yang dibutuhkan sudah diupload dan terverifikasi strukturnya

Jika salah satu belum ada → jalankan flow di bawah. Jangan asumsikan, jangan skip.

---

## Step 1 — Tanyakan Sumber Data

Ketika pengguna menyebut intent analisis data (apapun bentuknya), **langsung tampilkan
pilihan ini tanpa basa-basi panjang:**

```
Halo! Sebelum mulai, data apa yang ingin kamu analisis?

1. Google Search Console (GSC)
2. Google Analytics (GA)
3. Data Internal Accesstrade

Bisa pilih lebih dari satu ya — tinggal sebutkan nomornya.
```

Jika pengguna sudah menyebut sumber data di pesan awal → lewati Step 1, langsung ke Step 2.

---

## Step 2 — Tanyakan Rentang Waktu

Setelah sumber data dikonfirmasi, tanyakan rentang waktu jika belum disebutkan:

```
Untuk data [nama sumber], ini untuk periode apa?

1. Weekly  — perbandingan minggu ini vs minggu lalu (WoW)
2. Monthly — tren agregasi per minggu dalam satu bulan
3. Quarterly — perbandingan 3 bulan (MoM growth)

Masing-masing punya metrik dan output yang berbeda ya.
```

Jika rentang waktu sudah disebutkan di pesan awal → lewati Step 2, langsung ke Step 3.

---

## Step 3 — Tampilkan Checklist File

Setelah sumber data + rentang waktu dikonfirmasi, tampilkan file yang dibutuhkan.
Jika file belum diupload → tampilkan checklist. Jika sudah → langsung ke Step 4.

---

### Checklist: Google Search Console (GSC)

```
Untuk analisis GSC [Weekly/Monthly/Quarterly], aku butuh:

✦ 1 file CSV export dari Google Search Console
  Kolom yang harus ada:
  ├── Landing Page       (URL artikel)
  ├── Date (Month)       (nomor bulan, contoh: 5)
  ├── Date (ISO Week)    (nomor minggu, contoh: 21)
  ├── Query              (keyword pencarian)
  ├── Url Clicks         (jumlah klik)
  └── Impressions        (jumlah tayangan)

Cara export:
→ GSC → Search Results → Filter tanggal → Export → CSV

Silakan upload file CSV-nya ya.
```

---

### Checklist: Google Analytics (GA)

```
Untuk analisis GA [Weekly/Monthly/Quarterly], aku butuh 2 file CSV terpisah:

✦ File A — General Traffic
  Kolom yang harus ada:
  ├── Full page URL
  ├── Date (Month)
  ├── Week
  ├── Total users
  └── Sessions

✦ File B — Conversion / Click Daftar
  Kolom yang harus ada:
  ├── Full page URL
  ├── Date (Month)
  ├── Week
  ├── Total users
  ├── Sessions
  └── Click Daftar

Catatan: File B hanya berisi halaman yang menghasilkan minimal 1 Click Daftar.
Jika hanya ada 1 file gabungan → upload saja, aku periksa strukturnya.

Silakan upload kedua file-nya ya.
```

---

### Checklist: Data Internal Accesstrade

```
Untuk analisis Internal [Weekly/Monthly/Quarterly], tersedia beberapa file XLSX.
Upload sesuai fokus analisis yang kamu inginkan:

✦ SEO Registration (XLSX)
  → Untuk: melihat artikel mana yang menghasilkan registrasi
  Kolom: Artikel | reg_date | jumlah registrasi per hari

✦ Article Active Publisher (XLSX)
  → Untuk: melihat artikel yang menghasilkan publisher aktif
  Kolom: Artikel | Total Publisher | Publisher Click ≥10 | Impressi | Click | GMV

✦ Publisher Active Summary (XLSX)
  → Untuk: tren mingguan SEO vs Direct
  Kolom: Week | Channel | Total Publisher | Publisher Click ≥10 | GMV | Revenue

✦ SEO Type of Publisher (XLSX)
  → Untuk: distribusi tipe publisher dari SEO/artikel
  Kolom: Week | Total | Social Media | SEO | Paid Traffic

✦ Direct Type of Publisher (XLSX)
  → Untuk: distribusi tipe publisher dari Direct/brand keyword
  Kolom: Week | Total | Social Media | SEO | Paid Traffic

Minimal upload 1 file untuk bisa mulai.
Aku sesuaikan analisisnya dengan file yang tersedia.

Silakan upload file XLSX-nya ya.
```

---

## Step 4 — Verifikasi Struktur File

Setelah file diupload, **sebelum mulai analisis**:

1. Baca 5 baris pertama untuk cek kolom
2. Identifikasi rentang tanggal yang ada di data
3. Tampilkan konfirmasi ke pengguna:

```
✓ File diterima: [nama file]
✓ Kolom terdeteksi: [daftar kolom]
✓ Rentang data: [periode terlama] hingga [terbaru]
✓ Jumlah baris: [angka]

[Jika ada kolom tidak sesuai standar]:
⚠ Kolom "[nama]" tidak ditemukan.
  Aku asumsikan ini adalah "[mapping]" — apakah benar?

Aku siap mulai analisis [Weekly/Monthly/Quarterly] untuk [sumber data].
Lanjut? (atau ada yang perlu disesuaikan dulu?)
```

Tunggu konfirmasi dari pengguna sebelum lanjut ke Step 5.

---

## Step 5 — Jalankan Analisis

Setelah pengguna konfirmasi di Step 4, jalankan analisis sesuai kombinasi
**sumber data × rentang waktu** menggunakan panduan di bawah.

Baca file referensi yang relevan:
- `references/gsc-analysis.md` — metrik dan output untuk GSC
- `references/ga-analysis.md` — metrik dan output untuk GA
- `references/internal-analysis.md` — metrik dan output untuk Data Internal
- `references/viz-guide.md` — panduan visualisasi Storytelling with Data

---

## Penanganan Situasi Khusus

| Situasi | Respons |
|---|---|
| File diupload tapi kolom tidak sesuai | Sebutkan kolom yang kurang, minta konfirmasi mapping |
| Pengguna minta "analisis semua" tanpa spesifik | Tanyakan: semua sumber atau semua periode? |
| Data hanya 1 minggu tapi minta Monthly | Sebutkan keterbatasan, tawarkan analisis yang bisa dilakukan |
| Data parsial (minggu belum selesai) | Lanjutkan tapi tandai (*) dan sebut di narasi |
| Pengguna upload file yang salah | Jelaskan file yang dibutuhkan vs yang diupload |
| Pengguna kombinasi beberapa sumber | Jalankan checklist per sumber, kumpulkan semua file dulu baru analisis |
