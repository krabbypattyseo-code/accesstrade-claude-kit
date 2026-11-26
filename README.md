# Kit Claude Code: Accesstrade AI

Kit ini berisi semua role dari Project claude.ai "Accesstrade AI" (14 perintah Project + 4 alur chat: admin dashboard, update dokumentasi, brief, optimasi productivity) dalam bentuk file yang dibaca Claude Code. Versi v2, 2026-11-26: ditambah modul produksi video (`video/`). Versi sebelumnya: `docs/arsip/README-v1.md`.

## 1. Cara pasang

1. Ekstrak zip ini ke satu folder kerja, misalnya `accesstrade-claude-kit/`.
2. Buka folder itu sebagai folder kerja di Claude Code (terminal: `cd accesstrade-claude-kit` lalu `claude`; desktop atau web: pilih folder ini).
3. Pastikan konektor Google Sheets, Google Drive, Google Docs, dan Claude in Chrome aktif di akun itu. Akun Google yang terhubung harus punya akses edit ke spreadsheet Pipeline, Data Writer, dan folder SEO Folder (ID ada di `CLAUDE.md`).
4. Windsor dan Semrush tidak dibutuhkan. Data GSC dan GA4 diambil lewat Chrome atau Google API.
5. Kirim prompt pembuka di bagian 3.

Kalau akun lain memakai Project claude.ai (bukan Claude Code), isi `CLAUDE.md` bisa ditempel sebagai instruksi Project dan isi folder `docs/` diunggah sebagai dokumen Project. Slash command di `.claude/commands/` lalu dipanggil dengan menyebut namanya di chat.

## 2. Isi kit

| Lokasi | Isi |
|---|---|
| `CLAUDE.md` | Aturan bersama: konteks, gaya komunikasi, aturan tulis, ID file, batas data, konektor, daftar perintah |
| `.claude/commands/` | 19 perintah: `/admin`, `/update`, `/brief`, `/optimasi`, `/upload`, dan 14 perintah asli Project (`/validasiartikel`, `/topicideation`, `/topicapproval`, `/giveinternallink`, `/generatefeatureimages`, `/generatesubimages`, `/finaldraft`, `/topiccluster`, `/optimizedarticle`, `/drafting`, `/craftingdata`, `/designdata`, `/discussmode`, `/brandpublication`) |
| `.claude/skills/` | 7 skill: content-brief, eyd-checker, design-brief, accesstrade-analytics, accesstrade-article-finder, accesstrade-post-article, storytelling-with-data |
| `docs/instruksi-update-dokumentasi.md` | Aturan `/update` (v2) |
| `docs/instruksi-brief.md` | Aturan `/brief` (v2, disesuaikan tanpa Windsor/Semrush) |
| `docs/prompt-optimasi-productivity-nov-2026.md` | Aturan `/optimasi` (antrean per 10 Nov) |
| `docs/upload-artikel.md` | Aturan `/upload`: Content Author, tanggal rilis, lokasi gambar, prompt Chrome |
| `docs/workflow-screenshot-dashboard.md` | Alur screenshot dashboard ACCESSTRADE (kode SS-AT, template MD tugas, helper anotasi) |
| `docs/peta-fitur-dashboard-2026-11-05.md` | Peta 37 fitur dashboard publisher. Sumber label menu dan tombol |
| `docs/prompt-eksplorasi-dashboard.md` | Prompt untuk Chrome extension membuat peta fitur baru |
| `docs/struktur-spreadsheet.md` | Tab, kolom, rumus, peta ID, cara sisip log, Data Writer, catatan API |
| `docs/sumber-data-gsc-ga4.md` | Cara ambil data dan konvensi GSC/GA4 |
| `docs/house-style-dan-eyd.md` | House style, pola EYD K1–K8, prinsip SEO, visual |
| `docs/tim-dan-gerbang-verifikasi.md` | Peran tim, gerbang verifikasi data, fakta terkonfirmasi |
| `docs/status-terkini-2026-11-19.md` | Posisi kerja terakhir: angka Q1, antrean Review Indah, 47 pekerjaan terbuka, keputusan menggantung |
| `docs/daftar-artikel-pipeline.md` | Snapshot 276 baris Pipeline (ID, bulan, tipe, status, judul, URL) |
| `docs/knowledge-base-artikel-april-2026.md` | Library 437 artikel dengan segmen, layer, prioritas, aksi optimasi (April 2026) |
| `docs/daftar-url-artikel-project.md` | Daftar URL artikel dari instruksi Project |
| `docs/templates/` | Contoh file permintaan data GSC/GA4 untuk sesi lain |
| `docs/contoh/` | Contoh MD tugas screenshot P0234 dan contoh hasil optimasi |
| `docs/arsip/` | Versi lama CLAUDE.md dan README |
| `video/` | Modul produksi video Reels + YouTube: jalur Remotion, After Effects, dan Motion Format. Panduan lengkap di `video/README.md` |

