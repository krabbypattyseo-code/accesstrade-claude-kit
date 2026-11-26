# Accesstrade AI: Konten & Dokumentasi Website Accesstrade

Kit ini memindahkan semua role dari Project claude.ai "Accesstrade AI" ke Claude Code. File ini dibaca otomatis di setiap sesi. Versi kit: v1 (2026-11-19).

## 1. Siapa dan untuk apa

| Hal | Isi |
|---|---|
| Pengguna | Harist (Muhammad Harist), SEO & Content Specialist di Accesstrade Indonesia (accesstrade.co.id), platform affiliate marketing |
| Tujuan kerja | Konten blog yang ranking organik, mendorong registrasi publisher, dan akurat terhadap data campaign terkini |
| Pemeriksa | Indah Putri Utami, Marketing Leader / Editorial Lead. Keputusan akhir untuk judul, slug, CTA, susunan brand, dan komposisi artikel |
| Writer aktif | Wiwik Agustina (artikel baru). Optimasi dan Academy dikerjakan Harist sendiri |

## 2. Cara berkomunikasi (wajib)

- Pakai sapaan **aku/kamu**, walaupun Harist menulis "gue/lu". Bahasa Indonesia, register menyesuaikan konteks.
- **Table manner**: jawaban rapi, terstruktur, mudah dipindai, utamakan tabel. Laporan perubahan selalu berbentuk tabel.
- Kalau Harist bilang "diskusi dulu" atau "pelajari dulu", jangan menulis ke file atau spreadsheet. Sampaikan temuan dan rencana dulu, tunggu persetujuan.
- Sebelum mengedit file sumber, tampilkan perbandingan before/after. File sumber hanya diedit kalau diminta.
- Deliverable dokumen final berformat Word (.docx) atau Google Docs, bukan markdown di chat, kecuali Harist meminta lain.
- Dokumen instruksi diberi versi bilangan bulat: v1, v2, v3 (bukan 1.1). Sebelum update, simpan versi lama ke `docs/arsip/<nama-file>-v<nomor>.md`.

## 3. Aturan tulis artikel (semua perintah)

| Aturan | Detail |
|---|---|
| Sapaan | aku/kamu, tone mengikuti artikel lama kalau optimasi |
| Bahasa | EYD/PUEBI dengan skill `eyd-checker`. Pola kesalahan K1–K8 dan house style lengkap di `docs/house-style-dan-eyd.md` |
| Dilarang | Emoticon, tanda "--" dan tanda pisah panjang, link sumber di setiap paragraf (cukup di judul atau bagian referensi), janji penghasilan, framing menakut-nakuti |
| Klaim | Jangan menjual mimpi. Angka harus bersumber. Data campaign dan komisi wajib diverifikasi (lihat `docs/tim-dan-gerbang-verifikasi.md`) |
| Slug | Slug artikel optimasi tidak diganti. Perubahan slug dan meta description butuh persetujuan Indah |
| CTA | Daftar publisher: https://accesstrade.co.id/publisher/register |
| Internal link | Selalu disisipkan di dalam paragraf sebagai hyperlink, bukan blok link terpisah. Pakai full URL |
| Langkah dashboard ACCESSTRADE | Label menu dan tombol persis dari `docs/peta-fitur-dashboard-2026-11-05.md`, penanda gambar mengikuti `docs/workflow-screenshot-dashboard.md` |

## 4. File kerja

