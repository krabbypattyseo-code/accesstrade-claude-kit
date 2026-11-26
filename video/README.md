# Modul video ACCESSTRADE · Reels + YouTube

Membuat video dari **script + rekaman suara**, dijalankan lewat Claude Code. Dua format dengan script terpisah:

- **Reels / TikTok / Shorts**: 1080×1920, 20-45 detik, caption karaoke, cover.
- **YouTube**: 1920×1080, panjang bebas, bab (chapter), subtitle `.srt`, thumbnail, area end screen.

Tiga jalur pembuatan visual, script-nya sama:

| Jalur | Di mana | Hasil |
|---|---|---|
| **Remotion** | Mac Harist atau PC editor | MP4 langsung, otomatis |
| **After Effects** | PC editor (Windows, AE 2027) | Project .aep dibangun dari nol oleh script, lalu dipoles editor |
| **Motion Format** | Hanya Mac Harist (lisensi pribadi) | Klip motion graphic bergaya, dipasang sebagai adegan klip |

Aturan kerja untuk Claude: `CLAUDE.md`. Alur produksi: `alur/produksi.md`.

## Isi folder

| Folder / file | Isi |
|---|---|
| `CLAUDE.md` | Aturan modul: sesi, folder milik tiap sesi, aturan tetap |
| `alur/` | Alur produksi 5 tahap, aturan brief, playbook video dari footage |
| `brand/` | Brand guideline video ACCESSTRADE, token visual, panduan rekam suara |
| `brief/` | Brief video (dari sesi Scriptwriting) |
| `scripts/reels/`, `scripts/youtube/` | Script video (JSON) + caption. `SKEMA.md` = format lengkap |
| `rekaman/reels/`, `rekaman/youtube/` | Taruh rekaman suara di sini |
| `output/` | Hasil: video, cover, thumbnail, subtitle, chapter, project .aep, `daftar-render.md` |
| `remotion/` | Mesin Remotion (4.0.546) + alat suara, foto, klip, musik, efek suara |
| `ae/` | Jalur After Effects: builder ExtendScript, profil AE, project yang dibangun |
| `motion-format/` | Proyek Motion Format (hanya di Mac Harist) |
| `tools/bungkus-editor.mjs` | Membuat zip untuk PC editor (tanpa Motion Format) |
| `.claude/skills/` | Skill sesi: video-script, video-remotion, video-ae, video-improvement (+ motion-format di Mac Harist) |
| `kotak-masuk/`, `history/`, `CHANGELOG.md` | Catatan antar sesi, riwayat kerja, perubahan mesin |

## Setup di Mac Harist (sekali)

Dari folder `video/remotion`:

```bash
npm install
```

```bash
npm run setup:skills
```

```bash
npm run setup:python
```

Tes cepat:

```bash
npm run demo-vo -- ../scripts/reels/00-contoh-reels.json && npm run render -- ../scripts/reels/00-contoh-reels.json --draft
```

## Setup di PC editor (Windows, sekali)

1. Harist membuat paket dari folder `video/`: `node tools/bungkus-editor.mjs`, lalu mengirim zip dari `video/_paket/`.
2. Di PC editor, pasang lewat PowerShell (setiap baris satu perintah):

```bash
winget install OpenJS.NodeJS.LTS
```

```bash
winget install Python.Python.3.12
```

```bash
winget install Gyan.FFmpeg
```

   ffmpeg lengkap dibutuhkan untuk rekaman iPhone mode Lossless dan untuk limiter suara. Tutup lalu buka lagi PowerShell setelah memasang.
3. Ekstrak zip, misalnya ke `D:\Kerja\video`. Dari folder `video\remotion`:

```bash
npm install
```

```bash
npm run setup:skills
```

```bash
npm run setup:python
```

4. Buka aplikasi Claude, tab Code, pilih folder `video`. Untuk mengecek dan mempelajari After Effects lewat layar, nyalakan kendali komputer (computer use) di aplikasi Claude kalau tersedia di PC itu.
5. Chat pertama:

> /video-ae Kenalan dulu dengan After Effects di PC ini.

   Claude mendata AE (versi, efek, plugin, font, template render), menanyakan cara kerja editor, membedah 1-2 project contoh, lalu menguji builder dengan video contoh.

## Kerja sehari-hari

Satu chat = satu sesi. Contoh kalimat pembuka:

