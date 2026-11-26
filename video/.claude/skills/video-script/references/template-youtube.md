# Template script YouTube

Kanvas 1920×1080, durasi bebas (umumnya 5-15 menit), 15-60 adegan. Penonton YouTube biasanya menonton dengan suara dan memilih untuk menonton, jadi ruang untuk menjelaskan lebih besar, tapi tetap perlu ritme.

## Struktur

| Bagian | Isi | Durasi |
|---|---|---|
| Pembuka (`hook`, bisa 1-3 adegan) | Masalah atau janji, apa yang akan didapat penonton, kenapa harus menonton sampai habis | 15-40 dtk |
| Bab 1..n (`bab` + 3-8 adegan isi) | Satu ide besar per bab. Isi: poin, daftar, angka, foto, banding, kutipan | 1-3 menit per bab |
| Ringkasan (`daftar` atau `poin`) | Ulang 3 hal terpenting | 20-40 dtk |
| Outro (`outro`) | Ajakan + area end screen | 12-20 dtk |

## Aturan chapter (dari YouTube)

- Setiap adegan `bab` otomatis jadi chapter. Chapter pertama (pembuka) selalu di 0:00, namanya dari `chapterIntro`.
- Minimal **3 chapter** (pembuka + 2 bab) supaya chapter muncul di YouTube.
- Setiap chapter minimal **10 detik**.
- Judul bab = judul chapter: 2-5 kata, jelas, bisa dicari ("Kenapa notifikasi mengganggu", bukan "Bagian dua").

## Ritme

- Ganti adegan setiap 5-15 detik. Suara lebih dari 20 detik di satu adegan: pecah jadi dua adegan.
- Variasikan tipe: jangan lebih dari 3 adegan `poin` berturut-turut.
- Ulangi janji pembuka di tengah video ("tadi kita sudah bahas X, sekarang Y").
- Outro minimal 12 detik dan sisi kanannya dibiarkan kosong (end screen dipasang di YouTube Studio). Teks `vo` outro mengarahkan ke video berikutnya.
- Thumbnail (`cover.text`): 2-5 kata besar, boleh beda dari judul. Pakai `cover.image` kalau ada foto yang kuat.

## Kerangka

```json
{
  "format": "youtube",
  "number": "01",
  "slug": "judul-singkat",
  "title": "Judul kerja video",
  "chapterIntro": "Pembuka",
  "cover": {"text": "Teks *thumbnail*", "kicker": "Label"},
  "scenes": [
    {
      "id": 1,
      "type": "hook",
      "dur": 15,
      "onScreen": "Pertanyaan atau *janji* video",
      "vo": "Masalah yang dirasakan penonton. Apa yang akan dibahas. Kenapa penting.",
      "props": {"kicker": "Label seri", "sub": "Apa yang didapat penonton"}
    },
    {
      "id": 2,
      "type": "bab",
      "dur": 3,
      "vo": "Bagian pertama, judul bab satu.",
      "props": {"title": "Judul bab satu"}
    },
    {
      "id": 3,
      "type": "poin",
      "dur": 8,
      "onScreen": "Ide *utama* bab ini",
      "vo": "Penjelasan dalam dua atau tiga kalimat pendek.",
      "props": {"sub": "Ringkasan satu baris"}
    },
    {
      "id": 4,
      "type": "angka",
      "dur": 7,
      "vo": "Kalimat yang menyebut angkanya dan artinya.",
      "props": {"value": "73%", "label": "arti angka ini", "source": "Nama sumber, tahun"}
    },
    {
      "id": 5,
      "type": "bab",
      "dur": 3,
      "vo": "Bagian kedua, judul bab dua.",
      "props": {"title": "Judul bab dua"}
    },
    {
      "id": 6,
      "type": "banding",
      "dur": 9,
      "onScreen": "Pertanyaan perbandingan",
      "vo": "Banyak yang mengira A. Padahal faktanya B.",
      "props": {
        "left": {"label": "Mitos", "text": "Anggapan umum"},
        "right": {"label": "Fakta", "text": "Yang *sebenarnya*"},
        "verdict": "right",
        "revealOnWord": "faktanya"
      }
    },
    {
      "id": 7,
      "type": "daftar",
      "dur": 12,
      "onScreen": "Ringkasan",
      "vo": "Jadi ingat tiga hal. Satu. Dua. Tiga.",
      "props": {"items": ["Hal satu", "Hal dua", "Hal tiga"]}
    },
    {
      "id": 8,
      "type": "outro",
      "dur": 12,
      "onScreen": "Tonton video *berikutnya*",
      "vo": "Terima kasih sudah menonton. Lanjut ke video berikutnya di layar.",
      "props": {"sub": "Ajakan subscribe sesuai brand"}
    }
  ]
}
```

## Cek sebelum serah terima

- [ ] Minimal 3 chapter, masing-masing minimal 10 detik (`npm run cek` menampilkan daftar chapter)
- [ ] Pembuka menjawab "kenapa harus menonton" dalam 15-40 detik
- [ ] Tidak ada adegan dengan `vo` lebih dari ±20 detik
- [ ] Angka dan kutipan punya sumber, klaim sensitif bertanda `[KONFIRMASI]`
- [ ] Outro minimal 12 detik
- [ ] `npm run cek` tanpa error (kecuali foto yang belum diimpor)
- [ ] Judul, deskripsi, tag ditulis di `NN-slug-caption.txt`
