# Peta Fitur Dashboard Publisher ACCESSTRADE

> Disalin dari Project "Accesstrade AI" pada 2026-11-19 untuk kit Claude Code. Rujukan file sudah disesuaikan ke folder `docs/`. Nama alur lama: Chat Brief = `/brief`, chat update dokumentasi = `/update`, chat optimasi productivity = `/optimasi`, chat admin dashboard = `/admin`.

## Metadata
| Item | Isi |
|---|---|
| Tanggal eksplorasi | 2026-11-05 |
| Versi prompt | 1.0 |
| Peta pembanding | Tidak ada |
| Jenis akun | Publisher, status aktif, punya lebih dari satu properti (situs) |
| Bahasa UI | Indonesia (dipilih lewat ikon bendera), tetapi UI campuran: banyak judul halaman, kolom tabel, dan tooltip tetap berbahasa Inggris. Bahasa juga sering berganti sendiri ke Inggris di antara pemuatan halaman (lihat Pertanyaan Terbuka no. 1) |
| Domain dashboard | https://db.accesstrade.co.id/ |
| Jumlah fitur tercatat | 37 |
| Ringkasan perubahan | 37 BARU, 0 BERUBAH, 0 HILANG (eksplorasi pertama) |

## Pohon Navigasi
- Header (atas)
  - Tombol CUSTOM LINK (F-CUSTOM-LINK)
  - Ikon bendera / pilihan bahasa: Indonesia, Inggris (F-LANGUAGE-SWITCH)
  - Ikon headset / live chat (F-LIVE-CHAT)
  - Menu profil (ikon avatar)
    - Profil (F-PROFILE)
    - Rekening Bank (F-BANK-ACCOUNT)
    - Properti (F-PROPERTIES)
    - Ubah Kata Sandi (F-CHANGE-PASSWORD)
    - Keluar (F-LOGOUT)
- Sidebar, blok atas: Penghasilan (IDR), Superpoint, Pilih Situs Anda (F-SITE-SELECTOR)
- Beranda (F-DASHBOARD-HOME)
- AT Challenge, label "Baru" (F-AT-CHALLENGE)
- Direktori Campaign
  - Daftar Campaign (F-CAMPAIGN-LIST)
    - Tab TERSEDIA / TERAFILIASI / PAUSE
    - DETAIL campaign (F-CAMPAIGN-DETAIL)
      - Tab OVERVIEW / AFFILIATE LINK / BANNER / VIDEO / CUSTOM LINK / DATAFEED / XTRA COMMISSION / SEARCH PRODUCT (tab tergantung campaign)
  - Custom Link (F-CUSTOM-LINK)
- Campaign Spesial, label "Baru"
  - Shopee Komisi Ekstra (F-SHOPEE-XTRA-COMMISSION)
  - Blibli Komisi Brand (F-BLIBLI-BRAND-COMMISSION)
  - Tiktok Shop (F-TIKTOK-SHOP-PRODUCT)
  - Tokopedia (F-TOKOPEDIA-SHOP-PRODUCT)
- Laporan
  - Performa (F-REPORT-PERFORMANCE)
  - Konversi (F-REPORT-CONVERSION)
  - Campaign (F-REPORT-CAMPAIGN)
  - Kreatif (F-REPORT-CREATIVE)
  - Sub ID (F-REPORT-SUBID)
  - Pembayaran (F-REPORT-PAYMENT)
- Referral
  - URL Undangan (F-REFERRAL-INVITE)
    - Tab OVERVIEW / BANNERS
  - Performa Referral (F-REFERRAL-PERFORMANCE)
  - Laporan Konversi (F-REFERRAL-CONVERSION)
- AT Tools
  - Akademi (F-AT-ACADEMY)
  - Inpages (F-INPAGES)
  - Widget (F-WIDGET)
  - Superpoint (F-SUPERPOINT)
  - Videos (F-VIDEO-LIBRARY)
- Pengaturan
  - Sub ID / Pelacakan (F-SUBID-TRACKING)
  - Postback (F-POSTBACK)
    - Tab CONVERSION DATA / SUB ID UTM / SUB ID TARGET / SUB ID OPT / CUSTOMIZE
  - Dokumentasi API (F-API-DOCS)
- Voucher (F-VOUCHER)
- Event (F-EVENT)
  - Tab UPCOMING / REGISTERED / PAST
- Pusat Bantuan (F-HELP-CENTER)

## Kartu Fitur

