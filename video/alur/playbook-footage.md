# Playbook video dari footage

Versi v1 · 26 Nov 2026 · diadaptasi dari playbook editing Laycation Shorts. Berlaku untuk video yang memakai klip (b-roll, rekaman layar, talking head), di jalur Remotion maupun After Effects.

## Aturan tetap

| # | Aturan | Di kit |
|---|---|---|
| 1 | **Hook tanpa subtitle.** Cukup teks hook (label kecil + judul besar). Subtitle mulai setelah hook | `brand/tokens.json` → `caption.reels.onHook: false` |
| 2 | **Cek isi klip sebelum dipakai.** Nama file sering tidak sesuai isi. Ambil 1-3 frame dan lihat dulu | Eksekusi: ambil frame dengan ffmpeg, buka gambarnya |
| 3 | **Efek suara ada, tapi jangan berlebihan.** Volume 0,4-0,7, tidak di setiap adegan | Field `sfx` per adegan, `npm run sfx`. `npm run cek` memperingatkan volume > 0,8 |
| 4 | **Bagian teori atau penjelasan diberi motion graphic pendukung** (angka, daftar, perbandingan, sorotan teks) | Adegan `poin`, `daftar`, `angka`, `banding` di sela klip |
| 5 | **Pergantian b-roll rapat:** potong langsung tanpa fade, supaya wajah atau layar kosong tidak muncul sekelebat | `"transition": "cut"` di adegan klip yang berurutan |
| 6 | **Animasi masuk dari luar layar:** pudar + geser pendek. Elemen tidak boleh terlihat diam di pinggir sebelum animasinya jalan | Sudah jadi perilaku bawaan komponen |
| 7 | **Belum yakin dengan cerita atau hook?** Kirim draft alur cerita atau 2-3 opsi hook dulu, baru render | Sesi Scriptwriting |
| 8 | **Hapus file hanya kalau diminta**, dan pindahkan ke Trash/Recycle Bin, bukan dihapus permanen | Semua sesi |

## Klip

- Impor lewat `npm run klip -- <script> <file video> <nama>`: metadata (lokasi, kamera) dibuang, video HEVC iPhone diubah ke H.264. Ambil bagian yang dipakai saja dengan `--mulai` dan `--durasi` supaya file kecil.
- Rekaman layar dashboard ACCESSTRADE: pastikan tidak ada data pribadi publisher (nama, email, nomor rekening, saldo asli). Buramkan atau pakai akun demo.
- Talking head (wajah bicara) dengan suara dari klip itu sendiri: `"audio": true` di adegan klip, dan adegan itu tidak diberi `vo`.
- Klip vertikal untuk Reels, horizontal untuk YouTube. Klip yang orientasinya salah tetap jalan (dipotong tengah), atur titik fokus dengan `focus` (mis. `"50% 30%"`).

## Render

- Reels final HQ: `npm run render -- <script> --hq` → 1440×2560, setara resolusi kamera HP.
- Draft cepat: `--draft` (setengah resolusi).
- Render berat untuk CPU. Satu render dalam satu waktu.
