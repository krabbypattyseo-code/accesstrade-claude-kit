# Struktur Dokumen Content Brief (.docx)

Gunakan struktur ini saat compile dokumen Word. Section bertanda (*) wajib diisi, tidak boleh kosong.

## Header
- Nama Brand/Klien (*)
- Judul Project / Nama Artikel (*)
- Tanggal Brief Dibuat
- PIC / Penanggung Jawab (kalau disebut user)

## 1. Ringkasan Project
- 2-3 kalimat: konteks kenapa artikel ini dibuat, tujuan besar.

## 2. Data SEO
Tabel dengan kolom: Field | Detail
- Primary Keyword (*)
- Secondary Keywords
- Search Intent (*)
- Target URL Slug (kalau ada)
- Competitor / Top-Ranking Articles: sajikan sebagai **table 2 kolom** — Full URL | Gap yang Bisa Diisi (bukan bullet list, dan bukan cuma nama domain)

## 3. Target Audience
- Deskripsi pembaca (level pengetahuan, kebutuhan, pain point)
- Bahasa/istilah yang perlu dihindari atau justru dipakai

## 4. Tone & Voice
- Deskripsi tone (*)
- Contoh kalimat "do" dan "don't" kalau brand punya style guide

## 5. Outline Artikel
Sajikan sebagai **table 2 kolom**, satu baris per heading:
- Kolom 1: hanya level heading (H1, H2, H3, dst) — tanpa teks lain
- Kolom 2: teks heading, lalu baris "Ekspektasi Bahasan:" diikuti bullet poin yang harus dicover
- Tidak perlu word count sama sekali — biarkan writer berkreasi menentukan panjang tiap section

## 6. Requirement Tambahan
- Rekomendasi Internal Link (list: Judul Artikel — Full URL; ini rekomendasi dari Claude, writer yang pasang sendiri)
- Referensi Artikel (2-3 sumber luar negeri kredibel, sajikan sebagai table 2 kolom: Full URL | Insight/Data yang Bisa Dipakai; untuk kredibilitas riset, bukan untuk ditiru)
- CTA / goal artikel (*)
- Format khusus (bullet list, FAQ section, gambar/infografis, dll)

## 7. Deadline & Submission
- Deadline draft
- Format submission (Google Docs, Word, CMS langsung, dll — tanyakan kalau relevan)

---

**Catatan implementasi docx:**
- Pakai heading style built-in (`HeadingLevel.HEADING_1/2`) supaya kalau butuh TOC bisa otomatis.
- Section 2 dan 5 sebaiknya pakai table (docx-js `Table`) biar scannable buat writer.
- Simpan warna aksen/branding netral (jangan pakai warna brand tertentu, karena skill ini dipakai lintas brand).
