# Brand guidelines video · ACCESSTRADE Indonesia

Versi v1 · 26 Nov 2026 · disusun dari aturan kit Accesstrade (`../../CLAUDE.md`, `../../docs/house-style-dan-eyd.md`). Bagian bertanda `[KONFIRMASI]` belum ada sumbernya: tanyakan ke Harist/Indah sebelum dianggap final.
Dibaca sesi Scriptwriting (gaya bahasa, klaim, CTA) dan Improvement (visual → `tokens.json`).

## 1. Identitas

| | |
|---|---|
| Nama | ACCESSTRADE Indonesia (accesstrade.co.id) |
| Apa | Platform affiliate marketing: publisher mempromosikan campaign brand dan mendapat komisi |
| Penonton utama | Calon publisher pemula (kreator, pemilik media sosial, penulis blog) dan publisher aktif |
| Tujuan video | Edukasi affiliate marketing, tutorial dashboard publisher, info campaign, ajakan daftar publisher |
| Website | accesstrade.co.id |
| Handle media sosial | [KONFIRMASI] (belum tercatat di kit; kosongkan `brand.handle` sampai pasti) |

## 2. Suara dan gaya bahasa

- Sapaan **aku/kamu**. Bahasa Indonesia santai tapi rapi, mengikuti EYD (house style K1-K8).
- Nada: kakak yang sudah berpengalaman menjelaskan ke teman, jujur soal prosesnya. Bukan motivator.
- Kalimat pendek dan langsung. Istilah teknis dijelaskan sekali saat pertama muncul.
- Contoh "brand banget": "Komisi kamu baru masuk setelah transaksi divalidasi, jadi wajar kalau angkanya belum langsung muncul."
- Contoh "bukan kita": "Raih jutaan rupiah tiap hari tanpa modal!"

## 3. Yang dihindari

Yang berupa kata/pola sudah dimasukkan ke `tokens.json` → `rules.bannedWords` dan diperiksa `npm run cek`.

- Emoticon/emoji, tanda pisah panjang (—, –) dan "--".
- Sapaan "Anda".
- **Menjual mimpi**: janji penghasilan, "pasti cuan", "passive income", "kaya mendadak".
- **Framing menakut-nakuti**: "rugi besar kalau...", "jangan sampai ketinggalan".
- Klaim superlatif tanpa data ("terbaik", "nomor 1", "termurah").
- Data internal: budget, skema bagi hasil internal, data rekening, login, data pribadi publisher.

## 4. Klaim yang wajib dikonfirmasi

Ditulis `[KONFIRMASI]` di script sampai lolos gerbang verifikasi (`../../docs/tim-dan-gerbang-verifikasi.md`):
- Besaran komisi, syarat campaign, periode campaign, bonus.
- Angka statistik dan hasil publisher.
- Testimoni publisher (wajib izin tertulis).
- Perubahan judul, CTA, dan susunan brand di konten resmi: keputusan Indah (Editorial Lead).

## 5. Visual

| Warna | Kode | Dipakai untuk |
|---|---|---|
| Navy | #1A1A2E | Latar utama (gelap), teks di latar terang dan oranye |
| Orange ACCESSTRADE | #F17420 | Latar bab dan outro, kata yang disorot, kata aktif caption, kotak sorot screenshot |
| Off-white | #F7F7F5 | Latar terang (daftar, perbandingan) |
| Warm gray | #D9D6D1 | Teks pendukung redup |
| Putih | #FFFFFF | Teks di latar navy; sorotan di latar oranye (hanya teks besar) |

- Font: [KONFIRMASI] font resmi brand (file "Brand Guidelines Accesstrade" tidak ada di kit). Sementara: **Poppins** (judul) + **Inter** (teks), keduanya Google Fonts. Ganti di `tokens.json` → `font` kalau font resmi sudah ada.
- Logo: [KONFIRMASI] file logo resmi (PNG transparan, versi putih untuk latar navy/oranye). Sementara outro memakai tulisan "ACCESSTRADE".
- Screenshot dashboard: kotak sorot oranye 3 px, sudut membulat, sesuai `../../docs/workflow-screenshot-dashboard.md`.
- Visual tidak boleh menyiratkan janji penghasilan (mis. tumpukan uang, grafik naik tanpa data).
- Gaya ilustrasi feature image blog (isometric 3D flat-shaded) boleh dipakai juga untuk klip Motion Format.

## 6. Format video

### Reels / TikTok / Shorts
- Tujuan: awareness dan edukasi cepat, ajak ke artikel blog atau daftar publisher.
- Durasi ideal: 20-45 detik.
- Hook: masalah sehari-hari publisher, mitos affiliate, pertanyaan (lihat `alur/aturan-brief.md`).
- Topik rutin: tips affiliate per platform (Shopee, TikTok, Instagram), tutorial fitur dashboard, istilah affiliate.

### YouTube
- Tujuan: tutorial lengkap dan pembahasan mendalam, pendamping artikel blog.
- Durasi ideal: 5-12 menit.
- Struktur: pembuka 20-30 detik → 3-5 bab → ringkasan → ajakan + end screen.

## 7. Ajakan (CTA)

| Platform | CTA utama | Link (di caption/deskripsi) |
|---|---|---|
| Reels / TikTok | "Daftar jadi publisher di accesstrade.co.id" | https://accesstrade.co.id/publisher/register |
| YouTube | Tonton video berikutnya + daftar publisher | link register + artikel blog terkait |
