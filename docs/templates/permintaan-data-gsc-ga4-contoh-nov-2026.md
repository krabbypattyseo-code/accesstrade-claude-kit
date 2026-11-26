# Permintaan Data GSC & GA4: Artikel Baru November 2026 (v1)

> Disalin dari Project "Accesstrade AI" pada 2026-11-19 untuk kit Claude Code. Rujukan file sudah disesuaikan ke folder `docs/`. Nama alur lama: Chat Brief = `/brief`, chat update dokumentasi = `/update`, chat optimasi productivity = `/optimasi`, chat admin dashboard = `/admin`.

Dokumen ini adalah instruksi untuk sesi Claude yang punya akses API Google Search Console dan Google Analytics 4 milik Accesstrade Indonesia. Tujuannya adalah menarik data trafik yang dibutuhkan "Chat Brief" (chat pembuat content brief untuk writer) sebelum menyusun brief artikel baru November 2026.

Peminta: Harist (SEO, Accesstrade Indonesia)
Tanggal dibuat: 9 November 2026

---

## 1. Peranmu dan batasannya

| Hal | Instruksi |
|---|---|
| Peran | Analis data SEO. Tugasnya menarik data, menganalisis, dan menyerahkan hasil dalam format di bagian 7 |
| Bahasa | Bahasa Indonesia, sapaan aku-kamu, sajikan hasil dalam tabel |
| Yang tidak boleh | Jangan mengubah spreadsheet Content Pipeline atau file apa pun. Jangan membuat brief atau draft artikel. Hasilmu akan dipakai di chat lain |
| Kalau data tidak ada | Tulis "tidak ada data" di baris itu. Jangan mengisi dengan perkiraan atau angka dari ingatan |

## 2. Sumber data dan konvensi

| Item | Nilai |
|---|---|
| GSC property | `sc-domain:accesstrade.co.id` |
| GA4 property | `336985096` ("ACCESSTRADE - GA4"). Jangan pakai `430809648` (view terfilter, bukan untuk laporan utama) |
| Periode utama | 1 Agustus 2026 sampai 6 November 2026 (GSC terlambat 2 sampai 3 hari, jadi jangan sampai hari ini) |
| Periode pembanding | 1 Mei 2026 sampai 31 Juli 2026 (untuk melihat query yang naik) |
| Periode musiman | Tertulis per topik di bagian 4 |
| Filter page | Buang URL yang mengandung `#` |
| Dimensi GSC | Selalu tarik `query` + `page` bersamaan. Data query saja tidak cukup untuk mendeteksi kanibalisasi |
| Branded | Field branded bawaan tidak bisa dipercaya. Klasifikasikan manual: query yang mengandung "accesstrade" atau "accestrade" dianggap branded, dan dikeluarkan dari analisis topik |
| GA4 | Channel Organic Search, dimensi landing page. Metrik: sessions, engaged sessions, engagement rate, dan event Click Daftar (pakai nama event yang sama dengan laporan mingguan sebelumnya) |
| Event yang dilarang | `register_publisher_success` jangan dipakai (tracking bermasalah sejak pertengahan Mei 2026) |
| Batas data GA4 | GA4 baru tersedia mulai 21 April 2026. Untuk periode sebelum itu, cukup pakai GSC |
| Duplikat | Kalau ada baris kembar, pakai angka agregat dan beri catatan |

## 3. Daftar artikel baru November 2026

