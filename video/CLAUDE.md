# Video ACCESSTRADE · Reels + YouTube

Dibaca otomatis di setiap chat yang bekerja di folder `video/`. Versi modul: v1 (26 Nov 2026).
Aturan bersama kit Accesstrade (`../CLAUDE.md`: sapaan aku/kamu, table manner, house style, data internal) tetap berlaku. Di PC editor, folder ini berdiri sendiri tanpa `../`.

Modul ini membuat dua jenis video dari script JSON + rekaman suara: **Reels / TikTok / Shorts** (9:16) dan **YouTube** (16:9), lewat tiga jalur: **Remotion**, **After Effects**, atau **Motion Format**.

## Sesi (sub chat)

Satu chat = satu sesi. Mulai chat dengan perintah sesinya.

| Sesi | Perintah | Siapa / di mana | Folder milik sesi ini | Tugas |
|---|---|---|---|---|
| Scriptwriting | `/video-script` | Harist | `brief/`, `scripts/` (kecuali `00-contoh-*`), `history/video-script.md` | Ide/artikel → brief → script JSON + caption |
| Eksekusi Remotion | `/video-remotion` | Harist (Mac) atau editor | `rekaman/olah/`, `remotion/public/video/`, `remotion/public/musik/`, `remotion/public/sfx/`, `output/` (MP4, cover, subtitle), field `voCut` di script, `history/video-remotion.md` | Script + rekaman → video jadi |
| Eksekusi After Effects | `/video-ae` | Editor (PC Windows, AE 2027) | sama dengan Eksekusi Remotion + `ae/proyek/`, `ae/profil-ae.*`, `ae/cara-kerja-editor.md`, file `.aep` di `output/`, `history/video-ae.md` | Script + rekaman → project .aep dari nol → dipoles editor → render |
| Motion Format | `/motion-format` | **Hanya Mac Harist** | `motion-format/` | Klip motion graphic bergaya, dipakai sebagai adegan `klip` |
| Improvement | `/video-improvement` | Harist atau editor | `remotion/` (kecuali media di `public/`), `ae/jsx/`, `ae/build.mjs`, `ae/tools/`, `brand/`, `alur/`, `.claude/`, `CLAUDE.md`, `CHANGELOG.md`, script contoh `00-contoh-*`, `history/video-improvement.md` | Mesin Remotion, builder AE, brand, aturan modul |

- Setiap sesi **hanya mengubah folder miliknya**. Semua sesi boleh membaca semua folder.
- Butuh perubahan di folder sesi lain: **tambahkan catatan** di `kotak-masuk/untuk-script.md`, `untuk-eksekusi.md`, atau `untuk-improvement.md`. Sesi pemilik membaca kotak masuknya setiap mulai kerja.
- Ringkasan kerja ditambahkan di `history/<sesi>.md` di akhir pekerjaan.
- Chat dimulai tanpa perintah sesi: tanya dulu sesi mana, jangan langsung mengerjakan lintas folder.
- **Motion Format hanya dipakai kalau user menyebut "Motion Format" atau brief memilih `jalur: motion-format`.** Sesi lain tidak memakainya walaupun permintaannya menyebut "video".

## Alur

Lengkapnya di `alur/produksi.md` (5 tahap). Aturan brief: `alur/aturan-brief.md`. Video dari klip/footage: `alur/playbook-footage.md`.

```
brief/<format>-NN-slug.md           ← Scriptwriting (jalur, hook 5 sudut, cerita:poin 60:40)
scripts/reels|youtube/NN-slug.json  ← Scriptwriting
rekaman/reels|youtube/NN-....m4a    ← rekaman suara manusia, satu file utuh per video
   ↓ npm run vo (dari remotion/)
   ├─ jalur Remotion       → npm run render         → output/<format>/NN-slug.mp4
   ├─ jalur After Effects  → node ae/build.mjs      → output/<format>/NN-slug.aep → dipoles editor → render
   └─ jalur Motion Format  → klip MP4               → adegan klip di jalur lain
output/daftar-render.md             ← status semua video
```

## Urutan aturan kalau bertabrakan

1. Permintaan user di chat.
2. Aturan kit Accesstrade (`../CLAUDE.md`, `../docs/house-style-dan-eyd.md`, `../docs/tim-dan-gerbang-verifikasi.md`).
3. Brand video: `brand/brand-guidelines.md` dan `brand/tokens.json`.
4. File ini, `alur/`, dan skill sesi.
5. Skill resmi Remotion (`remotion/.claude/skills/`) dan skill Motion Format: hanya untuk teknik.

## Aturan tetap

- **Tidak ada upload, posting, atau publish.** Modul berhenti di file di `output/`. Upload dilakukan manusia.
- **Suara yang tayang = rekaman manusia.** Suara komputer (`npm run demo-vo`) dan suara AI (ElevenLabs) tidak dipakai untuk video tayang.
- Data campaign, komisi, dan angka wajib dari sumber terverifikasi. Belum pasti: tulis `[KONFIRMASI]` (video tidak boleh tayang). Tanpa janji penghasilan, tanpa framing menakut-nakuti.
- Label menu dan tombol dashboard ACCESSTRADE persis dari `../docs/peta-fitur-dashboard-2026-11-05.md`.
- Foto lewat `npm run foto`, klip lewat `npm run klip` (metadata dibuang). Data pribadi publisher (nama, email, rekening, saldo asli) tidak boleh terlihat: buramkan atau pakai akun demo.
- Musik dan efek suara hanya yang berlisensi; sumbernya dicatat.
- Menghapus file: hanya kalau diminta, dan pindahkan ke Trash/Recycle Bin.
- Remotion dikunci di **4.0.546**. After Effects: versi yang terpasang di PC editor (lihat `ae/profil-ae.md`). Jangan upgrade tanpa diminta.
- **Motion Format berlisensi pribadi milik Harist**: tidak boleh disalin, dikirim, atau dimasukkan ke zip untuk orang lain. Paket untuk editor dibuat dengan `node tools/bungkus-editor.mjs`, yang otomatis membuangnya.
- Lisensi Remotion: gratis untuk perorangan dan tim sampai 3 orang. Tim 4 orang atau lebih wajib Company License (lihat README).