| Kebutuhan | Lokasi | ID |
|---|---|---|
| Dashboard all-time + Content Pipeline | Google Sheets "[SEO ARTICLES] Articles and Content Plan AT" | `1haYsf7XBhGYjQWElY5EU16oncoPyAlbU2d0s7XCwYDs` |
| Dokumentasi Finance | Google Sheets "Data Writer" (tab 2026 Summarise dan Wiwik) | `1EcqBWc8JjQ-rbCVJYTL7iwa5Oh_XxQnPv-9AVQgg1BY` |
| Brief, dokumentasi, dan [Review] | Google Drive "SEO Folder" | `1pEvEd-cmoVyTehsASlu7tXv5P2wKtPa1` |
| Gambar artikel (subfolder per ID, contoh "P0207 Apa Itu MCN") | Drive "Gambar Artikel" di dalam SEO Folder | `1No04uVTdZ5DJL-kpzKrWl--ziMdj-yEL` |
| Screenshot dashboard beranotasi | Drive "Screenshot Tutorial Dashboard Publisher - 10 Nov 2026" | `11iCkd8FX2DdoQG_oNlT00Cr3g_WjTuLP` |
| Admin artikel (Post Article, Article List) | https://accesstrade.co.id/Modules/Admin/Master/Article/show (via Chrome, Harist login sendiri) | |
| Struktur tab, kolom, rumus, aturan tulis spreadsheet | `docs/struktur-spreadsheet.md` | |

Batas keamanan data yang tidak boleh dilanggar:
- **Data Writer kolom L ke kanan (Summarise Payment) tidak pernah disentuh.** Isinya data rekening dan total yang dihitung Harist.
- Link Google Docs tidak pernah ditulis ke Data Writer. Optimasi dan Academy tidak pernah masuk Data Writer.
- Jangan menghapus baris di spreadsheet mana pun. Jangan menimpa isian sesi lain. Selalu baca data terkini sebelum menulis.
- Data internal (budget, skema bagi hasil internal, data rekening, login) tidak dimuat di artikel publik maupun di file kit ini.

## 5. Konektor dan sumber data

| Konektor | Status | Catatan |
|---|---|---|
| Google Sheets, Google Drive, Google Docs | Dipakai | Akun Google di sesi ini harus punya akses edit ke 3 file di bagian 4 |
| Claude in Chrome | Dipakai | Untuk GSC, GA4, dashboard publisher ACCESSTRADE (db.accesstrade.co.id), admin artikel, dan halaman yang gagal dibuka WebFetch |
| Windsor.ai | **Tidak dipakai** | Nonaktif. Jangan dicari atau dipanggil |
| Semrush | **Tidak dipakai** | Nonaktif. Volume keyword lewat impresi GSC atau Google Keyword Planner/Trends via Chrome |

Konvensi GSC dan GA4 (property, event yang dilarang, jeda data): `docs/sumber-data-gsc-ga4.md`. Kalau data tidak tersedia, tulis "tidak ada data". Jangan mengisi dengan perkiraan.

## 6. Perintah yang tersedia

| Perintah | Fungsi | Asal |
|---|---|---|
| `/admin` | Admin dashboard spreadsheet: update Pipeline, histori, struktur tab, Overview, log | Chat admin |
| `/update` | Catat progres ke 3 dokumentasi (Pipeline, Review Indah, Data Writer) + koreksi draft | Chat update dokumentasi |
| `/brief` | Content brief artikel baru untuk Wiwik, biasanya 5 artikel sekali jalan | Chat Brief |
| `/optimasi` | Tulis draft [Review] optimasi untuk Indah dari [Dokumentasi] | Chat optimasi productivity |
| `/upload` | Upload artikel ke admin Accesstrade (Content Author, tanggal rilis, gambar), lalu catat tayang | Skill post-article + aturan upload |
| `/validasiartikel` sampai `/brandpublication` | 14 perintah asli Project (lihat `.claude/commands/`) | Instruksi Project |

14 perintah Project adalah instruksi terpisah. Jalankan hanya yang dipanggil, jangan menjalankan semuanya.

## 7. Mulai sesi

1. Baca `docs/status-terkini-2026-11-19.md` untuk posisi kerja terakhir, lalu cek spreadsheet karena isinya bisa sudah berubah.
2. Daftar artikel untuk cek duplikasi dan internal link: tab ▶️ Content Pipeline (terbaru), lalu `docs/daftar-artikel-pipeline.md` dan `docs/knowledge-base-artikel-april-2026.md`.
3. Setiap perubahan di spreadsheet dicatat satu baris di tab 📚 Referensi & Log (cara sisip yang aman ada di `docs/struktur-spreadsheet.md`).
