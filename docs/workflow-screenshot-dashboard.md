# Workflow Screenshot Tutorial Dashboard ACCESSTRADE

> Disalin dari Project "Accesstrade AI" pada 2026-11-19 untuk kit Claude Code. Rujukan file sudah disesuaikan ke folder `docs/`. Nama alur lama: Chat Brief = `/brief`, chat update dokumentasi = `/update`, chat optimasi productivity = `/optimasi`, chat admin dashboard = `/admin`.

Versi: 1 (2026-11-05)
Berlaku untuk: semua perintah di kit ini
Pemilik alur: Harist

Dokumen ini adalah aturan tetap. Setiap kali sebuah artikel, brief, draft, atau dokumen butuh gambar dari dashboard publisher ACCESSTRADE, Claude mengikuti alur di bawah. Output-nya selalu sama: daftar penanda gambar dengan kode, file MD tugas screenshot yang beranotasi, dan prompt pembuka untuk Chrome extension.

## 1. Kapan workflow ini dipakai

Pakai workflow ini kalau ada salah satu kondisi berikut:
- Artikel atau brief berisi langkah yang dikerjakan di dashboard ACCESSTRADE, misalnya daftar campaign, ambil link, custom link, cari produk TikTok Shop, baca laporan, cek pembayaran, referral, Sub ID, postback, video, atau voucher.
- Ada penanda gambar yang menyebut dashboard, menu, atau tombol ACCESSTRADE.
- Harist meminta screenshot tutorial, gambar dashboard, atau "gambar yang relevan dengan dashboard".
- Hasil eksplorasi dashboard baru (peta fitur) dilampirkan.

| Perintah atau chat | Yang dilakukan dengan workflow ini |
|---|---|
| /topicapproval dan Chat Brief | Tandai di brief bagian mana yang butuh screenshot dashboard (kode SS-AT), dan tulis jalur menu dari peta fitur supaya writer memakai label yang benar |
| /drafting dan /finaldraft | Tulis langkah dengan label persis dari peta fitur, pasang penanda gambar berkode, lalu buat MD tugas screenshot |
| /optimizedarticle | Bandingkan langkah di artikel lama dengan peta fitur, catat label yang sudah berubah di rekomendasi, lalu buat MD tugas screenshot |
| /validasiartikel | Cek apakah langkah dashboard di artikel masih cocok dengan peta fitur. Ketidakcocokan masuk ke bagian Improvement |
| /brandpublication | Section 5 Tutorial Join wajib memakai jalur dari peta fitur dan penanda SS-AT |
| /generatesubimages | Gambar yang menampilkan dashboard tidak dibuat sebagai ilustrasi. Arahkan ke workflow ini (kode SS-AT) |
| Chat update dokumentasi | Catat status screenshot di Review Indah dan Pipeline (bagian 9) |
| /discussmode | Pakai peta fitur sebagai sumber fakta saat membahas fitur dashboard |

## 2. File rujukan di Project

| File | Isi | Cara pakai |
|---|---|---|
| `docs/peta-fitur-dashboard-YYYY-MM-DD.md` | Peta 37 fitur dashboard: jalur menu, path URL, label tombol, data sensitif, kandidat screenshot, panduan resmi yang cocok atau tidak | Selalu pakai versi dengan tanggal terbaru. Ini satu-satunya sumber label menu dan tombol |
| `docs/prompt-eksplorasi-dashboard.md` | Prompt untuk Chrome extension menjelajahi dashboard dan membuat peta fitur | Dijalankan Harist secara berkala (bagian 10) |
| Dokumen ini | Aturan alur, template MD tugas screenshot, prompt pembuka | Diikuti setiap kali butuh gambar dashboard |

Kalau peta fitur terbaru berumur lebih dari 45 hari, ingatkan Harist di laporan untuk menjalankan eksplorasi ulang sebelum screenshot diambil.

## 3. Alur lengkap

