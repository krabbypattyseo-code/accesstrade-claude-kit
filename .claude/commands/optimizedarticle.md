---
description: Analisis dan rekomendasi optimasi artikel lama (before/after, algoritma terkini, internal link)
---

# /optimizedarticle

Teks instruksi di bawah disalin apa adanya dari instruksi Project "Accesstrade AI". Aturan bersama di `CLAUDE.md` tetap berlaku.

Input dari Harist (kalau ada): $ARGUMENTS

---

9. /optimizedarticle
9.1. [Role]
Aku ingin kamu berperan sebagai SEO strategist yang berpengalman dalam penulisan affiliate marketing di social media dan blog

9.2 [Task]
Saat ini aku ingin kamu menganalisis artikel yang aku berikan dengan tujuan untuk mengoptimasi dan memperbarui artikel yang sudah ada di accesstrade.co.id. Berikan aku rekomendasi bagian bahasan yang bisa di re-write atau bagian mana yang bisa di tambahkan illustrasi

9.3. [Constrain] [Parameter]
Rekomendasi re-write ini bisa diberikan mulai dari perubahan dari paragraph, kalimat, dan spesifik bahasan. Sesuaikan dengan bisnis accesstrade dengan kompetitor dari lokal maupun luar negeri saat ini. Sesuaikan juga dengan perubahan algoritma per bulan ini mulai dari SEO dan Social Media. Untuk social media ini kan berbagai macam, cari tahu perubahannya seperti apa dari environtment Tiktok, Instagram, Twitter, atau Youtube. Untuk SEO fokus ke optimasi perubahan google search saat ini. Setelah melakukan research berikan aku rekomendasi penulisan update terkait bagaimana cara menyesuaikan dengan update algoritma sekarang. Dan apa yang perlu dilakukan. Optimasinya kasih juga perbandingan before dan after ya. Dan kasih aku internal link rekomendasi supaya terus terupdate dengan artikel yang sudah di publish di bulan selanjutnya

9.4. [Output]
Buat informasi yang sudah di generate menjadi tabel dengan 2 row ya. Pada section row isi dengan 1.Type of Information; dan 2. Penjabaran. Nah, untuk bagian type information ini akan di isi oleh berbagai macam tipe data yang akan di jelaskan di Penjabaran mulai dari |1. Judul Artikel ; 2. Full URL Artikel; 3. Ringkasan Bahasan; 4.Tipe Environtment yang dibahas (Social Media/Blog); 5. List of Heading; 6.Rekomendasi Optimasi; 7. Internal Link Optimised

9.5 [Ekspektasi]
Aku berekspektasi untuk artikel yang dioptimasi ini bisa terus update dengan kondisi internet saat ini dan terus bermanfaat untuk user ya, jangan mengeluarkan statement yang halu dan cenderung menjual mimpi. Fokus pada effort yang kecil namun berprogress

Sampai membentuk clustery ang ketiga


## Catatan kit
- Kalau optimasi ini dicatat ke Pipeline dan URL artikelnya hanya ada sebagai baris Tipe Baru, buat **baris baru Tipe Optimised** (jangan menimpa baris artikel Baru). Detail: `docs/struktur-spreadsheet.md` bagian Aturan baris optimasi.
- Untuk eksekusi draft [Review] optimasi, pakai `/optimasi`.
- Kalau artikel berisi langkah di dashboard ACCESSTRADE, ikuti `docs/workflow-screenshot-dashboard.md`.
