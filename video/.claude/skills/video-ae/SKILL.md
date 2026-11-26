---
name: video-ae
description: Sesi Eksekusi After Effects untuk video ACCESSTRADE di PC editor (Windows, After Effects 2027). Chat pertama mengenal AE di PC itu (versi, efek, plugin, font, template render) dan cara kerja editor; setelah itu membangun project .aep dari nol berdasarkan script JSON + rekaman suara lewat ExtendScript, mengecek hasilnya (frame + layar), lalu editor memoles dan merender. Pakai saat user mengetik /video-ae, menyebut After Effects, AE, .aep, "bikin di AE", "kenalan dengan AE", atau mengecek kotak-masuk/untuk-eksekusi.md untuk jalur AE.
---

# Sesi Eksekusi After Effects

Kamu bekerja di PC editor (Windows) yang memakai **Adobe After Effects 2027**. Tugasmu membangun motion graphic **dari nol** di After Effects berdasarkan script yang sama dengan jalur Remotion, lalu menyerahkannya ke editor untuk dipoles.

Cara kerja utamanya **script, bukan klik**: kamu menulis/menjalankan ExtendScript (`ae/jsx/aekit.jsx` lewat `node ae/build.mjs`) yang membuat comp, layer, keyframe, caption, dan audio. **Kendali layar** (computer use) dipakai untuk melihat AE, mengecek hasil, mempelajari cara kerja editor, dan langkah yang memang tidak bisa di-script.

## Batas sesi

- **Boleh menulis:** `ae/proyek/`, `ae/profil-ae.json`, `ae/profil-ae.md`, `ae/cara-kerja-editor.md`, `rekaman/olah/`, `remotion/public/video/`, `remotion/public/musik/`, `remotion/public/sfx/`, `output/`, field `voCut` di script, `history/video-ae.md`.
- **Boleh menambah catatan** di `kotak-masuk/untuk-script.md` dan `kotak-masuk/untuk-improvement.md`.
- **Tidak boleh:** mengubah isi script, `ae/jsx/`, `ae/build.mjs`, `remotion/src/`, `brand/`. Bug di builder AE: catat ke `kotak-masuk/untuk-improvement.md` (atau jalankan `/video-improvement` di chat terpisah).
- **Project editor aman:** jangan menutup, menimpa, atau membuang perubahan project yang sedang dibuka editor. Sebelum build, minta editor menyimpan pekerjaannya. Jangan build ulang ke file .aep yang sudah dipoles editor (lihat langkah 6).
- **Pengaturan AE dan Windows milik editor:** jangan mengubah preferensi AE, pengaturan Windows, atau memasang plugin/font tanpa izin editor di chat. Untuk pengaturan keamanan (mis. izin script menulis file), minta editor yang mengkliknya sendiri.
- Tidak upload atau posting apa pun.

## Chat pertama di PC editor: kenalan dengan After Effects

Kerjakan sekali, sebelum membuat video apa pun. Hasilnya dipakai semua chat berikutnya.

1. **Prasyarat.** Cek dan laporkan dalam tabel: Windows versi berapa, lokasi AE 2027 (`C:\Program Files\Adobe\Adobe After Effects 2027\Support Files\AfterFX.exe`), Node.js 20+ (`node -v`), Python 3, folder `remotion/node_modules` (kalau belum: `cd remotion && npm install`, lalu `npm run setup:python`), dan apakah kendali layar (computer use) aktif di aplikasi Claude.
2. **Izin script di AE.** Minta editor membuka *Edit > Preferences > Scripting & Expressions* dan mencentang **Allow Scripts to Write Files and Access Network**. Editor yang mengklik, bukan kamu.
3. **Data AE di PC ini:**

```bash
node ae/build.mjs --inventaris
```

   Menulis `ae/profil-ae.json` + `ae/profil-ae.md`: versi dan build AE, bahasa, daftar efek (bawaan dan plugin pihak ketiga), font terpasang, template Output Module (cari yang H.264) dan Render Settings. Baca `profil-ae.md` dan ringkas ke editor: plugin apa saja yang ada, template render H.264 yang dipakai, font brand (`brand/tokens.json` → `font`) sudah terpasang atau belum. Font belum ada: minta izin editor untuk memasangnya dari Google Fonts.
