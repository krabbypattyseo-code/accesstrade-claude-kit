---
name: storytelling-with-data
description: >
  Panduan lengkap data visualization dan komunikasi data berbasis buku "Storytelling with Data"
  karya Cole Nussbaumer Knaflic. Gunakan skill ini kapanpun user meminta bantuan membuat
  visualisasi data, memilih jenis chart yang tepat, memperbaiki grafik yang ada, menyampaikan
  insight dari data, membuat presentasi berbasis data, menyederhanakan dashboard, menghilangkan
  clutter dari visual, atau ingin tahu cara bercerita dengan data secara efektif.
  Trigger juga untuk pertanyaan seperti: "chart apa yang cocok untuk data ini?",
  "bagaimana cara bikin grafik yang mudah dipahami?", "tolong review visual/dashboard ini",
  atau "bagaimana menyampaikan hasil analisis ke stakeholder?".
---

# Storytelling with Data
*Berdasarkan buku Cole Nussbaumer Knaflic — A Data Visualization Guide for Business Professionals*

---

## Kerangka Utama: 6 Pelajaran Inti

| # | Pelajaran | Inti |
|---|-----------|------|
| 1 | **Understand the context** | Pahami siapa audiensmu dan apa yang harus mereka lakukan |
| 2 | **Choose an appropriate visual** | Pilih tipe chart yang paling tepat untuk datamu |
| 3 | **Eliminate clutter** | Buang semua elemen yang tidak menambah nilai |
| 4 | **Focus attention** | Arahkan mata audiens ke tempat yang kamu inginkan |
| 5 | **Think like a designer** | Rancang dengan affordance, aksesibilitas, dan estetika |
| 6 | **Tell a story** | Bangun narasi dengan struktur awal–tengah–akhir |

---

## Pelajaran 1: Pahami Konteks

### Tiga pertanyaan wajib sebelum membuat visual
1. **WHO** — Siapa audiensmu? Semakin spesifik, semakin baik. Hindari membuat satu visual untuk semua orang.
2. **WHAT** — Apa yang harus mereka ketahui atau lakukan? Selalu rekomendasikan tindakan konkret.
3. **HOW** — Bagaimana cara terbaik menyampaikannya? (live presentation vs. dokumen mandiri)

### Exploratory vs. Explanatory
- **Exploratory** = kamu mengeksplorasi data sendiri (100 oyster, 2 pearl)
- **Explanatory** = kamu menyampaikan temuan ke audiens — **ini yang harus difokuskan**
- Jangan sajikan semua 100 oyster ke audiens. Sajikan hanya 2 pearl-nya.

### Big Idea & 3-Minute Story
- **Big Idea**: Satu kalimat yang merangkum pesan utama + "so what"-nya. Harus (1) artikulasikan sudut pandangmu, (2) sampaikan apa yang dipertaruhkan, (3) bisa dinyatakan dalam satu kalimat.
- **3-Minute Story**: Jika kamu hanya punya 3 menit dengan pengambil keputusan, apa yang kamu katakan?
- **Storyboard**: Outline visual sebelum membuat slide. Urutkan konten di atas kertas/sticky notes dulu.

---

## Pelajaran 2: Pilih Visual yang Tepat

### Panduan Cepat Pemilihan Chart

| Tipe Visual | Gunakan Ketika | Hindari Ketika |
|-------------|---------------|----------------|
| **Simple Text** | Hanya 1–2 angka penting | Ada lebih dari 3 data points |
| **Table** | Audiens perlu melihat nilai individual secara detail | Tujuan adalah melihat tren atau perbandingan cepat |
| **Heatmap** | Tabel dengan banyak data, ingin tambahkan visual cue | Data tidak punya skala yang bermakna |
| **Scatterplot** | Menunjukkan hubungan antara dua variabel | Audiens tidak familiar dengan grafik ilmiah |
| **Line Graph** | Data kontinu, tren waktu | Data kategorikal / tidak kontinu |
| **Slopegraph** | Perbandingan dua titik waktu, banyak kategori | Lebih dari 2 titik waktu |
| **Vertical Bar** | Perbandingan antar kategori dengan data sedikit | Nama kategori panjang |
| **Horizontal Bar** | ⭐ Go-to untuk data kategorikal — nama panjang, mudah dibaca | - |
| **Stacked Bar** | Komposisi part-of-whole seiring waktu | Lebih dari 3–4 segmen (sulit dibaca) |
| **Waterfall Chart** | Menunjukkan komponen penambah/pengurang dari nilai awal ke akhir | - |

