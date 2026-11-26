# Menambah tipe adegan baru

Contoh permintaan: "butuh adegan timeline tahun", "adegan checklist dengan centang", "adegan peta lokasi".

## Sebelum mulai

1. Pastikan tipe yang ada benar-benar tidak cukup (sering bisa dengan `daftar`, `banding`, atau props baru di tipe lama). Props baru lebih murah daripada tipe baru.
2. Tulis rancangan singkat ke user: nama tipe (Bahasa Indonesia, satu kata), props, tampilan Reels vs YouTube, contoh JSON. Tunggu persetujuan.
3. Baca skill resmi: `remotion/.claude/skills/remotion-markup/SKILL.md`, dan file rujukannya yang relevan (`text-highlights.md`, `multi-scene-video.md`, `timing.md`). Untuk peta: `remotion-maps`.

## Daftar file yang diubah

| # | File | Yang ditambah |
|---|---|---|
| 1 | `remotion/lib/scripts.mjs` | `TYPE_ALIASES` (nama + alias), pemeriksaan props wajib di `checkScript` |
| 2 | `remotion/src/types.ts` | nama di `SceneType`, props baru di `SceneProps` |
| 3 | `remotion/src/scenes/<Nama>.tsx` | komponen adegan: `SceneFrame`, `useFormat()`, `Rise`/`Pop`/`PopWords`; tangani `fmt.vertical` (Reels) dan horizontal (YouTube) |
| 4 | `remotion/src/scenes/shared.ts` | latar default di `DEFAULT_BG` |
| 5 | `remotion/src/Video.tsx` | daftarkan di `SCENES` |
| 6 | `scripts/SKEMA.md` | baris di tabel tipe + contoh props |
| 7 | `.claude/skills/video-script/references/template-*.md` | kapan memakai tipe ini |
| 8 | `scripts/reels/00-contoh-reels.json`, `scripts/youtube/00-contoh-youtube.json` | satu adegan contoh di masing-masing |
| 9 | `ae/jsx/aekit.jsx` | builder adegan yang sama di After Effects (ES3, tanpa JSON/arrow/let). Tes dengan `node ae/tools/mock-ae.mjs`, lalu di PC editor |

Kalau tipe baru butuh sinkron ke kata yang diucapkan, ikuti pola `onWord` → `at` di `prepareScript` (bagian 5).

## Tes

```bash
npm run typecheck && npm run cek
```

Render kedua contoh `--draft`, lihat frame adegan baru di kedua format: teks tidak keluar kotak, tidak bertabrakan dengan caption (Reels: konten di atas y 1160; YouTube: di atas y 800), animasi selesai sebelum adegan berakhir.

## Catat

`CHANGELOG.md` (versi angka tengah naik), catatan di `kotak-masuk/untuk-script.md` dan `kotak-masuk/untuk-eksekusi.md` ("tipe baru `x` tersedia, lihat SKEMA.md"), `history/video-improvement.md`.
