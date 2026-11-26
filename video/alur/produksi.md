# Alur produksi video ACCESSTRADE

Versi v1 · 26 Nov 2026 · diadaptasi dari alur produksi Domba Books dan Ruang Fisio (5 tahap), ditambah pilihan jalur pembuatan visual.

## 5 tahap

| # | Tahap | Sesi | Masukan | Keluaran | Gerbang |
|---|---|---|---|---|---|
| 1 | Brief + script | Scriptwriting | Ide, artikel blog, data campaign | `brief/<format>-NN-slug.md`, `scripts/<format>/NN-slug.json`, caption | OK Harist. Data campaign/komisi lewat gerbang verifikasi (`../docs/tim-dan-gerbang-verifikasi.md`) |
| 2 | Rekam + analisis rekaman | Eksekusi (Remotion / AE) | Rekaman utuh di `rekaman/<format>/` | Potongan per adegan + `rekaman/olah/<kunci>/laporan.md` (take ulang, kalimat hilang, skor) | OK Harist kalau ada adegan bertanda ⚠ |
| 3 | Bagi adegan | Scriptwriting (rencana), Eksekusi (cek) | Script + transkrip | Setiap adegan bertanda **cerita** atau **poin**, perbandingan ±60:40 | Tanya kalau ragu |
| 4 | Bangun visual | Eksekusi Remotion / Eksekusi AE / Motion Format | Script + potongan suara + foto/klip | Draft video atau project .aep | Cek per frame sebelum render penuh |
| 5 | Finishing + serah terima | Eksekusi | Draft yang disetujui | MP4 final, cover/thumbnail, subtitle, chapter, `output/daftar-render.md` | Laporan ke Harist. Upload dilakukan manusia |

## Tahap 3: cerita dan poin

Setiap paragraf script ditandai di brief:

| Jenis | Ciri | Jadi adegan |
|---|---|---|
| **Cerita** | Ada tempat, orang, aktivitas, kejadian, layar yang sedang dipakai | `klip` (b-roll, rekaman layar HP/dashboard), `foto` (screenshot dashboard beranotasi, foto suasana) |
| **Poin** | Konsep, angka, langkah, daftar, perbandingan, kutipan | `poin`, `daftar`, `angka`, `banding`, `kutipan` (infografis) |

- Perbandingan **cerita : poin ±60:40**. Video yang isinya infografis terus terasa seperti slide.
- Hook, data inti, dan ajakan (CTA) **selalu infografis**.
- Langkah di dashboard ACCESSTRADE: label menu dan tombol persis dari `../docs/peta-fitur-dashboard-2026-11-05.md`. Screenshot mengikuti `../docs/workflow-screenshot-dashboard.md` (kode SS-AT, kotak sorot oranye).

## Tahap 4: pilih jalur

Jalur ditulis di brief (`jalur:`). Script JSON-nya sama untuk semua jalur.

| Jalur | Sesi | Di mana | Cocok untuk | Hasil |
|---|---|---|---|---|
| **Remotion** | `/video-remotion` | Mac Harist atau PC editor | Video rutin, cepat, konsisten (tips, tutorial, data) | MP4 langsung |
| **After Effects** | `/video-ae` | PC editor (Windows, AE 2027) | Video yang perlu dipoles editor: animasi khusus, plugin, efek | Project `.aep` dibangun otomatis, dipoles editor, lalu render |
| **Motion Format** | skill `motion-format` | **Hanya Mac Harist** (lisensi pribadi) | Klip motion graphic bergaya (isometrik, peta, promo produk) untuk pembuka atau sisipan | MP4 klip, lalu dipasang sebagai adegan `klip` |

Jalur boleh digabung: klip Motion Format atau klip AE dimasukkan sebagai adegan `klip` di video Remotion, atau video Remotion diimpor ke AE untuk finishing.

## Tahap 5: finishing

- Jalur Remotion: musik (`npm run musik`) dan efek suara (`npm run sfx`) sudah ikut di render. Finishing tambahan di AE atau CapCut kalau perlu.
- Jalur AE: editor menambah overlay, musik, SFX, dan color di project .aep, lalu render.
- Arsipkan versi lama (jangan ditimpa): `NN-slug-v2.mp4`, `NN-slug-v3.mp4`.
- Laporan ke Harist dalam tabel: video, durasi, jalur, file, status tayang, catatan.
