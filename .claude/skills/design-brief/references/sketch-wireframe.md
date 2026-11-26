# Sketsa Wireframe — Gaya, Spec, dan Library Line Art

Daftar isi:
1. Filosofi sketsa
2. Aturan gaya
3. Struktur spec JSON
4. Library line art siap pakai
5. Pola per mode
6. Checklist sebelum render

---

## 1. Filosofi Sketsa

Sketsa ini menjawab pertanyaan yang tidak bisa dijawab teks: **di mana letak segala sesuatu, dan apa yang dilihat mata pertama kali.**

Yang dikunci sketsa: layout, hierarki, proporsi, focal point, area gambar.
Yang **tidak** dikunci sketsa: palet, gaya ilustrasi, tipografi final, detail rendering.

Kalau sketsa mulai terlihat seperti desain jadi, itu tanda terlalu jauh. Designer akan meniru alih-alih mengembangkan, dan nilai tambahnya hilang.

---

## 2. Aturan Gaya

| Aspek | Aturan |
|---|---|
| Warna | Hanya hitam, abu, putih. Tanpa warna brand — supaya tidak terbaca sebagai desain final |
| Garis | Tipis (1.4px), rounded cap, tanpa fill |
| Figur manusia | Stick figure: kepala lingkaran, badan bentuk sederhana, tanpa wajah |
| Headline | Serif (Georgia). Italic kalau berupa kutipan atau kalimat emosional |
| Body | Sans (Inter/Helvetica), abu untuk teks sekunder |
| Area foto | Kotak abu muda dengan silang diagonal + label deskriptif |
| Ruang kosong | Biarkan luas. Ruang kosong di sketsa adalah instruksi, bukan kemalasan |

---

## 3. Struktur Spec JSON

```json
{
  "width": 800,
  "height": 1000,
  "headline": "Teks headline",
  "headline_style": "serif-italic",
  "subline": "Teks pendukung",
  "blocks": [ ... ]
}
```

`headline_style`: `serif` | `serif-italic` | `sans`

Tipe blok:

| Tipe | Field | Untuk |
|---|---|---|
| `placeholder` | `label`, `height` | Area foto/gambar yang akan diisi designer |
| `lineart` | `label`, `height`, `svg` | Ilustrasi konsep yang digambar langsung |
| `text` | `content` | Paragraf pendukung |
| `note` | `content` | Catatan untuk designer, tidak ikut ke desain final |
| `cta` | `content` | Tombol / call to action |
| `divider` | — | Garis pemisah |
| `spacer` | `height` | Ruang kosong terkendali |

Field `svg` menerima elemen SVG mentah. Koordinat relatif terhadap area blok (lebar konten ≈ `width - 156`). Stroke dan fill sudah diatur wrapper, jadi cukup tulis geometrinya.

---

## 4. Library Line Art Siap Pakai

Tempel ke field `svg`, geser koordinatnya sesuai kebutuhan.

**Orang berdiri**
```
<circle cx='120' cy='40' r='26'/><line x1='120' y1='66' x2='120' y2='84'/>
<path d='M92 84 q28 -10 56 0 l9 100 q-37 12 -74 0 z'/>
<path d='M103 176 l-6 30'/><path d='M137 176 l6 30'/>
```

**Orang duduk di kursi**
```
<circle cx='120' cy='40' r='25'/><line x1='120' y1='65' x2='120' y2='80'/>
<rect x='62' y='80' width='116' height='92'/>
<path d='M84 80 q0 58 13 76'/><path d='M158 80 q0 58 -13 76'/>
<line x1='44' y1='98' x2='44' y2='192'/><line x1='196' y1='98' x2='196' y2='192'/>
<line x1='44' y1='98' x2='62' y2='98'/><line x1='178' y1='98' x2='196' y2='98'/>
<line x1='62' y1='172' x2='178' y2='172'/>
<line x1='76' y1='172' x2='76' y2='208'/><line x1='164' y1='172' x2='164' y2='208'/>
```

**Garis lantai**
```
<line x1='20' y1='210' x2='620' y2='210'/>
```

**Tumpukan kertas / dokumen berantakan**
```
<rect x='40' y='60' width='90' height='120' transform='rotate(-6 85 120)'/>
<rect x='70' y='50' width='90' height='120' transform='rotate(4 115 110)'/>
<rect x='110' y='66' width='90' height='120' transform='rotate(-3 155 126)'/>
<line x1='86' y1='96' x2='146' y2='96'/><line x1='86' y1='116' x2='146' y2='116'/>
```

**Meja**
```
<line x1='20' y1='150' x2='420' y2='150'/>
<line x1='60' y1='150' x2='60' y2='230'/><line x1='380' y1='150' x2='380' y2='230'/>
```

**Panah alur**
```
<line x1='40' y1='80' x2='180' y2='80'/><path d='M168 72 l14 8 l-14 8'/>
```

**Bar chart kosong (untuk sketsa infografis)**
```
<line x1='40' y1='200' x2='420' y2='200'/>
<rect x='70' y='120' width='48' height='80'/><rect x='150' y='80' width='48' height='120'/>
<rect x='230' y='150' width='48' height='50'/><rect x='310' y='60' width='48' height='140'/>
```

**Balon dialog**
```
<path d='M40 40 h200 a12 12 0 0 1 12 12 v70 a12 12 0 0 1 -12 12 h-150 l-30 26 v-26 h-20
a12 12 0 0 1 -12 -12 v-70 a12 12 0 0 1 12 -12 z'/>
```

Kalau butuh objek yang tidak ada di sini, gambar sendiri dengan `line`, `path`, `circle`, `rect` sederhana. Jangan berlebihan — sketsa yang detail justru mengurangi kegunaannya.

---

## 5. Pola Per Mode

### Feature image
Satu sketsa, satu frame. Isi: headline (kalau ada teks di gambar), area ilustrasi utama, catatan focal point. Rasio ikuti spek aset — `width: 1200, height: 630` untuk OG, `width: 1200, height: 675` untuk hero.

### Sub image
Satu sketsa per section. Kalau semua sub image satu keluarga visual, buat sketsa pertama sebagai **template acuan** dan sketsa berikutnya sebagai variasi — beri catatan eksplisit elemen mana yang konsisten dan mana yang berubah.

### Infografis
Sketsa fokus pada struktur data, bukan estetika: di mana judul insight, di mana chart, di mana hero number, di mana sumber data. Pakai bar chart kosong dari library — jangan gambar data asli, itu tugas designer dengan angka final.

---

## 6. Checklist Sebelum Render

- Semua teks di sketsa memakai copy final, bukan lorem ipsum dan bukan parafrase — persis sama dengan tabel Copy di brief, sampai ke kapitalisasi. Panjang teks nyata mempengaruhi layout, dan teks yang beda sedikit bikin designer bingung mana yang benar.
- Catatan untuk designer dibedakan secara visual dari copy: pakai blok `note` atau `label` (miring/abu), jangan ditulis sebagai teks biasa di dalam komposisi.
- Setiap area gambar punya label deskriptif yang menyebut subjek dan situasinya.
- Ada satu blok `note` yang menegaskan ini sketsa layout, bukan gaya visual final.
- Rasio sketsa sama dengan rasio aset final.
- Kalau lebih dari satu aset, urutan penomoran sketsa sama dengan urutan di tabel daftar aset.
