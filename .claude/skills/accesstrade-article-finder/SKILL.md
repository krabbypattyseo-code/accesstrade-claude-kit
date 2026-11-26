---
name: "accesstrade-article-finder"
description: "Cari artikel Accesstrade di dashboard admin (Article List) dari URL, slug, atau judul, lalu tandai barisnya. Pakai kalau artikel tidak muncul di filter tabel."
---

# Accesstrade Article Finder

Skill untuk menemukan satu artikel di dashboard internal Accesstrade (`https://accesstrade.co.id/Modules/Admin/Master/Article/show`) lewat Claude in Chrome, lalu menandai barisnya di tabel. Tujuannya: user tidak perlu menjelaskan cara mencarinya dari awal.

Gaya komunikasi: bahasa Indonesia santai, pakai aku/kamu, hasil dalam bentuk tabel.

## Kapan dipakai

User memberi URL artikel (contoh `https://accesstrade.co.id/blogs/affiliate-marketing/affiliate-marketing-indonesia`), slug, atau judul, lalu minta "cari di dashboard", "kasih tanda kalau ketemu", atau "cek ada nggak di Article List". Tab aktif biasanya sudah halaman admin Article List.

## Input yang dibutuhkan

Cukup satu dari: URL publik, slug, atau judul. Jangan tanya balik hal lain. Default perilakunya: cari sampai ketemu dengan segala cara, lalu tandai barisnya.

## Aturan keamanan

- Jangan memasukkan username atau password. Kalau halaman minta login, minta user login sendiri.
- Jangan klik Export > Excel (itu download, butuh izin eksplisit dari user).
- Jangan edit, hapus, atau ubah data artikel. Skill ini hanya membaca dan menandai tampilan.
- Semua perubahan di halaman (highlight, prefilter, page size) bersifat sementara dan hilang saat refresh. Bilang ini ke user di laporan akhir.

## Fakta penting tentang dashboard ini

**1. Filter default menyembunyikan artikel.** Panel filter selalu terkunci ke Type=BLOGS, Status=Online, Content Role=Educate, Partner Type=Publisher. Select-nya tidak punya opsi kosong. Artikel yang Partner Type-nya kosong (atau nilai lain di luar pilihan) tidak akan pernah tampil di UI, walaupun statusnya Online. Jadi "kosong di filter" bukan bukti artikelnya tidak ada.

**2. Nilai field filter (name di form):**

| Field | Name | Nilai |
|---|---|---|
| ID | `src_txtId` | angka |
| Judul | `src_txtTitle` | teks (LIKE) |
| Short Name Url | `src_txtShortNameUrl` | teks (LIKE) |
| Meta Description | `src_txtMetaDescription` | teks |
| Type | `src_slType` | 2 = BLOGS, 6 = SPECIAL |
| Status | `src_slStatus` | 1 = Online, 2 = Offline |
| Content Role | `src_slContentRole` | to_educate, to_inspire, to_convert |
| Partner Type | `src_slPartnerType` | 1 = Publisher, 2 = Advertiser |

**3. Struktur tabel.** Baris ada di `ul.tblContent li.listTable`. Tombol "Check" di `li.url a` berisi URL publik artikel (`/blogs/{kategori}/{short-name}`). Select page size: `#showLength_table_1` (isi 25/50/100; set 100 lebih cepat untuk scan manual).

**4. Klik tombol Filter harus klik asli.** Mengubah nilai select/input lewat JS itu aman (set `.value` lalu dispatch event `change`), tapi `button.click()` lewat JS tidak memicu request. Gunakan klik asli lewat tool `computer` (tombol Filter hijau di bawah panel, class `filterBtn`). Tombol Filter di header tabel membuka panel; jangan salah klik tombol Export di sebelahnya.

**5. Endpoint data.** `POST /Modules/Admin/Master/Article/data` dengan body urlencoded: `elm`, `limit`, `offset`, `src`. Catatan penting: `limit` = indeks awal, `offset` = ukuran halaman (terbalik dari kelaziman). `src` adalah string urlencoded berisi field `src_*` di atas. Respons JSON: `header`, `data[]`, `pagelabel`. Tiap baris punya `txtId`, `txtTitle`, `slCategoryType`, `dpReleaseDate`, `slStatus`, `txtShortNameUrl`, `slContentRole`, `txtTargetUrl`, `slPartnerType`. Kalau key `src_slType`, `src_slStatus`, `src_slContentRole`, `src_slPartnerType` dihapus dari `src` (bukan diisi kosong; diisi kosong hasilnya 0), server mengembalikan semua artikel (kasus terakhir: 1.287 artikel, jauh di atas 261 di tabel default).

