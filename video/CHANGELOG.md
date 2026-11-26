# Catatan perubahan modul video

Ditulis sesi Improvement setiap kali mesin video (Remotion atau builder After Effects), skill, atau aturan modul berubah. Sesi Eksekusi membaca file ini sebelum render. Entri terbaru di atas.

Format entri:

```
## vX.Y.Z · YYYY-MM-DD
- Apa yang berubah (satu baris per perubahan)
- Dampak untuk sesi lain: mis. "Scriptwriting: tipe adegan baru `timeline`, lihat scripts/SKEMA.md"
- Status tes: Remotion (Mac/Windows), After Effects (mock / AE asli)
```

## v1.0.0 · 2026-11-26
- Modul video ACCESSTRADE dibuat dari kit video Remotion (Reels 1080×1920 + YouTube 1920×1080).
- Lima sesi: `/video-script`, `/video-remotion`, `/video-ae`, `/motion-format` (hanya Mac Harist), `/video-improvement`.
- Mesin Remotion jalan di macOS dan Windows: Remotion dipanggil lewat Node langsung, Python lewat `.venv` lintas OS, suara demo Windows lewat System.Speech, foto HEIC lewat pillow-heif, ffmpeg sistem dipakai kalau ada.
- Tipe adegan baru `klip` (b-roll, rekaman layar, footage) dan `npm run klip`. Efek suara per adegan (`sfx`) dan `npm run sfx`.
- Brand ACCESSTRADE (navy/oranye), token `textOnBrand`/`accentOnBrand` untuk teks di latar oranye, hook Reels tanpa caption (`caption.reels.onHook: false`).
- Render utama dicoba ulang sekali kalau Chrome lambat menyala.
- Jalur After Effects: builder ExtendScript (`ae/`), inventaris AE, bedah project editor. **Belum dites di After Effects asli** (AE tidak ada di Mac Harist): tes pertama di PC editor lewat `/video-ae`.
- Alur dari project lain: produksi 5 tahap (Domba/Ruang Fisio), playbook footage (Laycation), aturan brief (Dpurple).
- Status tes: Remotion Mac (render draft kedua contoh, klip, brand), Windows belum dites di PC asli.
