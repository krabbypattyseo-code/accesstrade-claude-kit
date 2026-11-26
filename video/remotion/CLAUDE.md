# Mesin video (folder remotion/)

Milik sesi **Improvement** (`/video-improvement`). Sesi lain hanya menjalankan perintah `npm run ...` di sini dan menulis ke `public/video/`, `public/musik/`, `public/sfx/` (sesi Eksekusi). Aturan modul: `../CLAUDE.md`.

Jalan di macOS dan Windows: semua tool memanggil Remotion lewat `lib/run.mjs` (Node langsung, tanpa shell), jadi path berspasi aman. Jangan menambah pemanggilan `npx`, `sh`, atau perintah khusus satu sistem operasi di `lib/` dan `tools/`; kalau terpaksa, sediakan padanannya di `lib/run.mjs`.

## Wajib: pakai skill resmi Remotion sebelum menulis kode

Sebelum menulis atau mengubah kode Remotion (komponen, animasi, caption, audio, render), baca skill yang sesuai:

| Pekerjaan | Skill (folder `remotion/.claude/skills/`) |
|---|---|
| Tidak yakin skill mana | `remotion-best-practices` (penunjuk ke skill lain) |
| Markup, animasi, timing, audio, font, transisi | `remotion-markup` |
| Caption dan subtitle | `remotion-captions` |
| Render video atau still | `remotion-render` |
| Peta dan rute | `remotion-maps` |
| Cari dokumentasi Remotion | `remotion-docs` |

Kalau skill tidak muncul di daftar skill sesi, baca langsung filenya: `remotion/.claude/skills/<nama>/SKILL.md` (shortcut ke `remotion/.agents/skills/`), lalu ikuti file yang ditunjuknya. Kalau folder itu belum ada: `npm run setup:skills`.

Skill selalu versi terbaru, bisa sedikit lebih baru dari Remotion di kit (4.0.546). Fitur yang disarankan skill tapi belum ada di versi kit: pakai cara yang didukung versi terpasang, beri tahu user, dan jangan upgrade tanpa diminta. Skill juga tidak mengubah struktur kit: jangan membuat project baru, tetap pakai `render.mjs` dan alur script JSON.

## Peta kode

| File | Isi |
|---|---|
| `lib/paths.mjs` | Lokasi folder kit |
| `lib/brand.mjs` | `brand/tokens.json` → objek brand lengkap + default |
| `lib/scripts.mjs` | Baca script, alias tipe adegan, timing dari rekaman, sinkron `onWord`, pemeriksaan (`checkScript`), chapter, daftar render |
| `lib/run.mjs` | Pemanggil Remotion CLI, Python venv, ffmpeg sistem (lintas OS) |
| `lib/audio.mjs` | ffmpeg bawaan Remotion: konversi, loudness, potong, siapkan klip video |
| `lib/align.mjs` | Pencocokan kalimat script ↔ transkrip Whisper (dari belakang, take terakhir menang) |
| `lib/words.mjs` | Waktu kata untuk caption + file SRT |
| `sync.mjs` | Menulis `src/generated/` (brand.json, fonts.ts, scripts.json). Jalan otomatis sebelum studio/render |
| `render.mjs` | Render video + cover + SRT + chapter |
| `tools/` | `cek`, `vo`, `demo-vo` (macOS say / Windows System.Speech), `foto`, `klip`, `musik`, `sfx`, `setup-python`, `transcribe.py` |
| `src/theme.ts` | Ukuran kanvas, zona aman, area konten per format; helper warna |
| `src/Video.tsx` | Penyusun adegan, transisi, caption, audio. Daftar tipe adegan → komponen di `SCENES` |
| `src/scenes/*.tsx` | Satu file per tipe adegan; setiap adegan menangani Reels (vertikal) dan YouTube (horizontal) lewat `useFormat()` |
| `src/components/` | Caption, transisi, teks, animasi masuk, ikon, latar, logo |
| `src/Cover.tsx` | Cover Reels dan thumbnail YouTube |

## Aturan kode

- Animasi hanya dengan `useCurrentFrame()` + `interpolate()` / `spring()`. CSS transition/animation tidak ikut terender.
- `useCurrentFrame()` di komponen sekecil mungkin (lihat `components/Motion.tsx`).
- Audio dari `@remotion/media`. Gambar dengan `Img` + `staticFile()`.
- Warna, font, ukuran dari `theme.ts` / brand. Jangan menulis kode hex di komponen adegan.
- Setiap adegan baru harus jalan di dua format. Cek keduanya.
- Jangan ubah versi paket di `package.json` tanpa diminta user.

## Sebelum menyatakan selesai

```bash
npm run typecheck
```

```bash
npm run cek
```

Lalu render contoh kedua format (`--draft` cukup) dan lihat beberapa frame:

```bash
npm run render -- ../scripts/reels/00-contoh-reels.json --draft && npm run render -- ../scripts/youtube/00-contoh-youtube.json --draft
```

```bash
npx remotion still src/index.ts Youtube ../output/cek-frame.jpg --props=.render-props/youtube-00-contoh-youtube.json --frame=150
```
