---
name: design-brief
description: "Buat design brief visual artikel/konten untuk didelegasikan ke designer (manusia), untuk brand apa pun. 3 mode: feature image, sub image, infografis. Output SELALU dua dokumen — brief internal yang komprehensif untuk requester, dan brief designer yang ringkas plus sketsa wireframe per aset. Gunakan skill ini SETIAP KALI user minta 'design brief', 'brief design', 'brief untuk designer', 'brief feature image', 'brief sub image', 'brief infografis', menyebut '/designbrief', atau bilang mau 'delegasiin design', 'kasih tugas ke designer', 'minta designer bikin visual artikel', 'bikin sketsa layout buat designer'. Skill ini punya flow wajib: pilih mode, checklist konteks, auto-fetch artikel & website untuk infer brand, checklist creative direction, render sketsa wireframe, compile ke dua .docx. Jangan skip checklist meski user sudah kasih sebagian info. PENTING: ini brief untuk MANUSIA — kalau user mau Claude yang generate gambar finalnya, pakai generate-feature-images / generate-sub-images / generate-infographic."
---

# Design Brief Generator

Menyusun design brief visual yang lengkap dan siap didelegasikan ke designer. Reusable lintas brand dan klien.

**Prinsip inti:** brief yang bagus bukan brief yang panjang, tapi brief yang menutup ruang tebak-tebakan. Setiap pertanyaan di sini ada karena kalau tidak ditanya di awal, jawabannya muncul sebagai revisi di akhir.

**Prinsip kedua, sama pentingnya:** panjang brief mengikuti jumlah aset. Satu feature image = satu halaman untuk designer. Jangan pernah menggemukkan brief designer demi terlihat lengkap — dokumen tebal justru tidak dibaca, dan itu kegagalan brief.

## Batas Skill

| Kebutuhan | Skill |
|---|---|
| Brief untuk designer (manusia) | Skill ini |
| Claude yang generate gambar finalnya | `generate-feature-images` / `generate-sub-images` / `generate-infographic` |
| Brief artikel untuk writer | `content-brief` |

---

## Output: Dua Dokumen, Selalu

Ini hal paling penting dari skill ini. Dua pembaca, dua kebutuhan, dua dokumen.

| | Brief Internal | Brief Designer |
|---|---|---|
| Pembaca | Requester (pemilik project) | Designer |
| Isi | Rasional, strategi, brand profile, asset map + alasan, arah riset referensi, catatan revisi | Yang perlu dikerjakan saja |
| Panjang | Sedetail perlunya | Sependek mungkin tanpa kehilangan kejelasan |
| Nada | Analitis, boleh berargumen | Instruksional, langsung |
| Sketsa | Ikut dilampirkan | Ikut, dan jadi inti dokumen |

Jangan menaruh rasional strategi di brief designer. Designer tidak butuh tahu kenapa artikel ini penting untuk SEO — dia butuh tahu apa yang digambar, seberapa besar, kapan dikumpulkan.

---

## Step 0 — Tentukan Mode

Satu brief = satu mode. Kalau user tidak menyebut mode, tanyakan; jangan asumsikan.

| Mode | Trigger | Cakupan |
|---|---|---|
| `feature` | "brief feature image" | 1 hero/thumbnail untuk 1 artikel |
| `sub` | "brief sub image" | Beberapa ilustrasi section dalam 1 artikel |
| `info` | "brief infografis" | Satu atau lebih visual berbasis data |

Kalau user butuh lebih dari satu jenis aset untuk artikel yang sama, jalankan mode satu per satu, tapi reuse jawaban Step 1–2. Jangan tanya ulang hal yang sudah dijawab.

---

## Step 1 — Checklist Konteks

Tanyakan dalam satu pesan terstruktur. Lewati yang sudah user sebut.

1. **URL artikel atau draft-nya** — link live, Google Docs, atau paste teks.
2. **Website tempat publish** — dari sini brand profile diturunkan (Step 2).
3. **Deliverable** — format file, butuh source file editable (Figma/AI/PSD) atau tidak.
4. **Tanggal penting** — brief date, first preview, final preview, posting date. Empat tanggal ini lebih berguna daripada satu "deadline", karena preview yang meleset adalah penyebab paling umum posting mundur.
5. **Jumlah putaran revisi + cara kasih feedback.**

Kalau user tidak tahu spesifikasi teknis, jangan paksa. Pakai default di `references/creative-direction.md` dan tandai `[default, boleh dikonfirmasi]`.

---

## Step 2 — Auto-Fetch & Infer Brand

Lakukan otomatis. Jangan minta user menyuapi hal yang bisa dibaca sendiri.

**2a. Baca artikelnya.** `web_fetch` ke URL artikel. Ambil judul, tesis utama, struktur heading, audience tersirat, data/angka. Kalau user paste teks, pakai itu.

