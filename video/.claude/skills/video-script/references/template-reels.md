# Template script Reels / TikTok / Shorts

Kanvas 1080×1920, durasi 20-60 detik, 5-9 adegan. Penonton menonton tanpa suara sebagian besar waktu: teks layar harus tetap bercerita.

## Pola yang sering dipakai

| Pola | Urutan adegan | Cocok untuk |
|---|---|---|
| Tips / listicle | hook → poin/daftar ×3 → outro | edukasi cepat |
| Mitos vs fakta | hook → banding → poin (kenapa) → outro | meluruskan salah kaprah |
| Masalah → solusi | hook (masalah) → poin (akibat) → daftar (solusi) → outro | jualan halus |
| Angka mengejutkan | hook → angka → poin (artinya) → daftar (yang bisa dilakukan) → outro | data / riset |
| Sebelum → sesudah | hook → foto (sebelum) → foto/banding (sesudah) → poin → outro | hasil produk / jasa |
| Tutorial dashboard | hook → klip/foto (rekaman layar, screenshot SS-AT) ×3-4 → daftar (ringkasan langkah) → outro | cara pakai fitur ACCESSTRADE |

## Ritme

- Adegan 1 (hook): 2-4 detik. Teks maks 7 kata. Janji atau pertanyaan yang bikin penasaran.
- Ganti visual setiap 2-5 detik. Adegan yang suaranya panjang lebih baik dipecah dua.
- Outro: 2-4 detik, satu ajakan saja (dari brand guideline bagian CTA). Link register ditulis di caption, bukan di layar.
- Tandai setiap adegan **cerita** (klip/foto) atau **poin** (infografis) di brief. Target ±60:40.
- Cover (`cover.text`): 3-6 kata, boleh beda dari hook.

## Kerangka

```json
{
  "format": "reels",
  "number": "01",
  "slug": "judul-singkat",
  "title": "Judul kerja video",
  "cover": {"text": "Teks *cover*", "kicker": "Label"},
  "scenes": [
    {
      "id": 1,
      "type": "hook",
      "dur": 3,
      "onScreen": "Janji atau *pertanyaan* singkat",
      "vo": "Kalimat pembuka yang langsung ke inti.",
      "props": {"kicker": "Label seri"}
    },
    {
      "id": 2,
      "type": "poin",
      "dur": 4,
      "onScreen": "Pernyataan *penting*",
      "vo": "Kalimat pertama. Kalimat kedua yang menjelaskan.",
      "props": {"kicker": "Poin 1", "sub": "Penjelasan pendek di layar."}
    },
    {
      "id": 3,
      "type": "daftar",
      "dur": 5,
      "onScreen": "Judul daftar",
      "vo": "Ada tiga hal. Hal pertama, hal kedua, dan hal ketiga.",
      "props": {
        "items": [
          {"text": "Hal *pertama*", "onWord": "pertama"},
          {"text": "Hal kedua", "onWord": "kedua"},
          {"text": "Hal ketiga", "onWord": "ketiga"}
        ]
      }
    },
    {
      "id": 4,
      "type": "outro",
      "dur": 3,
      "onScreen": "Ajakan *singkat*",
      "vo": "Ajakan penutup sesuai brand."
    }
  ]
}
```

## Cek sebelum serah terima

- [ ] Hook maks 7 kata dan bisa dipahami tanpa suara
- [ ] Setiap kalimat `vo` diakhiri tanda baca
- [ ] Total `vo` 60-150 kata (`npm run cek` menunjukkan perkiraan durasi)
- [ ] Angka dan kutipan punya sumber, klaim sensitif bertanda `[KONFIRMASI]`
- [ ] Kata dan sapaan sesuai brand guideline (aku/kamu, tanpa janji penghasilan, tanpa tanda pisah panjang)
- [ ] Label menu dashboard persis dari peta fitur
- [ ] `npm run cek` tanpa error (kecuali foto yang belum diimpor)
- [ ] Caption upload ditulis di `NN-slug-caption.txt`
