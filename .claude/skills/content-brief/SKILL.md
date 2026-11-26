---
name: content-brief
description: "Buat content brief artikel blog/SEO yang siap didelegasikan ke writer, untuk brand apa pun. Gunakan skill ini SETIAP KALI user minta 'content brief', 'brief artikel', 'brief untuk writer', 'brief SEO', atau bilang mau 'kasih tugas ke writer'/'delegasiin ke penulis'. Skill ini menjalankan interaction flow wajib: checklist SEO teknis (target keyword, search intent, competitor URL) plus checklist editorial (topik, angle, audience, tone, brand voice), lalu generate outline H1-H2, lalu compile ke dokumen Word (.docx) siap kirim ke writer. Jangan skip checklist meskipun user sudah kasih sebagian info; tetap konfirmasi field yang belum lengkap sebelum generate brief final."
---

# Content Brief Generator

Skill untuk menyusun content brief artikel blog/SEO yang lengkap, terstruktur, dan siap didelegasikan ke writer — bisa dipakai untuk brand/klien apa pun (multi-brand, reusable).

## Alur Wajib

Jangan langsung generate brief. Ikuti urutan ini:

### Step 1 — Checklist SEO Teknis
Tanyakan (kalau belum disebut user), boleh digabung dalam satu pertanyaan terstruktur:
1. **Target keyword** (primary + secondary keyword kalau ada)
2. **Search intent** — informational / navigational / transactional / commercial
3. **Target audience** — siapa pembaca, level pengetahuan mereka
4. **Competitor URL / artikel ranking teratas** — minimal 1-3 URL **artikel spesifik** (bukan cuma nama domain/website) untuk dijadikan pembanding. Kalau user tidak punya, cari sendiri via `web_search` dan selalu catat full URL artikelnya, bukan cuma nama situsnya. Sajikan dalam table 2 kolom: **Full URL** | **Gap yang Bisa Diisi** (apa yang belum dicover kompetitor, jadi peluang angle unik untuk artikel ini).

### Step 2 — Checklist Editorial
1. **Brand / klien** — nama brand, biar konteksnya jelas kalau dipakai lintas brand
2. **Topik & angle spesifik** — sudut pandang unik yang mau diangkat
3. **Tone of voice** — formal, santai, expert-to-expert, dll (kalau brand punya style guide, minta referensinya)
4. **CTA / goal artikel** — mau drive ke mana (signup, produk, edukasi murni, dll)

Tidak perlu tanya word count dan internal link ke user — keduanya sudah tidak ada di checklist wajib (lihat Step 4 untuk internal link).

Kalau user sudah kasih sebagian info di pesan awal, jangan tanya ulang — cukup konfirmasi apa yang masih kurang.

### Step 3 — Riset Singkat (kalau dibutuhkan)
- Kalau user tidak kasih competitor URL, gunakan `web_search` untuk cari top-ranking articles dari target keyword.
- Analisis singkat: apa yang sudah dicover kompetitor, gap apa yang bisa diisi (angle unik/informasi yang belum ada).

### Step 4 — Generate Outline H1-H2
- Buat draft struktur outline berdasarkan search intent + gap kompetitor, disajikan sebagai **table 2 kolom** persis format ini:
  - Kolom 1: hanya level heading (`H1`, `H2`, `H3`, dst) — tidak ada teks lain.
  - Kolom 2: teks heading-nya, lalu baris baru "Ekspektasi Bahasan:" diikuti bullet list poin-poin yang harus dicover di section itu.
  - Satu baris table = satu heading.
- Jangan sertakan estimasi word count per section — outline ini tidak perlu total word count sama sekali. Biarkan writer bebas berkreasi menentukan panjang tiap section.
- Outline ini draft awal untuk writer — writer tetap bisa modifikasi, tapi struktur besarnya sudah dari brief.

### Step 4b — Rekomendasi Internal Link
- Cari 1-3 artikel di website brand yang relevan dengan topik (pakai `web_search` kalau perlu, misal `site:domainbrand.com <topik>`).
- Sajikan sebagai list: **Judul Artikel** — Full URL.
- Ini rekomendasi dari Claude, bukan link wajib — writer yang pasang sendiri di draft-nya nanti.

### Step 4c — Referensi Artikel
- Cari **2-3 sumber luar negeri yang kredibel** (situs otoritatif seperti media besar, lembaga riset, perusahaan/platform resmi, publikasi akademik — bukan blog sembarangan) yang sudah membahas topik ini lebih dulu.
- Tujuannya untuk memperkuat kredibilitas & kedalaman riset artikel (E-E-A-T), bukan untuk ditiru — writer boleh kutip data/insight dari sana dengan atribusi yang jelas, bukan menjiplak.
- Sajikan dalam **table 2 kolom** (sama seperti table Competitor di Step 1): **Full URL** | **Insight/Data yang Bisa Dipakai**.

### Step 5 — Compile ke Dokumen Word
Gunakan skill `docx` (baca `/mnt/skills/public/docx/SKILL.md` untuk cara generate). Struktur dokumen ikuti `references/brief-template.md` di folder skill ini.

Setelah file jadi:
1. Render ke PDF dan cek visualnya (lihat instruksi di skill docx) sebelum dikirim ke user.
2. Simpan ke `/mnt/user-data/outputs/`.
3. Gunakan `present_files` untuk kasih ke user.

## Prinsip Penulisan Brief
- Brief harus **self-contained** — writer yang baca brief-nya harus bisa langsung kerja tanpa nanya balik.
- Hindari jargon internal brand yang tidak dijelaskan.
- Setiap section brief harus actionable, bukan cuma deskriptif (misal bukan cuma "tone: santai" tapi kasih contoh kalimat).
- Karena skill ini dipakai lintas brand, selalu cantumkan nama brand & tanggal brief di header dokumen supaya writer/PIC tidak tertukar antar project.

## Referensi
- `references/brief-template.md` — struktur lengkap section-by-section untuk dokumen brief final.
