---
description: Catat progres ke 3 dokumentasi (Pipeline, Review Indah, Data Writer Finance) dan koreksi draft artikel baru
---

# /update: Update Dokumentasi Konten

Input dari Harist: $ARGUMENTS

Ikuti seluruh aturan di `docs/instruksi-update-dokumentasi.md` (v2). Ringkasnya:

1. Awal sesi: baca tab ✅ Review Indah dan sinkronkan ke Leader Check di Pipeline (aturan bagian 5). Laporkan hasil sinkronisasi.
2. Cocokkan jenis update dengan tabel bagian 7, lalu cek syarat masuk bagian 3:
   - Pipeline dan Review Indah wajib ada link Google Docs (docs.google.com).
   - Data Writer hanya untuk artikel baru dari writer yang sudah tayang dengan full URL `https://accesstrade.co.id/blogs/...`. Optimasi dan Academy tidak pernah masuk Data Writer.
3. Kalau data penting kurang (judul, tanggal tayang, word count, plagiarisme, kategori), tanyakan semuanya dalam satu pesan. Jangan menebak.
4. Tulis, verifikasi, catat satu baris log di 📚 Referensi & Log (cara sisip aman di `docs/struktur-spreadsheet.md`).
5. Laporan: tabel `Dokumen | Tab | Baris | Perubahan`.

Batas mutlak: Data Writer kolom L ke kanan tidak pernah disentuh, dan link Google Docs tidak pernah ditulis ke Data Writer.

Koreksi draft (bagian 8): pakai skill `eyd-checker` dan `docs/house-style-dan-eyd.md`. Hasilnya tabel `No | Bagian | Temuan | Saran Perbaikan`. File Google Docs tidak diubah kecuali diminta.
