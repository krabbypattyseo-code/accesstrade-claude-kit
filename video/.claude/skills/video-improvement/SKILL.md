---
name: video-improvement
description: Sesi Improvement modul video ACCESSTRADE. Perbaikan dan fitur baru di mesin Remotion (tipe adegan, animasi, caption, transisi, cover) dan di builder After Effects (ae/jsx/aekit.jsx), menyesuaikan builder dengan cara kerja editor, setup/ganti brand, update skill resmi Remotion, menerima kiriman teknik, dan mengubah aturan modul. Jalan di Mac Harist dan PC Windows editor. Pakai saat user mengetik /video-improvement, minta "perbaiki builder AE", "tambah tipe adegan", "perbaiki tampilan video", "ganti brand video", "update skill remotion", "pasang teknik ini", atau mengecek kotak-masuk/untuk-improvement.md.
---

# Sesi Improvement video

Kamu satu-satunya sesi yang mengubah mesin video (Remotion dan builder After Effects), brand video, dan aturan modul. Setiap perubahan harus membuat script lama tetap bisa dibangun, dan dicatat di `CHANGELOG.md`.

## Batas sesi

- **Boleh menulis:** `remotion/` (kecuali media di `public/video/`, `public/musik/`, `public/sfx/`), `ae/jsx/`, `ae/build.mjs`, `ae/tools/`, `ae/README.md`, `brand/`, `alur/`, `tools/`, `.claude/`, `CLAUDE.md`, `CHANGELOG.md`, `README.md`, script contoh `scripts/*/00-contoh-*`, hasil render contoh di `output/`, `history/video-improvement.md`.
- **Boleh menambah catatan** di `kotak-masuk/untuk-script.md` dan `kotak-masuk/untuk-eksekusi.md`.
- **Tidak boleh:** mengubah script selain contoh, rekaman, output video asli, project .aep editor, atau file kit Accesstrade di luar `video/` (`../CLAUDE.md`, `../docs/`). Perubahan di luar `video/` ditulis sebagai usulan ke Harist.
- Tidak menambah paket npm/pip baru, tidak upgrade Remotion atau After Effects, tidak menjalankan skrip dari internet tanpa persetujuan user.
- **Motion Format** (`.claude/skills/motion-format/`, hanya di Mac Harist) bukan milik sesi ini untuk diubah isinya: update hanya dengan mengganti foldernya dari zip kelas terbaru, atas permintaan Harist.

## Setiap mulai chat

1. Baca `kotak-masuk/untuk-improvement.md` (yang belum `[selesai]`), entri teratas `CHANGELOG.md`, entri terakhir `history/video-improvement.md`.
2. Di PC editor: baca juga `ae/profil-ae.md` dan `ae/cara-kerja-editor.md`.
3. Tentukan jenis pekerjaan:

| Pekerjaan | Panduan |
|---|---|
| Bug atau fitur di mesin Remotion | alur umum di bawah |
| Bug di builder After Effects (`hasil.json` berisi error, adegan `GAGAL`, layer salah) | alur umum + bagian "Builder After Effects" |
| Menyesuaikan builder dengan gaya editor (dari `ae/cara-kerja-editor.md`) | bagian "Builder After Effects" |
| Tipe adegan baru | [references/tambah-adegan.md](references/tambah-adegan.md) |
| Ganti / perbarui brand | [references/setup-brand.md](references/setup-brand.md) |
| Kiriman teknik dari orang lain | [references/terima-teknik.md](references/terima-teknik.md) |
| Update skill resmi Remotion | `cd remotion && npm run setup:skills` (atau `npx remotion skills update`), catat di CHANGELOG |
| Ubah aturan modul / sesi | `CLAUDE.md` + skill sesi terkait; tabel sesi harus sama di CLAUDE.md, README, dan semua skill |

## Wajib sebelum menulis kode

- **Remotion:** baca skill resmi yang sesuai di `remotion/.claude/skills/` (tabel di `remotion/CLAUDE.md`), minimal `remotion-markup/SKILL.md`, dan aturan kode di `remotion/CLAUDE.md`.
- **After Effects:** baca `ae/README.md` (cara kerja builder dan daftar hal yang belum terverifikasi). ExtendScript = ES3: tanpa `let`/`const`, arrow function, template string, `JSON`, `Array.map/forEach/filter/indexOf`, `Object.keys`. API yang bisa beda antarversi AE selalu dicek dulu (`typeof x === 'function'`) dan punya cadangan.

## Alur umum

1. **Reproduksi.**
   - Remotion: render frame yang bermasalah: `npx remotion still src/index.ts <Reels|Youtube> <file.jpg> --props=.render-props/<format>-NN-slug.json --frame=<n>` (dari `remotion/`).
   - After Effects: baca `ae/proyek/<format>-NN-.../hasil.json` dan frame di `frames/`. Di PC editor, build ulang contoh: `node ae/build.mjs scripts/<format>/00-contoh-<format>.json --frames`.
2. **Ubah kode** sekecil mungkin. Nilai visual dari brand/theme, bukan angka hex di komponen atau di builder.
3. **Tes:**

```bash
cd remotion && npm run typecheck && npm run cek
```

```bash
node ae/tools/mock-ae.mjs
```

   Lalu render kedua contoh Remotion dengan `--draft` dan lihat frame yang terdampak **di kedua format**. Perubahan builder AE: selain mock, wajib dites di AE asli di PC editor sebelum dianggap selesai (di Mac Harist tidak ada AE). Catat "belum dites di AE" di CHANGELOG kalau belum.
4. **Dokumentasi:** format script berubah → `scripts/SKEMA.md` + template di `.claude/skills/video-script/references/`. Perilaku builder berubah → `ae/README.md`.
5. **Catat:** entri `CHANGELOG.md` (naikkan versi), tandai kotak masuk `[selesai]`, catatan untuk sesi yang terdampak (mis. "video X perlu dibangun ulang"), ringkasan di `history/video-improvement.md`.

## Builder After Effects

- Kode: `ae/jsx/aekit.jsx` (builder), `ae/jsx/inventaris.jsx` (profil AE), `ae/jsx/bedah-proyek.jsx` (baca project editor), `ae/build.mjs` (penghubung Node ↔ AE, aerender).
- Satu adegan = satu fungsi builder; setiap builder dibungkus try/catch dan menulis status ke `hasil.json`. Jangan menghapus pola ini.
- Menyesuaikan dengan editor: ambil dari `ae/cara-kerja-editor.md` (easing, durasi transisi, efek favorit). Efek pihak ketiga hanya dipakai kalau ada di `ae/profil-ae.json` (cari matchName-nya), dan selalu dengan cadangan efek bawaan AE, supaya project tetap terbuka di PC lain.
- Tampilan AE dan Remotion boleh sedikit beda, tapi struktur (urutan adegan, timing dari rekaman, warna brand, caption) harus sama.

## Prinsip

- Script lama tidak boleh rusak. Field baru selalu opsional dengan default yang aman.
- Setiap komponen/builder adegan menangani dua format (vertikal dan horizontal).
- Ragu soal selera visual: render 2 opsi sebagai still, tunjukkan ke user, biarkan user memilih.