| ID | Judul kerja | Bucket | Status brief | Kebutuhan data |
|---|---|---|---|---|
| P0215 | UGC Adalah: Cara Jadi UGC Creator dan Dibayar Brand | MCN | Sudah ada (4 Nov) | Validasi kepemilikan keyword dan FAQ |
| P0216 | Media Kit Kreator: Isi, Contoh, dan Template | MCN | Belum | Lengkap |
| P0217 | Cara Menjadi Content Creator dari Nol sampai Dapat Brand Deal | MCN | Belum | Lengkap |
| P0218 | Strategi Affiliate Shopee 12.12 Harbolnas | Affiliates | Sudah ada (4 Nov) | Validasi dan pola musiman 12.12 tahun lalu |
| P0219 | Ide Produk Affiliate untuk Kado Natal & Tahun Baru | Affiliates | Belum | Lengkap dan pola musiman |
| P0220 | Kalkulator Komisi Shopee Affiliate | Affiliates | **Dibatalkan sebagai artikel baru** | Cari topik pengganti (bagian 5) |
| P0221 | Cara Mengaktifkan FB Pro 2026 | Platform | Belum | Lengkap, fokus kanibalisasi |
| P0222 | Monetisasi Instagram 2026: Syarat dan Cara Mengaktifkannya | Platform | Belum | Lengkap, fokus kanibalisasi |
| P0223 | Aplikasi Penghasil Uang 2026 | Others | Sudah ada (4 Nov) | Validasi kepemilikan keyword dan FAQ |
| P0227 | Strategi Affiliate Ramadan 2027 | Affiliates | Belum | Lengkap dan pola musiman Ramadan 2026 |

## 4. Analisis per topik

Untuk setiap topik, jalankan analisis A sampai E di bawah, lalu analisis khusus topik itu.

**Analisis standar (berlaku untuk semua topik):**

| Kode | Analisis | Cara |
|---|---|---|
| A | Query terkait | Tarik query + page dengan pola regex di tabel topik (case-insensitive). Urutkan berdasarkan impresi |
| B | Kepemilikan halaman | Untuk setiap query dengan impresi 20 atau lebih, catat halaman Accesstrade mana yang muncul. Kalau satu query muncul di 2 halaman atau lebih, tandai "potensi kanibal" |
| C | Query pertanyaan untuk FAQ | Dari hasil A, ambil query yang mengandung: apa, apakah, bagaimana, cara, kenapa, mengapa, berapa, kapan, bisa, boleh |
| D | Peluang naik | Bandingkan impresi periode utama vs pembanding. Tandai query yang naik 50% atau lebih |
| E | Kandidat internal link | Dari halaman pemilik di B, tarik data GA4 Organic: sessions dan Click Daftar. Halaman dengan Click Daftar tertinggi diprioritaskan sebagai internal link |

### P0215 UGC Adalah (validasi)
- Regex query: `ugc|user generated|konten buatan pengguna`
- Halaman yang harus dicek: `/blogs/insights/rata-rata-gaji-influencer-berdasarkan-jumlah-followersnya`, `/blogs/social-media/endorse-vs-product-seeding-vs-affiliate`
- Pertanyaan: apakah ada query UGC yang sudah dipegang halaman lain dengan posisi lebih baik dari 10? Query "ugc" apa saja yang muncul selain "ugc adalah"?

### P0216 Media Kit Kreator
- Regex query: `media kit|mediakit|rate card|ratecard|portofolio (influencer|kreator|creator)|pitching brand`
- Halaman yang harus dicek: `/blogs/insights/strategi-menentukan-berapa-rate-card-influencer-indonesia-beserta-contohnya`, `/blogs/social-media/cara-professional-komunikasi-dengan-brand-untuk-creator`
- Pertanyaan: apakah query "media kit" sudah muncul di artikel rate card? Kalau ya, di posisi berapa? Ini menentukan apakah media kit jadi artikel sendiri atau cukup section di artikel rate card

### P0217 Cara Menjadi Content Creator
- Regex query: `(cara|tips|langkah).*(content creator|konten kreator|kreator|influencer|youtuber|tiktoker|selebgram)|content creator pemula`
- Halaman yang harus dicek: `/blogs/social-media/perbedaan-content-creator-dan-influencer`, `/blogs/insights/hardskill-dan-softskill-wajib-content-creator`, `/blogs/social-media/cara-menjadi-beauty-influencer-tiktok-yang-menghasilkan`
- Pertanyaan: halaman mana yang saat ini paling banyak mendapat query "cara menjadi content creator" dan "cara menjadi influencer"? Apakah ada halaman influencer TikTok lama yang sudah dihapus (catatan Pipeline menyebut `cara-menjadi-influencer-tiktok-tanpa-modal`, tapi URL itu 404). Cek di GSC apakah URL itu masih punya impresi atau sudah di-redirect