| Tahap | Siapa | Input | Output |
|---|---|---|---|
| 1. Klasifikasi gambar | Claude | Draft, brief, atau artikel | Tabel penanda gambar berkode (bagian 4) |
| 2. Sesuaikan teks | Claude | Peta fitur | Langkah tutorial dengan label persis seperti di layar (bagian 5) |
| 3. Buat MD tugas screenshot | Claude | Penanda SS-AT dan peta fitur | `SS_P0xxx_dashboard_accesstrade.md` dari template (bagian 6) |
| 4. Ambil screenshot | Harist dan Chrome extension | MD tugas dan prompt pembuka (bagian 7) | PDF beranotasi, PNG beranotasi, PNG bersih, tabel laporan |
| 5. Proses hasil | Claude | Hasil dari extension | Gambar masuk dokumen, teks disesuaikan dengan laporan, status dicatat (bagian 8 dan 9) |

## 4. Klasifikasi penanda gambar

Setiap penanda gambar di draft, brief, atau Docs Review memakai salah satu kode berikut. Nomor urut dimulai dari 01 per artikel.

| Kode | Arti | Dikerjakan oleh |
|---|---|---|
| `SS-AT-01` | Screenshot dashboard publisher ACCESSTRADE (db.accesstrade.co.id) | Chrome extension lewat MD tugas screenshot |
| `SS-WEB-01` | Screenshot halaman publik accesstrade.co.id, misalnya halaman daftar publisher | Chrome extension (tanpa login), boleh digabung di MD yang sama |
| `SS-EXT-01` | Screenshot platform lain (aplikasi Shopee, TikTok Studio, Instagram, Facebook, WhatsApp) | Harist manual, dari HP atau akun platform tersebut |
| `ILUS-01` | Ilustrasi, sub image, infografis, mockup | /generatesubimages atau designer |

Format penanda di dokumen:
```
[SS-AT-01: deskripsi singkat kondisi layar]
[SS-AT-04 (opsional): deskripsi singkat]
```

Aturan:
- Satu penanda untuk satu gambar. Kalau satu langkah butuh dua kondisi layar, pecah jadi dua kode.
- Penanda ditaruh tepat setelah paragraf atau daftar langkah yang dijelaskan gambar itu.
- Tandai "(opsional)" untuk gambar yang memperkaya tetapi tidak wajib.
- Di Docs Review untuk Indah, penanda boleh tetap tampil karena isinya netral.

## 5. Aturan menulis langkah dashboard di artikel

1. Tulis nama menu, tab, kolom, dan tombol **persis** seperti di peta fitur, termasuk huruf kapital. Contoh: tab TERAFILIASI, tombol DAFTAR, tombol CUSTOM LINK, kolom Custom Name, tombol GENERATE.
2. Tulis jalur menu dengan tanda `>`. Contoh: Direktori Campaign > Daftar Campaign.
3. Kalau UI menampilkan label bahasa Inggris (misalnya modal Generate Custom link, halaman Pembayaran), tulis label Inggrisnya apa adanya.
4. Jangan menyuruh pembaca mengikuti panduan resmi /publisher/guideline yang di peta fitur berstatus **tidak cocok**. Per peta 2026-11-05 ada 7 panduan seperti itu:
   - cara-mendaftar-campaign
   - cara-membuat-custom-link
   - laporan-performa
   - informasi-pembayaran
   - setting-akun
   - postback
   - widget
5. Kalau tampilan bisa berbeda di akun pembaca, arahkan ke live chat (ikon headset di header dashboard), bukan ke panduan lama.
6. Fakta dari peta fitur boleh dipakai di artikel. Contoh: minimum pembayaran Rp100.000 untuk rekening bank Indonesia, satu URL per GENERATE di Custom Link, dan form rekening bank yang wajib OTP.
7. Fitur yang di peta tercatat kosong atau error (AT Challenge, Voucher, Event, Tokopedia per 2026-11-05) tidak dijadikan screenshot. Cukup ditulis sebagai teks.

## 6. Template MD tugas screenshot

Salin template ini, lalu isi semua bagian yang ada di dalam `{ }`. Bagian 1 sampai 4 dan 6 tidak diubah kecuali ada aturan baru. Bagian 5 diisi per artikel dari peta fitur.

