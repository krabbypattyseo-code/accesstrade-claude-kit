---
description: Upload artikel (baru atau optimasi) ke admin Accesstrade lewat Chrome, lalu catat tayang
---

# /upload: Upload Artikel ke Admin Accesstrade

Input dari Harist (ID Pipeline atau link draft): $ARGUMENTS

Ikuti `docs/upload-artikel.md`, dengan skill `accesstrade-post-article` untuk mengisi form dan `accesstrade-article-finder` untuk mencari entri artikel lama (optimasi).

Ringkasnya:
- Content Author = Muhammad Harist untuk artikel tulisan Wiwik.
- Release Date mengikuti bulan rencana di kolom B Pipeline. Tanggal persis, Status, dan Tags ditanyakan.
- Gambar diambil dari Drive "Gambar Artikel" (subfolder per ID) dan folder screenshot dashboard.
- Save hanya setelah Harist bilang oke. Setelah tayang, catat lewat aturan `/update`.
