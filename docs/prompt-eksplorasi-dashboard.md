# Prompt Eksplorasi Dashboard Publisher ACCESSTRADE

> Disalin dari Project "Accesstrade AI" pada 2026-11-19 untuk kit Claude Code. Rujukan file sudah disesuaikan ke folder `docs/`. Nama alur lama: Chat Brief = `/brief`, chat update dokumentasi = `/update`, chat optimasi productivity = `/optimasi`, chat admin dashboard = `/admin`.

Versi prompt: 1 (2026-11-05)
Pemakai: Chrome extension yang mengoperasikan dashboard publisher ACCESSTRADE yang sudah login
Output: satu file MD bernama `PETA_FITUR_DASHBOARD_ACCESSTRADE_YYYY-MM-DD.md`

## 1. Tujuan

Kamu menjelajahi dashboard publisher ACCESSTRADE dan membuat peta semua fitur yang ada. Peta ini dipakai tim konten untuk tiga hal:
1. Menulis tutorial dan artikel blog yang sesuai dengan tampilan dashboard terbaru.
2. Menyusun instruksi screenshot untuk artikel baru dan artikel optimasi.
3. Mendeteksi fitur yang baru, berubah, atau hilang, karena fitur seperti itu butuh tutorial baru atau update tutorial lama.

Yang dicatat hanya struktur dan teks antarmuka. Data akun tidak dicatat.

## 2. Aturan keamanan (wajib)

1. **Hanya membaca.** Boleh membuka menu, tab, filter, dropdown, dan pop up informasi. Boleh mengarahkan kursor untuk membaca tooltip.
2. **Jangan menekan tombol yang mengubah atau mengirim sesuatu**, misalnya: Apply, Join, Submit, Simpan, Save, Generate, Withdraw, Tarik Saldo, Hapus, Delete, Upload, Kirim, Ubah Rekening, Logout.
   - Kalau perlu tahu apa yang terjadi setelah tombol itu ditekan, tulis di bagian Pertanyaan Terbuka.
3. Jangan mengetik apa pun di form, kecuali kolom pencarian atau filter yang hanya menyaring tampilan.
4. **Jangan mencatat data akun.** Nama, ID publisher, email, nomor HP, saldo, nominal komisi, nomor rekening, dan link yang memuat ID publisher tidak boleh ditulis.
   - Catat nama kolom atau label saja. Contoh: tulis "kolom Saldo Tersedia", bukan angkanya.
5. Jangan mencatat parameter URL yang berisi ID. Tulis path saja, contoh `/publisher/custom-link`.
6. Kalau muncul pop up konfirmasi yang tidak sengaja terbuka, tutup dengan Batal atau ikon X.

## 3. Cakupan dan batas

1. Jelajahi semua menu level 1 di navigasi utama (sidebar, header, menu profil), lalu semua submenu dan tab di dalamnya (level 2 dan 3).
2. Untuk halaman berisi tabel atau daftar, cukup lihat halaman pertama. Catat kolom, filter, dan opsi urutan, bukan isi barisnya.
3. Untuk daftar campaign, buka **maksimal 3 detail campaign** sebagai contoh struktur, dan utamakan campaign Shopee, TikTok Shop, dan satu campaign CPL atau CPA. Catat struktur halaman detail, bukan data campaign satu per satu.
4. Ikuti juga link bantuan atau panduan yang ada di dashboard, termasuk halaman di `https://accesstrade.co.id/publisher/guideline/`. Catat judulnya, URL-nya, dan apakah isinya masih cocok dengan tampilan dashboard.
5. Kalau dashboard punya pilihan bahasa, eksplorasi dengan bahasa Indonesia. Catat label bahasa Inggris hanya kalau UI-nya campuran.
6. Batas waktu wajar: berhenti setelah semua menu level 1 dan 2 tercatat. Halaman yang belum sempat dibuka dicatat di Pertanyaan Terbuka.

## 4. Kalau ada peta versi sebelumnya

Kalau file `PETA_FITUR_DASHBOARD_ACCESSTRADE_*.md` versi sebelumnya ikut dilampirkan:
1. Pakai ID fitur yang sama untuk fitur yang sama. Jangan membuat ID baru untuk fitur lama.
2. Bandingkan setiap fitur, lalu beri status:
   - **BARU**: tidak ada di versi sebelumnya.
   - **BERUBAH**: ada perubahan nama menu, jalur, kolom, tombol, label, atau batasan. Tulis apa yang berubah.
   - **HILANG**: ada di versi sebelumnya, tidak ditemukan sekarang.
   - **SAMA**: tidak ada perubahan.
