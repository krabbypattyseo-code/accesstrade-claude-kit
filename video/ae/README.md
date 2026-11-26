# Jalur After Effects

Jalur kedua selain Remotion. Script JSON + rekaman suara yang sama diubah jadi **proyek After Effects (.aep) yang bisa diedit**, dibangun dari nol oleh ExtendScript: comp, layer, keyframe, warna dan font brand, caption, suara, marker. Editor merapikan .aep-nya, lalu render lewat `aerender`.

Target: **Adobe After Effects 2027 di Windows** (PC editor). AE tidak terpasang di Mac tempat jalur ini dibuat, jadi semuanya baru diuji dengan AE tiruan (`tools/mock-ae.mjs`). Baca bagian [Belum dites di After Effects asli](#belum-dites-di-after-effects-asli) sebelum run pertama.

```
scripts/reels/NN-slug.json ──▶ node ae/build.mjs ──▶ ae/proyek/reels-NN-slug/build.jsx
                                   │                        │  (#include aekit.jsx + DATA)
                                   │                        ▼
                                   │                 After Effects (AfterFX.exe -r)
                                   │                        │
                                   ▼                        ▼
                         ae/proyek/.../hasil.json   output/reels/NN-slug.aep
                                                            │  --render
                                                            ▼
                                                   output/reels/NN-slug-ae.mp4 (aerender)
```

## Isi folder

| File | Isi |
|---|---|
| `build.mjs` | Perintah utama (Node, tanpa paket tambahan). Baca script, periksa, susun DATA, tulis `build.jsx`, buka AE, tunggu hasil, render. |
| `jsx/aekit.jsx` | Pustaka ExtendScript (ES3). `AEKIT.build(DATA)` membangun seluruh proyek. |
| `jsx/inventaris.jsx` | Dijalankan sekali di PC editor: versi AE, efek, font, template render, izin tulis file, uji fitur yang dipakai aekit. |
| `lib/data.mjs` | Menyusun DATA dari hasil `prepareScript` (lib Remotion): path media absolut, ukuran kanvas, peta font, path output. Dipakai `build.mjs` dan mock. |
| `tools/mock-ae.mjs` | Uji tanpa AE: model objek AE tiruan di `node:vm`, plus lint ES3. Opsi `--svg <folder>` menggambar letak akhir tiap adegan. |
| `contoh-data/` | Contoh DATA hasil `prepareScript` (Reels, YouTube) + brand contoh, dipakai mock. |
| `profil-ae.json`, `profil-ae.md` | Dibuat `--inventaris` di PC editor. Dibaca `build.mjs`. |
| `font-manual.json` | Opsional, diisi manusia kalau nama font di PC berbeda (lihat [Font](#font)). |
| `proyek/` | Dibuat otomatis (`build.jsx`, `hasil.json`, `frames/`). Diabaikan git. |

Logika script tidak diduplikasi: `readScript`, `prepareScript`, `checkScript`, `outputBase`, `videoName`, `buildBrand` diimpor dari `video/remotion/lib/`. Angka kanvas dan zona aman (`SPEC` di `lib/data.mjs`) menyalin `FORMATS` di `remotion/src/theme.ts`: kalau yang satu diubah, ubah juga yang lain.

## Perintah

Semua dari folder `video/`:

```bash
node ae/build.mjs --inventaris                              # sekali per PC / per update AE
node ae/build.mjs scripts/reels/01-slug.json                 # bangun output/reels/01-slug.aep
node ae/build.mjs scripts/reels/01-slug.json --render        # bangun + render output/reels/01-slug-ae.mp4
node ae/build.mjs scripts/youtube/01-slug.json --frames      # + PNG tengah tiap adegan di ae/proyek/.../frames/
node ae/build.mjs scripts/reels/01-slug.json --no-run        # hanya tulis build.jsx (jalankan manual di AE)
node ae/tools/mock-ae.mjs                                    # uji tanpa AE, harus keluar 0
```

| Flag | Fungsi |
|---|---|
| `--no-run` | Tidak membuka AE. Jalankan `build.jsx` sendiri: AE > File > Scripts > Run Script File. |
| `--render` | Setelah proyek jadi, render dengan `aerender` (template H.264 dari profil). |
| `--draft` | Render cepat dengan template "Draft Settings", file `-ae-draft.mp4`. |
| `--frames` | Simpan PNG di tengah tiap adegan (kalau `saveFrameToPng` ada). |
| `--timpa` | Boleh menimpa .aep yang sudah ada. Tanpa flag ini, proyek baru disimpan sebagai `-v2`, `-v3`, ... |
| `--om "<nama>"` | Template Output Module untuk render (mengalahkan profil). |
| `--rs "<nama>"` | Template Render Settings (default "Best Settings"; AE berbahasa lain memakai nama lain). |
| `--timeout <dtk>` | Batas menunggu AE, default 600. |

Urutan kerja `build.mjs`: `readScript` → `prepareScript` (timing dari rekaman, `onWord` → `at`, waktu kata) → `checkScript` (error = berhenti, peringatan dicetak) → `buildBrand` → baca `profil-ae.json` → susun DATA → tulis `ae/proyek/<format>-<NN>-<slug>/build.jsx` → buka AE → tunggu `hasil.json` dengan `runId` yang sama → laporan → (opsional) render.

Program dipanggil tanpa shell, dengan daftar argumen, jadi path berspasi aman.

## Persiapan di PC editor (Windows)

1. **Node 20+** dan kit ini. Kalau ada rekaman suara di `remotion/public/video/<kunci>/vo/`, `prepareScript` membaca durasinya lewat Remotion: jalankan `npm install` di `remotion/` dulu.
2. **After Effects 2027**. Lokasi biasa: `C:\Program Files\Adobe\Adobe After Effects 2027\Support Files\AfterFX.exe` dan `aerender.exe` di folder yang sama. `build.mjs` mencari AE terbaru di `C:\Program Files\Adobe\Adobe After Effects *` (versi Beta dipakai terakhir), atau memakai path dari `profil-ae.json`.
3. **Izinkan skrip menulis file**: Edit > Preferences > Scripting & Expressions > centang *Allow Scripts to Write Files and Access Network*. Tanpa ini AE tidak bisa menulis `hasil.json` / `profil-ae.json` (aekit menguji tulis di awal dan memberi alert).
4. **Font brand** terpasang di Windows (Google Fonts: Poppins, Inter, dst. sesuai `brand/tokens.json`), lalu jalankan `--inventaris` supaya nama PostScript-nya tercatat.
5. **Template Output Module H.264**. AE 2023 ke atas biasanya punya "H.264 - Match Render Settings - 15 Mbps". Kalau tidak ada: Edit > Templates > Output Module > New, format H.264, simpan dengan nama yang mengandung "H.264", lalu `--inventaris` lagi. `build.mjs --render` tidak menebak nama template: tanpa template yang diketahui, render dibatalkan dengan penjelasan.

macOS (cadangan, untuk uji): AE dibuka lewat `osascript` (`tell application "Adobe After Effects 2027" to DoScriptFile "<path>"`), aerender di `/Applications/Adobe After Effects 2027/aerender`.

## Font

aekit memakai nama **PostScript** font untuk enam peran:

| Peran | Dipakai untuk |
|---|---|
| `display800` | judul, hook, angka besar, nomor bab, caption karaoke |
| `display700` | teks kutipan |
| `body800` | label panel banding, cap [KONFIRMASI] |
| `body700` | kicker, pil, teks panel, nama di kutipan |
| `body600` | isi daftar, caption subtitle |
| `body500` | sub judul, sumber, keterangan |

Urutan sumber nama: `ae/font-manual.json` → daftar font di `profil-ae.json` (family + style) → tebakan gaya Google Fonts (`Poppins-ExtraBold`, `Inter-SemiBold`). Tebakan bisa salah: misalnya Inter statis versi baru bernama `Inter18pt-SemiBold`, dan Inter versi variable punya nama lain lagi. Kalau begitu isi `ae/font-manual.json`:

```json
{"Inter 600": "Inter18pt-SemiBold", "Poppins 800": "Poppins-ExtraBold"}
```

Kunci = `<family> <ketebalan CSS>`. Font yang tidak terpasang tetap dipakai AE sebagai font pengganti, dan `hasil.json` mencatat peringatannya.

## Proyek yang dihasilkan

- **Proyek baru** lewat `app.newProject()`. Kalau proyek yang sedang terbuka belum disimpan, AE sendiri yang bertanya. Dibatalkan = build berhenti, proyek lama tidak disentuh.
- **Folder**: `01 Comp` (comp utama), `02 Adegan` (precomp adegan + kartu foto), `03 Suara` (rekaman, sfx, musik), `04 Foto`, `05 Klip`.
- **Comp utama** `REELS 01 slug` / `YOUTUBE 01 slug`, 1080x1920 / 1920x1080, 30 fps, durasi = akhir adegan terakhir.
- **Satu precomp per adegan** `S01 hook`, `S02 poin`, ..., diletakkan di `scene.start`. Adegan sebelum transisi slide/fade diperpanjang 14 frame (`motion.transitionFrames`) supaya adegan baru masuk di atasnya.
- **Transisi**: slide (Reels dari bawah, YouTube dari kanan) dan fade = keyframe di layer precomp; wipe = shape layer `Wipe Snn` (panel primary + garis accent) di comp utama; adegan pertama selalu cut.
- **Easing**: kurva cubic-bezier Remotion diubah jadi `KeyframeEase` (kecepatan + pengaruh). Pegas `Rise` dan `Pop` didekati dengan keyframe; kata per kata (`PopWords`) memakai rumus pegas yang sama persis di Expression Selector.
- **Caption** di comp utama, satu layer teks per halaman (`Caption 001`, ...) dengan in/out point. Aturan halaman, nyala/mati per adegan (mati di outro, di adegan yang teks layarnya sama dengan suara, di hook kalau `caption.<format>.onHook` false, `props.caption` "on"/"off" memaksa) sama dengan `Caption.tsx` / `Video.tsx`.
  - Reels (karaoke, maks 4 kata): teks tebal bergaris tepi; kata aktif berwarna accent lewat Text Animator "Kata aktif" + Expression Selector berbasis kata. Waktu tiap kata ada di expression (`var s=[...]` mulai, `var e=[...]` selesai, detik comp utama), bisa diedit.
  - YouTube (subtitle, maks 8 kata): teks putih di kotak hitam 62%; kotak `Caption 001 kotak` menempel ke teks dan ukurannya ikut teks (`sourceRectAtTime`).
- **Suara**: tiap rekaman di `clip.start`. SFX di `scene.start + at`, volume → Audio Levels (dB = 20·log10(volume)). Musik diulang di precomp `Musik`, turun `audio.musicDuckDb` dB selama ada suara (jeda < 1,5 dtk dianggap masih bicara, landai 8 frame).
- **Marker** di comp utama untuk tiap adegan (dengan durasi). YouTube: marker chapter (`MarkerValue.chapter`) untuk tiap bab + "Pembuka" di 0:00 kalau bab pertama tidak di awal.
- **CATATAN**: layer teks panduan (guide layer, nonaktif, tidak ikut render) berisi judul, nomor, format, durasi, status demo/[KONFIRMASI].
- **Simpan** ke `output/<format>/NN-slug.aep`. File yang sudah ada tidak ditimpa (kecuali `--timpa`).
- **hasil.json**: `status` (ok/error), `aeVersion`, `project`, `mainComp`, `duration`, `scenes[]` (status per adegan), `captions`, `audio`, `markers`, `frames`, `highlight` (cara sorotan dipasang), `fonts`, `features` (API yang terdeteksi), `warnings[]`, `errors[]`, `seconds`.
- **Kalau satu adegan gagal**: precomp-nya diberi teks merah `GAGAL: <tipe> <pesan>`, adegan lain tetap dibangun, `status` jadi error.

Warna dan teks brand: semua dari `brand/tokens.json` lewat `buildBrand()`, termasuk `textOnBrand` / `accentOnBrand` untuk latar brand (teks = textOnBrand, sorotan dan nomor bab = accentOnBrand, kicker dan pil handle = latar textOnBrand dengan teks primary, titik bab aktif accentOnBrand / nonaktif textOnBrand 35%).

### Jadi apa tiap adegan di AE

| Tipe | Latar default | Di AE |
|---|---|---|
| `hook` | dark | Kicker (pil) + judul besar (kata muncul satu per satu) + garis accent memanjang + sub. Reels rata tengah, YouTube rata kiri 80% lebar. |
| `bab` | brand | Nomor besar `01` (pop) + kicker "Bagian N" + judul + titik urutan bab. Reels bertumpuk di tengah; YouTube nomor di kiri, garis pembatas, judul di kanan. |
| `poin` | dark | Garis accent vertikal + kicker + pernyataan + sub. |
| `daftar` | light | Judul + kartu per poin (lencana nomor atau ikon garis). Tiap kartu masuk dari kanan pada `item.at` (dari `onWord`) atau dibagi rata. YouTube: judul kiri 36%, daftar kanan. |
| `angka` | dark | Angka besar menghitung naik 1 dtk lewat expression Source Text (format Indonesia: titik ribuan, koma desimal, prefix/suffix dipertahankan, mis. `Rp1.250.000`, `2,5x`). Nilai bukan angka tampil apa adanya. Label + sub + sumber. |
| `kutipan` | dark | Tanda kutip besar + kutipan + garis accent + nama dan keterangan. |
| `foto` | dark | Kartu sudut bulat = precomp `Snn foto kartu foto` dengan mask; foto diskala *cover* + `focus`, zoom 100→108% sepanjang adegan, beberapa foto berganti pada `at` dengan crossfade 8 frame, label pil accent di kiri bawah. |
| `banding` | light | Dua panel (Reels atas-bawah, YouTube berdampingan). Panel kanan masuk pada `revealAt` (dari `revealOnWord`) atau 40% durasi. Lencana centang (accent) / silang (alert) sesuai `verdict`; panel kanan bergaris accent kalau verdict kanan. Foto opsional di atas panel. |
| `outro` | brand | Logo (`brand.logo.file`) atau nama brand + ajakan + sub + pil handle/website. YouTube: teks di kiri, kanan ±55% kosong untuk end screen; layer panduan `PANDUAN END SCREEN` (guide layer, tidak dirender). |
| `klip` | (footage) | Video layar penuh (*cover*, `focus`), mulai dari detik `props.start` di file sumber (`startTime` negatif), tanpa suara kecuali `audio: true`. Kalau ada `onScreen`/`kicker`: gradasi gelap dari atas (78% → 0 di 38% tinggi Reels / 45% YouTube, lewat mask feather) + judul kiri atas. `text` = pil accent kiri bawah area konten. |

Tipe yang tidak dikenal dibangun sebagai `poin` (dengan peringatan), sama dengan Remotion. Adegan dengan `[KONFIRMASI]` diberi cap merah miring di kanan atas.

### Mengedit di AE

- Teks: edit langsung. Pil (kicker, handle, label) ikut melebar karena ukurannya expression dari teks induknya.
- Sorotan `*kata*`: AE 2024.3+ memakai `characterRange` (warna per karakter, bisa diedit di panel Character). AE lama memakai Text Animator "Sorotan" dengan expression berisi indeks karakter.
- Kata muncul: animator "Muncul geser" dan "Muncul pudar". Angka jeda/stagger ada di awal expression (`time-(0.133+(textIndex-1)*0.1)`).
- Hitung naik: expression di Source Text layer `Angka`. Hapus expression untuk teks statis.
- Kartu, panel, poin daftar: layer teks/ikon adalah anak (parent) dari layer kartu; geser kartu, isinya ikut. Opasitas anak mengikuti induk lewat expression.

## Pengujian tanpa AE

```bash
node ae/tools/mock-ae.mjs                       # semua uji, keluar 0 kalau lulus
node ae/tools/mock-ae.mjs --verbose             # + peringatan AE tiap uji
node ae/tools/mock-ae.mjs --svg /tmp/pratinjau  # + SVG letak akhir tiap adegan (kotak teks perkiraan)
```

Yang diuji (dua contoh DATA, data campuran semua tipe + sfx + musik + transisi + [KONFIRMASI], mode "AE lama" tanpa `addBoxText`/`sourceRectAtTime`/`characterRange`/`markerProperty`/`app.fonts` dengan media hilang, lewat `build.jsx` asli, AE yang menolak font, script asli `scripts/*/00-contoh-*.json` kalau Remotion terpasang): tidak ada exception, ukuran dan durasi comp, satu precomp per adegan, semua adegan ok tanpa `GAGAL`, folder proyek, posisi tiap teks di dalam kanvas, caption tidak tumpang tindih dan tidak muncul di adegan yang caption-nya mati, jumlah suara/sfx/musik, marker dan chapter, layer CATATAN, `hasil.json` valid, proyek tidak menimpa .aep lama, batal `newProject`, semua expression bisa di-parse dan dievaluasi (hitung naik berakhir di nilai yang benar, karaoke menyalakan kata yang tepat), inventaris (dua mode), dan lint ES3 (arrow, let/const, template literal, `.map/.forEach/.filter/.indexOf` pada array, `JSON`, `Object.keys`, kata cadangan ES3 sebagai nama properti, karakter non-ASCII, koma di akhir).

Mock-nya ketat: referensi properti lama setelah `addProperty`/`remove` dianggap error (AE asli bisa membuat referensi seperti itu "invalid"), `setValue` pada properti berkeyframe error, jumlah dimensi nilai dicek. Tapi mock **tidak** membuktikan perilaku AE asli: ukuran teks, nama matchName, dan perilaku API di bawah ini tetap asumsi.

## Belum dites di After Effects asli

Semua yang ada di bawah ini ditulis dari dokumentasi dan pengalaman, **belum dijalankan di AE**. Run pertama di PC editor adalah ujinya. `inventaris.jsx` sudah menguji sebagian (bagian `kitProbe` di `profil-ae.md`).

**Menjalankan dan menulis file**
- `AfterFX.exe -r <build.jsx>` menjalankan skrip di AE yang sudah terbuka, atau membuka AE lalu menjalankannya. macOS: `osascript ... DoScriptFile`.
- `#include "<path absolut dengan />"` di `build.jsx` (UTF-8 dengan BOM) terbaca, termasuk path berspasi.
- Izin tulis file: kunci preferensi `Pref_SCRIPTING_FILE_NETWORK_SECURITY` di "Main Pref Section v2" / "Main Pref Section" (hanya dicatat). Penentu sebenarnya: uji tulis `hasil.json` di awal build.
- `File.write` dengan `encoding = "UTF-8"` (isi ASCII saja, semua karakter lain di-escape).
- `app.newProject()` bertanya simpan dan mengembalikan `null` kalau dibatalkan. `app.project.save(File)`.

**Teks**
- `LayerCollection.addBoxText([w, h], teks)`; tinggi kotak dibuat 3x perkiraan supaya teks tidak terpotong.
- `Layer.sourceRectAtTime(0, false)` pada teks kotak mengembalikan batas huruf, bukan batas kotak (kalau sama dengan kotak, aekit beralih ke perkiraan dan memberi peringatan). Semua tata letak bergantung pada ini.
- `TextDocument`: `font` (nama PostScript), `fontSize`, `applyFill`/`fillColor`, `applyStroke`/`strokeColor`/`strokeWidth`/`strokeOverFill`, `justification`, `tracking`, `leading` + `autoLeading`, `resetCharStyle()`, `resetParagraphStyle()`, `boxTextPos` (cadangan saja). Perilaku kalau font belum terpasang (diterima sebagai font hilang, atau ditolak: aekit mencoba lagi tanpa font).
- `TextDocument.characterRange(awal, akhir)` dengan akhir eksklusif, `CharacterRange.fillColor`, lalu `setValue(td)` supaya berlaku.
- `app.fonts.getFontsByPostScriptName()` dan `app.fonts.allFonts` (AE 24+).
- Text Animator: `ADBE Text Animators` → `ADBE Text Animator` → `ADBE Text Animator Properties` (`ADBE Text Fill Color`, `ADBE Text Position 3D`, `ADBE Text Opacity`) dan `ADBE Text Selectors` → `ADBE Text Expressible Selector` dengan `ADBE Text Range Type2` (Based On: 1 = karakter, 3 = kata) dan `ADBE Text Expressible Amount`. AE tidak menambah Range Selector bawaan lewat skrip (kalau menambah, aekit menghapusnya).
- Expression selector: `selectorValue * angka` berjalan di mesin JavaScript dan Legacy; "kata" = dipisah spasi (`pindah-pindah` satu kata), sama dengan pemecahan caption.
- Expression Source Text yang mengembalikan string tetap memakai gaya teks (hitung naik).

**Bentuk, efek, mask, parenting**
- matchName shape: `ADBE Root Vectors Group`, `ADBE Vector Group`, `ADBE Vectors Group`, `ADBE Vector Shape - Rect/Ellipse/Group`, `ADBE Vector Graphic - Fill/Stroke`, nilai Line Cap/Join 2 = bulat, warna sebagai `[r, g, b, 1]`.
- Efek Gradient Ramp `ADBE Ramp` dengan `ADBE Ramp-0001..0005`, Ramp Shape 2 = radial (cahaya sudut latar).
- Mask `ADBE Mask Parade` / `ADBE Mask Atom` / `ADBE Mask Shape` / `ADBE Mask Feather` `[x, y]` (feather vertikal saja untuk gradasi klip).
- `layer.parent = induk` mengompensasi transform (layer tidak melompat), dan posisi anak `[0, 0]` = titik asal ruang layer induk (pil dan kotak subtitle).
- Expression opasitas berantai: `thisLayer.hasParent`, `parent.transform.opacity`; ukuran pil: `thisLayer.parent.sourceRectAtTime(time, false)`.
- Posisi diisi `[x, y]` di layer 2D; skala `[x, y]` dilengkapi z dari nilai sekarang.

**Waktu, suara, marker, render**
- `KeyframeEase(speed, influence)` dari kurva bezier: jumlah ease = 1 untuk properti 1D/spasial, 3 untuk Scale; kecepatan posisi dalam px/dtk sepanjang lintasan.
- `Layer.startTime` negatif untuk `props.start` klip; `audioEnabled = false` untuk membisukan klip.
- Audio Levels `ADBE Audio Group` / `ADBE Audio Levels` `[dB, dB]`; layer precomp `Musik` dengan `enabled = false` tetap bersuara.
- `CompItem.markerProperty` (AE 14+), `MarkerValue.chapter`, `MarkerValue.duration`. Marker di waktu yang sama digabung (satu waktu hanya satu marker).
- `CompItem.saveFrameToPng(time, file)` (tidak terdokumentasi resmi, bisa berjalan asinkron: PNG mungkin muncul setelah `hasil.json`).
- `Layer.guideLayer`, `Layer.enabled`, `CompItem.openInViewer()`.
- `aerender -project -comp -output -OMtemplate -RStemplate` saat AE GUI masih terbuka; nama template "Best Settings" / "Draft Settings" (AE berbahasa lain: pakai `--rs`).
- Kecepatan render dengan puluhan layer caption ber-expression belum diukur.

## Beda dengan hasil Remotion

- Sorotan `*kata*` di latar terang: Remotion memakai stabilo accent di belakang kata; AE memakai teks warna primary.
- Kata aktif karaoke: Remotion = kotak accent dengan teks accentText; AE = teks warna accent (Text Animator tidak bisa membuat kotak per kata).
- Bayangan (kartu, teks caption) tidak dibuat.
- Teks "muted" di latar brand memakai `textOnBrand` (Remotion memakai putih 78%), supaya terbaca dengan token warna latar brand.
- Pegas `Rise`/`Pop` didekati keyframe bezier, bukan simulasi pegas.
- Ukuran huruf tetap dipilih dengan `fitSize` yang sama; pembungkusan baris dikerjakan AE, jadi jumlah baris bisa sedikit berbeda dari browser.

## Checklist run pertama di PC editor

1. Pasang font brand, nyalakan *Allow Scripts to Write Files and Access Network*, `npm install` di `remotion/` kalau ada rekaman.
2. `node ae/build.mjs --inventaris` → baca `ae/profil-ae.md`: versi AE, izin tulis "nyala", template H.264 ada, font brand terpasang, `kitProbe` (addBoxText, characterRange, expressionSelector tanpa error).
3. `node ae/tools/mock-ae.mjs` → harus `0 gagal` (sudah lulus di Mac; ulangi kalau aekit.jsx diubah).
4. `node ae/build.mjs scripts/reels/00-contoh-reels.json` dan `node ae/build.mjs scripts/youtube/00-contoh-youtube.json` → baca laporan dan peringatan AE.
5. Buka .aep di `output/reels/` dan `output/youtube/`, periksa: letak teks di zona aman, sorotan kata, kata muncul satu per satu, hitung naik, karaoke/subtitle, transisi slide/fade/wipe, kartu foto dan klip, suara dan musik, marker/chapter, layer CATATAN. Catat yang meleset ke `kotak-masuk/` atau langsung perbaiki aekit.jsx (lalu jalankan mock lagi).
6. `node ae/build.mjs scripts/reels/00-contoh-reels.json --render` → `output/reels/00-contoh-reels-ae.mp4`, bandingkan dengan hasil Remotion.
