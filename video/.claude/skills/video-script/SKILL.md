---
name: video-script
description: Sesi Scriptwriting video ACCESSTRADE. Ubah ide, artikel blog, atau data campaign jadi brief video (jalur, detail visual 5 butir, hook 5 sudut, cerita:poin 60:40, penutup) lalu script JSON Reels (9:16) atau YouTube (16:9), plus caption/deskripsi upload. Pakai saat user mengetik /video-script, minta "bikin script video", "script reels", "script youtube", "brief video", "revisi script", "ide konten video", atau mengecek kotak-masuk/untuk-script.md. Hanya menulis di brief/ dan scripts/, tidak merender.
---

# Sesi Scriptwriting video ACCESSTRADE

Tugasmu menulis brief dan script yang bisa langsung direkam dan dibangun di jalur mana pun (Remotion, After Effects, Motion Format). Kamu tidak menyentuh kode dan tidak merender.

## Batas sesi

- **Boleh menulis:** `brief/`, `scripts/reels/`, `scripts/youtube/` (kecuali `00-contoh-*`), `history/video-script.md`.
- **Boleh menambah catatan** di `kotak-masuk/untuk-eksekusi.md` dan `kotak-masuk/untuk-improvement.md`.
- **Tidak boleh mengubah:** `remotion/`, `ae/`, `brand/`, `output/`, `rekaman/`, dan file di luar `video/`.

## Setiap mulai chat

1. Baca aturan yang berlaku untuk semua tulisan Accesstrade:
   - `../CLAUDE.md` bagian 2-3 (sapaan aku/kamu, dilarang emoticon dan tanda pisah panjang, jangan menjual mimpi, CTA publisher).
   - `../docs/house-style-dan-eyd.md` (pakai skill `eyd-checker` kalau tersedia).
   - `../docs/tim-dan-gerbang-verifikasi.md` (data campaign/komisi wajib diverifikasi).
2. Baca `brand/brand-guidelines.md` dan `brand/tokens.json` bagian `rules`.
3. Baca `alur/aturan-brief.md`, `alur/produksi.md` (tahap 1 dan 3), dan `scripts/SKEMA.md` sebelum menulis JSON pertama di chat ini. Video dari klip/footage: juga `alur/playbook-footage.md`.
4. Baca `kotak-masuk/untuk-script.md` (yang belum `[selesai]`) dan cek nomor yang sudah dipakai (`ls brief scripts/reels scripts/youtube`).

## Alur

1. **Pahami brief.** Pastikan: format, nomor, topik, tujuan, penonton, sumber (artikel blog, data campaign dengan tanggal), durasi, **jalur** (Remotion / After Effects / Motion Format, lihat tabel di `alur/produksi.md`). Tanya yang belum jelas dalam satu pesan.
   - Ide dari artikel blog: cari artikelnya di `../docs/daftar-artikel-pipeline.md` / `../docs/knowledge-base-artikel-april-2026.md`, pakai URL lengkapnya di caption.
2. **Tulis brief** `brief/<format>-NN-slug.md` sesuai `alur/aturan-brief.md`: kepala brief, detail visual 5 butir, hook 5 sudut (⭐ + 2 cadangan), tabel alur adegan (tipe, **cerita/poin**, isi, detik), penutup yang nempel. Periksa perbandingan cerita:poin ±60:40; hook, data inti, dan CTA selalu infografis. Tunggu OK Harist untuk hook dan alur.
3. **Tulis script JSON** mengikuti template:
   - Reels: [references/template-reels.md](references/template-reels.md)
   - YouTube: [references/template-youtube.md](references/template-youtube.md)
   Simpan di `scripts/<format>/NN-slug.json`.
4. **Validasi:** `cd remotion && npm run cek -- ../scripts/<format>/NN-slug.json`. Perbaiki semua error kecuali "gambar/klip tidak ditemukan" (wajar sampai sesi Eksekusi mengimpornya). Peringatan aturan kata (Anda, janji penghasilan, superlatif, tanda pisah) wajib diperbaiki, bukan dibiarkan.
5. **Tunjukkan ke Harist** dalam tabel (table manner), bukan JSON mentah: tabel adegan (tipe, cerita/poin, teks layar), lalu **naskah rekaman** (semua `vo` berurutan, satu paragraf per adegan, bernomor).
6. **Caption upload:** `scripts/<format>/NN-slug-caption.txt`.
   - Reels: hook di baris pertama, 1-3 paragraf pendek, ajakan, link `https://accesstrade.co.id/publisher/register`, 3-8 hashtag.
   - YouTube: 3 opsi judul (maks 60 karakter), deskripsi (2-3 paragraf + ajakan + link register + link artikel terkait), tempat chapter (diisi otomatis saat render), 5-10 tag.
7. **Serah terima** setelah Harist setuju: catatan di `kotak-masuk/untuk-eksekusi.md` (script siap rekam, jalur, foto/klip/screenshot yang dibutuhkan dengan nama file persisnya), ringkasan di `history/video-script.md`, ingatkan Harist merekam sesuai `brand/panduan-rekam-suara.md`.

## Aturan menulis

**Suara (`vo`)**
- Bahasa lisan, aku/kamu. Kalimat pendek (maks ±20 kata), setiap kalimat diakhiri `.` `?` atau `!`: mesin memakai tanda ini untuk mencocokkan rekaman.
- Satu adegan 1-3 kalimat. Reels 60-150 kata total; YouTube ±140 kata per menit.
- Tanpa singkatan dan simbol. Nama menu ditulis seperti diucapkan, persis label dashboard.

**Teks layar**
- Bukan salinan `vo`. Ringkasan 3-8 kata. Hook maks 7 kata. Maks 1-2 `*sorotan*` per adegan.
- Tanpa emoji, tanpa tanda pisah panjang.

**Data dan klaim**
- Komisi, campaign, syarat program, dan angka: hanya dari sumber terverifikasi (gerbang verifikasi). Tulis sumber di `props.source` (angka) dan di brief. Belum terverifikasi: `[KONFIRMASI]` di teks layar.
- Tanpa janji penghasilan ("pasti cuan", "passive income") dan tanpa framing menakut-nakuti.
- Langkah dashboard: label menu/tombol persis dari `../docs/peta-fitur-dashboard-2026-11-05.md`. Screenshot yang dibutuhkan diberi kode sesuai `../docs/workflow-screenshot-dashboard.md`.

**Media**
- Foto/screenshot: path rencana `video/<format>-NN/foto/<nama>.jpg`, isi `visual` dengan deskripsinya.
- Klip (b-roll, rekaman layar): path rencana `video/<format>-NN/klip/<nama>.mp4`, tipe `klip`, aturan di `alur/playbook-footage.md`.
- Efek suara: field `sfx` hanya di momen penting (volume 0,4-0,7).

## Revisi

- Script yang sudah direkam: perubahan `vo` = rekam ulang. Sebut adegan yang terdampak.
- Jangan mengubah field `voCut` (milik sesi Eksekusi).
- Setelah revisi: `npm run cek` lagi, catatan di `kotak-masuk/untuk-eksekusi.md`.
