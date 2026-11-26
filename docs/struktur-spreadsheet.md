# Struktur Spreadsheet Dashboard Website Accesstrade

Versi v1 (2026-11-19). Dirangkum dari kerja chat admin dashboard sejak 2 Nov 2026.

## 1. File

| File | ID | Fungsi |
|---|---|---|
| [SEO ARTICLES] Articles and Content Plan AT | `1haYsf7XBhGYjQWElY5EU16oncoPyAlbU2d0s7XCwYDs` | Dashboard all-time produktivitas Website Accesstrade (SEO + website/dev). Dicek Indah |
| Data Writer | `1EcqBWc8JjQ-rbCVJYTL7iwa5Oh_XxQnPv-9AVQgg1BY` | Dokumentasi Finance untuk fee writer |
| Komposisi_Artikel_Q1_FY27 | `1DuwMQjg-5OXc2uQJ7RPOQs1JCaNGWCpAkyvJttCyYF4` | Arsip. Tidak dipakai lagi |

Tahun fiskal Accesstrade mulai Oktober: FY26 = Okt 2025–Sep 2026, FY27 = Okt 2026–Sep 2027. Q1 = Okt–Des.

## 2. Tab aktif

| Tab | sheetId | Isi | Siapa yang mengisi |
|---|---|---|---|
| 🏠 Overview | 900000004 | Dashboard rumus. Jangan ketik angka manual | Rumus |
| ▶️ Content Pipeline | 900000001 | Satu baris = satu pekerjaan konten (Baru, Optimised, Academy) dari rencana sampai tayang | Claude (semua perintah) |
| ✅ Review Indah | 900000005 | Antrean review Indah | Claude kolom A–G dan K, Indah kolom H–J |
| 📥 Ideation & Backlog | 900000002 | Ide dan backlog (ID I001…), kolom S status di Pipeline otomatis | Claude |
| 📊 Performance | 1085551939 | Snapshot Okt 2026 (baris 5–33) + 193 baris kumulatif FY26 (baris 34–226) | Claude, kalau diminta |
| Academy | 1935691859 | Materi AT Academy | Harist |
| Kanibalisasi | 1714214683 | Daftar URL merge/redirect, dipakai cek kanibalisasi | Claude, kalau diminta |
| 🛠️ Website & Dev Tracker | 900000003 | Request ke developer (SEO, website, Academy, Superpoint) | **Harist sendiri** |
| 📚 Referensi & Log | 761155198 | Log perubahan + definisi sumber angka | Claude |

Tab lama di-hide (bukan dihapus): Jadwal Kerja, Overview (lama), Dokumentasi Developer, Tracking Progress, Ideation & Leader Suggestion, ✒️Brief Design & Writing Optimise 🟨, ▶️New Article 📝, Optimised by Keyword, Plan 3 Bulan, Content Performance, Kalender Juli/Agustus/September, Copy of Bank Ide & Keyword.

## 3. ▶️ Content Pipeline

Header di baris 4, data mulai baris 5. ID terakhir per 2026-11-19: **P0276** (baris 280).

| Kolom | Isi | Catatan |
|---|---|---|
| A ID | P + 4 digit, lanjut dari ID terakhir | |
| B Bulan (YYYY-MM) | Teks, contoh `2026-11` | Satu-satunya kolom bulan yang diisi |
| C Nama Bulan | Rumus ARRAYFORMULA di C5 | Jangan diisi |
| D FY | Rumus ARRAYFORMULA di D5 | Jangan diisi |
| E Kuartal | Rumus, hasil "FYxx Qn" | Jangan diisi |
| F Tipe | Baru / Optimised / Academy | |
| G Bucket | MCN / Affiliates / Platform / Others | Platform = panduan platform sosmed/marketplace (FB Pro, IG, TikTok, Threads, Shopee, dst) |
| H Kategori Blog | Social Media, Insight, Affiliate Marketing, How To, Guidelines, Paid Ads, SEO, Promo, E-Commerce, dst | Ikuti segmen URL artikel |
| I Judul / Topik | Judul artikel (baris lama banyak yang berisi slug) | |
| J Keyword Utama, K Volume/bln | | Boleh kosong |
| L Slug / URL | Full URL setelah tayang | |
| M PIC / Penulis | Wiwik Agustina (baru), Harist (optimasi/Academy) | |
| N Status | Belum Mulai / On Progress / Drafting / Draft Selesai / Review / Published / Cancelled | |
| O Leader Check | Not Yet Checked / Need to Check! / Progress Revised / Need Revised / Done / Approve | |
| P Tgl Publish / Update | | |
| Q Link Brief | Brief artikel baru, atau Docs [Dokumentasi]/analisis untuk optimasi | |
| R Link Draft | Draft, atau Docs [Review] untuk optimasi | |
| S Feedback Leader | | |
| T Kebutuhan Design, U Status Design, V Link Brief Design | | |
| W Word Count, X Plagiarisme | | |
| Y Catatan | Tambah di belakang dengan ` \| YYYY-MM-DD: ...` | Jangan timpa |
| Z Sumber Data | Asal baris | |

Rumus (jangan diubah):
```
C5: =ARRAYFORMULA(IF(B5:B="","",CHOOSE(VALUE(RIGHT(B5:B,2)),"Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember")&" "&LEFT(B5:B,4)))
D5: =ARRAYFORMULA(IF(B5:B="","","FY"&IF(VALUE(RIGHT(B5:B,2))>=10,VALUE(MID(B5:B,3,2))+1,VALUE(MID(B5:B,3,2)))))
```

Peta ID:

| Rentang | Isi |
|---|---|
| P0001–P0193 | Artikel FY26 (dari Mapping Bucket FY26) |
| P0194–P0206 | Optimasi dan artikel Sep 2026 |
| P0207–P0233 | Rencana artikel baru Q1 FY27 |
| P0234–P0254 | Rencana optimasi Q1 FY27 |
| P0255 | Cancelled (Juli) |
| P0256–P0261 | Optimasi pengalir AT Beauty Creator Lab (Nov–Des) |
| P0262–P0263 | Artikel baru pengganti P0220 dan P0221 (keputusan 9 Nov) |
| P0264–P0271 | Histori optimasi Mei–Juni 2026 (dari dokumen progres Harist) |
| P0272–P0276 | Histori optimasi Apr–Agu 2026 (dari daftar dokumen optimasi Harist) |

### Aturan baris optimasi

- Sebelum menambah baris, cek judul dan URL di seluruh Pipeline.
- Kalau URL sudah ada sebagai baris yang sama jenisnya dan putarannya, update baris itu.
- Kalau URL hanya ada sebagai baris Tipe Baru, optimasinya dibuat **baris baru Tipe Optimised**. Satu putaran optimasi = satu baris, supaya Overview menghitungnya dan link brief/draft asli tidak tertimpa.
- Di Catatan baris optimasi, sebut ID baris asal (contoh "Artikel asal P0143").

## 4. ✅ Review Indah

Header baris 4. Kolom: A ID Review (R001…), B Tgl Diajukan, C ID Pipeline, D Judul / Item, E Tipe, F Link Google Docs (validasi regex docs.google.com), G Yang Diminta (Approve / Feedback / Keputusan), H Status Review (Menunggu Review / Revisi / Approve), I Feedback Indah, J Tgl Selesai Review, K Catatan Harist (bullet "•"), L Status di Pipeline (rumus VLOOKUP, jangan diisi). R001–R014 terisi per 2026-11-19.

## 5. 🏠 Overview (ringkas)

- Filter FY di C4 (All-time / FY26 / FY27). E4 `=IF(C4="All-time","FY*",C4)`. Pakai "FY*", bukan "*", supaya header dan baris kosong tidak terhitung.
- Bagian: Ringkasan (B8:K8), Target vs Realisasi Q1 FY27 (B12:I16), per Bucket, Status Cek Leader (B27:G28) + Menunggu Review Indah dan Perlu Revisi (H27:I28), Website & Developer (B31:H32, daftar FILTER di B36), Dampak (B53:E54, B57:E58, Top 10 dengan SORTN di B62), Produktivitas per bulan (B74 ke bawah).
- Target Q1 FY27: Okt 8 baru + 4 optimasi, Nov 9 + 7, Des 10 + 10. Per bucket: MCN 9, Affiliates 21, Platform 14, Others 4. KPI ke depan 10 baru + 10 optimasi per bulan.
- Hitungan `SUM(COUNTIFS({...}))` harus dibungkus `ARRAYFORMULA`, kalau tidak hanya elemen pertama yang terhitung.
- Protected range di Overview bersifat warning-only.

## 6. 📚 Referensi & Log

Kolom: Tanggal | Sheet | Perubahan | Sumber | Oleh (= Claude). Di bawah log ada blok "DEFINISI & SUMBER ANGKA", lalu baris header "Item | Penjelasan", lalu definisi.

Cara sisip baris log yang aman:
1. Baca kolom A tab ini dan cari nomor baris (1-based) yang berisi persis "DEFINISI & SUMBER ANGKA". Misalnya baris N.
2. `insertDimension` ROWS dengan `startIndex = N-1`, `endIndex = N`, `inheritFromBefore: true`. Baris kosong baru ada di baris N, dan DEFINISI turun ke N+1.
3. Tulis log ke `A{N}:E{N}`.
4. Baca ulang beberapa baris di sekitarnya untuk memastikan log ada di atas DEFINISI dan header "Item | Penjelasan" tidak tertimpa.

Kalau menyisipkan dua log sekaligus, ulangi langkah 1 untuk log kedua (nomor baris DEFINISI sudah bergeser).

## 7. Data Writer (Finance)

- Tab **2026 Summarise**: satu blok per bulan tayang (judul bulan, baris kosong, header, daftar). Header NO | SEO Writer | TITLE | LINK ARTICLE | DATE RELEASE | STATUS | CATEGORY | Word Length | Plagiarisme Checker | FEE. Format: "Nov 05, 2026", "Online", "0%", "Rp100,000". NO mulai 1 per blok. Blok baru dibuat 2 baris setelah blok terakhir, judul dan header disalin dari blok sebelumnya.
- Tab **Wiwik**: header baris 2. Tulis di baris pertama yang kolom C kosong, isi B–J.
- Artikel baru yang tayang ditulis di kedua tab dengan isi sama.
- **Kolom L ke kanan tidak pernah disentuh.**
- Finance hanya melihat 2026 Summarise. Writer aktif hanya Wiwik. Total fee dihitung Harist.

## 8. Catatan teknis Google Sheets API

| Hal | Cara |
|---|---|
| Field mask repeatCell | Daftar dipisah koma, contoh `userEnteredFormat.textFormat,userEnteredFormat.backgroundColorStyle`. Gaya kurung `user_entered_format(text_format)` ditolak |
| Hasil get_values terlalu besar | Hasil disimpan ke file. Olah dengan Python atau jq, jangan dibaca manual sepotong-sepotong |
| Format baris baru | `copyPaste` dengan `pasteType: PASTE_FORMAT` dari baris di atasnya (ikut dropdown dan validasi) |
| Kolom rumus | Tulis per rentang (A:B lalu F:Z) supaya C:E tidak tertimpa |
| Panggilan gagal tanpa alasan jelas | Retry sekali dengan panggilan yang sama. Kalau gagal lagi, laporkan |