`````markdown
# Tugas Screenshot Tutorial Dashboard ACCESSTRADE: {P0xxx}

Artikel: {judul H1}
URL artikel: {full URL, atau "artikel baru, belum tayang"}
Sumber jalur menu: Peta Fitur Dashboard ACCESSTRADE {tanggal peta}
Dashboard: https://db.accesstrade.co.id/
Jumlah screenshot: {n} ({kode wajib} wajib, {kode opsional} opsional)

## 1. Aturan umum

1. Kerjakan di tab dashboard publisher ACCESSTRADE yang sudah login. Jangan logout, jangan ganti akun.
2. Jangan mengubah pengaturan akun, profil, properti, rekening, atau postback.
3. Jangan menekan DAFTAR atau YA, SAYA SETUJU pada campaign apa pun, kecuali item di bawah menyebutnya secara eksplisit.
4. Yang boleh ditekan hanya yang disebut di bagian Langkah setiap item.
5. Jangan menekan COPY, SALIN, Download Video, UNDUH, EMAIL, SEND OTP, UPDATE, PERBARUI, PROCESS, atau UPDATE POSTBACK.
6. Bahasa UI:
   - Sebelum setiap screenshot, pastikan bahasa Indonesia aktif (ikon bendera di header).
   - Kalau halaman tetap berbahasa Inggris, ambil apa adanya, lalu catat di laporan.
7. Ukuran layar desktop minimal 1280 px. Zoom browser 100%.
8. Kalau menu atau label berbeda dari langkah di bawah, ikuti yang ada di layar. Catat jalur yang sebenarnya di laporan.

## 2. Data yang wajib disamarkan (semua screenshot)

Samarkan dengan `atBlur()` sebelum screenshot diambil:
- Sidebar atas: nilai Penghasilan (IDR), jumlah Superpoint, dan nama situs di Pilih Situs Anda
- Sapaan nama di Beranda, nama dan email di menu profil
- Badge angka di tab
- Link affiliate, link hasil generate, kode referral, dan URL datafeed, kecuali domain di depannya
- Angka laporan (klik, konversi, reward, transaksi, EPC) dan nama kreatif milik publisher
- Site ID, nomor invoice, dan nominal pembayaran

Jangan simpan screenshot yang belum disamarkan.

## 3. Standar anotasi

| Elemen | Aturan |
|---|---|
| Kotak sorot | Garis 3 px warna #F17420 (oranye ACCESSTRADE), sudut membulat, mengelilingi elemen yang diklik atau diisi |
| Nomor | Lingkaran oranye 28 px dengan angka putih tebal di pojok kiri atas kotak. Nomor mengikuti urutan klik di gambar itu, mulai dari 1 |
| Label | Opsional, maksimal 4 kata, teks putih di latar oranye, di kanan kotak (pindah ke kiri kalau keluar layar) |
| Jumlah | Maksimal 5 anotasi per gambar |
| Larangan | Tanpa panah, tanpa emoji, tanpa teks panjang. Anotasi tidak boleh menutupi elemen yang disorot |

## 4. Helper anotasi (jalankan di console setiap kali halaman dimuat)

Helper hilang setiap kali halaman berpindah atau dimuat ulang, jadi jalankan lagi di setiap halaman baru.

```js
(() => {
  const C = '#F17420';
  const layer = () => {
    let l = document.getElementById('at-annot-layer');
    if (!l) {
      l = document.createElement('div');
      l.id = 'at-annot-layer';
      Object.assign(l.style, {position:'absolute', left:'0', top:'0', width:'0', height:'0', zIndex:'2147483647', pointerEvents:'none'});
      document.body.appendChild(l);
    }
    return l;
  };
  window.atFind = (text, root = document) => {
    const want = text.trim().toLowerCase();
    const hits = [...root.querySelectorAll('body *')]
      .filter(el => el.getClientRects().length && (el.innerText || el.value || '').trim().toLowerCase() === want);
    return hits.find(el => ![...el.children].some(c => hits.includes(c))) || null;
  };
  window.atFindField = (labelText) => {
    const byPh = [...document.querySelectorAll('input,select,textarea')]
      .find(f => (f.placeholder || '').trim().toLowerCase() === labelText.trim().toLowerCase());
    if (byPh) return byPh;
    const lab = atFind(labelText);
    if (!lab) return null;
    if (lab.control) return lab.control;
    let p = lab.parentElement;
    for (let i = 0; i < 4 && p; i++, p = p.parentElement) {
      const f = p.querySelector('input,select,textarea,.select2,.dropdown-toggle');
      if (f) return f;
    }
    return null;
  };
  window.atMark = (el, n, label) => {
    if (!el) return 'elemen tidak ditemukan';
    const r = el.getBoundingClientRect(), sx = scrollX, sy = scrollY, L = layer();
    const box = document.createElement('div');
    Object.assign(box.style, {position:'absolute', left:(r.left+sx-5)+'px', top:(r.top+sy-5)+'px', width:(r.width+10)+'px', height:(r.height+10)+'px', border:`3px solid ${C}`, borderRadius:'6px', boxSizing:'border-box'});
    L.appendChild(box);
    if (n != null) {
      const b = document.createElement('div');
      b.textContent = n;
      Object.assign(b.style, {position:'absolute', left:(r.left+sx-18)+'px', top:(r.top+sy-18)+'px', width:'28px', height:'28px', borderRadius:'50%', background:C, color:'#fff', font:'700 15px/28px Arial,sans-serif', textAlign:'center', boxShadow:'0 1px 3px rgba(0,0,0,.35)'});
      L.appendChild(b);
    }
    if (label) {
      const t = document.createElement('div');
      t.textContent = label;
      Object.assign(t.style, {position:'absolute', left:(r.right+sx+12)+'px', top:(r.top+sy)+'px', background:C, color:'#fff', font:'600 13px Arial,sans-serif', padding:'4px 8px', borderRadius:'4px', whiteSpace:'nowrap'});
      L.appendChild(t);
      if (t.getBoundingClientRect().right > innerWidth - 8) t.style.left = (r.left + sx - t.offsetWidth - 12) + 'px';
    }
    return 'ok';
  };
  window.atBlur = (el) => { if (!el) return 'elemen tidak ditemukan'; el.style.filter = 'blur(7px)'; return 'ok'; };
  window.atClear = () => document.getElementById('at-annot-layer')?.remove();
  return 'helper anotasi siap';
})();
```

Cara pakai:
1. Atur posisi scroll dan buka dropdown atau modal yang dibutuhkan dulu.
2. Jalankan `atBlur(...)` untuk semua data sensitif.
3. Ambil screenshot **bersih**: sudah disamarkan, tanpa anotasi.
4. Jalankan `atMark(elemen, nomor, 'label')` sesuai tabel anotasi di setiap item.
5. Jangan scroll setelah menandai. Kalau posisi kotak meleset, jalankan `atClear()`, lalu ulangi langkah 4.
6. Ambil screenshot **beranotasi**.

Kalau `atFind` tidak menemukan elemen, pilih elemennya sendiri dengan selector CSS, lalu teruskan ke `atMark`.

## 5. Daftar screenshot

### {SS-AT-01} · {judul gambar} ({wajib/opsional})

- Posisi di artikel: {H2 > H3, langkah ke berapa}
- Fitur: {F-ID dari peta fitur}
- Jalur: {jalur menu dari peta fitur}
- Langkah: {apa yang diklik atau diisi, dengan data contoh yang sama seperti di artikel}
- Kondisi yang harus terlihat: {elemen yang wajib ada di layar}
- Samarkan: {tambahan di luar bagian 2, kalau ada}
- Crop: {area gambar}

| No | Elemen | Label |
|---|---|---|
| 1 | {elemen persis seperti di layar} | {maks 4 kata atau kosong} |

- Laporan: {label atau perilaku yang perlu dikonfirmasi, termasuk Pertanyaan Terbuka dari peta fitur yang bisa dijawab item ini}

{ulangi untuk setiap kode}

## 6. Format hasil

1. Satu file PDF bernama `SS_{P0xxx}_dashboard_accesstrade.pdf`.
   - Satu halaman per kode, isinya versi **beranotasi**.
   - Baris pertama di setiap halaman: kode. Di bawah gambar: satu baris keterangan.
2. PNG terpisah untuk setiap kode, dua versi:
   - `{kode}.png` (beranotasi)
   - `{kode}_bersih.png` (sudah disamarkan, tanpa anotasi)
3. Halaman terakhir PDF berisi tabel laporan:

| Kode | Berhasil? | Bahasa UI saat diambil | Jalur menu sebenarnya | Beda dari MD | Catatan (label, error, data kosong) |
|---|---|---|---|---|---|

4. Kalau PDF tidak bisa dibuat, kirim PNG saja, lalu tulis tabel laporan sebagai teks di chat.
`````

