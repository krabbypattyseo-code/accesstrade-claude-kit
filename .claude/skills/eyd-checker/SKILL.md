---
name: eyd-checker
description: Koreksi ejaan dan bentuk kata baku (EYD/PUEBI) untuk semua tulisan berbahasa Indonesia milik Accesstrade, tanpa mematikan sapaan aku-kamu. Gunakan skill ini SETIAP KALI user minta "cek EYD", "koreksi tulisan", "bakukan bahasa", "proofread", "terlalu casual", "perbaiki ejaan", "review bahasa", menyebut "/eydcheck", atau menempelkan draft artikel, kurikulum Academy, content brief, design brief, caption, atau balasan PR untuk dicek bahasanya. Trigger juga ketika ada feedback dari reviewer atau tim PR soal penulisan yang kurang baku, ketika user bilang "tolong jangan casual banget", atau sebelum artikel masuk tahap /finaldraft dan publish. Jangan tunggu user menyebut kata "EYD" secara harfiah.
---

# EYD Checker — Accesstrade

Skill ini membakukan **bentuk kata dan ejaan**, bukan mengubah kepribadian tulisan. Tulisan Accesstrade tetap hangat, tetap memanggil pembaca dengan "kamu", tetap memakai "aku" sebagai suara penulis. Yang dikoreksi adalah kata-kata yang bentuknya berasal dari ragam lisan Jakarta dan tidak punya dasar di ejaan resmi.

Contoh pemicu dibuatnya skill ini: reviewer menandai kata **"kejawab"** dan memintanya diganti jadi **"terjawab"**. Kata itu bukan masalah nada, melainkan masalah prefiks. Prefiks lisan `ke-` untuk makna pasif atau tak sengaja tidak diakui dalam ragam tulis; bentuk resminya `ter-`.

## Prinsip inti

Sebelum mengoreksi apa pun, pegang tiga garis ini:

1. **Sapaan tidak disentuh.** "aku", "kamu", "kita" tetap. Jangan pernah mengganti jadi "saya", "Anda", atau "penulis" kecuali user memintanya secara eksplisit.
2. **Yang dikoreksi adalah bentuk, bukan rasa.** Kalimat pendek, sapaan langsung, dan ritme percakapan boleh bertahan. Yang dibuang adalah bentuk kata tidak baku, singkatan lisan, dan partikel obrolan.
3. **Jangan menambah kalimat baru.** Skill ini memperbaiki, bukan menulis ulang. Kalau sebuah kalimat butuh dirombak total karena maknanya rancu, tandai di tabel temuan dan minta keputusan user, jangan diam-diam mengarang ganti.

## Alur kerja

### Langkah 1 — Terima naskah dan tentukan kanal

Tanyakan kanalnya kalau belum jelas, karena tingkat ketegasan berbeda:

| Kanal | Ketegasan | Catatan |
| --- | --- | --- |
| Artikel blog Accesstrade | Tinggi | Aku-kamu tetap, ejaan wajib baku |
| Kurikulum AT Academy | Tinggi | Sama dengan blog, plus istilah teknis konsisten |
| Content brief / design brief | Sedang | Istilah kerja internal boleh apa adanya |
| Balasan atau materi ke PR/advertiser | Paling tinggi | Nol toleransi bentuk lisan |
| Caption sosial media | Longgar | Bentuk kata tetap baku, tapi kalimat fragmen diizinkan |

Kalau user tidak menyebut kanal dan naskahnya jelas artikel blog, jalan terus dengan asumsi blog dan sebutkan asumsinya di akhir.

### Langkah 2 — Sapu tujuh kategori kesalahan

Baca naskah dan tandai temuan menurut tujuh kategori di bawah. Untuk daftar kata lengkap, buka `references/kamus-baku.md`.

**K1 — Prefiks lisan `ke-` yang seharusnya `ter-` atau `di-`**
Ini kategori yang memicu feedback PR. Ciri-cirinya: kata kerja pasif berawalan `ke-` yang tidak punya bentuk resmi.
kejawab → terjawab · kebaca → terbaca · kepake → terpakai · keliatan → terlihat · kebawa → terbawa · ketemu → bertemu atau ditemukan (tergantung konteks) · kepikiran → terpikirkan · kejar-kejaran deadline → dikejar tenggat

Perkecualian: `ke-` yang memang preposisi arah (`ke dashboard`, `ke halaman`) benar dan ditulis terpisah.

**K2 — Bentuk kata tidak baku dari ragam lisan**
gimana → bagaimana · gitu → begitu · gini → begini · udah → sudah · nggak/gak/ga → tidak · bikin → membuat · kayak → seperti · pengen → ingin · banget → sekali atau sangat · doang → saja · aja → saja · emang → memang · makanya → karena itu

