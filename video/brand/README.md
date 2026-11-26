# Folder brand

| File | Isi | Dibaca oleh |
|---|---|---|
| `brand-guidelines.md` | Identitas, gaya bahasa, klaim, visual, CTA (untuk manusia dan Claude) | semua sesi |
| `tokens.json` | Nilai visual yang dipakai mesin video | `remotion/sync.mjs` |
| `panduan-rekam-suara.md` | Cara merekam suara supaya bisa diproses otomatis | yang merekam suara |
| `../ae/profil-ae.md` | Font yang terpasang di PC editor (jalur After Effects memakai font sistem, bukan Google Fonts langsung) | sesi `/video-ae` |
| logo (`logo.png` / `logo.svg`) | Logo transparan, opsional | outro dan cover |

Setelah `tokens.json` diubah, jalankan `npm run studio` atau `npm run render` (keduanya menjalankan sync otomatis). Nilai yang salah format diabaikan dengan peringatan, lalu memakai nilai default kit.

## Isi tokens.json

Semua field opsional.

| Field | Contoh | Keterangan |
|---|---|---|
| `brand.name` / `brand.short` | `"Contoh Brand"` / `"Contoh"` | `short` tampil sebagai wordmark kalau belum ada logo |
| `brand.handle` / `brand.website` | `"@contohbrand"` | tampil di outro |
| `color.background` | `"#101828"` | latar gelap (latar utama) |
| `color.backgroundLight` | `"#F6F4EF"` | latar terang (daftar, banding) |
| `color.primary` | `"#2E5BFF"` | latar bab dan outro, badge nomor, kicker |
| `color.accent` / `color.accentText` | `"#FFC53D"` / `"#101828"` | sorotan `*kata*`, kata aktif di caption, angka besar; `accentText` = teks di atas warna accent |
| `color.text` / `color.textOnLight` | `"#FFFFFF"` / `"#101828"` | teks di latar gelap / latar terang |
| `color.alert` | `"#E5484D"` | cap [KONFIRMASI], tanda silang di banding |
| `color.textOnBrand` / `color.accentOnBrand` | `"#1A1A2E"` / `"#FFFFFF"` | teks dan sorotan di latar brand (bab, outro). Kosong = sama dengan `text` / `accent`. Wajib diisi kalau `accent` sama dengan `primary` |
| `font.display` / `font.body` | `{"family": "Poppins", "weights": ["700","800"]}` | nama persis di Google Fonts |
| `logo.file` / `logo.width` | `"logo.png"` / `360` | path relatif ke folder brand/; lebar di outro (px) |
| `caption.reels` / `caption.youtube` | `{"maxWords": 4, "style": "karaoke", "onHook": false}` | `karaoke` (kata aktif disorot) atau `subtitle` (kotak gelap). `onHook: false` = hook tanpa caption |
| `size.reels` / `size.youtube` | `{"hook": 118, "title": 86, "body": 50, "caption": 70, "label": 38, "big": 240}` | ukuran huruf dasar per format (px) |
| `motion.transition` | `"slide"` | transisi default: `slide`, `fade`, `wipe`, `cut` |
| `motion.transitionFrames` | `14` | lama transisi (30 frame = 1 detik) |
| `radius.card` | `32` | sudut kartu foto dan panel |
| `audio.voiceLufs` | `-14` | target loudness suara (standar media sosial) |
| `audio.musicVolume` / `audio.musicDuckDb` | `0.5` / `-18` | volume musik latar, dan seberapa turun saat ada suara |
| `rules.maxHookWords` / `rules.maxOnScreenWords` | `7` / `12` | batas kata teks layar (peringatan) |
| `rules.noEmoji` | `true` | peringatan kalau ada emoji di teks layar |
| `rules.bannedWords` | `[{"pattern": "\\bAnda\\b", "message": "pakai kamu"}]` | pola regex (atau kata biasa) yang diperingatkan saat cek/render |
