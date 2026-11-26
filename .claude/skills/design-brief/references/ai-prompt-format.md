# Arah Riset Referensi & Prompt AI

Dua hal berbeda, jangan ditukar posisinya.

| | Tempat | Fungsi |
|---|---|---|
| Arah riset referensi | Brief designer | Isi utama — designer bekerja dari referensi |
| Prompt AI generatif | Brief internal (lampiran) | Opsional — untuk requester mengecek arah, bukan instruksi ke designer |

Alasannya: prompt AI yang ditaruh di brief designer sering terbaca sebagai "pakai ini", padahal maksudnya eksplorasi. Hasilnya designer menyerahkan output AI mentah, dan itu bukan yang dibayar.

---

## 1. Arah Riset Referensi (masuk brief designer)

Per aset, empat komponen:

| Komponen | Isi |
|---|---|
| Keyword riset | 4–6 frasa bahasa Inggris, siap tempel ke kolom pencarian |
| Kanal | Pinterest (mood & ilustrasi) / Dribbble (UI & grafis) / Behance (kampanye utuh) / Are.na (kurasi editorial) |
| Yang dicari | Satu kalimat — aspek apa yang diperhatikan: komposisi? palet? bobot garis? cropping? |
| Yang dihindari | Klise spesifik untuk topik ini |

Keyword yang bekerja itu spesifik pada **gaya + subjek**, bukan pada topik artikel.

| Kurang berguna | Lebih berguna |
|---|---|
| `medical tourism illustration` | `minimal line art figures editorial` |
| `SEO infographic` | `single accent color bar chart editorial layout` |
| `family healthcare` | `two figures negative space quiet composition` |

Sertakan juga satu kalimat "yang dicari": misalnya "perhatikan seberapa banyak ruang kosong dibiarkan di sekitar figur — itu yang bikin nadanya tenang, bukan detail gambarnya."

---

## 2. Prompt AI Generatif (lampiran brief internal)

Tiga varian per aset. Beda sintaks, sama konsep. Setiap prompt memuat: style lane → subjek → komposisi → palet (hex) → mood → exclusion.

### Nano Banana (Gemini)
Kalimat natural dan deskriptif. Kuat kalau komposisi dijelaskan spasial dan warna disebut hex. Instruksi negatif ditulis sebagai kalimat, bukan daftar keyword.

> A [style lane] illustration of [konsep]. [Komposisi: apa di tengah, apa di sekitarnya, arah alur mata]. Color palette: [hex] as dominant background, [hex] for the focal element, neutral [hex] for supporting shapes. Mood: [tone]. [Rasio] format. No text, no logos, no watermarks, no stock-photo people.

### Midjourney
Padat, keyword-driven, parameter di akhir.

> [konsep], [style lane], [elemen komposisi], [palet + hex], [mood], clean composition, ample negative space --ar 16:9 --style raw --no text, logos, watermark, stock photo

| Aset | Parameter |
|---|---|
| Feature image | `--ar 16:9` |
| Sub image | `--ar 16:9` |
| Infografis horizontal | `--ar 4:3` |
| Infografis vertikal | `--ar 4:5` |

### Universal (Firefly / DALL-E / lainnya)
> [Style lane] illustration showing [konsep]. Composition: [deskripsi]. Colors: [hex list]. Mood: [tone]. Aspect ratio [rasio]. Exclude: text, typography, logos, watermarks, realistic human faces.

---

## 3. Khusus Infografis

AI image generator tidak bisa dipercaya menghasilkan angka dan label akurat. Jadi:

- Prompt hanya untuk arah visual dan gaya, bukan chart final.
- Tulis eksplisit di brief: chart, angka, dan label dibuat manual oleh designer.
- Sertakan tabel data mentah terpisah supaya designer punya sumber yang benar.

---

## 4. Kalimat Pembuka Lampiran (wajib ada)

> Prompt di bawah ini alat bantu eksplorasi arah visual, bukan target akhir dan bukan instruksi ke designer. Output final tetap karya designer.
