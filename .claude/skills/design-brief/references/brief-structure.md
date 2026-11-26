# Struktur Dokumen — Internal & Designer

Dua dokumen, dua pembaca. Jangan digabung, jangan disamakan isinya.

---

# A. BRIEF DESIGNER

**Target: 1 halaman untuk 1 aset. Maksimal 3 halaman untuk 5+ aset.**

Kalau dokumen ini melewati batas itu, ada yang harus dipotong — hampir selalu bagian rasional yang seharusnya ada di brief internal.

## Header
Brand · Judul artikel · Jenis aset · Jumlah aset

## Tanggal Penting
Tabel ringkas:

| Brief date | First preview | Final preview | Posting date |
|---|---|---|---|

Empat tanggal ini lebih berguna daripada satu "deadline", karena preview yang meleset adalah penyebab paling umum posting mundur.

## Spesifikasi
Tabel pendek — hanya yang perlu dieksekusi:

| Field | Detail |
|---|---|
| Dimensi & rasio | |
| Format file | |
| Maks ukuran file | |
| Varian tambahan | |
| Source file editable | |
| Warna brand (hex) | |
| Font | |

## Aturan Copy
Section pendek, ditaruh sebelum blok per aset:

> Semua teks sudah final dan ada di tabel Copy tiap aset. Pakai persis apa adanya — jangan ditulis ulang, dipersingkat, ditambah, atau diganti sinonimnya, termasuk caption kecil dan label. Tugasmu murni visual: warna, komposisi, tipografi, elemen grafis.
>
> Kalau ada teks yang tidak muat atau merusak komposisi, kabari dulu sebelum diubah.
>
> Teks di sketsa yang ditulis miring atau berwarna abu adalah catatan untukmu, bukan copy — jangan ikut digambar.

## Per Aset
Untuk tiap aset, blok pendek dengan urutan tetap:

1. **Nomor & nama aset**
2. **Copy** — tabel berisi SETIAP string yang muncul di visual, apa adanya. Bukan ringkasan pesan, tapi teks siap ketik. Wajib memuat: teks utama, label, caption kecil, callout, atribusi/sumber, keberadaan dan posisi logo, dan varian copy untuk crop lain. Kalau suatu elemen memang tidak berteks, tulis "Tidak ada" — kekosongan yang disengaja harus terlihat disengaja.
3. **Visual cue** — 1–2 kalimat: apa yang digambar dan situasinya
4. **Sketsa layout** — gambar PNG disisipkan di sini
5. **Referensi riset** — 4–6 keyword bahasa Inggris + kanal (Pinterest/Dribbble/Behance)

Format visual cue yang bekerja: subjek + situasi + emosi.
Contoh: "Meja penuh kertas, paspor, dan sticky notes. Satu orang di baliknya terlihat kewalahan." Bukan: "Visual yang menggambarkan kompleksitas dokumen."

## Do & Don't
Tabel dua kolom. Item spesifik project di atas, standar di bawah. Maksimal 6 baris per kolom — kalau lebih, tidak dibaca.

## Submission
- Naming convention file
- Folder / channel submission
- Jumlah putaran revisi
- Cara memberi feedback

**Cek sebelum kirim:** baca sketsa, catat setiap kata yang terlihat, cocokkan dengan tabel Copy. Kata yang muncul di sketsa tapi tidak ada di tabel akan diarang designer.

**Yang TIDAK boleh masuk brief designer:** rasional SEO, target traffic, analisis kompetitor, alasan pemilihan topik, prompt AI generatif (kecuali user minta), strategi distribusi.

---

# B. BRIEF INTERNAL

Untuk requester. Boleh sedetail dan sekomprehensif mungkin — ini dokumen berpikir, bukan dokumen instruksi.

## 1. Ringkasan Project
Artikel ini tentang apa, aset visualnya untuk apa, dipublish di mana, kenapa sekarang.

## 2. Brand Profile
Tabel lengkap: primary color, accent, netral, font, mood, industri, link guideline.
Kalau diturunkan dari fetch website dan belum dikonfirmasi, tandai `[hasil inferensi, mohon dikonfirmasi]`.

## 3. Analisis Artikel
Hasil baca `web_fetch`: tesis utama, struktur heading, audience tersirat, momen emosional yang bisa jadi hook visual, data/angka yang tersedia.

## 4. Asset Map + Rasional
Tabel: No | Section | Tipe Visual | Konsep | **Kenapa konsep ini** | Prioritas

Kolom "kenapa" adalah nilai utama dokumen ini. Ini yang dipakai requester untuk menilai apakah usulan Claude masuk akal, dan untuk membela keputusan visual ke stakeholder.

## 5. Creative Direction Lengkap
- Pesan utama per aset
- Emotional tone
- Style lane + alasan pemilihannya
- Focal point
- Human presence
- Referensi disuka + anti-referensi + alasan kenapa anti-referensi itu tidak cocok

## 6. Sketsa + Catatan Desain
Sketsa yang sama dengan brief designer, tapi disertai catatan: keputusan layout apa yang diambil dan apa alternatifnya kalau designer mengusulkan arah lain.

## 7. Arah Riset Referensi
Keyword, kanal, apa yang dicari dari referensi, klise yang dihindari.

## 8. Lampiran — Prompt AI Generatif
Opsional. Format di `ai-prompt-format.md`. Ditaruh di sini, bukan di brief designer.

## 9. Spesifikasi Teknis Lengkap
Termasuk varian yang belum tentu diminta sekarang tapi mungkin dibutuhkan nanti (crop sosial media, @2x, versi dark mode).

## 10. Catatan Revisi & Risiko
- **Keputusan copy yang diambil Claude** — copy asli yang dipotong, dipecah, atau ditulis ulang demi keterbacaan, beserta alasannya. Ini keputusan editorial yang dibuat atas pertimbangan visual, jadi harus direview orang yang berwenang atas pesan
- Bagian mana yang paling mungkin kena revisi dan kenapa
- Asumsi yang dibuat Claude dan perlu divalidasi
- Titik keputusan yang masih terbuka

---

## Catatan Implementasi docx

- Heading pakai style built-in (`HeadingLevel.HEADING_1/2`).
- Semua tabel: `columnWidths` di level table DAN `width` di tiap cell, dua-duanya `WidthType.DXA`.
- Shading pakai `ShadingType.CLEAR`, jangan `SOLID` (jadi hitam).
- Sketsa PNG disisipkan pakai `ImageRun` dengan `type: "png"`, lebar maksimal ~500pt supaya muat halaman portrait.
- `PageBreak` harus di dalam `Paragraph`.
- Jangan pakai `\n` — pakai `Paragraph` terpisah.
- Warna aksen dokumen netral (abu/hitam), bukan warna brand klien, karena skill ini dipakai lintas brand.