### F-SITE-SELECTOR · Penghasilan (IDR) / Superpoint / Pilih Situs Anda
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Sidebar, blok paling atas (tampil di semua halaman) |
| Path URL | Tidak punya URL sendiri |
| Fungsi | Menampilkan ringkasan penghasilan dan poin Superpoint, serta memilih situs (properti) yang datanya ditampilkan di dashboard |
| Elemen di halaman | Label "Penghasilan (IDR) :" (EN: "Earnings (IDR):"), label "Superpoint :" dengan satuan "Point", dropdown "Pilih Situs Anda" (EN: "Choose Your Site") berisi daftar properti |
| Aksi utama | Mengganti situs di dropdown. Menurut tooltip, isinya "Nama Situs". Tidak diubah selama eksplorasi |
| Label status yang muncul | Tidak ada |
| Teks bantuan atau batasan | Tooltip dropdown: "Nama Situs" |
| Data sensitif di halaman | Nilai Penghasilan (IDR), jumlah poin Superpoint, nama situs di dropdown |
| Kandidat screenshot | Sidebar atas dengan dropdown terbuka (angka dan nama situs diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-DASHBOARD-HOME · Beranda
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Beranda |
| Path URL | / |
| Fungsi | Halaman ringkasan: sapaan, banner promo, kartu metrik 7 hari, grafik klik dan konversi, rekomendasi campaign, voucher, Superpoint, Akademi, Inpages, dan Widget |
| Elemen di halaman | Sapaan "Hello, [nama]". Carousel banner (Previous/Next). Kartu metrik: EARNING, EPC, KLIK, KONVERSI. Grafik "Total Klik & Konversi - Periode 7 hari" (legenda Click, Conversion). Kolom "Search Campaigns". Kartu campaign dengan tombol DETAIL dan DAFTAR (pada mode EN: "APPLY NOW") serta link "LEBIH BANYAK". Section KODE VOUCHER (LEBIH BANYAK), SUPERPOINT (ikon ? dan LEBIH BANYAK), AKADEMI (kartu materi dan LEBIH BANYAK), INPAGES ("Promosikan Link Afiliasi Dalam Satu Tautan Dengan INPAGES.", tombol SELENGKAPNYA dan MULAI SEKARANG), WIDGET ("Promosikan Link Afiliasi Dengan WIDGET ACCESSTRADE Ke Situs Web / Blog Anda", tombol SELENGKAPNYA dan MULAI SEKARANG) |
| Aksi utama | DAFTAR membuka modal "Konfirmasi" (tidak ditekan). LEBIH BANYAK di campaign mengarah ke /my-campaign, di voucher ke /vouchers, di Superpoint ke superpoint.accesstrade.id, di Akademi ke academy.accesstrade.id (autologin) |
| Label status yang muncul | Label kecil di bawah metrik (persentase perubahan), tidak dicatat nilainya |
| Teks bantuan atau batasan | Tooltip EARNING: "Potensi Pendapatan yang akan diperoleh Publisher (masih dalam proses validasi)". EPC: "Potensi Pendapatan Per Klik. Digunakan oleh Publisher pengguna iklan berbayar. EPC bukanlah komisi yang didapat dari setiap klik". KLIK: "Klik yang terjadi dari link afiliasi". KONVERSI: "Konversi yang dihasilkan dari link afiliasi". SUPERPOINT: "Kumpulkan poin dari komisi yang didapatkan dan tukar dengan berbagai hadiah menarik" |
| Data sensitif di halaman | Nama publisher di sapaan, nilai EARNING/EPC/KLIK/KONVERSI, angka grafik, sidebar Penghasilan |
| Kandidat screenshot | (1) Kartu metrik dan grafik 7 hari (angka diblur). (2) Section INPAGES dan WIDGET. (3) Kartu campaign dengan tombol DETAIL dan DAFTAR |
| Panduan terkait | /publisher/guideline/laporan-performa (menyebut 'Total Click & Conversion'; label sekarang "Total Klik & Konversi - Periode 7 hari", sebagian cocok). /publisher/guideline/cara-ambil-voucher (menyebut section 'Voucher Codes'; label sekarang "KODE VOUCHER", tidak cocok persis) |
| Catatan perubahan | - |

### F-AT-CHALLENGE · AT Challenge
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Challenge (label "Baru") |
| Path URL | /at-challenge |
| Fungsi | Program tantangan untuk publisher. Teks di layar: "Selamat datang di AT Challenge! Challenge diri kamu buat ikut program ACCESSTRADE sekarang! Dapetin hadiahnya, sukses lewat aktivitasnya!" |
| Elemen di halaman | Judul "AT Challenge", banner info. Saat eksplorasi tidak ada challenge yang tampil. Modal tersembunyi berisi tombol JOIN SEKARANG, NANTI SAJA, YA, Close |
| Aksi utama | JOIN SEKARANG (diduga untuk ikut challenge, tidak ditekan) |
| Label status yang muncul | Tidak terlihat (daftar kosong) |
| Teks bantuan atau batasan | Hanya banner sambutan |
| Data sensitif di halaman | Tidak ada di tampilan kosong |
| Kandidat screenshot | Belum layak. Tunggu sampai ada challenge aktif |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-CAMPAIGN-LIST · Daftar Campaign (judul halaman: "Campaign List")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Direktori Campaign > Daftar Campaign |
| Path URL | /my-campaign (dialihkan ke /my-campaign/unaffiliated) |
| Fungsi | Mencari, menyaring, dan mendaftar campaign. Status kemitraan campaign dibagi per tab |
| Elemen di halaman | Kolom "Search by keyword". Dropdown "Kategori" (checkbox: Automotive, E-Commerce, Education, Entertainment, Financial Services, Games, Online Services, Telecommunications, Travel And Leisure). Dropdown "Tipe" (Biaya Per Klik (CPC), Biaya Per Lead (CPL), Biaya Per Aksi (CPA), Biaya Per Penjualan (CPS)). Tombol CARI. Tab TERSEDIA, TERAFILIASI, PAUSE (dengan badge jumlah). Chip filter aktif (contoh "Terafiliasi ⊗"). Kartu campaign: logo, nama, kategori, "Up To x%", tombol DETAIL dan DAFTAR (tab Tersedia) atau AMBIL LINK (tab Terafiliasi). Pita "Rewards Update" di beberapa kartu |
| Aksi utama | DAFTAR membuka modal "Konfirmasi": "Apakah Anda menyetujui semua syarat dan ketentuan untuk mempromosikan campaign yang dipilih?" dengan tombol TIDAK dan YA, SAYA SETUJU (tidak ditekan). AMBIL LINK: untuk Tokopedia mengarah ke /tokopedia-shop, untuk campaign lain tidak punya href (tidak ditekan). DETAIL membuka /campaign/{id} |
| Label status yang muncul | TERSEDIA ("Pilih dan daftar campaign yang kamu minati."), TERAFILIASI ("Campaign yang sudah disetujui dan siap untuk dipromosikan."), PAUSE ("Campaign yang sedang pause.") |
| Teks bantuan atau batasan | Kartu di tab PAUSE hanya punya tombol DETAIL. Label kategori di dropdown tetap berbahasa Inggris |
| Data sensitif di halaman | Sidebar Penghasilan. Jumlah campaign per tab (badge) sebaiknya diblur |
| Kandidat screenshot | (1) Tab TERSEDIA dengan dropdown Tipe terbuka. (2) Tab TERAFILIASI dengan tombol AMBIL LINK. (3) Modal Konfirmasi setelah klik DAFTAR |
| Panduan terkait | /publisher/guideline/cara-mendaftar-campaign: tidak cocok (masih "Apply Now" dan istilah Campaign Rekomendasi/Afiliasi/sudah didaftar/ditolak; di layar sekarang DAFTAR dan tab Tersedia/Terafiliasi/Pause). /publisher/guideline/cara-mengambil-link-affiliate: sebagian cocok ("Berafiliasi", di layar sekarang "TERAFILIASI") |
| Catatan perubahan | - |

### F-CAMPAIGN-DETAIL · Detail Campaign
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Direktori Campaign > Daftar Campaign > DETAIL |
| Path URL | /campaign/{id} |
| Fungsi | Menampilkan syarat, komisi, konversi, dan aturan trafik campaign, serta materi promosi (link, banner, video, custom link, datafeed) |
| Elemen di halaman | Header: logo, nama campaign, tombol "Preview" (membuka situs advertiser di tab baru). Filter atas: "Campaign name", Kategori, Tipe, CARI. Tab yang terlihat bergantung pada campaign. Contoh Shopee: OVERVIEW, AFFILIATE LINK, BANNER, VIDEO, CUSTOM LINK, DATAFEED, XTRA COMMISSION. TikTok Shop: OVERVIEW, SEARCH PRODUCT. Campaign CPA (travel): OVERVIEW, AFFILIATE LINK, BANNER. Isi OVERVIEW (mode ID): kotak AFFILIATE LINK dengan ikon salin (khusus campaign tertentu). Blok CAMPAIGN: Status, Periode, Kategori, Tipe, Perangkat, Aplikasi (Hanya Web / Hanya Aplikasi Mobile / Web & Aplikasi Mobile), Negara, Deskripsi. Blok KOMISI: Hadiah, Hadiah berdasarkan Kategori (link "Read more"). Blok KONVERSI: Aksi yang Dibutuhkan, Jendela Konversi, Kondisi Penolakan, Syarat Validasi. Blok TRAFIK: Pembatasan Trafik (daftar centang hijau/silang merah). Mode EN: Status, Period, Category, Type, Device, Application, Country, Description, COMMISSION, Rewards, Rewards by Categories, CONVERSION, Required Action, Conversion Window, Reject Condition, Validation Term, TRAFFIC, Traffic Restrictions |
| Aksi utama | Tab AFFILIATE LINK: daftar link bernomor (link utama dan link promo). Tab BANNER: grup banner per tema dengan jumlah, dropdown "All Size", kartu ukuran dan format (JPG) dengan tombol GET LINK. Tab VIDEO: dropdown "All Categories" (beauty_and_health, home_and_living, fashion, gadget_and_electronics, groceries), kartu video. Tab CUSTOM LINK: lihat F-CUSTOM-LINK. Tab DATAFEED: daftar URL feed per kategori (ALL BEAUTY BODY & HEALTH, ALL FASHION, ALL GADGET & ACCESSORIES, ALL HOBBIES & ACTIVITIES, ALL OTHERS) dengan ikon salin. Tab XTRA COMMISSION mengarah ke /shopee-xtra-commission. Tab SEARCH PRODUCT (TikTok) membuka /tiktok-shop di tab baru. Tidak ada yang ditekan selain pindah tab |
| Label status yang muncul | Status campaign: RUNNING. Tipe: CPS, CPA |
| Teks bantuan atau batasan | AFFILIATE LINK: "Affiliate link is a special link you can use to promote a campaign you have selected... All links below lead to the official brand or campaign site, not directly to product pages like custom links." BANNER/VIDEO: "Campaign banners/videos are provided to help you easily share affiliate links..." DATAFEED (ID): "Anda bisa mendownload data yang disediakan untuk kebutuhan afiliasi..." Tab CUSTOM LINK: daftar "Accepted URL Format" dan peringatan "Multiple links are Not Allowed" |
| Data sensitif di halaman | Isi kotak AFFILIATE LINK, URL datafeed (memuat ID situs/publisher), link hasil GET LINK, sidebar Penghasilan |
| Kandidat screenshot | (1) OVERVIEW blok CAMPAIGN, KOMISI, KONVERSI. (2) Deretan tab di bawah header. (3) Tab BANNER dengan GET LINK. (4) Tab DATAFEED (URL diblur) |
| Panduan terkait | /publisher/guideline/cara-ambil-affiliate-banner: sebagian besar cocok (Detail > Banners > Get Link > Copy; label tab sekarang "BANNER"). /publisher/guideline/cara-mengambil-link-affiliate: sebagian cocok |
| Catatan perubahan | - |

### F-CUSTOM-LINK · Generate Custom link
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Direktori Campaign > Custom Link; tombol CUSTOM LINK di header; tab CUSTOM LINK di Detail Campaign |
| Path URL | Modal, tanpa URL sendiri (#generateCustomLinkModal) |
| Fungsi | Membuat link afiliasi yang diarahkan ke halaman promo atau produk tertentu |
| Elemen di halaman | Versi modal: judul "Generate Custom link", teks penjelasan, dropdown "Your Affiliated Campaign" (placeholder "Choose campaign", berisi campaign terafiliasi), kolom "Custom Name", kolom "Custom URL", tombol RESET dan GENERATE. Elemen tersembunyi setelah generate: "Add Sub ID / Tracking", COPY, ADD NEW. Versi tab di Detail Campaign: "Create Custom Link" (Custom Name, "Accepted URL Format" berisi daftar domain yang diterima, peringatan "Multiple links are Not Allowed", Custom URL, GENERATE) dan panel "Result" (kolom "Search by keyword", rentang tanggal, tombol FILTER) |
| Aksi utama | GENERATE: menurut teks di layar membuat custom link (tidak ditekan) |
| Label status yang muncul | Tidak terlihat |
| Teks bantuan atau batasan | "Custom Link / Deep Link adalah link afiliasi yang diarahkan ke halaman promo atau halaman produk tertentu dari sebuah website. Custom link dibuat agar publisher bisa langsung mempromosikan produk spesifik di suatu website." Satu URL per generate |
| Data sensitif di halaman | Hasil custom link (memuat ID publisher), daftar Result |
| Kandidat screenshot | (1) Modal dari tombol header. (2) Tab CUSTOM LINK di Detail Campaign dengan Accepted URL Format |
| Panduan terkait | /publisher/guideline/cara-membuat-custom-link: tidak cocok (alurnya "Klik Affiliate Link" lalu tempel URL; sekarang ada modal header dan tab CUSTOM LINK terpisah) |
| Catatan perubahan | - |

### F-SHOPEE-XTRA-COMMISSION · Shopee Komisi Ekstra (judul halaman: "Shopee XTRA Commission")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Campaign Spesial > Shopee Komisi Ekstra |
| Path URL | /shopee-xtra-commission |
| Fungsi | Daftar toko Shopee dengan komisi ekstra beserta periode dan persentasenya |
| Elemen di halaman | Section "Best Promotion" (kartu promo dengan periode, "Commission Up to x%", tombol DETAIL). Dropdown campaign Shopee (Shopee ID NON KOL / KOL Tier 2 / KOL Tier 1). Dropdown urutan (Latest, Commission (%)). Kolom "Search Shop Name". Tombol FILTER. Kartu toko (pita "Promoted", periode, "Up To x%") dengan tombol GET LINK |
| Aksi utama | GET LINK membuka modal "Salin tautan afiliasi & bagikan untuk promosikan brand" dengan kolom Tautan Afiliasi dan tombol SALIN (tidak ditekan) |
| Label status yang muncul | Pita "Promoted" |
| Teks bantuan atau batasan | Opsi urutan berbahasa Inggris |
| Data sensitif di halaman | Tautan afiliasi di modal |
| Kandidat screenshot | Halaman dengan Best Promotion dan grid toko, serta modal GET LINK (link diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-BLIBLI-BRAND-COMMISSION · Blibli Komisi Brand (judul halaman: "Blibli Brand Commission")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Campaign Spesial > Blibli Komisi Brand |
| Path URL | /blibli-brand-commission |
| Fungsi | "Berikut adalah brand pilihan dari Blibli dengan komisi khusus. Pastikan kamu promosikan link dan banner untuk mendapatkan bonus dari brand di bawah ini." |
| Elemen di halaman | Banner info, kolom "Search by brand name", tombol FILTER, kartu brand (periode, "Up To : x %") dengan tombol GET LINK |
| Aksi utama | GET LINK membuka modal berisi MEDIA SOSIAL ("Kamu bisa unduh banner dan salin tautan afiliasi lalu tempel di postingan kamu", tombol UNDUH BANNER, Tautan Afiliasi, SALIN) dan SITUS WEB ("Kamu bisa salin skrip ini dan letakkan di halaman situs web kamu", Kode Tautan Afiliasi, SALIN) (tidak ditekan) |
| Label status yang muncul | Tidak ada |
| Teks bantuan atau batasan | Beberapa kartu menampilkan batas komisi, contoh "Up To : x % (Max Rp...)" |
| Data sensitif di halaman | Tautan afiliasi dan kode skrip di modal |
| Kandidat screenshot | Grid brand dan modal GET LINK (link diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-TIKTOK-SHOP-PRODUCT · Tiktok Shop (judul halaman: "Tiktok Shop Affiliate")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Campaign Spesial > Tiktok Shop; juga tab SEARCH PRODUCT di detail campaign TikTok Shop |
| Path URL | /tiktok-shop |
| Fungsi | Mencari produk TikTok Shop dan mengambil link afiliasi per produk |
| Elemen di halaman | Kolom "Product Name", "Min. Price", "Max. Price". Dropdown "Semua Kategori" (20 kategori, contoh Beauty & Personal Care, Food & Beverages, Phones & Electronics, Muslim Fashion). Dropdown "All Commission" (Under 3%, 3% - 5%, 5% - 10%, 10% - 15%, More Then 15%). Dropdown "Product Sold" (Under 50 ... More Then 1000). Dropdown "Store Rating" (> 3.9 (Good), > 4.2 (Hight), > 4.5 (Super)). Tombol CARI. Kartu produk (gambar, nama, harga, toko, "terjual / Tersedia", "Up to x% / Earn: Rp...") dengan tombol GET LINK. Paginasi Prev / Page n / Next |
| Aksi utama | GET LINK membuka modal "Kamu bisa salin link afiliasi dan tempelkan di postinganmu" (Link Afiliasi, SALIN) dengan opsi "Get link now or customize SubID as needed": Get Link Now / Using Sub ID / Generate Link Now (tidak ditekan) |
| Label status yang muncul | Tidak ada |
| Teks bantuan atau batasan | Ada salah ketik di opsi: "More Then", "Hight" |
| Data sensitif di halaman | Link afiliasi di modal |
| Kandidat screenshot | Baris filter dan grid produk, serta modal GET LINK dengan opsi Sub ID |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-TOKOPEDIA-SHOP-PRODUCT · Tokopedia (judul halaman: "Tokopedia Shop Affiliate")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Campaign Spesial > Tokopedia; juga AMBIL LINK pada kartu Tokopedia di tab TERAFILIASI |
| Path URL | /tokopedia-shop |
| Fungsi | Mencari produk Tokopedia untuk diambil link afiliasinya (struktur filter sama dengan Tiktok Shop) |
| Elemen di halaman | Product Name, Min. Price, Max. Price, Semua Kategori, All Commission, Product Sold, Store Rating, CARI. Indikator LOADING |
| Aksi utama | Diduga GET LINK per produk. Tidak bisa dipastikan karena daftar produk tidak selesai dimuat |
| Label status yang muncul | Tidak terlihat |
| Teks bantuan atau batasan | Modal link sama dengan Tiktok Shop (ada di DOM) |
| Data sensitif di halaman | Link afiliasi di modal |
| Kandidat screenshot | Belum layak (halaman tertahan di LOADING lebih dari 6 detik) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-REPORT-PERFORMANCE · Performa (judul halaman: "Performance Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Performa |
| Path URL | /performance |
| Fungsi | Ringkasan performa per bulan dalam bentuk grafik dan tabel |
| Elemen di halaman | Pemilih periode (default sekitar 11 bulan). Dropdown Tanggal Konversi / Tanggal Konfirmasi. Dropdown Semua Status / Disetujui / Menunggu / Ditolak. Dropdown Semua Campaign. Tombol LIHAT REPORT. Setelah report tampil: dua dropdown metrik grafik dipisah "VS" (Impression, Clicks, CTR, Conversions, CVR, Transaction Items, Transaction amount, Reward, EPC), grafik area, ikon UNDUH (CSV). Kolom tabel: Month, Impression, Clicks, CTR, Conversions, CVR, Transaction Items, Transaction amount (IDR), Reward (IDR), EPC (IDR). Ikon expand di tiap baris bulan |
| Aksi utama | LIHAT REPORT menampilkan laporan (ditekan, hanya filter tampilan). UNDUH mengunduh CSV (tidak ditekan) |
| Label status yang muncul | Disetujui, Menunggu, Ditolak |
| Teks bantuan atau batasan | Sebelum ditekan: "Klik tombol di atas untuk menampilkan laporan." |
| Data sensitif di halaman | Semua angka tabel dan grafik, terutama Transaction amount, Reward, EPC |
| Kandidat screenshot | Baris filter dan grafik dengan dropdown metrik (tabel diblur) |
| Panduan terkait | /publisher/guideline/laporan-performa: tidak cocok (menyebut sub-section Conversion, Daily, Monthly, Creative, Monthly Device, Daily Device dan tombol 'Dashboard'; menu sekarang Performa, Konversi, Campaign, Kreatif, Sub ID, Pembayaran) |
| Catatan perubahan | - |

### F-REPORT-CONVERSION · Konversi (judul halaman: "Conversion Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Konversi |
| Path URL | /conversion |
| Fungsi | Laporan konversi per campaign untuk periode tertentu |
| Elemen di halaman | Kartu ringkasan: "Konversi Terjadi Bulan Ini", "Hadiah Disetujui Bulan Lalu (IDR)", "Konversi (terjadi)", "Hadiah (IDR)", masing-masing dengan ikon ?. Filter periode, Tanggal Konversi/Tanggal Konfirmasi, Semua Status/Disetujui/Menunggu/Ditolak, Semua Campaign. Tombol EMAIL dan LIHAT REPORT. Kolom tabel: checkbox, Campaign Name, Conversions, Reward (IDR). Tiap baris punya ikon unduh dan ikon ? |
| Aksi utama | LIHAT REPORT (ditekan). EMAIL: dari labelnya diduga mengirim laporan ke email (tidak ditekan). Ikon unduh per baris (tidak ditekan) |
| Label status yang muncul | Disetujui, Menunggu, Ditolak |
| Teks bantuan atau batasan | Tooltip tidak sesuai labelnya. "Konversi Terjadi Bulan Ini": "Saldo yang akan dibawa ke bulan berikutnya..." "Hadiah Disetujui Bulan Lalu (IDR)": "Jumlah dari akumulasi Disetujui Bulan Lalu dengan Total Saldo Hingga Bulan ini". "Konversi (terjadi)" dan "Hadiah (IDR)": "Komisi yang dibayarkan pada bulan ini. Akan menjadi 0 apabila telah dibayarkan" |
| Data sensitif di halaman | Angka di keempat kartu, Conversions, Reward |
| Kandidat screenshot | Kartu ringkasan dan filter, serta tabel per campaign (angka diblur) |
| Panduan terkait | /publisher/guideline/laporan-performa (tidak cocok, lihat di atas) |
| Catatan perubahan | - |

### F-REPORT-CAMPAIGN · Campaign (judul halaman: "Campaign Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Campaign |
| Path URL | /by_campaign |
| Fungsi | Membandingkan performa antar campaign |
| Elemen di halaman | Periode, Tanggal Konversi/Tanggal Konfirmasi, Semua Status/Setujui/Menunggu/Tolak, LIHAT REPORT. Setelah tampil: dropdown Top 10 / Top 15, "Campaigns sorted by" (Campaign Name, Impression, Clicks, CTR, Conversions, CVR, Transaction Items, Transaction amount, Reward, EPC), grafik batang horizontal, tombol UNDUH. Kolom: Campaign ID, Campaign Name, Impression, Clicks, CTR, Conversions, CVR, Transaction Items, Transaction amount (IDR), Reward (IDR), EPC (IDR) |
| Aksi utama | LIHAT REPORT (ditekan). UNDUH (tidak ditekan) |
| Label status yang muncul | Setujui, Menunggu, Tolak (EN: Approve, Pending, Reject). Label ini berbeda dengan Performa/Konversi yang memakai Disetujui/Ditolak |
| Teks bantuan atau batasan | "Klik tombol di atas untuk menampilkan laporan dengan tanggal periode." |
| Data sensitif di halaman | Angka tabel dan grafik |
| Kandidat screenshot | Grafik Top 10 dengan dropdown sort |
| Panduan terkait | /publisher/guideline/laporan-performa (bagian LAPORAN CAMPAIGN, alurnya tidak cocok) |
| Catatan perubahan | - |

### F-REPORT-CREATIVE · Kreatif (judul halaman: "Creative Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Kreatif |
| Path URL | /creative |
| Fungsi | Performa per kreatif (link, banner, custom link) |
| Elemen di halaman | Periode (default beberapa hari terakhir), Tanggal Konversi/Konfirmasi, Semua Status/Setujui/Menunggu/Tolak, Semua Campaign, LIHAT REPORT. Setelah tampil: Top 10/Top 15, "Creatives sorted by", grafik batang, UNDUH. Kolom: Creative ID, Creative Name, Campaign ID, Campaign Name, Impression, Clicks, CTR, Conversions, CVR, Transaction Items, Transaction amount (IDR), Reward (IDR), EPC |
| Aksi utama | LIHAT REPORT (ditekan). UNDUH (tidak ditekan) |
| Label status yang muncul | Setujui, Menunggu, Tolak |
| Teks bantuan atau batasan | Nama custom link buatan publisher muncul di Creative Name |
| Data sensitif di halaman | Creative Name (nama custom link publisher), angka |
| Kandidat screenshot | Grafik dan header tabel (isi diblur) |
| Panduan terkait | /publisher/guideline/laporan-performa (bagian Creative, alurnya tidak cocok) |
| Catatan perubahan | - |

### F-REPORT-SUBID · Sub ID (judul halaman: "SubID Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Sub ID |
| Path URL | /by_subid |
| Fungsi | Performa berdasarkan parameter Sub ID |
| Elemen di halaman | Periode. Dropdown parameter (utm_source, utm_medium, utm_campaign, utm_term, target_usia, target_jenis_kelamin, target_minat, target_status_perkawinan, ...). Semua Status/Disetujui/Menunggu/Ditolak. Semua Campaign. LIHAT REPORT. Setelah tampil: Top 10, "Campaigns sorted by", grafik, UNDUH. Kolom: [nama parameter], Campaign ID, Campaign Name, Clicks, Conversions, CVR, Transaction Amount, Reward (IDR), EPC (IDR) |
| Aksi utama | LIHAT REPORT (ditekan). UNDUH (tidak ditekan) |
| Label status yang muncul | Disetujui, Menunggu, Ditolak. Nilai "unknown" untuk klik tanpa Sub ID |
| Teks bantuan atau batasan | Tidak ada |
| Data sensitif di halaman | Nilai Sub ID dan angka |
| Kandidat screenshot | Dropdown parameter terbuka dan header tabel |
| Panduan terkait | /publisher/guideline/sub-id (isi belum terbaca, lihat Pertanyaan Terbuka) |
| Catatan perubahan | - |

### F-REPORT-PAYMENT · Pembayaran (judul halaman: "Payment Report")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Laporan > Pembayaran |
| Path URL | /payment |
| Fungsi | Status pembayaran komisi dan riwayat invoice |
| Elemen di halaman | Kartu "Your Lifetime Reward (IDR)", "Minimum Payment Amount (IDR)" (progress bar menuju batas minimum). Blok "Process Stages (IDR)": Reward Approved, Payment in Progress, Payment Held Until Requirement Met, masing-masing dengan tombol DETAIL. Kolom Period dan "No. Invoice", tombol SHOW REPORT. Kolom tabel: checkbox, Invoice (badge link), Bulan Yang Disetujui, Komisi Yang Disetujui (IDR), VAT, Pajak Penghasilan, Jumlah Komisi Dibayar (IDR), Tanggal Pembayaran Komisi. Ikon unduh per baris |
| Aksi utama | SHOW REPORT (ditekan). DETAIL membuka modal "Total Affiliate Program Commission" dengan tab PAID dan UNDER PROCESSING (tidak dibuka). Ikon unduh invoice (tidak ditekan) |
| Label status yang muncul | PAID, UNDER PROCESSING |
| Teks bantuan atau batasan | "Total reward paid to you since registration with ACCESSTRADE". "Minimum payment for Indonesia bank account is IDR 100,000". Tooltip Reward Approved: "Jumlah dari akumulasi Disetujui Bulan Lalu dengan Total Saldo Hingga Bulan ini". Payment in Progress: "Komisi yang dibayarkan pada bulan ini. Akan menjadi 0 apabila telah dibayarkan". Payment Held: "Saldo yang akan dibawa ke bulan berikutnya. Apabila tidak ada maka akan bernilai 0". Halaman ini tetap berbahasa Inggris setelah 3x muat ulang, tetapi kolom tabelnya berbahasa Indonesia |
| Data sensitif di halaman | Semua nominal, nomor invoice |
| Kandidat screenshot | Kartu Process Stages dan header tabel invoice (semua nominal dan nomor invoice diblur) |
| Panduan terkait | /publisher/guideline/informasi-pembayaran: tidak cocok (masih "Dashboard > Setting Akun > Akun Bank > Edit" dan label lama seperti "Saldo Dari Bulan (n)"; halaman panduan sendiri menyebut akan diperbarui) |
| Catatan perubahan | - |

### F-REFERRAL-INVITE · URL Undangan (judul halaman: "Referral")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Referral > URL Undangan |
| Path URL | /referral |
| Fungsi | Program referral: mengajak publisher atau influencer lain mendaftar lewat link referral |
| Elemen di halaman | Tab OVERVIEW dan BANNERS. OVERVIEW: kotak REFERRAL LINK dan INFLUENCER LINK (ikon salin), blok CAMPAIGN (Status, Period, Application, Category, Type, Description), COMMISSION (Rewards), CONVERSION (Required Action, Conversion Window, Reject Condition, Validation Term), TRAFFIC (Device, Country, Traffic Restrictions). BANNERS: "Referral Banner", kartu ukuran (1080x1920, 1080x1080, 600x300, JPG) dengan GET LINK |
| Aksi utama | Ikon salin link, GET LINK banner (tidak ditekan) |
| Label status yang muncul | RUNNING. Tipe CPA (tooltip "Click Per Action") |
| Teks bantuan atau batasan | Struktur hadiah tertulis di blok COMMISSION (bertingkat). Ajakan: "Yuk, segera salin link referral Anda dan ajak teman Anda sebanyak-banyaknya!" Tooltip "Click Per Action" untuk CPA tampak keliru |
| Data sensitif di halaman | Referral Link dan Influencer Link (memuat kode referral) |
| Kandidat screenshot | Tab OVERVIEW (link diblur) dan tab BANNERS |
| Panduan terkait | Halaman publik https://accesstrade.co.id/publisher/referral (ada di navigasi situs, isinya belum dibandingkan) |
| Catatan perubahan | - |

### F-REFERRAL-PERFORMANCE · Performa Referral (judul halaman: "Referee Performance")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Referral > Performa Referral |
| Path URL | /referee-performance |
| Fungsi | Performa publisher atau influencer yang diajak |
| Elemen di halaman | Periode. Dropdown Performa Referee / Performance by Campaign. Conversion Date / Confirmation Date. Semua Tipe Referee / Publisher / Influencer. All Status / Approve / Pending / Reject. Tombol SHOW REPORT |
| Aksi utama | SHOW REPORT (ditekan) |
| Label status yang muncul | Approve, Pending, Reject |
| Teks bantuan atau batasan | Saat tidak ada data: "NO DATA IS AVAILABLE FOR THIS PERIOD." |
| Data sensitif di halaman | Data referee bila ada |
| Kandidat screenshot | Baris filter |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-REFERRAL-CONVERSION · Laporan Konversi (judul halaman: "Referee Conversion")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Referral > Laporan Konversi |
| Path URL | /referee-conversion |
| Fungsi | Konversi yang dihasilkan dari referral |
| Elemen di halaman | Periode. Conversion Date / Confirmation Date / Paid Date. "Choose Campaign". Tombol SHOW REPORT |
| Aksi utama | SHOW REPORT (ditekan) |
| Label status yang muncul | Tidak terlihat |
| Teks bantuan atau batasan | Tooltip tersembunyi: "Total Konversi" dan "Saldo yang akan dibawa ke bulan berikutnya. Apabila tidak ada maka akan bernilai 0". Saat kosong: "NO DATA IS AVAILABLE FOR THIS PERIOD." |
| Data sensitif di halaman | Data konversi referral bila ada |
| Kandidat screenshot | Baris filter |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-AT-ACADEMY · Akademi
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Tools > Akademi; juga section AKADEMI di Beranda |
| Path URL | Tidak ada (memanggil autologin('ata') ke academy.accesstrade.id) |
| Fungsi | Membuka platform belajar AT Academy dengan login otomatis |
| Elemen di halaman | Menu sidebar. Di Beranda: kartu materi (gambar, durasi, judul, nama kelas) |
| Aksi utama | Klik menu membuka AT Academy (tidak dibuka, di luar domain dashboard) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | URL autologin memuat token, jangan ditampilkan |
| Kandidat screenshot | Section AKADEMI di Beranda |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-INPAGES · Inpages
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Tools > Inpages; juga section INPAGES di Beranda |
| Path URL | Tidak ada (autologin('inpages')) |
| Fungsi | "Dengan INPAGE.ES memberikan cara termudah untuk menghubungkan semua konten Anda dan mengubah trafik menjadi lebih banyak pengikut dan penjualan." |
| Elemen di halaman | Di Beranda: tombol SELENGKAPNYA dan MULAI SEKARANG |
| Aksi utama | Membuka Inpages dengan login otomatis (tidak dibuka) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | - |
| Kandidat screenshot | Section INPAGES di Beranda |
| Panduan terkait | /publisher/guideline/aplikasi-inpages (konsep cocok, alur di aplikasinya belum dicek) |
| Catatan perubahan | - |

### F-WIDGET · Widget
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Tools > Widget; juga section WIDGET di Beranda |
| Path URL | Tidak ada (autologin('widget')) |
| Fungsi | "Buat dan pasang widget ke situs Anda untuk menampilkan Kode Voucher atau Tombol Link Afiliasi." |
| Elemen di halaman | Di Beranda: SELENGKAPNYA dan MULAI SEKARANG |
| Aksi utama | Membuka Widget dengan login otomatis (tidak dibuka) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | - |
| Kandidat screenshot | Section WIDGET di Beranda |
| Panduan terkait | /publisher/guideline/widget: kemungkinan tidak cocok (masih menyuruh login dengan email dan password, padahal dashboard sekarang memakai autologin) |
| Catatan perubahan | - |

### F-SUPERPOINT · Superpoint
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Tools > Superpoint; juga section SUPERPOINT di Beranda |
| Path URL | Tidak ada (autologin('superpoint') ke superpoint.accesstrade.id) |
| Fungsi | "Kumpulkan poin dari komisi yang didapatkan dan tukar dengan berbagai hadiah menarik" |
| Elemen di halaman | Di Beranda: judul SUPERPOINT dengan ikon ? dan LEBIH BANYAK |
| Aksi utama | Membuka Superpoint (tidak dibuka) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | Jumlah poin di sidebar |
| Kandidat screenshot | Section SUPERPOINT di Beranda |
| Panduan terkait | Halaman publik https://accesstrade.co.id/publisher/superpoint (belum dibandingkan) |
| Catatan perubahan | - |

### F-VIDEO-LIBRARY · Videos
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | AT Tools > Videos (membuka tab baru) |
| Path URL | /videos |
| Fungsi | Pustaka video promosi produk yang sudah memuat link afiliasi |
| Elemen di halaman | Teks info (EN): "Campaign videos are provided to help you easily share affiliate links..." Dropdown "All Categories" (beauty_and_health, home_and_living, fashion, gadget_and_electronics, groceries). Grid kartu video dengan tombol play |
| Aksi utama | Klik video membuka modal "Video" dengan tombol Copy, Download Video, Close (tidak ditekan) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Nama kategori ditampilkan dalam format slug (huruf kecil, garis bawah) |
| Data sensitif di halaman | Link yang disalin |
| Kandidat screenshot | Grid video dengan dropdown kategori |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-SUBID-TRACKING · Sub ID / Pelacakan (judul halaman: "Tracking URL")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Pengaturan > Sub ID / Pelacakan |
| Path URL | /subid |
| Fungsi | Menambahkan parameter kustom ke tracking URL dan melihat pratinjaunya |
| Elemen di halaman | Judul "Tracking URL" dengan ikon ?. Bagian "Parameter": kolom "Nama Kustom" dan "Nilai Kustom", tombol + (tambah baris), tombol PERBARUI. Panel "Pratinjau" berisi contoh URL |
| Aksi utama | PERBARUI menyimpan parameter (tidak ditekan) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Tooltip ikon ? tidak muncul saat di-hover |
| Data sensitif di halaman | URL pratinjau (bisa memuat ID) |
| Kandidat screenshot | Form Parameter dan Pratinjau |
| Panduan terkait | /publisher/guideline/sub-id (isi belum terbaca) |
| Catatan perubahan | - |

### F-POSTBACK · Postback
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Pengaturan > Postback |
| Path URL | /postback |
| Fungsi | Mengatur URL postback untuk menerima data konversi ke server publisher |
| Elemen di halaman | Kolom "Masukan URL anda" (EN: "Enter the URL of your site"), ikon ?. Bagian PARAMETER dengan tab CONVERSION DATA ({ACTION_ID}, {BANNER_ID}, {BROWSER}, {CATEGORY_ID}, {CATEGORY_NAME}, {CITY}, {CLICK_DATE}, {CONFIRMED_DATE}, {COUNTRY}, {DEVICE_BRAND}, {DEVICE_TYPE}, {GOODS_ID}, {IP_ADDRESS}, {LANGUAGE}, {MERCHANT_CAMPAIGN_NAME}, {MERCHANT_CAMPAIGN_NO}, {PARTNER_SITE_NAME}, {PARTNER_SITE_NO}, {REFERER}, {REFERRAL_DOMAIN}, {REFERRAL_URL}, {REWARD}, {SALES_DATE}, {SALES_LOG_STATUS}, {SEQ_NO}, {TOTAL_PRICE}, {USER_AGENT}, {VERIFY}, {CUSTOMER_TYPE}), SUB ID UTM ({UTM_SOURCE}, {UTM_MEDIUM}, {UTM_CONTENT}, {UTM_CAMPAIGN}, {UTM_TERM}), SUB ID TARGET ({TARGET_AGE} sampai {TARGET_INCOME}, 10 parameter), SUB ID OPT ({OPT_1} sampai {OPT_10}), CUSTOMIZE (Name, Value). Tiap parameter punya kolom "Name" dan tombol +. Radio Active / Inactive. Checkbox "We will resend postback data if there is an update in status or data from each conversion." Panel PREVIEW. Tombol UPDATE POSTBACK |
| Aksi utama | UPDATE POSTBACK menyimpan pengaturan (tidak ditekan) |
| Label status yang muncul | Active, Inactive |
| Teks bantuan atau batasan | Tiap parameter punya tooltip, contoh {ACTION_ID}: "User action ID for distinguishing different user actions of the same merchant campaign". {BANNER_ID}: "ID of ACCESSTRADE banner which user clicked" |
| Data sensitif di halaman | URL postback milik publisher |
| Kandidat screenshot | Tab CONVERSION DATA dengan PREVIEW, dan radio Active/Inactive |
| Panduan terkait | /publisher/guideline/postback: tidak cocok (menyebut "Dashboard Advance", menu "Seting Akun" > "Website", tombol 'Edit'; sekarang Pengaturan > Postback langsung dengan tombol UPDATE POSTBACK) |
| Catatan perubahan | - |

### F-API-DOCS · Dokumentasi API
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Pengaturan > Dokumentasi API |
| Path URL | Link eksternal https://support.accesstrade.global/#api |
| Fungsi | Dokumentasi API untuk publisher (dari label menu) |
| Elemen di halaman | Tidak dibuka |
| Aksi utama | - |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | - |
| Kandidat screenshot | Menu Pengaturan yang terbuka |
| Panduan terkait | Dokumen ini sendiri |
| Catatan perubahan | - |

### F-VOUCHER · Voucher (judul halaman: "Voucher Code & Deals")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Voucher |
| Path URL | /vouchers |
| Fungsi | Daftar kode voucher dan deals dari advertiser |
| Elemen di halaman | Kolom "Search by keyword", dropdown "Pilih campaign", tombol FILTER. Tab kategori dengan badge jumlah: SEMUA, TRAVEL & HOTELS, ELECTRONICS, FASHION, BEAUTY & HEALTH, HOME & LIVING, FOOD & GROCERY |
| Aksi utama | Tidak terlihat karena daftar kosong (semua kategori 0) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | - |
| Kandidat screenshot | Belum layak (kosong) |
| Panduan terkait | /publisher/guideline/cara-ambil-voucher: belum bisa dipastikan (menyebut tombol Copy, Belanja Sekarang, Bagikan, yang tidak terlihat karena data kosong) |
| Catatan perubahan | - |

### F-EVENT · Event
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Event |
| Path URL | /events |
| Fungsi | Daftar webinar AT Talk dan pendaftarannya |
| Elemen di halaman | Tab UPCOMING, REGISTERED, PAST (dengan badge jumlah). Section "Why Join AT Talk?" (Expert Speakers, Insightful Material, Free Learning). Section "What Do AT Talk Friends Say?" (testimoni) |
| Aksi utama | Tidak terlihat (tab UPCOMING kosong) |
| Label status yang muncul | UPCOMING, REGISTERED, PAST |
| Teks bantuan atau batasan | Saat kosong: "NO UPCOMING EVENT IS AVAILABLE". Ada salah ketik di teks: "manarik", "AT Talksecara" |
| Data sensitif di halaman | - |
| Kandidat screenshot | Tab event dan section Why Join AT Talk |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-HELP-CENTER · Pusat Bantuan
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Pusat Bantuan |
| Path URL | Link eksternal https://accesstrade.co.id/publisher/guideline |
| Fungsi | Membuka halaman "ACCESSTRADE Publisher Guideline" |
| Elemen di halaman | Daftar 13 panduan (lihat tabel Panduan Resmi) |
| Aksi utama | - |
| Label status yang muncul | - |
| Teks bantuan atau batasan | URL dengan garis miring akhir (/publisher/guideline/) menghasilkan 404 Not Found. URL tanpa garis miring berfungsi |
| Data sensitif di halaman | - |
| Kandidat screenshot | Halaman indeks guideline |
| Panduan terkait | Lihat tabel Panduan Resmi |
| Catatan perubahan | - |

### F-LIVE-CHAT · Live chat (ikon headset)
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Header > ikon headset |
| Path URL | Panel samping, tanpa URL |
| Fungsi | Chat langsung dengan tim ACCESSTRADE Indonesia |
| Elemen di halaman | Judul "Accesstrade Indonesia", "We are online", "and ready to help", avatar agen, kolom "Enter message...", ikon lampiran, tombol tutup |
| Aksi utama | Mengirim pesan (tidak dilakukan) |
| Label status yang muncul | "We are online" |
| Teks bantuan atau batasan | UI chat berbahasa Inggris |
| Data sensitif di halaman | Nama agen dan isi percakapan |
| Kandidat screenshot | Panel chat terbuka (nama agen diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-LANGUAGE-SWITCH · Pilihan bahasa (ikon bendera)
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Header > ikon bendera |
| Path URL | Tanpa URL (fungsi change_ln) |
| Fungsi | Mengganti bahasa UI |
| Elemen di halaman | Opsi "Indonesia" dan "Inggris" (EN: "English") |
| Aksi utama | Memilih bahasa. Indonesia dipilih sesuai instruksi eksplorasi |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Pilihan bahasa tidak konsisten antar halaman (lihat Pertanyaan Terbuka no. 1) |
| Data sensitif di halaman | - |
| Kandidat screenshot | Dropdown bahasa terbuka |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-PROFILE · Profil (judul halaman: "My Profile")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Menu profil > Profil |
| Path URL | /my-account |
| Fungsi | Data diri dan kontak publisher |
| Elemen di halaman | Tab PROFILE, BANK ACCOUNT, PROPERTIES, CHANGE PASSWORD. Bagian Biodata: First Name, Last Name, Gender, Birthdate. Contact: Email (tidak bisa diubah), Phone Number. Address: Province, City, ZIP Code, Address. Avatar dengan ikon kamera. Tombol UPDATE |
| Aksi utama | UPDATE menyimpan perubahan profil (tidak ditekan) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Ikon ? di judul halaman |
| Data sensitif di halaman | Semua isian (nama, gender, tanggal lahir, email, nomor HP, alamat, avatar). Wajib diblur penuh |
| Kandidat screenshot | Form kosong atau akun dummy saja |
| Panduan terkait | /publisher/guideline/setting-akun: tidak cocok (menyuruh klik 'Settings' di menu profil; sekarang menu profil berisi Profil, Rekening Bank, Properti, Ubah Kata Sandi) |
| Catatan perubahan | - |

### F-BANK-ACCOUNT · Rekening Bank (judul halaman: "Bank Account")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Menu profil > Rekening Bank |
| Path URL | /my-account/bank-account |
| Fungsi | Mengelola rekening pembayaran, dilindungi OTP |
| Elemen di halaman | Kotak "Account Verification": "To help keep your account and information secure we need to confirm your identity with a One-Time Password (OTP)." "We will send the verification code to your email address". Tombol SEND OTP |
| Aksi utama | SEND OTP mengirim kode ke email (tidak ditekan). Form rekening tidak terlihat sebelum verifikasi |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Akses form rekening wajib OTP |
| Data sensitif di halaman | Data rekening (setelah OTP) |
| Kandidat screenshot | Kotak Account Verification |
| Panduan terkait | /publisher/guideline/setting-akun dan /informasi-pembayaran: tidak cocok (tidak menyebut OTP, jalur menu lama) |
| Catatan perubahan | - |

### F-PROPERTIES · Properti (judul halaman: "Properties")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Menu profil > Properti |
| Path URL | /my-account/properties |
| Fungsi | Daftar situs atau akun media milik publisher |
| Elemen di halaman | Kartu per properti: nama, URL, "Site ID", ikon pensil (edit). Modal EDIT: Site Name, Site URL, Type (BLOG, SOCIAL_NETWORK, COUPON, CASHBACK, REWARD_POINT, FORUM, COMMUNITY, PORTAL, SEARCH_ENGINE, AFFILIATE_NETWORK, OTHER_ADVERTISING_NETWORK, INFLUENCER, MEDIA_BUYER, COMPARISON, MEDIA), sumber trafik (Pencarian Organik, Pencarian Berbayar, Facebook Ads, YouTube Channel, Instagram, dan lain-lain), metode promosi (Review Produk dan Jasa, Kupon, Cashback, Lead Generation, dan lain-lain), Category (kategori dan subkategori), tombol PROCESS |
| Aksi utama | PROCESS menyimpan perubahan properti (tidak ditekan) |
| Label status yang muncul | - |
| Teks bantuan atau batasan | Tidak terlihat tombol tambah properti baru |
| Data sensitif di halaman | Nama situs, URL situs, Site ID |
| Kandidat screenshot | Modal EDIT (nama, URL, dan ID diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-CHANGE-PASSWORD · Ubah Kata Sandi (judul halaman: "Change Password")
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Menu profil > Ubah Kata Sandi |
| Path URL | /my-account/change-password |
| Fungsi | Mengganti kata sandi akun |
| Elemen di halaman | Info "Create a new secure password for user [email]". Kolom Current Password, New Password, Re-enter New Password (ikon mata). Tombol UPDATE (nonaktif sampai syarat terpenuhi) |
| Aksi utama | UPDATE menyimpan kata sandi baru (tidak ditekan) |
| Label status yang muncul | Checklist syarat |
| Teks bantuan atau batasan | "Your Password must meet these requirements:" At Least 8 Characters, At Least 1 Uppercase Letter, At Least One Number, Password And Confirmation Must Match |
| Data sensitif di halaman | Email di teks info |
| Kandidat screenshot | Form kosong dengan checklist syarat (email diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

### F-LOGOUT · Keluar
| Item | Isi |
|---|---|
| Status | BARU |
| Jalur menu | Menu profil > Keluar |
| Path URL | Tidak tercatat (tombol tanpa href) |
| Fungsi | Keluar dari akun (dari label) |
| Elemen di halaman | Item menu "Keluar" |
| Aksi utama | Tidak ditekan |
| Label status yang muncul | - |
| Teks bantuan atau batasan | - |
| Data sensitif di halaman | Dropdown profil menampilkan nama dan email publisher |
| Kandidat screenshot | Dropdown menu profil (nama dan email diblur) |
| Panduan terkait | Tidak ditemukan |
| Catatan perubahan | - |

## Panduan Resmi yang Ditemukan
| Judul | URL | Fitur terkait (F-ID) | Masih cocok dengan dashboard? | Catatan |
|---|---|---|---|---|
| ACCESSTRADE Publisher Guideline (indeks) | https://accesstrade.co.id/publisher/guideline | F-HELP-CENTER | Ya (sebagai indeks) | Versi dengan garis miring akhir mengembalikan 404 |
| Cara Daftar ACCESSTRADE | https://accesstrade.co.id/publisher/guideline/cara-daftar-accesstrade | - | Tidak dicek | Tentang pendaftaran dan login, di luar dashboard |
| Cara Mendaftar Campaign | https://accesstrade.co.id/publisher/guideline/cara-mendaftar-campaign | F-CAMPAIGN-LIST | Tidak | Masih "Apply Now" dan 5 istilah status lama; di layar sekarang DAFTAR dan tab TERSEDIA/TERAFILIASI/PAUSE |
| Cara Mengambil Link Afiliasi | https://accesstrade.co.id/publisher/guideline/cara-mengambil-link-affiliate | F-CAMPAIGN-LIST, F-CAMPAIGN-DETAIL | Sebagian | "Berafiliasi" sekarang "TERAFILIASI"; ada tombol AMBIL LINK baru |
| Cara Membuat Custom Link | https://accesstrade.co.id/publisher/guideline/cara-membuat-custom-link | F-CUSTOM-LINK | Tidak | Belum menyebut tombol CUSTOM LINK di header dan tab CUSTOM LINK |
| Aplikasi Inpages | https://accesstrade.co.id/publisher/guideline/aplikasi-inpages | F-INPAGES | Belum bisa dipastikan | Aplikasi Inpages tidak dibuka |
| Laporan Performa | https://accesstrade.co.id/publisher/guideline/laporan-performa | F-REPORT-PERFORMANCE, F-REPORT-CONVERSION, F-REPORT-CAMPAIGN, F-REPORT-CREATIVE | Tidak | Struktur submenu lama (Daily, Monthly, Device) |
| Informasi Pembayaran | https://accesstrade.co.id/publisher/guideline/informasi-pembayaran | F-REPORT-PAYMENT, F-BANK-ACCOUNT | Tidak | Jalur "Setting Akun > Akun Bank > Edit" dan label lama; halaman menyebut akan diperbarui |
| Widget | https://accesstrade.co.id/publisher/guideline/widget | F-WIDGET | Kemungkinan tidak | Masih login manual; dashboard sekarang autologin |
| Cara Ambil Voucher | https://accesstrade.co.id/publisher/guideline/cara-ambil-voucher | F-VOUCHER, F-DASHBOARD-HOME | Belum bisa dipastikan | "Voucher Codes" sekarang "KODE VOUCHER"; data voucher kosong |
| Cara Ambil Banner | https://accesstrade.co.id/publisher/guideline/cara-ambil-affiliate-banner | F-CAMPAIGN-DETAIL | Sebagian besar | Label tab sekarang "BANNER", tombol "GET LINK" sama |
| Setting Akun | https://accesstrade.co.id/publisher/guideline/setting-akun | F-PROFILE, F-BANK-ACCOUNT | Tidak | Tidak ada menu 'Settings'; rekening bank sekarang wajib OTP |
| Sub ID | https://accesstrade.co.id/publisher/guideline/sub-id | F-SUBID-TRACKING, F-REPORT-SUBID | Belum bisa dipastikan | Isi halaman tidak terbaca oleh alat eksplorasi |
| Postback | https://accesstrade.co.id/publisher/guideline/postback | F-POSTBACK | Tidak | Masih "Dashboard Advance" dan "Seting Akun > Website" |

## Log Perubahan
| F-ID | Status | Apa yang berubah |
|---|---|---|
| Semua (37 fitur) | BARU | Eksplorasi pertama |

## Pertanyaan Terbuka
| No | Fitur (F-ID) | Pertanyaan | Kenapa tidak bisa dipastikan |
|---|---|---|---|
| 1 | F-LANGUAGE-SWITCH (semua halaman) | Kenapa bahasa UI berganti sendiri ke Inggris walau Indonesia sudah dipilih? | Terjadi acak di antara pemuatan halaman (contoh: Daftar Campaign, Detail Campaign, Laporan Campaign, Pembayaran, Profil). Pembayaran tetap EN setelah 3x muat ulang. Bisa jadi bug sesi atau server |
| 2 | F-CAMPAIGN-LIST | Apa yang terjadi saat AMBIL LINK ditekan pada campaign non-Tokopedia? | Tombol tanpa href dan ragu apakah ia membuat link baru, jadi tidak ditekan |
| 3 | F-CAMPAIGN-LIST, F-DASHBOARD-HOME | Setelah YA, SAYA SETUJU, apakah campaign masuk status menunggu persetujuan dan di tab mana? | Tombol mengirim pendaftaran, tidak ditekan. Tidak terlihat tab status "Menunggu" atau "Ditolak" |
| 4 | F-CAMPAIGN-DETAIL | Seperti apa detail campaign yang belum terafiliasi (apakah ada tombol DAFTAR, tab mana yang terkunci)? | Tiga detail yang dibuka semuanya campaign terafiliasi |
| 5 | F-CAMPAIGN-DETAIL | Untuk apa tombol tersembunyi "Product Seeding"? | Ada di DOM tetapi tidak tampil |
| 6 | F-CUSTOM-LINK | Seperti apa tampilan hasil GENERATE (Add Sub ID / Tracking, COPY, ADD NEW)? | Elemen hanya muncul setelah generate, tidak ditekan |
| 7 | F-TOKOPEDIA-SHOP-PRODUCT | Apakah halaman Tokopedia memang sedang error? | Tertahan di LOADING lebih dari 6 detik pada dua kali cek |
| 8 | F-REPORT-CONVERSION | Apakah tooltip keempat kartu ringkasan memang tertukar atau salah salin? | Teks tooltip tidak sesuai label kartunya |
| 9 | F-REPORT-CAMPAIGN, F-REPORT-CREATIVE | Kenapa label status di dua laporan ini Setujui/Tolak, berbeda dengan Disetujui/Ditolak di laporan lain? | Inkonsistensi label di UI |
| 10 | Laporan (semua) | Apa format file UNDUH dan apa isi email dari tombol EMAIL? | Tidak ditekan (unduhan dan pengiriman) |
| 11 | F-REPORT-PERFORMANCE | Ikon expand per bulan menampilkan rincian apa (harian)? | Tidak dibuka |
| 12 | F-REPORT-PAYMENT | Seperti apa isi modal DETAIL (tab PAID / UNDER PROCESSING) dan halaman invoice? | Tidak dibuka untuk menghindari data nominal dan invoice |
| 13 | F-REFERRAL-PERFORMANCE, F-REFERRAL-CONVERSION | Apa saja kolom tabelnya? | Tidak ada data pada periode default |
| 14 | F-AT-ACADEMY, F-INPAGES, F-WIDGET, F-SUPERPOINT | Seperti apa tampilan di dalam masing-masing aplikasi? | Membuka dengan autologin ke domain lain, di luar cakupan dashboard |
| 15 | F-API-DOCS | Apa isi dan versi dokumentasi API? | Link eksternal, tidak dibuka |
| 16 | F-BANK-ACCOUNT | Kolom apa saja di form rekening setelah OTP? | Perlu menekan SEND OTP (mengirim email) |
| 17 | F-AT-CHALLENGE | Seperti apa kartu challenge dan alur JOIN SEKARANG? | Tidak ada challenge aktif |
| 18 | F-VOUCHER | Seperti apa kartu voucher dan tombolnya? | Semua kategori kosong |
| 19 | F-EVENT | Seperti apa isi tab REGISTERED dan PAST? | Tidak dibuka |
| 20 | F-SUBID-TRACKING, F-POSTBACK | Apa isi tooltip ikon ? di judul halaman? | Tooltip tidak muncul saat di-hover |
| 21 | F-PROPERTIES | Bagaimana cara menambah properti baru? | Tidak terlihat tombol tambah |
| 22 | F-HELP-CENTER | Apakah URL guideline dengan garis miring akhir (404) masih dipakai di materi lain? | Perlu cek tautan internal dan eksternal |
| 23 | F-TIKTOK-SHOP-PRODUCT, F-EVENT | Apakah salah ketik ("More Then", "Hight", "manarik", "AT Talksecara") akan diperbaiki? | Perlu konfirmasi tim produk |
