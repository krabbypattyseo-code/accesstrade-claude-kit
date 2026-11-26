---
description: Content brief artikel baru untuk writer (Wiwik), batch biasanya 5 ID Pipeline, lalu catat ke Pipeline
---

# /brief: Content Brief Artikel Baru

Input dari Harist (biasanya daftar ID, contoh "P0215, P0216, P0217, P0218, P0222"): $ARGUMENTS

Ikuti seluruh alur 8 step di `docs/instruksi-brief.md` (v2), dengan skill `content-brief` untuk checklist dan template dokumen.

Penyesuaian di kit ini:
- Data GSC lewat Chrome (Search Console) atau Google API kalau tersedia. **Windsor dan Semrush tidak dipakai.** Aturan data: `docs/sumber-data-gsc-ga4.md`.
- Kalau sesi ini tidak bisa menarik data GSC/GA4 sendiri, buat file permintaan data dengan pola `docs/templates/permintaan-data-gsc-ga4-contoh-nov-2026.md`, kirim ke Harist, lalu lanjutkan bagian yang tidak bergantung pada data.
- Untuk langkah dashboard ACCESSTRADE di outline, pakai `docs/peta-fitur-dashboard-2026-11-05.md` dan `docs/workflow-screenshot-dashboard.md`.
- Brief hanya untuk Tipe **Baru**. Kalau ID-nya Optimised, atau skor keunikan di bawah 70%, berhenti untuk ID itu dan laporkan (kandidat optimasi).

Yang ditulis ke Pipeline hanya kolom Q Link Brief, M PIC (Wiwik Agustina), N Status (On Progress), J Keyword (kalau berubah), dan I Judul (hanya kalau Harist setuju). Tidak menulis ke Review Indah atau Data Writer.
