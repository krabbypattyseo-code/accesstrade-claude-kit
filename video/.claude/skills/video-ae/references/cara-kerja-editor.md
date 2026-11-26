# Template: ae/cara-kerja-editor.md

Salin template ini ke `ae/cara-kerja-editor.md` di chat pertama, lalu isi dari jawaban editor dan hasil bedah project contohnya. File ini dibaca setiap chat `/video-ae` dan `/video-improvement` di PC editor.

```markdown
# Cara kerja editor di After Effects

Diisi: YYYY-MM-DD · AE versi: (dari profil-ae.md) · Windows: ...

## Kebiasaan
| Hal | Jawaban editor |
|---|---|
| Template / preset / MOGRT yang sering dipakai | |
| Plugin favorit (mis. Animation Composer, Motion Bro, Element 3D, Saber) | |
| Gaya easing (Easy Ease biasa / graph editor custom / plugin) | |
| Durasi transisi favorit | |
| Struktur folder di panel Project | |
| Penamaan comp dan layer | |
| Render: AE Render Queue atau Media Encoder, preset apa | |
| Finishing: musik, SFX, color dilakukan di AE atau aplikasi lain | |

## Bedah project contoh
| Project | Comp utama (ukuran, fps, durasi) | Efek paling sering | Expression yang dipakai | Catatan gaya |
|---|---|---|---|---|

## Yang ditiru builder
- (usulan konkret, mis. "transisi slide 12 frame dengan ease 80%", "pakai efek Drop Shadow di kartu")
- Usulan sudah dikirim ke kotak-masuk/untuk-improvement.md pada: YYYY-MM-DD

## Yang tidak boleh dilakukan Claude di PC ini
- (aturan dari editor, mis. "jangan sentuh folder D:\Project Klien")
```

## Membedah project contoh

1. Minta editor membuka project contohnya di AE dan menyimpannya dulu.
2. Jalankan bedah (membaca saja, tidak mengubah project):

```bash
node ae/build.mjs --bedah
```

   Kalau AE tidak terbuka otomatis, jalankan `ae/jsx/bedah-proyek.jsx` lewat *File > Scripts > Run Script File...* di AE (minta editor yang mengklik). Hasilnya `ae/proyek/_bedah/bedah-<nama project>.json`: daftar comp, layer, efek (matchName), expression, dan font yang dipakai.
3. Ringkas ke tabel "Bedah project contoh" di atas.