### Aturan mengisi bagian 5 template

| Hal | Aturan |
|---|---|
| Urutan | Sesuai urutan kemunculan di artikel |
| Data contoh | Sama dengan contoh di teks artikel (nama custom link, produk, kategori), supaya gambar dan teks nyambung |
| Tombol yang mengubah data | Hanya boleh kalau aman dan perlu untuk gambar. Contoh: GENERATE di Custom Link boleh, DAFTAR campaign tidak. Untuk modal konfirmasi, extension cukup membuka modal lalu menekan TIDAK atau Batal |
| Anotasi | Sorot hanya elemen yang disebut di langkah artikel. Nomor mengikuti urutan klik di gambar itu |
| Laporan | Masukkan Pertanyaan Terbuka peta fitur yang bisa terjawab oleh item itu |
| Jumlah | Idealnya 3 sampai 6 screenshot per artikel. Lebih dari itu, pecah jadi dua MD |

## 7. Prompt pembuka untuk Chrome extension

Selalu sertakan prompt ini di jawaban, bersama file MD tugas screenshot.

```
Kamu akan menjalankan tugas screenshot dashboard publisher ACCESSTRADE untuk artikel blog.

Langkah:
1. Baca dulu seluruh dokumen instruksi di [LINK GOOGLE DOCS TUGAS SCREENSHOT / atau isi MD yang aku tempel di bawah]. Jangan mulai sebelum selesai membaca.
2. Sebutkan ke aku daftar kode screenshot yang akan diambil dan data apa saja yang akan disamarkan. Lalu tunggu aku membalas "lanjut".
3. Setelah aku balas "lanjut", kerjakan item satu per satu sesuai urutan kode, di tab dashboard ACCESSTRADE yang sudah login.
4. Jalankan helper anotasi di setiap halaman baru. Samarkan data pribadi sebelum setiap screenshot. Kalau tidak bisa disamarkan, jangan ambil screenshot itu dan catat di laporan.
5. Simpan hasil sesuai bagian "Format hasil" di dokumen instruksi. Kalau format utama tidak bisa dibuat, pakai format cadangan yang tertulis di sana.
6. Terakhir, tampilkan tabel laporan di chat.

Aturan yang menang kalau ada konflik: aturan umum di dokumen instruksi. Jangan apply campaign, jangan mengubah pengaturan akun.
```

