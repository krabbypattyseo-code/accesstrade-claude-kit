# Upload Artikel ke Admin Accesstrade

Versi v1 (2026-11-19). Dipakai oleh `/upload`, bersama skill `accesstrade-post-article` (isi form Post Article) dan `accesstrade-article-finder` (cari artikel di Article List).

## 1. Lokasi

| Kebutuhan | Lokasi |
|---|---|
| Form dan daftar artikel admin | https://accesstrade.co.id/Modules/Admin/Master/Article/show (lewat Claude in Chrome, Harist login sendiri) |
| Upload gambar body | Menu "Upload Image" / Upload Gambar di sidebar admin |
| Gambar artikel (feature image, infografis, sub image) | Drive "Gambar Artikel", subfolder per artikel dengan nama `P0xxx Judul Singkat`. Folder ID `1No04uVTdZ5DJL-kpzKrWl--ziMdj-yEL` (di dalam SEO Folder) |
| Screenshot dashboard beranotasi | Drive "Screenshot Tutorial Dashboard Publisher - 10 Nov 2026", folder ID `11iCkd8FX2DdoQG_oNlT00Cr3g_WjTuLP` (akses link publik, dipakai untuk memasang gambar di Docs [Review]). Screenshot baru boleh punya folder baru, tanyakan Harist |
| Sumber teks | Google Docs draft (kolom R Pipeline) atau .docx export. Untuk optimasi: Docs [Review] versi final |

## 2. Aturan yang sudah disepakati

| Aturan | Detail |
|---|---|
| Content Author | Artikel tulisan Wiwik Agustina diposting dengan **Content Author = Muhammad Harist**. Wiwik ghost writer, jadi tidak ditambahkan ke daftar Content Author |
| Release Date | Disesuaikan ke **bulan rencana artikel** (kolom B Pipeline). Contoh: artikel rencana Oktober diberi tanggal Oktober walaupun diunggah di awal November. Tanggal persisnya ditanyakan ke Harist |
| Status | Online atau Offline, tanya Harist |
| Upload sebelum feedback Indah | Hanya kalau Harist memintanya (preseden Okt 2026 untuk mengejar kuota bulan). Catat di Catatan Pipeline |
| Cover | Feature image 680x450 dari subfolder Gambar Artikel, diunggah lewat field Cover, bukan lewat Upload Gambar |
| Gambar body | Lewat Upload Gambar, lalu Copy Url, lalu Insert image dengan alt text deskriptif (detail di skill) |
| FAQ | Dilewati karena form belum punya fiturnya (aturan skill) |
| Save / Post | **Hanya setelah Harist bilang oke secara eksplisit.** Setelah save, buka ulang artikelnya untuk cek |
| Slug artikel optimasi | Tidak diganti. Artikel optimasi diedit di entri yang sudah ada (cari dulu dengan `accesstrade-article-finder`), bukan dibuat entri baru |
| Data akun | Jangan memasukkan username atau password. Kalau diminta login, minta Harist login sendiri |

## 3. Alur

1. Ambil data dari Pipeline: judul, Bulan, Tipe, Kategori, Keyword, Link Draft, Kebutuhan Design (lokasi gambar).
2. Baca draft final, ambil meta title, meta description, slug (opsi berlabel Rekomendasi kalau ada).
3. Tampilkan tabel isian form ke Harist: Field | Isi. Tanyakan yang belum ada (Release Date, Status, Tags, Keyword).
4. Isi form mengikuti skill `accesstrade-post-article`, termasuk merapikan jarak paragraf.
5. Verifikasi isi form terhadap draft (tabel Field | Di form | Draft | Status).
6. Tunggu "oke", lalu save. Buka ulang dan cek.
7. Setelah tayang: jalankan aturan `/update` (Pipeline: Published, Slug/URL, Tgl Publish, Word Count, Plagiarisme. Artikel baru writer: Data Writer 2026 Summarise dan Wiwik).

## 4. Prompt pembuka kalau upload dijalankan di sesi Chrome terpisah

```
Kamu akan mengunggah satu artikel ke admin Accesstrade (Post Article) di tab yang sudah login.

Data artikel:
- ID Pipeline: {P0xxx}
- Sumber teks: {link Google Docs / file .docx terlampir}
- Title (Id): {H1 final}
- Category: {kategori}
- Release Date: {dd-mm-yyyy}
- Status: {Online/Offline}
- Meta Title: {…}
- Meta Description: {…}
- Short Name Url: {slug}
- Keyword: {…}
- Tags: {…}
- Content Role: {Educate/Inspire/Convert}
- Content Author: Muhammad Harist
- Cover: {nama file feature image}
- Gambar body: {daftar file + posisi + alt text}

Langkah:
1. Isi semua field dan Content. H1 tidak masuk Content, FAQ dilewati.
2. Unggah gambar body lewat Upload Gambar, sisipkan di posisinya dengan alt text.
3. Bersihkan paragraf kosong dan span sisa paste.
4. Tampilkan tabel verifikasi Field | Di form | Sumber | Status.
5. Jangan klik Save/Post sampai aku bilang oke.
```