### P0218 Strategi Affiliate Shopee 12.12 (validasi dan musiman)
- Regex query: `12\.12|12 12|1212|harbolnas|double day|tanggal kembar`
- Halaman yang harus dicek: `/blogs/affiliate-marketing/upsize-komisi-affiliate-12-12`, `/blogs/affiliate-marketing/upsize-komisi-affiliate-11-11`, `/blogs/affiliate-marketing/strategi-affiliate-shopee-11-11`
- **Periode musiman tambahan:** 1 November 2025 sampai 31 Desember 2025, data harian
- Pertanyaan: kapan impresi query 12.12 mulai naik tahun lalu (tanggal)? Kapan puncaknya? Apakah artikel 11.11 (tayang 16 Okt 2026) sudah mendapat impresi dari query 12.12?

### P0219 Kado Natal & Tahun Baru
- Regex query: `kado|hadiah|natal|christmas|tahun baru|akhir tahun|hampers|tukar kado|gift`
- **Periode musiman tambahan:** 1 November 2025 sampai 15 Januari 2026, data mingguan
- Pertanyaan: apakah blog Accesstrade pernah mendapat impresi untuk query kado atau hadiah akhir tahun? Halaman mana? Kapan mulai naik? Kategori produk apa yang muncul di query (misalnya "kado natal untuk pacar", "hampers natal")?

### P0221 Cara Mengaktifkan FB Pro
- Regex query: `(aktif|mengaktifkan|aktifkan|nyalakan|ubah|beralih|ganti|nonaktif|matikan).*(fb pro|mode profesional|facebook pro|professional mode)|cara (membuat|buat|jadi) fb pro|menu (mode )?profesional (tidak|gak|nggak) (ada|muncul)`
- Halaman yang harus dicek: `/blogs/social-media/fb-pro-itu-apa` (tayang 27 Okt 2026), `/blogs/guidelines-affiliate/playbook-facebook-pro-pemula-migrasi-registrasi`, `/blogs/social-media/perbedaan-facebook-biasa-vs-fb-pro`, `/blogs/social-media/panduan-setting-privasi-fb-pro-aman-profesional`
- Pertanyaan utama: query aktivasi FB Pro saat ini dipegang halaman mana? Kalau `fb-pro-itu-apa` sudah ranking di posisi 1 sampai 5 untuk "cara mengaktifkan fb pro", laporkan dengan jelas, karena artikel baru berisiko kanibal dan mungkin lebih baik dijadikan optimasi

### P0222 Monetisasi Instagram
- Regex query: `monetisasi (instagram|ig)|(instagram|ig).*(monetisasi|monetization|gift|hadiah|langganan|subscription|bonus|dibayar|status monetisasi)|syarat.*(instagram|ig).*(uang|monetisasi)`
- Halaman yang harus dicek: `/blogs/social-media/cara-dapat-uang-dari-ig-reels`, `/blogs/social-media/cara-sukses-dapat-uang-dari-instagram-tanpa-modal`, `/blogs/guidelines-affiliate/panduan-bisa-dapat-cuan-di-instagram-tanpa-modal`
- Pertanyaan: pisahkan query yang intent-nya "fitur monetisasi resmi" (gift, langganan, syarat, status) dari query "cara dapat uang dari Instagram" secara umum. Hitung berapa impresi masing-masing dan halaman mana yang memegangnya