4. **Pelajari cara kerja editor.** Tanyakan dalam satu pesan, lalu tulis jawabannya di `ae/cara-kerja-editor.md` (template di [references/cara-kerja-editor.md](references/cara-kerja-editor.md)):
   - template/preset/MOGRT yang biasa dipakai, plugin favorit, gaya easing, struktur folder project, cara memberi nama comp/layer, kebiasaan render (AE langsung atau Media Encoder);
   - minta 1-2 project .aep terbaiknya. Buka di AE (dengan izin) dan bedah isinya dengan `ae/jsx/bedah-proyek.jsx` (lihat langkah di reference). Kalau kendali layar aktif, ambil screenshot timeline dan panel Effect Controls untuk melihat gaya animasinya.
   Dari situ, catat yang bisa ditiru builder (warna, durasi transisi, easing, efek yang sering dipakai) dan tulis usulannya ke `kotak-masuk/untuk-improvement.md`.
5. **Uji builder dengan contoh:**

```bash
node ae/build.mjs scripts/reels/00-contoh-reels.json --frames
```

```bash
node ae/build.mjs scripts/youtube/00-contoh-youtube.json --frames
```

   Lihat frame di `ae/proyek/<format>-00-.../frames/` dan hasil `result.json`. Buka .aep bersama editor. Adegan `GAGAL`, layer kosong, font salah, atau error: catat ke `kotak-masuk/untuk-improvement.md` lengkap dengan isi `result.json`, lalu jalankan `/video-improvement` di chat lain untuk memperbaikinya di PC ini.
6. Tambah ringkasan di `history/video-ae.md`.

## Per video

1. **Cek script dan rekaman**, sama dengan jalur Remotion (dari folder `remotion/`): `npm run cek -- ../scripts/<format>/NN-slug.json`, impor foto (`npm run foto`) dan klip (`npm run klip`) dengan nama persis seperti di script, proses suara (`npm run vo`) dan baca laporannya. Detail langkahnya ada di skill `video-remotion` bagian "Alur per video" langkah 1-4.
2. **Bangun project AE:**

```bash
node ae/build.mjs scripts/<format>/NN-slug.json --frames
```

   Builder membuat project baru (AE meminta simpan kalau ada project yang belum disimpan, biarkan editor yang memilih), membangun main comp + satu precomp per adegan + caption + audio + marker bab, menyimpan `output/<format>/NN-slug.aep`, dan mengekspor frame tengah tiap adegan.
3. **Cek sendiri sebelum menyerahkan:** baca `result.json` (status per adegan) dan lihat semua frame. Kendali layar aktif: ambil screenshot AE (panel Project, timeline main comp) untuk memastikan struktur rapi. Cari: teks keluar kotak, font pengganti (Arial), layer kosong, adegan `GAGAL`, audio tidak sinkron.
4. **Serahkan ke editor:** jelaskan struktur project (comp utama, precomp per adegan, layer caption, marker bab). Editor memoles di AE. Kalau editor ingin bagian tertentu dibuat ulang otomatis, build ulang ke nama baru (`NN-slug-v2.aep`), jangan menimpa file yang sudah dipoles.
5. **Render:** dari AE/Media Encoder oleh editor, atau

```bash
node ae/build.mjs scripts/<format>/NN-slug.json --render
```

   (memakai aerender dan template H.264 dari `profil-ae.json`). Hasil di `output/<format>/`. YouTube: subtitle `.srt` dan `-chapter.txt` dibuat dari jalur Remotion: `cd remotion && npm run render -- <script> --cover-only` menghasilkan thumbnail, subtitle, dan chapter tanpa merender ulang videonya.
6. **Serah terima** seperti jalur Remotion: status `[KONFIRMASI]`/demo = belum boleh tayang, tandai kotak masuk `[selesai]`, ringkasan di `history/video-ae.md`.

## Kendali layar: kapan dan bagaimana

| Pakai kendali layar untuk | Jangan untuk |
|---|---|
| Melihat AE setelah build (timeline, preview, Effect Controls) | Membangun animasi klik demi klik kalau script bisa |
| Mempelajari project contoh editor | Mengubah preferensi AE atau Windows tanpa izin |
| Langkah tanpa API script (mis. antrean Media Encoder, Essential Graphics) dengan izin editor | Menutup project editor, mengklik "Don't Save" |
| Mengecek pesan error/dialog AE yang menghentikan script | Mengisi login, lisensi Adobe, atau pembayaran |

Sebelum klik pertama di chat ini, sebut ke editor apa yang akan kamu lakukan. Dialog AE yang meminta keputusan (simpan, timpa, hapus): berhenti dan tanya editor.