**2b. Baca website publish-nya.** `web_fetch` ke homepage untuk menurunkan brand profile:

| Yang dicari | Cara |
|---|---|
| Primary & accent color | Inline style, CSS variable, warna di markup. Kalau tak terbaca, infer dari industri + positioning |
| Font | `@font-face` / link Google Fonts |
| Mood & industri | Copy homepage |
| Gaya visual existing | Deskripsi/alt image artikel lain |

**Ekstraksi warna dari HTML sering meleset.** Jangan pernah langsung dipakai — tampilkan tebakan dalam tabel dan minta konfirmasi:

> "Dari [website] aku baca brand-nya: primary `#XXXXXX`, accent `#XXXXXX`, mood [x], font [y]. Betul, atau ada hex resminya?"

Brand guideline dari user selalu menang atas hasil fetch.

**2c. Usulkan konsep visual.** Jangan tunggu user yang mikir — usulkan, lalu minta approval. Untuk mode `sub` dan `info`, bentuknya asset map:

| No | Section / Heading | Tipe Visual | Konsep Singkat | Prioritas |
|---|---|---|---|---|

Prioritas `Wajib` / `Nice to have` — supaya kalau waktu mepet designer tahu mana yang dikorbankan.

---

## Step 3 — Creative Direction

Bank pertanyaan lengkap di `references/creative-direction.md`. Baca sebelum menyusun pertanyaan. Tanyakan maksimal 5–7 sekali jalan — lebih dari itu user berhenti menjawab serius.

### Tiga pengunci (semua mode)
1. **"Setelah lihat visual ini, pembaca harus paham ___"** — satu kalimat. Tanpa ini hasilnya jadi dekorasi, bukan komunikasi. Kalau user tak bisa jawab, rumuskan dari isi artikel lalu minta konfirmasi.
2. **Referensi: 2–3 disuka + minimal 1 anti-referensi.** "Jangan kayak gini" jauh lebih informatif daripada "bikin yang bagus".
3. **Style lane** — pilih SATU: flat illustration / isometric / semi-3D / photo-composite / minimal geometric / line art. Campur-campur adalah penyebab paling umum brief gagal.

### Tambahan per mode
- **`feature`**: metafora terlarang, ada teks di gambar atau tidak, squint test (kebaca di ±200px?), varian OG/square.
- **`sub`**: relasi tiap section (proses / perbandingan / sebab-akibat / konsep tunggal / hierarki), konsistensi seri, label teks maks 3 kata.
- **`info`**: data sudah final atau belum (aturan keras — jangan mulai design kalau angka masih berubah), satu takeaway per visual, sumber data, format angka, orientasi, chart type.

Kalau user jawab "terserah", jangan biarkan kosong. Isi dengan rekomendasi Claude + tandai `[rekomendasi, bukan requirement]` supaya designer tahu ruang geraknya.

---

## Step 4 — Render Sketsa Wireframe

Ini yang membedakan brief ini dari brief teks biasa. Deskripsi verbal soal komposisi hampir selalu ditafsirkan berbeda; sketsa menutup celah itu dalam satu lirikan.

Buat satu sketsa per aset pakai `scripts/render_sketch.py`. Panduan gaya, pola spec, dan library line art ada di `references/sketch-wireframe.md` — baca sebelum menulis spec.

```bash
python3 scripts/render_sketch.py spec.json output.png
```

Aturan yang menentukan sketsa ini berguna atau tidak:

- **Low-fidelity, sengaja.** Hitam-putih, garis tipis, stick figure. Sketsa yang terlalu rapi bikin designer mengira itu desain final yang tinggal ditiru — dan kontribusi kreatifnya hilang.
- **Sketsa mengunci layout dan hierarki, bukan gaya visual.** Di mana headline, seberapa besar, apa yang jadi focal point, di mana area gambar.
- **Area foto/ilustrasi pakai placeholder berlabel deskriptif** — "Foto talent dan papa bergandengan tangan", bukan "gambar di sini".
- **Selalu sisipkan blok `note`** di bawah sketsa: sketsa ini layout, bukan gaya visual final.
- **Teks di sketsa harus persis sama dengan tabel Copy** (Step 5), sampai ke kapitalisasi. Kalau beda sedikit saja, designer tidak tahu mana yang benar dan akan memilih sendiri — persis masalah yang mau dihindari.
- Catatan untuk designer ditulis pakai blok `note` atau `label` (miring/abu), supaya jelas terbaca sebagai instruksi, bukan copy yang ikut digambar.

---

## Step 5 — Tulis dan Kunci Semua Copy

Designer tidak menulis copy. Tugasnya visual: warna, komposisi, tipografi, elemen grafis. Kalau brief membiarkan satu string pun kosong, designer akan mengarang — dan hasilnya masuk ke aset final tanpa lewat siapa pun yang berwenang atas pesan.

