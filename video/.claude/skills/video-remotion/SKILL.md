---
name: video-remotion
description: Sesi Eksekusi Remotion video ACCESSTRADE. Proses rekaman suara, siapkan foto, klip, musik, dan efek suara, render draft lalu final video Reels atau YouTube dari script JSON ke output/ (plus cover, thumbnail, subtitle, chapter). Jalan di Mac Harist maupun PC Windows editor. Pakai saat user mengetik /video-remotion, bilang "rekaman sudah masuk", "render", "render ulang", "proses suara", "ganti foto", "pasang klip", atau mengecek kotak-masuk/untuk-eksekusi.md untuk jalur Remotion. Tidak mengubah isi script dan tidak mengubah mesin video.
---

# Sesi Eksekusi Remotion

Tugasmu mengubah script + rekaman menjadi file video yang siap dicek manusia. Kamu tidak menulis ulang script dan tidak mengubah kode.

## Batas sesi

- **Boleh menulis:** `rekaman/olah/`, `remotion/public/video/`, `remotion/public/musik/`, `remotion/public/sfx/`, `output/`, `history/video-remotion.md`.
- **Satu pengecualian di script:** boleh menambah/mengubah field `voCut` (koreksi potongan rekaman). Field lain tidak.
- **Boleh menambah catatan** di `kotak-masuk/untuk-script.md` (masalah isi/teks) dan `kotak-masuk/untuk-improvement.md` (bug atau fitur mesin).
- **Tidak boleh:** mengubah isi script, `remotion/src/`, `remotion/lib/`, `ae/`, `brand/`. Tidak upload atau posting apa pun.
- Perintah dijalankan dari folder `remotion/`. Di Windows sama persis (PowerShell atau terminal Claude Code).

## Setiap mulai chat

1. Baca entri teratas `CHANGELOG.md`: ada perubahan mesin sejak entri terakhir `history/video-remotion.md`? Sebutkan yang relevan.
2. Baca `kotak-masuk/untuk-eksekusi.md` (yang belum `[selesai]`, jalur Remotion) dan `output/daftar-render.md`. Brief video ada di `brief/`.
3. Video dari klip/footage: baca `alur/playbook-footage.md`.
4. Ringkas ke user dalam tabel: video mana yang siap diproses, mana yang menunggu rekaman, foto, atau klip.

## Alur per video

### 1. Cek script

```bash
npm run cek -- ../scripts/<format>/NN-slug.json
```

- Error isi (teks, tipe, props wajib): jangan diperbaiki sendiri. Tulis ke `kotak-masuk/untuk-script.md`, lanjut ke video lain.
- Error "gambar/klip/suara tidak ditemukan": lanjut ke langkah 2.

### 2. Foto

Untuk setiap path foto di script yang belum ada:
1. Minta user file fotonya (atau path di disk). Jangan memakai foto dari internet tanpa lisensi yang jelas.
2. **Lihat fotonya dulu** (buka file gambarnya). Cek data pribadi: wajah anak atau orang yang belum memberi izin, nama, alamat, nomor telepon, plat nomor, label pengiriman, layar dengan data. Ada? Tanyakan ke user, lalu buramkan dengan `--blur x,y,w,h` (koordinat piksel foto asli).
3. Impor dengan **nama persis seperti di script**:

```bash
npm run foto -- ../scripts/<format>/NN-slug.json <file foto> <nama-tanpa-.jpg>
```

### 2b. Klip video (adegan `klip`)

Untuk setiap path klip di script yang belum ada: minta file videonya, **cek isinya dulu** (ambil 1-3 frame: `npx remotion ffmpeg -nostdin -ss <detik> -i <file> -frames:v 1 <frame.jpg>`, lalu lihat), pastikan tidak ada data pribadi publisher, lalu:

```bash
npm run klip -- ../scripts/<format>/NN-slug.json <file video> <nama-tanpa-.mp4> --mulai <detik> --durasi <detik>
```

### 3. Musik dan efek suara (opsional)

Hanya kalau script meminta `media.music` dan user memberi file berlisensi:

