# Panduan rekam suara

Satu video = **satu rekaman utuh**. Mesin video memotong sendiri rekaman itu per adegan dengan mencocokkan kata yang terdengar ke teks script. Jadi tidak perlu mengedit audio.

## Sebelum merekam

- Ruangan tenang, tidak bergema (kamar dengan kasur/lemari baju lebih baik daripada ruangan kosong).
- iPhone: aplikasi **Voice Memos**. Kualitas: Pengaturan → Voice Memos → Kualitas Audio. **Lossless** bisa diproses di Mac; untuk PC Windows editor pilih **Compressed**, atau pasang ffmpeg lengkap di PC itu (`winget install Gyan.FFmpeg`).
- Jarak mulut ke HP ±20-30 cm, sedikit dari samping supaya napas tidak "meniup" mic.
- Buka script dan baca dulu sekali tanpa merekam.

## Saat merekam

- Baca teks `vo` dari adegan pertama sampai terakhir, **berurutan**, dalam satu rekaman.
- Jeda ±1 detik di antara adegan.
- **Salah baca? Jangan berhenti merekam.** Diam sebentar, lalu ulangi **satu kalimat penuh** dari awal kalimat. Mesin selalu memakai pengulangan yang terakhir, yang salah otomatis terbuang.
- Ucapkan angka seperti di script ("lima puluh menit" atau "50 menit", keduanya dikenali).
- Boleh beda sedikit dari script (mis. "nggak" vs "tidak"), tapi kalimat yang berubah jauh bisa tidak ketemu.
- Video YouTube yang panjang tetap satu file. Boleh istirahat di tengah: diam saja, jangan stop rekaman. Kalau terpaksa terpotong jadi dua file, minta sesi Eksekusi (`/video-remotion` atau `/video-ae`) menyambungnya.

## Setelah merekam

1. Kirim ke laptop lewat **AirDrop atau Google Drive** (bukan WhatsApp, karena kualitasnya diturunkan).
2. Beri nama diawali nomor video, lalu taruh di folder sesuai format:
   - Reels: `rekaman/reels/01-judul-singkat.m4a`
   - YouTube: `rekaman/youtube/01-judul-singkat.m4a`
3. Di sesi Eksekusi (`/video-remotion` atau `/video-ae`): "rekaman video reels 01 sudah masuk". Claude menjalankan `npm run vo` dan memberi laporan per adegan. Adegan dengan skor rendah perlu didengarkan ulang.

## Kalau hasilnya kurang pas

- **Adegan tidak ketemu**: biasanya kalimatnya jauh beda dari script. Rekam ulang kalimat itu saja di akhir file, atau minta potongan manual (`voCut`).
- **Suara terlalu pelan**: dinormalkan otomatis ke -14 LUFS. Rekaman yang sangat pelan butuh ffmpeg sistem untuk limiter (`brew install ffmpeg`).
- **Ada bunyi "klik" atau napas di awal adegan**: minta sesi Eksekusi menggeser potongan dengan `voCut`.
