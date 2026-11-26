---
name: accesstrade-post-article
description: Isi form Post Article di admin Accesstrade dari dokumen artikel .docx versi After Revised, termasuk upload gambar body dan rapikan jarak paragraf, lalu cek kesesuaian sebelum save.
---

# Accesstrade Post Article dari Dokumen After Revised

Pakai skill ini kalau user kasih file artikel (.docx export Google Docs) dan minta artikelnya diisi, dicek, dirapikan, atau dipost lewat form **Post Article** di `accesstrade.co.id/Modules/Admin/Master/Article/show` (Claude in Chrome).

Gaya komunikasi: bahasa Indonesia santai (aku/kamu), laporan dalam bentuk tabel.

## 1. Baca dokumen dan temukan versi "After Revised"

1. Convert docx: `pandoc file.docx -t markdown -o doc.md`, lalu unzip docx untuk ambil gambar di `word/media/`.
2. Biasanya dokumen berisi beberapa versi artikel berurutan (Draft → Revised → After Revised). Label tab sering hilang saat export, jadi cari H1 judul yang berulang (`grep -n '^# ' doc.md`).
3. **After Revised = versi terakhir**, yaitu yang langsung diikuti blok **Meta Title / Meta Description / URL Slug**. Kalau ragu, diff dengan versi sebelumnya dan sebutkan ke user.
4. Dari blok meta, ambil opsi berlabel **(Rekomendasi)** untuk Meta Title dan Meta Description, plus slug rekomendasi. Teruskan catatan editorial di akhir dokumen ke user.
5. **Skip section FAQ** ("Pertanyaan yang Sering Ditanyakan" + Q&A). Fiturnya belum ada di form, jadi jangan dimasukkan ke Content dan jangan dihitung sebagai kekurangan.

## 2. Mapping field form