### P0223 Aplikasi Penghasil Uang (validasi)
- Regex query: `(aplikasi|apk|app).*(penghasil|menghasilkan|dapat|dibayar) (uang|saldo|duit)|aplikasi (penipuan|legal|resmi|terbukti)`
- Halaman yang harus dicek: `/blogs/insights/cara-menghasilkan-uang-dari-rumah-dengan-modal-internet`, `/blogs/insights/website-penghasil-uang`, `/blogs/insights/kerja-sampingan-online`, `/blogs/insights/cara-menghasilkan-uang-dari-hp-untuk-ibu-rumah-tangga`
- Pertanyaan: apakah ada query dengan angka penghasilan (misalnya "100 ribu per hari") yang impresinya besar? Laporkan saja datanya. Artikel tidak akan menjanjikan angka, tetapi query ini perlu dijawab di FAQ

### P0227 Strategi Affiliate Ramadan 2027
- Regex query: `ramadan|ramadhan|puasa|lebaran|idul fitri|thr|mudik|hampers|takjil|bukber`
- Halaman yang harus dicek: `/blogs/promo/strategi-komisi-peak-sale-ramadan` (tayang 6 Mar 2026)
- **Periode musiman tambahan:** 1 Desember 2025 sampai 15 April 2026, data mingguan (Ramadan 2026 kurang lebih 18 Feb sampai 19 Mar)
- Pertanyaan: minggu ke berapa sebelum Ramadan impresi mulai naik? Query apa yang paling besar? Apakah artikel peak sale Ramadan masih mendapat impresi setelah Maret 2026? Data ini menentukan jadwal tayang ideal artikel Ramadan 2027 (Ramadan 2027 diperkirakan mulai 8 Februari)

## 5. Topik pengganti P0220

**Konteks:** P0220 "Kalkulator Komisi Shopee Affiliate" dibatalkan sebagai artikel baru. Halaman tool belum ada, dan query "cara menghitung komisi shopee" sudah dipegang artikel kanonik `/blogs/affiliate-marketing/cara-menghitung-komisi-program-shopee-affiliate-jangan-sampai-ada-yang-hilang`. Kuota November tetap 10 artikel baru, jadi perlu satu topik pengganti yang bisa di-brief minggu ini dan tayang paling lambat akhir November.

**Syarat topik pengganti:**

| Syarat | Detail |
|---|---|
| Tipe | Artikel baru, bukan optimasi |
| Keunikan | Belum ada halaman Accesstrade yang menjadi pemilik query utamanya (tidak ada halaman di posisi 1 sampai 10 dengan intent yang sama) |
| Relevansi | Bisa diarahkan ke CTA daftar publisher Accesstrade |
| Waktu | Relevan untuk tayang akhir November sampai Desember |
| Bucket | Bebas. Hitungan Q1 FY27 saat ini: Affiliates 24 (target 21), MCN 12 (target 9), Platform 14 (target 14), Others 4 (target 4). Jadi Affiliates tidak wajib |

**Analisis yang perlu dijalankan:**

| Kode | Analisis | Cara | Yang dicari |
|---|---|---|---|
| R1 | Query tanpa rumah | Semua query non-branded di periode utama dengan impresi 100 atau lebih dan posisi rata-rata lebih buruk dari 15 | Topik yang dicari orang, tapi belum punya artikel yang cocok |
| R2 | Halaman yang salah intent | Halaman yang mendapat impresi besar untuk query di luar topik judulnya (contoh: artikel A ranking untuk topik B) | Peluang memecah topik B jadi artikel sendiri |
| R3 | Query naik | Query dengan kenaikan impresi 100% atau lebih vs periode pembanding, minimal 50 impresi di periode utama | Tren baru |
| R4 | Query pertanyaan | Query pertanyaan (lihat kode C) dengan impresi 50 atau lebih dan CTR di bawah 1% | Pertanyaan yang belum dijawab langsung |
| R5 | Tema yang mengonversi | GA4 Organic: 20 landing page dengan Click Daftar terbanyak dan rasio Click Daftar per session tertinggi (minimal 30 sessions) | Tema yang terbukti mendorong registrasi |
| R6 | Cek ide awal | Uji tema di bawah ini dengan R1 sampai R4, lalu laporkan data masing-masing | Validasi atau tolak ide awal |

