# Aturan brief video

Versi v1 · 26 Nov 2026 · aturan brief Harist (dipakai di Dpurple sejak 26 Nov 2026), disesuaikan untuk ACCESSTRADE.

Setiap video punya brief di `brief/<format>-NN-slug.md` sebelum script JSON ditulis. Brief memuat bagian di bawah, ditambah tabel alur adegan (tipe, cerita/poin, isi, detik).

## Kepala brief

```
jalur: remotion | ae | motion-format
format: reels | youtube
nomor: NN
tujuan: edukasi | ajak daftar publisher | info campaign
penonton: calon publisher pemula | publisher aktif | ...
sumber: <artikel blog / data campaign / dokumentasi>, dengan tanggal
```

## 1. Detail visual 5 butir

Satu blok di atas tabel alur adegan.

| Butir | Isi |
|---|---|
| Objek utama | Benda atau layar yang paling sering terlihat, dengan ciri yang benar (mis. menu Report di dashboard, aplikasi Shopee di HP) |
| Kamera | Sudut dan gerak (mis. dari jauh lalu mendekat ke tombol yang diklik) |
| Suasana | Latar (dark / light / brand), cahaya, waktu |
| Momen kunci | Satu momen "wow" (mis. angka komisi naik, sebelum vs sesudah) |
| Teks di layar | Hook dan label. Satu kata kunci disorot oranye |

## 2. Hook 5 sudut

Tabel 5 opsi hook, masing-masing maks 8 kata:

| Sudut | Contoh pola |
|---|---|
| Pertanyaan | "Link afiliasi kamu sudah dicek belum?" |
| Angka mengejutkan | angka nyata dari data terverifikasi |
| Mitos dibantah | "Afiliasi itu harus punya banyak followers?" |
| Masalah sehari-hari | situasi yang sering dialami publisher |
| Rahasia | "Menu ini jarang dibuka publisher baru" |

- Tandai satu pilihan ⭐ dengan alasannya, dan sebut 2 cadangan untuk dites.
- Hook yang dipakai sebagai teks layar maks 7 kata (`npm run cek` memeriksa).
- **Angka hanya dari data yang sudah diverifikasi** (gerbang verifikasi di `../docs/tim-dan-gerbang-verifikasi.md`). Tanpa janji penghasilan, tanpa framing menakut-nakuti.

## 3. Penutup yang nempel

Sebelum adegan outro: 1 kalimat kesimpulan + 1 pertanyaan ke penonton, total maks 12 kata, tampil besar dan diucapkan.
- Soft sell: pertanyaan ringan (mis. "Kamu biasanya cek komisi tiap hari atau tiap minggu?"), bukan ajakan beli.
- Kalau bisa, kalimat penutup menyambung ke kalimat pembuka (loop).
- Ajakan di outro: daftar publisher di accesstrade.co.id (link lengkap `https://accesstrade.co.id/publisher/register` di caption, bukan di layar).