| Field form | name | Sumber |
|---|---|---|
| Title (Id) * | `txtTitle` | H1 versi After Revised |
| Title (En) | `txtTitleEn` | kosong, kecuali user minta |
| Type * | `slType` | BLOGS (default) |
| Category | `slCategoryType` | dari segmen slug, mis. `/blogs/social-media/` → Social Media, `/blogs/how-to/` → How To |
| Release Date * | `dpReleaseDate` (dd-mm-yyyy) | tanya user |
| Status * | `slStatus` | Online/Offline, tanya user |
| Cover | `fImage` | feature image dari user. Cover punya tempat upload sendiri di field Cover, **bukan** lewat Upload Gambar |
| Content * | TinyMCE `txtContent` | body After Revised tanpa H1 & tanpa FAQ |
| Meta Title (Id) | `txtMetaTitle` | opsi Rekomendasi |
| Meta Description | `txtMetaDescription` | opsi Rekomendasi (trim, tanpa newline di akhir) |
| Short Name Url | `txtShortNameUrl` | bagian terakhir slug, mis. `engagement-rate-tiktok` |
| Keyword (,) | `txtMetaKeyword` | keyword utama; tanya user kalau tidak ada |
| Tags (#) | `txtTags[]` | tanya user |
| Content Role | `slContentRole` | Educate/Inspire/Convert, default Educate |
| Content Author | `slContentAuthor` | sesuai user |

## 3. Gambar di body artikel (sub image)

Gambar di body selalu lewat halaman **Upload Gambar** (menu "Upload Image" di kiri bawah sidebar admin):

1. **Upload.** Klik **Upload Gambar**, lalu upload file dari `word/media/` atau dari user. Pakai tool `file_upload` ke input file-nya; jangan klik input file karena akan membuka dialog native. Beri nama yang jelas, mis. "CVR".
2. **Copy URL.** Kalau perlu, cari lewat kolom **Cari Gambar**. Pakai tombol **Copy Url**, yaitu URL penuh berformat `https://accesstrade.co.id/<timestamp>_<nama-file>.png`, bukan Copy Filename.
3. **Insert.** Taruh kursor di posisi gambar sesuai dokumen, lalu buka **Insert → Insert image**.
4. **Isi dialog "Insert/edit image":**
   - **Source**: URL dari langkah 2.
   - **Image description**: alt text deskriptif dan wajib diisi, mis. "Rumus CVR: (Total Pembelian ÷ Total Klik Tautan) × 100%".
   - **Dimensions**: biarkan otomatis (Constrain proportions tetap tercentang).
   - Klik **Ok**.

Alternatif: sisipkan `<img src="URL" alt="deskripsi">` lewat TinyMCE API di posisi yang sama, dengan hasil akhir yang identik.

## 4. Aturan isi Content dan kerapian

- H1 **tidak** masuk Content. H2/H3 tetap `<h2>`/`<h3>`, paragraf jadi `<p>`.
- List bernomor jadi `<ol>`, bullet jadi `<ul>`. Jangan pakai "=>" atau simbol manual, dan label bullet jangan sampai hilang (mis. "CTR (Click-Through Rate): …").
- Tabel jadi `<table>` dengan baris header. Baris "Sumber: …" dibuat italic.
- Semua hyperlink dari dokumen wajib ikut dengan URL persis.

### Jarak antar paragraf (wajib dirapikan)

Paste dari Google Docs biasanya meninggalkan sampah HTML yang bikin jarak antarparagraf dobel. Bersihkan sebelum save:

1. **Hapus paragraf kosong** `<p>&nbsp;</p>` di antara blok. Jarak antarparagraf cukup dari margin bawaan `<p>`/`<h2>`. Paragraf yang berisi gambar atau link jangan dihapus.
2. **Unwrap `<span style="font-weight: 400;">`**: buang span-nya, teksnya tetap dipertahankan.
3. **Unwrap `<p>` di dalam sel tabel** (`<td><p>…</p></td>` → `<td>…</td>`) supaya baris tabel tidak terlalu tinggi.
4. Cara cek manual: menu **Tools → Source code** di editor Content. Di situ terlihat semua `<p>&nbsp;</p>` dan span sisa, dan bisa diedit langsung, lalu klik **Ok**.
5. Cara cepat lewat JS: simpan backup dulu (`window.__backupHTML = ed.getContent()`), bersihkan DOM `ed.getBody()`, lalu `ed.save()`. Setelah itu verifikasi teks tidak berubah: bandingkan `textContent` sebelum dan sesudah dengan semua whitespace dibuang, harus identik. Jumlah gambar, link, H2, dan H3 juga harus tetap sama.
6. Cek visual dengan screenshot: jarak tiap paragraf dan heading harus seragam, tanpa celah kosong dobel.

## 5. Verifikasi sebelum save (wajib)

1. Baca nilai field lewat JS: `document.querySelector('[name=...]').value`.
2. Bandingkan per paragraf: kirim daftar paragraf After Revised (dinormalisasi, tanpa prefix list) ke JS, lalu cek `includes` terhadap `innerText` editor yang whitespace-nya sudah dinormalisasi. Laporkan yang tidak cocok beserta posisi bedanya.
3. Cek jumlah H2/H3 (FAQ tidak dihitung), link dan URL-nya, gambar beserta src dan alt-nya, isi tabel, serta tidak ada `<p>&nbsp;</p>` atau span font-weight sisa.
4. Tips teknis:
   - Output JS yang mengandung URL dengan query string bisa ke-BLOCK. Strip `?…` dulu dan pecah output panjang (±1.800 karakter).
   - Kadang tool JS melaporkan "failed" padahal script-nya sudah jalan. Cek ulang state-nya dulu sebelum mengulang perubahan.

## 6. Laporan dan konfirmasi

- Tampilkan tabel: Field | Di form | After Revised | Status (✅/❌/⚠️).
- Sebutkan catatan editorial dari dokumen.
- **Upload gambar dan klik Save/Post/Submit hanya setelah user bilang oke secara eksplisit di chat.** Setelah save, buka ulang artikelnya untuk memastikan semua tersimpan.