**Ide awal untuk dicek (R6).** Ini hipotesis, bukan keputusan. Pastikan dulu belum ada artikel Accesstrade yang memegangnya:

| Tema | Regex query | Alasan dicek |
|---|---|---|
| Komisi TikTok affiliate per kategori | `komisi (tiktok|tt) (affiliate|afiliasi)|berapa (persen )?komisi tiktok` | Pasangan cluster Shopee yang sudah kuat |
| Link affiliate tidak tercatat atau komisi tidak masuk (lintas platform) | `(link|komisi).*(tidak|gak|nggak) (tercatat|masuk|terhitung)` | Masalah umum publisher, bisa jadi artikel troubleshooting |
| Shopee Video affiliate | `shopee video` | Format yang dibahas di beberapa artikel Bank Konten |
| Threads untuk affiliate | `threads` | Platform yang sudah punya beberapa artikel, cek apakah ada celah |
| Pajak penghasilan affiliate / SPT | `pajak|spt|npwp|pph` | P0228 dijadwalkan Desember. Kalau datanya kuat, bisa ditarik ke November (opsi cadangan) |

**Opsi cadangan:** kalau R1 sampai R6 tidak menghasilkan topik yang memenuhi syarat, laporkan artikel Desember mana yang paling layak ditarik ke November berdasarkan data (kandidat: P0228 Pajak Affiliate, P0230 YouTube Shorts Affiliate, P0231 Shopee Video vs TikTok vs Reels, P0232 Instagram Broadcast Channel).

## 6. Prioritas pengerjaan

| Urutan | Bagian | Alasan |
|---|---|---|
| 1 | P0221 dan P0222 (bagian 4) | Paling berisiko kanibal. Hasilnya menentukan apakah tetap jadi artikel baru |
| 2 | Bagian 5 (pengganti P0220) | Kuota November bergantung pada ini |
| 3 | P0219 dan P0227 (bagian 4) | Topik musiman, butuh data waktu tayang |
| 4 | P0216 dan P0217 | Topik MCN |
| 5 | P0215, P0218, P0223 | Validasi brief yang sudah ada |

## 7. Format hasil yang diserahkan

Serahkan dalam satu file Markdown dengan nama `hasil-data-gsc-ga4-artikel-baru-november-2026.md`, berisi:

**7.1 Ringkasan per topik** (satu tabel untuk semua topik)

| ID | Total impresi query terkait | Query utama + posisi | Halaman pemilik saat ini | Potensi kanibal (ya/tidak + URL) | Rekomendasi (lanjut artikel baru / ubah jadi optimasi / ganti angle) |
|---|---|---|---|---|---|

**7.2 Detail per topik:** untuk setiap ID, cantumkan:
- Tabel 15 query teratas: query, page, klik, impresi, CTR, posisi
- Daftar query pertanyaan untuk FAQ (maksimal 8)
- Query yang naik (kode D)
- 3 sampai 5 kandidat internal link (full URL) beserta sessions Organic dan Click Daftar dari GA4
- Untuk topik musiman: tanggal mulai naik, tanggal puncak, dan rekomendasi tanggal tayang

**7.3 Topik pengganti P0220:** 3 kandidat terbaik, diurutkan:

| Peringkat | Usulan judul | Primary keyword | Bukti data (impresi, posisi, tren) | Halaman Accesstrade terdekat + risiko kanibal | Bucket | Kenapa cocok tayang akhir November |
|---|---|---|---|---|---|---|

**7.4 Catatan data:** periode yang dipakai, query yang dibuang (branded), keterbatasan (misalnya GA4 sebelum 21 April 2026 tidak tersedia), dan angka yang perlu dicek ulang lewat ekspor CSV GSC.

Setelah file selesai, Harist akan membawa hasilnya ke Chat Brief untuk finalisasi skor keunikan, kepemilikan keyword, dan pembuatan brief.