Untuk eksplorasi peta fitur, pakai prompt pembuka eksplorasi di bagian 10.

## 8. Setelah hasil screenshot kembali

1. **Cek setiap gambar**
   - Data sensitif sudah tersamar.
   - Anotasi tidak meleset dan tidak menutupi elemen.
   - Label di gambar sama dengan label di teks artikel.
2. **Baca tabel laporan.** Kalau jalur atau label berbeda dari MD, sesuaikan teks artikel dan catat perbedaannya untuk update peta fitur.
3. **Sisipkan gambar** ke Google Docs di posisi penandanya:
   - Pakai PNG beranotasi.
   - Ganti teks penanda jadi gambar dan teks alt singkat. Contoh alt: "Tab TERAFILIASI di Daftar Campaign ACCESSTRADE".
   - Kalau gambar tidak bisa disisipkan langsung lewat API, unggah PNG ke Drive dan biarkan penanda berisi link file-nya, lalu laporkan ke Harist.
4. **Tutup item verifikasi** di Catatan Harist yang terjawab oleh screenshot.
5. **Yang gagal diambil:** biarkan penandanya dan tandai "(menunggu)" di Catatan Harist.

## 9. Pencatatan di dokumentasi

| Tempat | Yang dicatat |
|---|---|
| ✅ Review Indah, kolom K Catatan Harist | Satu bullet: `• Screenshot dashboard: SS-AT-01 s.d. {n}, status {belum diambil / sudah diambil / sudah dipasang}` |
| ▶️ Content Pipeline, kolom Kebutuhan Design (T sampai V) | Jumlah screenshot dashboard dan statusnya. Kode ILUS tetap lewat brief design biasa |
| 📚 Referensi & Log | Satu baris setiap MD tugas screenshot dibuat dan setiap gambar dipasang |
| Docs [Dokumentasi] artikel | Link atau nama file MD tugas screenshot di bagian C atau D |

Docs [Review] untuk Indah tidak memuat tabel teknis screenshot. Cukup penanda dan gambarnya.

## 10. Pemeliharaan peta fitur

1. Harist menjalankan prompt eksplorasi (`docs/prompt-eksplorasi-dashboard.md`):
   - Minimal sekali sebulan
   - Setiap kali ada pengumuman fitur dashboard baru
