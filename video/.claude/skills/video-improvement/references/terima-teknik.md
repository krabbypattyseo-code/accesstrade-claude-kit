# Menerima kiriman teknik

Kit ini sepenuhnya milik pemakainya; tidak ada update otomatis dari pembuat kit. Kalau pembuat kit atau orang lain menemukan teknik baru, mereka mengirim **catatan teknik** (teks/markdown, bukan file pengganti). Tugasmu memasang teknik itu ke versi kit ini tanpa merusak yang sudah ada.

## Alur

1. **Baca seluruh catatan** sebelum menyentuh file. Pahami: masalah apa yang diselesaikan, bagian mesin mana yang terlibat, versi kit pengirim.
2. **Bandingkan dengan kit ini.** Kit pengirim bisa sudah berbeda (nama file, struktur, brand). Cari padanan di kit ini lewat `remotion/CLAUDE.md` (peta kode) dan `CHANGELOG.md`.
3. **Jelaskan rencana ke user:** apa yang akan diubah, file mana, risikonya, perlu paket baru atau tidak. Tunggu persetujuan.
4. **Sesuaikan, jangan menyalin mentah:**
   - Nama brand, warna, font, path, atau aturan milik pengirim tidak dibawa. Pakai `brand/` dan `theme.ts` kit ini.
   - Potongan kode dibaca dan dipahami dulu. Jangan menjalankan skrip dari catatan tanpa membacanya.
   - Paket npm/pip baru, unduhan, atau upgrade Remotion hanya dengan persetujuan user.
5. **Pasang lewat alur umum** di SKILL.md (reproduksi → ubah → typecheck → render kedua format → dokumentasi).
6. **Catat** di `CHANGELOG.md`: "Teknik dari <pengirim/sumber>: <judul>", plus dampak ke sesi lain.

## Format catatan teknik (untuk pengirim)

Bagikan format ini ke siapa pun yang mau mengirim teknik:

```markdown
# Teknik: <judul singkat>

- Dari: <nama> · Tanggal: <YYYY-MM-DD> · Versi kit pengirim: <vX.Y.Z> · Remotion: <versi>

## Masalah yang diselesaikan
<1-3 kalimat. Contoh: caption Reels menutupi foto di adegan foto.>

## Cara kerja
<penjelasan singkat idenya, tanpa bergantung pada nama file pengirim>

## Bagian mesin yang terlibat
<mis. komponen caption, pencocokan rekaman, render.mjs>

## Kode
<potongan kode inti, dengan penjelasan per bagian>

## Cara tes
<script contoh / frame yang dicek / hasil yang diharapkan>

## Catatan
<keterbatasan, dependensi, hal yang perlu disesuaikan dengan brand penerima>
```
