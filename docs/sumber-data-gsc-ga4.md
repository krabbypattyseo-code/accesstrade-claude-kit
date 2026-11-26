# Sumber Data GSC & GA4

Versi v1 (2026-11-19). Windsor.ai dan Semrush **tidak dipakai** di kit ini.

## 1. Cara mengambil data

| Urutan | Cara | Kapan |
|---|---|---|
| 1 | Google API (Search Console API, GA4 Data API) | Kalau sesi ini punya akses |
| 2 | Claude in Chrome di UI Search Console dan GA4 | Default. Pakai filter dan ekspor CSV di UI |
| 3 | File permintaan data untuk sesi lain | Kalau 1 dan 2 tidak bisa. Pola: `docs/templates/permintaan-data-gsc-ga4-contoh-nov-2026.md` |
| 4 | CSV yang di-upload Harist | Ikuti checklist skill `accesstrade-analytics` |

## 2. Konvensi (wajib)

| Item | Nilai |
|---|---|
| GSC property | `sc-domain:accesstrade.co.id` |
| GA4 property | `336985096` ("ACCESSTRADE - GA4"). Jangan pakai `430809648` (view terfilter) |
| Dimensi GSC | Selalu `query` + `page` bersamaan. Data query saja bisa salah menyimpulkan kanibalisasi |
| Filter page | Buang URL yang mengandung `#` |
| Branded | Field branded bawaan tidak bisa dipercaya. Query yang mengandung "accesstrade" atau "accestrade" = branded |
| Jeda data GSC | 2–3 hari. 1–2 minggu terakhir terlihat lebih rendah dari aslinya |
| GA4 | Channel Organic Search, dimensi landing page / full page URL. Metrik: sessions, engaged sessions, engagement rate, event Click Daftar (`conversions_click_daftar`) |
| Event yang dilarang | `register_publisher_success` (tracking bermasalah sejak pertengahan Mei 2026) |
| Batas GA4 | Data tersedia mulai 21 April 2026 |
| Duplikat | Kalau ada baris kembar, pakai angka agregat dan beri catatan |
| Volume keyword | Impresi GSC, atau Google Keyword Planner / Google Trends lewat Chrome. Kalau tidak ada, tulis "tidak ada data" |
| People Also Ask | Kotak PAA di Google Search lewat Chrome + query pertanyaan di GSC |

## 3. Temuan yang masih berlaku

- Bank konten adalah mesin konversi (rasio Click Daftar per sesi tinggi), FB Pro adalah mesin traffic (klik besar, konversi rendah). Pertimbangkan ini saat memilih internal link dan CTA.
- Artikel baru yang belum dapat impresi GSC setelah tayang kemungkinan belum terindeks. Sarankan URL Inspection lalu Request Indexing.
- Event page AT Beauty Creator Lab belum punya tracking konversi form (lihat Dev Tracker).