### Visual yang Harus Dihindari

| Visual | Masalah | Alternatif |
|--------|---------|------------|
| **Pie chart** | Mata manusia sulit membandingkan sudut & area | Horizontal bar chart |
| **Donut chart** | Lebih sulit dari pie (membandingkan panjang busur) | Horizontal bar chart |
| **3D chart** | Distorsi perspektif, misleading | Versi 2D |
| **Secondary y-axis** | Membingungkan, susah diinterpretasi | Label langsung atau pisah dua grafik |

### Aturan Bar Chart
- Y-axis **wajib mulai dari 0** untuk bar chart — manipulasi skala = misleading
- Untuk line graph, boleh tidak mulai dari 0
- Pertimbangkan urutan kategori: natural order (waktu, usia) atau dari terbesar ke terkecil

---

## Pelajaran 3: Hilangkan Clutter

### Prinsip Gestalt — 6 Cara Mata Manusia Mengelompokkan Objek

| Prinsip | Deskripsi | Aplikasi di Data Viz |
|---------|-----------|----------------------|
| **Proximity** | Objek dekat = satu grup | Atur spacing tabel untuk arahkan mata ke baris atau kolom |
| **Similarity** | Warna/bentuk sama = terkait | Gunakan warna yang sama untuk label dan datanya |
| **Enclosure** | Objek dalam satu batas = satu grup | Background shading untuk pisahkan actual vs. forecast |
| **Closure** | Otak melengkapi bentuk yang tidak utuh | Hilangkan border yang tidak perlu |
| **Continuity** | Mata mengikuti jalur paling mulus | Hapus gridline vertikal, biarkan data mengalir |
| **Connection** | Objek yang terhubung = satu grup | Gunakan garis untuk menghubungkan titik data |

### Langkah Decluttering (Step-by-Step)
1. Hapus gridlines (atau buat sangat tipis/abu-abu)
2. Hapus border/kotak di sekitar grafik
3. Hapus default chart junk (background warna, shadow, 3D)
4. Kurangi label axis yang redundan
5. Label data langsung (hilangkan legend terpisah jika bisa)
6. Gunakan warna konsisten antara label dan data
7. Manfaatkan white space — jangan takut kosong

### Cognitive Load
- Setiap elemen visual = beban kognitif bagi audiens
- Pertanyaan untuk setiap elemen: *"Apakah ini membantu pesan saya?"* Kalau tidak → hapus
- Data-ink ratio (Tufte): maksimalkan "tinta" yang merepresentasikan data, minimalkan sisanya

---

## Pelajaran 4: Fokuskan Perhatian

### Preattentive Attributes
Otak manusia memproses atribut ini **sebelum** berpikir sadar (< 250ms):

| Atribut | Kekuatan | Cara Pakai |
|---------|----------|------------|
| **Warna (hue)** | ⭐⭐⭐ Sangat kuat | Highlight 1 elemen penting dengan warna berbeda |
| **Intensitas warna** | ⭐⭐⭐ Sangat kuat | Gunakan gradasi untuk menunjukkan urutan/magnitude |
| **Ukuran** | ⭐⭐⭐ Kuat | Buat elemen penting lebih besar |
| **Posisi** | ⭐⭐ Kuat | Letakkan info terpenting di kiri atas |
| **Bentuk** | ⭐⭐ Sedang | Bedakan kategori dengan bentuk marker |
| **Bold/tebal** | ⭐⭐ Sedang | Gunakan untuk teks penting |
| **Gerakan** | ⭐⭐⭐ Sangat kuat | Gunakan hati-hati, hanya untuk animasi yang meaningful |

### Strategi Penggunaan
- Gunakan **satu warna dominan** untuk highlight, abu-abu untuk konteks
- Strategi "push everything to background first" — lalu bawa yang penting ke depan
- Preattentive attributes bisa **dilayer**: penting banget = besar + berwarna + bold
- **Peringatan**: highlight satu hal bisa membuat hal lain lebih sulit dilihat

### Penggunaan Warna
- Gunakan **sparingly** — seperti hawk di langit penuh burung
- Warna cerah menarik lebih banyak perhatian dari warna muted
- Pertimbangkan color blindness (hindari merah-hijau bersamaan)
- Abu-abu terang = de-emphasis yang efektif untuk elemen konteks

---

## Pelajaran 5: Think Like a Designer

### Tiga Prinsip Desainer

