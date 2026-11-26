# Creative Direction — Bank Pertanyaan & Standar

Daftar isi:
1. Pertanyaan pengunci (semua mode)
2. Pertanyaan per mode
3. Style lane
4. Klise yang harus dihindari
5. Spesifikasi teknis default
6. Tabel pemilihan chart (mode `info`)
7. Do & Don't standar

---

## 1. Pertanyaan Pengunci (semua mode)

Tanyakan maksimal 5–7 pertanyaan sekali jalan. Lebih dari itu user berhenti menjawab serius.

| Pertanyaan | Kenapa ini menaikkan kualitas design |
|---|---|
| "Setelah lihat visual ini, pembaca harus paham ___" | Mengubah brief dari "bikin gambar" jadi "sampaikan pesan". Ini satu-satunya pertanyaan yang tidak boleh dilewat |
| 2–3 referensi yang disuka | Kalibrasi selera lebih cepat lewat contoh daripada kata sifat |
| Minimal 1 anti-referensi | Pagar. Menghemat satu putaran revisi penuh |
| Style lane (pilih satu) | Mencegah hasil campur aduk yang terlihat tidak sengaja |
| Focal point — apa yang harus dilihat pertama | Tanpa hierarki, semua elemen berteriak bersamaan |
| Emotional tone (satu kata) | Optimis / urgent / tenang / playful / serius. Satu kata, bukan tiga |
| Human presence | Pakai orang, tangan, wajah? Perlu representasi lokal Indonesia? |

---

## 2. Pertanyaan Per Mode

### Feature image
- Ada teks di dalam gambar? Kalau ya: teksnya apa, maksimal berapa kata, font apa.
- Squint test: aset ini akan tampil sebagai thumbnail kecil — apa satu elemen yang harus tetap terbaca di 200px?
- Butuh varian: OG image (share preview), crop square (IG feed), crop vertikal (Story)?
- Safe area: bagian mana yang boleh kepotong kalau di-crop otomatis platform.

### Sub image
- Relasi tiap section — menentukan komposisi:

| Relasi konten | Komposisi yang cocok |
|---|---|
| Proses / langkah | Alur berurutan, node bernomor |
| Perbandingan A vs B | Split dua kolom |
| Sebab-akibat | Panah, before → after |
| Konsep tunggal | Ikon sentral + elemen pendukung |
| Hierarki | Piramida / tree / nested |

- Konsistensi seri: satu sistem template atau bebas per aset?
- Label teks maksimal 3 kata, atau murni visual?
- Berapa aset, dan mana yang wajib kalau waktu mepet?

### Infografis
- Data-nya mana, dan sudah final? (jangan mulai design kalau angka masih berubah)
- Satu takeaway per infografis.
- Sumber data — wajib tampil di visual?
- Format angka: `Rp1.500.000` vs `Rp1,5 jt`, desimal, persen.
- Orientasi: horizontal blog / vertikal 4:5 IG / dua-duanya.
- Ada angka yang harus di-highlight sebagai hero number?

---

## 3. Style Lane

Pilih satu. Tulis di brief lengkap dengan ciri-cirinya supaya designer dan user membayangkan hal yang sama.

| Lane | Ciri | Cocok untuk |
|---|---|---|
| Flat illustration | Bidang warna solid, tanpa gradasi berat, outline tipis/tanpa outline | Konten edukatif, SaaS, fintech |
| Isometric | Perspektif 30°, kedalaman terkontrol, banyak detail objek | Penjelasan sistem, alur, ekosistem |
| Semi-3D render | Bentuk lembut, soft shadow, material clay/glossy | Brand modern, produk digital |
| Photo-composite | Foto asli + elemen grafis di atasnya | Travel, lifestyle, review produk |
| Minimal geometric | Bentuk dasar, ruang kosong luas, palet terbatas | Konten serius, data, editorial |
| Line art | Garis tunggal, tanpa fill, figur disederhanakan, banyak ruang kosong | Topik sensitif/emosional, editorial, kesehatan |

---

## 4. Klise yang Dihindari Secara Default

Cantumkan daftar ini di section Don't kecuali user secara eksplisit menginginkannya:

- Jabat tangan / dua orang berjas
- Bohlam lampu untuk "ide"
- Panah naik untuk "pertumbuhan"
- Puzzle piece untuk "solusi"
- Orang menunjuk grafik melayang
- Stock photo senyum generik di depan laptop
- Robot humanoid untuk "AI"
- Target dengan panah tepat di tengah
- Gembok untuk "keamanan" tanpa konteks lain
- Teks berlebihan menutupi ilustrasi

---

## 5. Spesifikasi Teknis Default

Pakai ini kalau user tidak punya standar sendiri. Tandai di brief sebagai default yang boleh dikonfirmasi.

| Aset | Dimensi | Format | Ukuran file | Catatan |
|---|---|---|---|---|
| Feature image | 1200×630 (OG) atau 1600×900 (hero) | WebP + PNG fallback | ≤150KB | Elemen penting di 80% area tengah |
| Sub image | 1200×675 | WebP | ≤120KB | Konsisten antar aset dalam satu artikel |
| Infografis horizontal | 1200×900 | PNG/WebP | ≤200KB | Teks minimal 16px setara |
| Infografis vertikal | 1080×1350 | PNG | ≤250KB | Untuk repurpose IG |

Tambahan yang selalu ditanyakan/dicantumkan:
- Versi @2x untuk layar retina?
- Source file editable diserahkan atau tidak?
- Naming convention file (`[slug-artikel]_[tipe]_[nomor]`)
- Folder submission (Drive, Figma, WeTransfer)
- Alt text — siapa yang menulis, designer atau writer

---

## 6. Tabel Pemilihan Chart (mode `info`)

Berbasis prinsip *Storytelling with Data*. Kalau user tidak punya preferensi, pilih dari sini dan jelaskan alasannya di brief.

| Relasi data | Chart |
|---|---|
| Perbandingan A vs B | Horizontal bar |
| Perubahan sepanjang waktu | Line chart |
| Bagian dari keseluruhan | Donut atau stacked bar |
| Peringkat | Ordered horizontal bar |
| Satu angka kunci | Big number callout + konteks |
| Proses / langkah | Numbered step flow |
| Before vs after | Split comparison card |

Aturan tambahan yang dicantumkan di brief:
- Satu focal point per visual — highlight data terpenting pakai accent color, redupkan sisanya.
- Judul infografis menyatakan insight, bukan mendeskripsikan chart.
- Hilangkan gridline, legend (kalau label bisa langsung menempel), efek 3D.

---

## 7. Do & Don't Standar

Sajikan dua kolom bersebelahan di dokumen. Tambahkan item spesifik project di atas daftar ini.

| Do | Don't |
|---|---|
| Satu pesan per visual | Menumpuk banyak ide dalam satu gambar |
| Kontras teks cukup untuk dibaca | Teks tipis di atas gradasi ramai |
| Pakai palet brand yang ditentukan | Menambah warna baru di luar palet |
| Konsisten stroke weight dan corner radius | Campur ikon dari beberapa set berbeda |
| Ruang kosong sebagai elemen desain | Mengisi semua area sampai penuh |
| Cek tampilan di ukuran kecil | Menilai hanya dari tampilan 100% zoom |