| Sesi | Kalimat pembuka |
|---|---|
| Scriptwriting | `/video-script` Bikin brief + script Reels 01 dari artikel "Cara Daftar TikTok Affiliate". Jalur Remotion. |
| Scriptwriting | `/video-script` Script YouTube 01, 8 menit, tutorial menu Report di dashboard. Jalur After Effects. |
| Eksekusi Remotion | `/video-remotion` Rekaman Reels 01 sudah masuk, proses dan render draft. |
| Eksekusi After Effects | `/video-ae` Rekaman YouTube 01 sudah masuk, bangun project AE-nya. |
| Motion Format (Mac Harist) | `/motion-format` Klip pembuka 6 detik gaya isometrik untuk Reels 03, warna brand ACCESSTRADE. |
| Improvement | `/video-improvement` Cek kotak masuk dan kerjakan yang ada. |

## Perintah

Dari folder `remotion/`:

| Perintah | Fungsi |
|---|---|
| `npm run studio` | Buka Remotion Studio di browser |
| `npm run cek -- <script>` | Periksa script tanpa render (tanpa argumen: semua script) |
| `npm run foto -- <script> <file> <nama>` | Foto/screenshot ke folder video, metadata dibuang. `--blur x,y,w,h` untuk data pribadi |
| `npm run klip -- <script> <file> <nama>` | Klip video ke folder video, metadata dibuang, HEVC → H.264. `--mulai` / `--durasi` |
| `npm run musik -- <file> <nama>` | Musik latar (loudness disamakan) |
| `npm run sfx -- <file> <nama>` | Efek suara |
| `npm run vo -- <script>` | Proses rekaman suara → potongan per adegan + laporan |
| `npm run demo-vo -- <script>` | Suara komputer sementara, hanya cek timing |
| `npm run render -- <script>` | Render final + cover (YouTube: + subtitle + chapter). `--draft`, `--hq`, `--cover-only` |

Dari folder `video/` (jalur After Effects, di PC editor):

| Perintah | Fungsi |
|---|---|
| `node ae/build.mjs --inventaris` | Data AE di PC ini → `ae/profil-ae.md` |
| `node ae/build.mjs <script> --frames` | Bangun project .aep dari script + frame cek |
| `node ae/build.mjs <script> --render` | Render .aep lewat aerender |
| `node ae/tools/mock-ae.mjs` | Tes builder tanpa After Effects |

## Lisensi

- **Remotion** bukan open source: gratis untuk perorangan dan organisasi sampai 3 orang; organisasi 4 orang atau lebih butuh Company License (±$25 per bulan per orang yang membuat video). Detail: [remotion.dev/docs/license/faq](https://www.remotion.dev/docs/license/faq). ACCESSTRADE Indonesia kemungkinan lebih dari 3 orang: **pastikan ke atasan sebelum dipakai untuk produksi rutin.**
- **Motion Format**: lisensi pembeli milik Harist. Hanya boleh di komputer Harist, tidak boleh dibagikan (termasuk versi yang diubah). Tidak ikut di paket editor.
- **Skill resmi Remotion**: dipasang dari repositori `remotion-dev/skills` saat setup.
- **After Effects**: lisensi Adobe milik PC editor.
- Musik, efek suara, foto, klip: milik sendiri atau berlisensi. Catat sumbernya.

## Kalau ada masalah

| Gejala | Solusi |
|---|---|
| Render gagal "Timed out ... connect to the browser" | Chrome lambat menyala (sering dari SSD eksternal). Render otomatis dicoba sekali lagi; kalau masih gagal, jalankan ulang |
| `Whisper belum terpasang` | `npm run setup:python` |
| Rekaman tidak bisa dibaca (Windows) | Rekaman iPhone mode Lossless: pasang ffmpeg lengkap (`winget install Gyan.FFmpeg`), atau rekam dengan mode Compressed |
| `node ae/build.mjs` tidak menemukan After Effects | Lihat `ae/README.md`; isi lokasi `AfterFX.exe` di `ae/profil-ae.json` |
| Script AE gagal menulis file | AE: Edit > Preferences > Scripting & Expressions > centang "Allow Scripts to Write Files and Access Network" |
| Font salah di AE | Font brand harus terpasang di Windows (unduh dari Google Fonts, klik kanan > Install for all users) |