**1. Affordances** — Visual cues yang menunjukkan cara menggunakan sesuatu
- Highlight elemen penting (preattentive attributes)
- Hilangkan distraksi
- Buat hierarki visual yang jelas

**2. Aksesibilitas** — Mudah dimengerti oleh semua audiens
- **Teks adalah temanmu**: setiap chart butuh judul, setiap axis butuh label
- Gunakan bahasa yang familiar bagi audiens, bukan jargon teknis
- Tambahkan anotasi untuk menjelaskan hal yang tidak self-explanatory
- Minta orang lain review: "Apa yang kamu tangkap dari visual ini?"

**3. Estetika** — Visual yang menarik = lebih dipercaya
- Alignment yang rapi menciptakan kesan profesional
- White space = breathe room untuk audiens
- Konsistensi font, warna, ukuran di seluruh presentasi

### Hierarki Visual
Buat audiens tahu urutan mana yang harus dibaca pertama → kedua → ketiga:
- Paling penting: ukuran besar, warna mencolok, posisi atas-kiri
- Pendukung: ukuran medium, warna normal
- Konteks: ukuran kecil, abu-abu, posisi tidak mencolok

---

## Pelajaran 6: Bercerita dengan Data

### Struktur Narasi (3-Act Structure)
```
ACT 1 — SETUP (Awal)
"Inilah situasinya..."
→ Setting, karakter (audiens = hero), kondisi saat ini

ACT 2 — CONFLICT (Tengah)
"Inilah masalah/kesempatan yang ada..."
→ Imbalance, tension antara "what is" dan "what could be"
→ Data mendukung argumen

ACT 3 — RESOLUTION (Akhir)
"Inilah yang perlu dilakukan..."
→ Rekomendasi konkret, call to action
```

### Elemen Cerita yang Efektif
- **Tension** adalah inti cerita — tanpa konflik, tidak ada cerita
- Framing audiens sebagai "hero": cerita harus tentang mereka, bukan tentang kamu
- Identifikasi motivasi audiens: uang, kompetisi, efisiensi, inovasi?

### Taktik Storytelling Praktis

| Taktik | Deskripsi |
|--------|-----------|
| **Bing Bang Bongo** | Tell them what you'll say → say it → tell them what you said |
| **Horizontal Logic** | Judul setiap slide harus menceritakan kisah utuh jika dibaca berurutan |
| **Vertical Logic** | Konten setiap slide mendukung judulnya |
| **Reverse Storyboard** | Ambil presentasi jadi, tulis poin utama per halaman → apakah alurnya masuk akal? |
| **Write headlines first** | Tulis headline/judul slide sebelum kontennya |

---

## Checklist Sebelum Finalisasi Visual

**Konteks**
- [ ] Sudah jelas siapa audiens spesifiknya?
- [ ] Big Idea sudah bisa dinyatakan dalam satu kalimat?
- [ ] Ada rekomendasi aksi yang jelas?

**Visual**
- [ ] Tipe chart sudah tepat untuk data ini?
- [ ] Y-axis bar chart mulai dari 0?
- [ ] Tidak ada pie/donut/3D chart?

**Clutter**
- [ ] Gridlines diminimalkan?
- [ ] Tidak ada border/kotak yang tidak perlu?
- [ ] Legend diganti dengan direct label jika memungkinkan?

**Attention**
- [ ] Ada satu elemen yang di-highlight sebagai focal point?
- [ ] Warna digunakan secara sparingly?
- [ ] Elemen konteks sudah di-de-emphasize (abu-abu)?

**Desain**
- [ ] Setiap chart punya judul yang informatif?
- [ ] Setiap axis punya label?
- [ ] Alignment rapi dan konsisten?

**Cerita**
- [ ] Ada struktur awal–tengah–akhir?
- [ ] Audiens = hero, bukan kamu?
- [ ] Horizontal logic jalan (judul-judul membentuk narasi)?

---

## Referensi Cepat: Pertanyaan Diagnostik

Ketika diminta review/improve sebuah visual, tanyakan:
1. *Siapa audiensnya dan apa yang harus mereka lakukan setelah melihat ini?*
2. *Ke mana mata saya pergi pertama kali? Apakah itu yang dimaksud?*
3. *Elemen mana yang bisa dihapus tanpa kehilangan informasi penting?*
4. *Apakah judulnya langsung menyampaikan insight, atau hanya label?*
5. *Apakah ada alternatif tipe chart yang lebih efektif?*