```bash
npm run musik -- <file musik> <nama>
```

Isi sumber dan lisensinya di `remotion/public/musik/sumber-musik.txt`. Efek suara di field `sfx` script: `npm run sfx -- <file> <nama>`, sumbernya di `remotion/public/sfx/sumber-sfx.txt`.

### 4. Suara

1. Cari rekaman di `rekaman/<format>/NN-*.m4a` (atau .wav/.mp3).
2. Belum ada: tunjukkan naskah rekaman (semua `vo` berurutan) dan arahkan ke `brand/panduan-rekam-suara.md`. Untuk pratinjau timing saja, boleh `npm run demo-vo -- <script>` lalu render `--draft`, dan **sebut jelas bahwa itu suara komputer**.
3. Ada: proses.

```bash
npm run vo -- ../scripts/<format>/NN-slug.json
```

4. Baca `rekaman/olah/<format>-NN/laporan.md`. Untuk adegan bertanda ⚠ (skor < 0,7 atau tidak ketemu), bandingkan kolom "Script" dan "Terdengar":
   - Beda karena user sedikit improvisasi tapi maknanya sama: aman, sebutkan saja.
   - Potongan salah (mengambil kalimat lain, terpotong): perbaiki dengan `voCut` di script, `{"<id>": [[mulai, selesai]]}` dalam detik di `suara-normal.wav` (lihat kolom "Bagian rekaman" adegan sebelah dan transkrip di `transkrip.json`), lalu jalankan `npm run vo` lagi.
   - Kalimat tidak direkam: minta user merekam kalimat itu (boleh disambung di akhir rekaman yang sama).

### 5. Draft dan cek visual

```bash
npm run render -- ../scripts/<format>/NN-slug.json --draft
```

Video panjang (YouTube): jalankan di latar dan jangan menjalankan dua render sekaligus.

**Cek sendiri sebelum menyerahkan ke user.** Ambil satu frame dari tengah tiap adegan (waktu adegan ada di `.render-props/<format>-NN-slug.json`), lalu lihat gambarnya:

```bash
npx remotion ffmpeg -nostdin -loglevel error -y -ss <detik> -i ../output/<format>/NN-slug-draft.mp4 -frames:v 1 ../rekaman/olah/<format>-NN/cek-<id>.jpg
```

Yang dicari: teks terpotong atau keluar kotak, caption menutupi isi, foto ter-crop di bagian penting, cap [KONFIRMASI], adegan kosong.
- Masalah dari teks script (terlalu panjang): catat ke `kotak-masuk/untuk-script.md`.
- Masalah tampilan mesin: catat ke `kotak-masuk/untuk-improvement.md` dengan path gambar frame dan penjelasannya.

Serahkan path draft ke user dan minta user menonton.

### 6. Final

Setelah user setuju:

```bash
npm run render -- ../scripts/<format>/NN-slug.json
```

Reels: tambah `--hq` kalau user ingin 1440×2560. Draft (`-draft.mp4`) boleh dipindah ke Trash kalau user setuju.

Hasil:
- Reels: `output/reels/NN-slug.mp4` + `NN-slug-cover.jpg`
- YouTube: `output/youtube/NN-slug.mp4` + `-thumbnail.jpg` + `.srt` + `-chapter.txt`

### 7. Serah terima

- Beri tahu user langkah upload (dilakukan user sendiri):
  - Reels: pakai `-cover.jpg` sebagai cover, caption dari `scripts/reels/NN-slug-caption.txt`.
  - YouTube: unggah `.srt` sebagai subtitle, tempel isi `-chapter.txt` di deskripsi (bersama deskripsi dari `NN-slug-caption.txt`), pasang end screen di 12 detik terakhir, pakai `-thumbnail.jpg`.
- Status `[KONFIRMASI]` atau demo di `output/daftar-render.md` = **belum boleh tayang**. Sampaikan ini dengan jelas.
- Tandai catatan kotak masuk yang selesai dengan `[selesai]` dan tambah ringkasan di `history/video-remotion.md`.
- Laporan ke Harist dalam tabel: video, durasi, file, status tayang, catatan.
