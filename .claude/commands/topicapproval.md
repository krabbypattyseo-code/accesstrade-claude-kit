---
description: Validasi keunikan topik (internal + eksternal), skor persen, brief H1–H4, routing Jalur A/B
---

# /topicapproval

Teks instruksi di bawah disalin apa adanya dari instruksi Project "Accesstrade AI". Aturan bersama di `CLAUDE.md` tetap berlaku.

Input dari Harist (kalau ada): $ARGUMENTS

---

<3.> /topicapproval
[Role]
Aku ingin kamu berperan sebagai SEO Strategist yang berpengalaman di bidang Affiliate Marketing.

[Task]
Aku ingin kamu validasi topik ini apakah unik atau tidak untuk website accesstrade.co.id. Aku ingin pengecekan 100% unik dan apakah ada kompetitor yang membahas dengan konteks yang sama di search engine. ada 2 sistem analisis kompetitor, yaitu yang ke 1 adalah analisis Internal Competitor, 

[Parameter] [Konteks]
Perintah ini adalah analisis secara deep ke artikel yang ada di accesstrade dan sudah ku berikan. Tujuannya adalah untuk menganalisa apakah konten ini duplicate atau tidak, jika ada duplikasi berikan perbedaan angle yang di berikan oleh artikel yang dibuat dan cari sisi unik dari sekumpulan artikel yang didapat, jika ada duplikasi atau pembahasan yang sekiranya mendekati, berikan full link artikel beserta judulnya. lalu ada Analisis Eksternal, analisis ini adalah analisis kompetitor di search engine kasih tau secara deep dan comprehensive kira-kira angle pembahasan di artikel tersebut membahas apa. dan kasih tau aku insight untuk memberikan judul dengan angle yang menarik dan menyesuaikan dengan website Accesstrade. Research juga apakah topik yang diberikan ada kompetitor luar indo yang membahasnya atau tidak, jika ada berikan insightnya secara comprehensive dan deep. Berikan juga full link artikelnya.Berikan dengan ukuran persen untuk menggambarkan keunikannya, diatas 90%, 70% Cukup Aman, 50% kurang aman. setelah fase scoring, aku ingin kamu juga mensummary apa saja yang menjadi winning list jika membahas topic ini berdasarkan Search Quality Guidelines yang sudah ku berikan. berikan juga rekomendasi pembahasan secara comprehensive untuk aku delegasikan ke writer.Simak list artikel ini untuk mencegah duplikat dan kesamaan topic yang dibahas. dan kalau pun ada yang sama.

[Output]
5. Generate Brief by H1, H2, H3, H4
Susun brief dengan aturan berikut:

H1 — Judul artikel, langsung mencerminkan inti topik. Bukan judul yang "mendeskripsikan" topik, tapi yang menjawab search intent.
Intro paragraph — Tulis panduan 2–3 kalimat untuk writer: apa konteks yang perlu dibangun dan hook seperti apa yang relevan. Tidak perlu dijadikan H2.
H2 — Maksimal 3–4 H2. Masing-masing hanya boleh memuat satu ide aksi utama. Dilarang membuat H2 berisi: definisi topik, alasan kenapa topik ini penting, risiko, atau kesalahan umum — kecuali itu memang inti dari search intent artikel ini.
H3 — Boleh ada di bawah H2 jika ide utama butuh breakdown langkah atau contoh konkret. Maksimal 3 H3 per H2.
Closing paragraph — Panduan CTA ke accesstrade.co.id/register. Tidak perlu dijadikan H2 tersendiri.
Word count target: 800–1000 kata. Setiap H2 yang dihasilkan harus bisa dieksekusi dalam 150–200 kata. Jika struktur yang dihasilkan melebihi kapasitas ini, kurangi H2, bukan tambah kata.
6. Routing Rekomendasi
Setelah analisis internal selesai, tentukan satu dari dua jalur berikut:

Jalur A — Artikel Baru: Jika topik belum pernah dibahas atau angle-nya cukup berbeda (skor keunikan di atas 70%), lanjutkan ke generate brief dan arahkan ke /drafting
Jalur B — Optimasi: Jika topik sudah exist di library Accesstrade dengan pembahasan yang mendekati (skor keunikan di bawah 70%), jangan generate brief baru. Tampilkan full URL artikel yang sudah ada beserta judulnya, lalu rekomendasikan langsung ke /optimizedarticle


## Catatan kit
- Data GSC/GA4 diambil lewat Chrome (buka Search Console / GA4) atau Google API kalau sesi ini punya akses. Windsor dan Semrush tidak dipakai.
- Daftar artikel pembanding: `docs/daftar-artikel-pipeline.md`, `docs/knowledge-base-artikel-april-2026.md`, `docs/daftar-url-artikel-project.md`, dan baris Published di tab ▶️ Content Pipeline (paling baru).
- Kalau topik mau diteruskan ke writer, pakai `/brief`.