3. Isi bagian Log Perubahan di output.

Kalau tidak ada versi sebelumnya, beri status BARU untuk semua fitur dan tulis "Eksplorasi pertama" di Log Perubahan.

## 5. Aturan ID fitur

- Format: `F-` + nama fitur dalam huruf besar dan tanda hubung, contoh `F-CUSTOM-LINK`, `F-CAMPAIGN-LIST`, `F-REPORT-CONVERSION`.
- Nama ID diambil dari fungsi fitur, bukan dari posisi menu, supaya ID tidak berubah kalau menu dipindah.
- Sub-bagian dalam satu halaman cukup dicatat di kartu fitur induknya. Jangan dibuat ID sendiri, kecuali punya URL sendiri.

## 6. Format output (ikuti persis)

````markdown
# Peta Fitur Dashboard Publisher ACCESSTRADE

## Metadata
| Item | Isi |
|---|---|
| Tanggal eksplorasi | YYYY-MM-DD |
| Versi prompt | 1 |
| Peta pembanding | nama file versi sebelumnya, atau "Tidak ada" |
| Jenis akun | contoh: Publisher individu, status aktif (tanpa nama atau ID) |
| Bahasa UI | |
| Domain dashboard | contoh: https://.../ (tanpa parameter) |
| Jumlah fitur tercatat | |
| Ringkasan perubahan | contoh: 2 BARU, 3 BERUBAH, 0 HILANG |

## Pohon Navigasi
- Menu level 1
  - Submenu level 2 (F-ID)
    - Tab level 3

## Kartu Fitur

### F-ID · Nama fitur seperti tertulis di layar
| Item | Isi |
|---|---|
| Status | BARU / BERUBAH / HILANG / SAMA |
| Jalur menu | Menu > Submenu > Tab |
| Path URL | /path/tanpa/parameter |
| Fungsi | satu kalimat, berdasarkan teks di layar |
| Elemen di halaman | kolom, filter, tab, tombol (tulis label persis) |
| Aksi utama | tombol utama dan apa yang menurut teks di layar akan terjadi (tidak ditekan) |
| Label status yang muncul | contoh: Menunggu, Disetujui, Ditolak |
| Teks bantuan atau batasan | tooltip, catatan kecil, batas jumlah, syarat |
| Data sensitif di halaman | label kolom yang perlu disamarkan saat screenshot |
| Kandidat screenshot | kondisi layar yang layak dijadikan gambar tutorial |
| Panduan terkait | URL guideline atau bantuan yang ditautkan, cocok atau tidak |
| Catatan perubahan | isi kalau status BERUBAH atau HILANG |

## Panduan Resmi yang Ditemukan
| Judul | URL | Fitur terkait (F-ID) | Masih cocok dengan dashboard? | Catatan |
|---|---|---|---|---|

## Log Perubahan
| F-ID | Status | Apa yang berubah |
|---|---|---|

## Pertanyaan Terbuka
| No | Fitur (F-ID) | Pertanyaan | Kenapa tidak bisa dipastikan |
|---|---|---|---|
````

## 7. Cek sebelum menyimpan

1. Tidak ada nama, ID publisher, email, nomor HP, saldo, nominal komisi, atau nomor rekening di file.
2. Setiap fitur di Pohon Navigasi punya kartu fitur, dan sebaliknya.
3. Label tombol, menu, dan kolom ditulis persis seperti di layar, termasuk huruf besar dan kecilnya.
4. Simpan sebagai satu file MD dengan nama `PETA_FITUR_DASHBOARD_ACCESSTRADE_YYYY-MM-DD.md`.

## Riwayat Versi

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1 | 2026-11-05 | Versi awal: tujuan, aturan keamanan hanya-baca, cakupan, perbandingan dengan peta lama, aturan ID fitur, format output, cek sebelum menyimpan. Dipakai untuk peta fitur 2026-11-05 |

Aturan nomor versi:
- Setiap update aturan atau alur: naik satu angka (v2 menjadi v3, dan seterusnya).
- Perbaikan salah ketik yang tidak mengubah aturan: tidak perlu versi baru.
- Sebelum update, simpan versi lama ke `docs/arsip/<nama-file>-v<nomor>.md`, lalu perbarui baris Versi di atas dan tabel ini.
- Setiap peta fitur mencatat versi prompt yang dipakai di Metadata.