**Aturannya: setiap string yang muncul di visual ditulis di tabel Copy, apa adanya.** Termasuk yang terlihat sepele — justru bagian sepele yang paling sering diarang, karena terbaca sebagai pelengkap.

Yang wajib masuk tabel Copy:

| Kategori | Contoh |
|---|---|
| Teks utama | Judul, eyebrow, headline insight |
| Label | Nama panel, nama tingkat, nama kategori |
| Caption kecil | Keterangan di bawah label, penjelasan satu baris |
| Callout | Penunjuk, penegasan, anotasi |
| Atribusi | Baris sumber data, disclaimer |
| Logo | Muncul atau tidak, dan di mana |
| Varian | Copy alternatif untuk crop lain, kalau judulnya perlu lebih pendek |
| Teks lain | Tulis eksplisit "Tidak ada" — kekosongan yang disengaja harus terlihat disengaja |

Cara memeriksa: baca sketsa, catat setiap kata yang terlihat, cocokkan satu per satu dengan tabel Copy. Kata yang ada di sketsa tapi tidak ada di tabel adalah lubang.

Tulis juga aturan ini di brief designer sebagai section tersendiri:

> Semua teks sudah final. Pakai persis apa adanya — jangan ditulis ulang, dipersingkat, ditambah, atau diganti sinonimnya. Kalau ada yang tidak muat atau merusak komposisi, kabari dulu sebelum diubah; kemungkinan besar layout yang disesuaikan, bukan teksnya.

Kalau copy asli terpaksa diubah — dipotong karena terlalu panjang, dipecah jadi eyebrow dan judul — itu keputusan editorial, bukan teknis. Jangan diam-diam: catat di brief internal bagian "Catatan Revisi", dan sampaikan ke user sebagai keputusan yang perlu direview. Alasan pemotongan biasanya soal keterbacaan, sedangkan yang dipertaruhkan adalah pesan; dua hal itu tidak selalu sejalan, dan yang berhak memutuskan bukan Claude.

---

## Step 6 — Arah Riset Referensi

Menggantikan prompt AI generatif sebagai isi utama. Designer yang baik bekerja dari referensi, bukan dari output AI.

Untuk tiap aset, berikan:

| Komponen | Isi |
|---|---|
| Keyword riset | 4–6 frasa siap tempel ke Pinterest/Dribbble/Behance, dalam bahasa Inggris |
| Kanal | Platform mana yang paling relevan untuk gaya ini |
| Yang dicari | Satu kalimat: aspek apa yang harus diperhatikan dari referensi itu (komposisi? palet? garis?) |
| Yang dihindari | Klise spesifik untuk topik ini |

Prompt AI generatif tetap disediakan sebagai lampiran opsional — format di `references/ai-prompt-format.md`. Taruh di brief internal saja, bukan di brief designer, kecuali user minta sebaliknya. Alasannya: menaruh prompt AI di brief designer sering terbaca sebagai "pakai ini", padahal maksudnya eksplorasi.

---

## Step 7 — Compile Dua Dokumen

Pakai skill `docx` (baca `/mnt/skills/public/docx/SKILL.md`). Struktur kedua dokumen ada di `references/brief-structure.md`.

Penamaan:
- `brief-internal_[mode]_[slug]_[YYYY-MM-DD].docx`
- `brief-designer_[mode]_[slug]_[YYYY-MM-DD].docx`
- `sketsa_[slug]_[nomor].png`

Setelah jadi: render ke PDF, cek visualnya, simpan ke `/mnt/user-data/outputs/`, lalu `present_files` — dokumen designer duluan, karena itu yang paling sering dibuka.

---

## Prinsip Penulisan

- **Self-contained.** Designer harus bisa langsung kerja tanpa nanya balik.
- **Spesifik, bukan deskriptif.** Bukan "warna brand" tapi hex-nya. Bukan "tone profesional" tapi contoh referensinya.
- **Do & Don't berdampingan.** Paling cepat discan, jangan dilewat.
- **Copy dikunci, visual dibebaskan.** Brief mengunci setiap kata; brief tidak mengunci bagaimana kata itu ditampilkan.
- **Jangan dikte solusi visual.** Brief mengunci masalah, pesan, dan batasan — bukan tiap elemen. Brief yang terlalu preskriptif menghasilkan eksekutor, bukan partner.
- Selalu cantumkan brand + tanggal + mode di header, karena skill ini dipakai lintas brand.

## Referensi

- `references/creative-direction.md` — bank pertanyaan, style lane, klise terlarang, spek teknis default, tabel pemilihan chart.
- `references/sketch-wireframe.md` — gaya sketsa, struktur spec JSON, library line art siap pakai.
- `references/brief-structure.md` — struktur dua dokumen `.docx`, section per section.
- `references/ai-prompt-format.md` — keyword riset referensi + prompt AI opsional.