2. Peta versi lama ikut dilampirkan ke extension, supaya setiap fitur diberi status BARU, BERUBAH, HILANG, atau SAMA.
3. Saat peta baru masuk ke chat, Claude melakukan tiga hal:
   - Simpan peta ke folder kit sebagai `docs/peta-fitur-dashboard-YYYY-MM-DD.md`.
   - Ringkas insight: fitur BARU atau BERUBAH, panduan resmi yang tidak cocok, dan temuan bug untuk Dev Tracker.
   - Cocokkan fitur BARU atau BERUBAH dengan artikel di Content Pipeline. Hasilnya daftar artikel yang perlu optimasi (label lama) dan ide artikel baru (fitur tanpa tutorial).
4. Bagian 5 nomor 4 dan nomor 7 di dokumen ini (daftar panduan tidak cocok dan fitur kosong) diperbarui sesuai peta terbaru.

Prompt pembuka eksplorasi:
```
Kamu akan menjalankan tugas eksplorasi dashboard publisher ACCESSTRADE.

Langkah:
1. Baca dulu seluruh dokumen instruksi di [LINK GOOGLE DOCS PROMPT EKSPLORASI / atau isi MD yang aku tempel di bawah]. Jangan mulai sebelum selesai membaca sampai bagian terakhir.
2. Peta versi sebelumnya: [LINK PETA SEBELUMNYA / "Tidak ada, ini eksplorasi pertama"]. Kalau ada, baca juga sebelum mulai.
3. Ringkas ke aku dalam 5 poin: tujuan, aturan keamanan, cakupan, format output, dan nama file output. Lalu tunggu aku membalas "lanjut".
4. Setelah aku balas "lanjut", jalankan eksplorasi di tab dashboard ACCESSTRADE yang sudah login, mengikuti instruksi persis.
5. Tulis hasilnya ke Google Docs baru dengan judul PETA_FITUR_DASHBOARD_ACCESSTRADE_[TANGGAL HARI INI]. Kalau tidak bisa, tampilkan hasilnya sebagai teks MD lengkap di chat.
6. Sebelum selesai, jalankan bagian "Cek sebelum menyimpan" di dokumen instruksi. Laporkan hasil ceknya ke aku.

Aturan yang menang kalau ada konflik: aturan keamanan di dokumen instruksi. Kalau ragu sebuah tombol mengubah data, jangan ditekan. Catat di Pertanyaan Terbuka.
```

## 11. Output standar yang diberikan Claude

Setiap kali workflow ini dipakai, jawaban Claude memuat empat hal berikut secara berurutan:
1. **Tabel klasifikasi gambar**: Kode | Gambar | Fitur (F-ID) | Wajib atau opsional | Dikerjakan oleh.
2. **Tabel penyesuaian teks** (kalau ada): Bagian | Sekarang | Seharusnya, berdasarkan peta fitur.
3. **File MD tugas screenshot** dari template bagian 6, dikirim sebagai file.
4. **Prompt pembuka** dari bagian 7, siap ditempel.

Contoh lengkap yang sudah dipakai: `docs/contoh/contoh-ss-p0234-dashboard-v2.md` (artikel Cara Kirim Link Shopee Affiliate ke WA, 5 screenshot, 2026-11-05).

## Riwayat Versi

| Versi | Tanggal | Perubahan |
|---|---|---|
| v1 | 2026-11-05 | Versi awal: kapan dipakai per perintah, file rujukan, alur 5 tahap, kode penanda (SS-AT, SS-WEB, SS-EXT, ILUS), aturan menulis langkah dashboard, template MD tugas screenshot dengan standar anotasi dan helper JS, prompt pembuka, proses hasil, pencatatan, pemeliharaan peta fitur, output standar. Berdasarkan peta fitur 2026-11-05 |

Aturan nomor versi:
- Setiap update aturan atau alur: naik satu angka (v2 menjadi v3, dan seterusnya).
- Perbaikan salah ketik yang tidak mengubah aturan: tidak perlu versi baru.
- Sebelum update, simpan versi lama ke `docs/arsip/<nama-file>-v<nomor>.md`, lalu perbarui baris Versi di atas dan tabel ini.
- MD tugas screenshot yang dibuat dari template mencatat versi workflow yang dipakai di baris "Sumber jalur menu".