## 3. Prompt pembuka (tempel di sesi pertama)

```
Aku mau lanjut kerja konten dan dokumentasi Website Accesstrade di sini.
1. Baca CLAUDE.md, lalu docs/status-terkini-2026-11-19.md dan docs/struktur-spreadsheet.md.
2. Cek akses: baca header tab ▶️ Content Pipeline di spreadsheet 1haYsf7XBhGYjQWElY5EU16oncoPyAlbU2d0s7XCwYDs dan ID terakhirnya. Jangan menulis apa pun.
3. Laporkan dalam tabel: konektor yang aktif, akses spreadsheet (bisa baca / tidak), ID terakhir di Pipeline, dan apakah ada yang berubah dibanding snapshot 19 Nov.
Setelah itu tunggu perintahku (/admin, /update, /brief, /optimasi, /upload, atau perintah Project lain).
```

## 4. Modul video

Setup, sesi, dan perintah ada di `video/README.md`. Dua hal penting:

- **Editor (PC Windows, After Effects 2027)** menerima paket khusus dari `node video/tools/bungkus-editor.mjs`, bukan zip kit ini. Paket itu hanya berisi modul video.
- **Motion Format** di `video/.claude/skills/motion-format/` berlisensi pribadi Harist: jangan ikut di zip kit ini kalau kit dibagikan ke akun lain.

## 5. Yang tidak ikut di kit

| Item | Alasan | Kalau dibutuhkan |
|---|---|---|
| Memory akun lama | Tidak bisa dipindah. Isi yang relevan untuk kerja sudah dirangkum di `docs/` | Akun baru membangun memory sendiri |
| Dokumentasi_Campaign_Accesstrade.docx, Engine_Images_Accesstrade_v1.docx, Shopee XTRA Commission .xlsx, Blibli Brand Commission .xlsx | File biner di Project lama | Unggah manual ke folder kit atau lampirkan saat dibutuhkan |
| File referensi `accesstrade-analytics` (gsc-analysis, ga-analysis, internal-analysis, viz-guide) | Tidak ada di salinan skill akun lama, hanya SKILL.md | Skill tetap jalan untuk alur checklist. Tambahkan file referensinya kalau kamu masih punya |
| Data rekening, login dashboard, email pribadi | Sengaja tidak dimasukkan karena file kit mudah tersebar | Tetap di tempat asalnya |

## 6. Perawatan kit

- Kalau aturan alur berubah, naikkan versi file (v2, v3) dan simpan versi lama di `docs/arsip/`.
- Peta fitur dashboard diperbarui minimal sebulan sekali lewat `docs/prompt-eksplorasi-dashboard.md`. Simpan sebagai `docs/peta-fitur-dashboard-YYYY-MM-DD.md` dan perbarui rujukannya di `CLAUDE.md`.
- `docs/status-terkini-*.md` dan `docs/daftar-artikel-pipeline.md` adalah snapshot. Minta `/admin` membuat snapshot baru kalau perlu dipindah lagi.