**6. Batasan tool.** Output JS yang berisi cookie atau query string akan diblokir (`[BLOCKED: Cookie/query string data]`). Jangan mencetak body request mentah; parse dengan `URLSearchParams` dan cetak hanya key atau hasil turunan. Di REPL, definisikan helper sebagai `window.x = async (...) => {...}` (deklarasi `function` sering gagal). Jangan cetak JSON besar; cetak ringkasan.

## Alur kerja

1. **Baca konteks tab.** Pastikan tab aktif adalah Article List admin. Kalau bukan, navigasi ke URL admin di atas. Kalau minta login, berhenti dan minta user login.

2. **Turunkan kata kunci dari input.** Dari URL: kategori = segmen setelah `/blogs/`, slug = segmen terakhir. Kalau input judul, pakai judul.

3. **Verifikasi artikel publik (opsional tapi murah).** Di tab admin (same origin), `fetch` URL publik lalu ambil `<title>`, `<h1>`, canonical, `datePublished`. Ini memberi judul cadangan dan tanggal terbit untuk mencocokkan.

4. **Coba jalur cepat lewat UI.** Buka panel Filter, isi `src_txtShortNameUrl` dengan slug, klik Filter (klik asli), baca `ul.tblContent li.listTable`. Kalau ketemu, lompat ke langkah 7. Kalau kosong, JANGAN simpulkan tidak ada.

5. **Tarik data tanpa filter terkunci.**
   - Pasang hook: `jQuery(document).ajaxSend((e,x,s)=>{window.__log2=(window.__log2||[]);window.__log2.push({u:s.url,d:typeof s.data==='string'?s.data:''})})`.
   - Klik Filter sekali (klik asli) supaya request tertangkap; ambil entri terakhir dengan URL berakhiran `Article/data` sebagai template (`window.__u`, `window.__base`).
   - Buat helper yang menghapus 4 key select dari `src`, lalu paging: `limit` = 0, 100, 200, ... dan `offset` = 100, sampai jumlah baris < 100.
   - Simpan semua baris di `window.__allrows`.

6. **Cocokkan.** Urutan kecocokan: (a) `txtShortNameUrl` persis sama dengan slug; (b) judul mengandung H1 atau title publik; (c) baris lain yang `txtTargetUrl`-nya menunjuk URL ini (catat sebagai artikel terkait, bukan target). Kalau ada beberapa kandidat, pilih yang short name-nya persis dan sebutkan sisanya.

7. **Tampilkan di tabel UI lalu tandai.**
   - Kalau artikel tidak bisa tampil karena filter terkunci (mis. Partner Type kosong), pasang prefilter: `jQuery.ajaxPrefilter(o=>{if(/Article\/(data|datacounttable)/.test(o.url)&&typeof o.data==='string'){const p=new URLSearchParams(o.data);if(p.has('src')){const i=new URLSearchParams(p.get('src'));['src_slType','src_slStatus','src_slContentRole','src_slPartnerType'].forEach(k=>i.delete(k));p.set('src',i.toString());o.data=p.toString();}}})`.
   - Buka panel Filter, ketik ID artikel di field ID (klik asli + ketik), klik Filter (klik asli). Baris seharusnya muncul.
   - Tandai baris: background kuning (`#fff3a3`), outline merah 3px, tambahkan badge merah "KETEMU — ID {id}" di atas baris, lalu `scrollIntoView({block:'center'})`.
   - Ambil screenshot untuk memastikan tandanya terlihat.

8. **Rapikan.** Kalau user hanya mau lihat, tanda dibiarkan. Kalau mengubah page size, kembalikan ke 25 dan halaman 1.

## Format laporan

Selalu tampilkan tabel ringkas:

| Field | Isi |
|---|---|
| ID | ... |
| Title (Id) | ... |
| Short Name Url | ... |
| Category | ... |
| Release Date | ... |
| Status | ... |
| Content Role | ... |
| Partner Type | ... (tulis "kosong" kalau kosong) |

Lalu tulis satu atau dua kalimat: kenapa tidak muncul di tabel default (kalau memang begitu), bahwa tanda dan prefilter hanya sementara sampai refresh, dan daftar artikel terkait bila ada (mis. yang Target URL-nya menunjuk artikel ini).

## Kalau tetap tidak ketemu

Jika data tanpa filter juga tidak berisi short name atau judul yang cocok, katakan jelas bahwa artikel tidak ada di tabel Article List (sudah dicek semua Type, Status, Content Role, Partner Type). Tawarkan cek menu admin lain (Guideline, Event, FAQ) dan sertakan hasil verifikasi URL publiknya (status, title, H1).

## Catatan tambahan

- Kalau user minta "scan manual halaman per halaman", set page size 100 dan baca href `li.url a` per halaman, tapi ingat cara ini tetap terbatas pada filter default.
- Kalau user minta daftar semua artikel dengan Partner Type kosong (atau field lain kosong), gunakan data dari langkah 5 dan filter di `window.__allrows`.