**K3 — Partikel dan interjeksi obrolan**
Buang seluruhnya: `nih`, `deh`, `dong`, `kok`, `sih`, `lho`, `yaudah`, `nah` di awal kalimat, `yuk` di luar CTA.
Untuk CTA, `yuk` masih boleh dipertahankan satu kali per artikel kalau memang bagian dari ajakan penutup.

**K4 — Ejaan `di-` sebagai imbuhan versus preposisi**
Imbuhan pasif dirangkai: `dipromosikan`, `dibagikan`, `diklik`.
Preposisi tempat dipisah: `di dashboard`, `di TikTok Shop`, `di bawah`, `di antara`.
Kesalahan paling sering: `di promosikan` (salah) dan `didashboard` (salah).

**K5 — Awalan `me-` yang dilesapkan**
nulis → menulis · ngirim → mengirim · nyari → mencari · ngasih → memberikan · ngecek → mengecek · nempel → menempel

**K6 — Tanda baca dan format angka**
- Tanda hubung ganda `--` dilarang sebagai penyambung. Ganti dengan koma, titik, atau kata sambung. (Ini juga aturan house style yang sudah berlaku.)
- Tidak ada emotikon di badan artikel.
- Angka satu sampai sembilan ditulis huruf kecuali menyertai satuan atau data: `tiga langkah`, tapi `komisi 5%` dan `12 video`.
- Rupiah: `Rp50.000` tanpa spasi setelah `Rp`, titik sebagai pemisah ribuan.
- Persen dirapatkan ke angka: `8%`.

**K7 — Istilah asing**
Istilah teknis yang sudah jadi kosakata kerja tetap dipertahankan tanpa terjemahan dan tanpa miring: dashboard, real-time, Sub ID, Bank Konten, CTA, Reels, Carousel, Feed Post, affiliate, publisher, campaign, link.
Istilah asing di luar daftar itu yang punya padanan Indonesia yang lazim, terjemahkan: `revenue` → pendapatan, `benefit` → manfaat, `effort` → usaha, `challenge` → tantangan.
Kalau ragu, pertahankan bentuk aslinya dan tandai di tabel supaya user yang memutuskan.

### Langkah 3 — Susun output

Output selalu dua bagian, berurutan.

**Bagian A: Tabel temuan**

| No | Kategori | Kalimat asli | Perbaikan | Alasan |
| --- | --- | --- | --- | --- |

Isi kolom `Kalimat asli` dengan potongan kalimat secukupnya supaya user bisa menemukannya di naskah, bukan hanya kata tunggalnya. Kolom `Alasan` cukup satu klausa pendek, misalnya "prefiks lisan, bentuk baku ter-".

Urutkan berdasarkan urutan kemunculan di naskah, bukan berdasarkan kategori, supaya user bisa menyisir dari atas ke bawah.

Kalau temuannya lebih dari 40, jangan potong diam-diam. Tampilkan 40 pertama, lalu sebutkan sisanya sudah ikut diperbaiki di naskah bersih dan tawarkan tabel lanjutan.

**Bagian B: Naskah bersih**

Naskah lengkap hasil koreksi, siap salin. Aturan:
- Struktur heading, urutan paragraf, dan panjang naskah tidak berubah.
- Internal link yang sudah tertanam di badan paragraf dipertahankan persis di posisi semula.
- Jangan menambahkan catatan editor di dalam naskah bersih. Semua catatan tinggal di tabel.

Setelah naskah bersih, tutup dengan ringkasan satu paragraf: berapa temuan, kategori mana yang paling dominan, dan pola apa yang perlu dihindari penulis di naskah berikutnya. Bagian ini yang membuat skill berguna untuk mendidik penulis, bukan cuma menambal satu artikel.

### Langkah 4 — Eskalasi kalau perlu

Tahan koreksi dan tanya user kalau menemukan:
- Kalimat yang maknanya berubah kalau dibakukan, misalnya idiom yang tidak punya padanan baku.
- Klaim angka komisi, status campaign, atau nama brand yang mungkin sudah usang. Skill ini tidak memverifikasi fakta, tapi kalau terlihat, sebutkan supaya dicek ke tim SA.
- Naskah yang bukan bahasa Indonesia atau campuran berat dua bahasa.

## Yang tidak dilakukan skill ini

- Tidak mengubah sudut pandang jadi formal kaku.
- Tidak menambah atau memangkas argumen.
- Tidak melakukan optimasi SEO, itu urusan `/optimizedarticle`.
- Tidak memverifikasi data kampanye atau komisi.

## Referensi

- `references/kamus-baku.md` — daftar padanan tidak baku ke baku, dikelompokkan per kategori K1 sampai K7, plus daftar istilah asing yang dikecualikan. Buka file ini setiap kali menjalankan Langkah 2.
