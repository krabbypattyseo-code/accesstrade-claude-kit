# Tugas Screenshot Tutorial Dashboard ACCESSTRADE: P0239

Artikel: Cara Salin Link Shopee untuk Produk, Akun, dan Affiliate
URL artikel: https://accesstrade.co.id/blogs/how-to/cara-mendapatkan-link-shopee
Sumber jalur menu: Peta Fitur Dashboard ACCESSTRADE 2026-11-05 (workflow screenshot v1)
Dashboard: https://db.accesstrade.co.id/
Jumlah screenshot: 3 (SS-AT-01, SS-AT-02, SS-AT-03 wajib, tidak ada yang opsional)

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

Catatan: kalau set screenshot P0234 (SS-AT-01 sampai SS-AT-03, Custom Link) sudah diambil dan masih sesuai layar sekarang, item di bawah boleh memakai ulang file itu. Catat di laporan kode P0234 mana yang dipakai.

### SS-AT-01 · Campaign Shopee di tab TERAFILIASI (wajib)

- Posisi di artikel: H2 Cara Membuat Link Shopee Affiliate agar Dapat Komisi > H3 Lewat Custom Link ACCESSTRADE, paragraf pembuka
- Fitur: F-CAMPAIGN-LIST
- Jalur: sidebar Direktori Campaign > Daftar Campaign > tab TERAFILIASI
- Langkah: buka Daftar Campaign, klik tab TERAFILIASI, ketik "Shopee" di kolom Search by keyword, lalu klik CARI
- Kondisi yang harus terlihat: menu Daftar Campaign di sidebar, deretan tab TERSEDIA / TERAFILIASI / PAUSE, dan kartu campaign Shopee dengan tombol AMBIL LINK
- Samarkan: badge jumlah di setiap tab
- Crop: sidebar kiri sampai kartu Shopee pertama

| No | Elemen | Label |
|---|---|---|
| 1 | Menu Daftar Campaign di sidebar | |
| 2 | Tab TERAFILIASI | Campaign disetujui |
| 3 | Kartu campaign Shopee | |

- Laporan: nama kartu Shopee yang tampil dan teks deskripsi di bawah tab TERAFILIASI

### SS-AT-02 · Modal Generate Custom link terisi (wajib)

- Posisi di artikel: H3 Lewat Custom Link ACCESSTRADE, langkah 2 sampai 5
- Fitur: F-CUSTOM-LINK
- Jalur: tombol CUSTOM LINK di header
- Langkah:
  1. Buka tab baru, cari "botol minum" di shopee.co.id. Salin link produk teratas dari toko Shopee Mall, lalu kembali ke dashboard.
  2. Klik tombol CUSTOM LINK di header.
  3. Di Your Affiliated Campaign, pilih campaign Shopee yang sama dengan SS-AT-01.
  4. Isi Custom Name `link_produk`.
  5. Tempel link produk di Custom URL. **Jangan klik GENERATE dulu.**
- Kondisi yang harus terlihat: modal berjudul "Generate Custom link", ketiga kolom terisi, tombol RESET dan GENERATE
- Crop: modal utuh, ikutkan tombol CUSTOM LINK di header kalau masih terlihat

| No | Elemen | Label |
|---|---|---|
| 1 | Tombol CUSTOM LINK di header (lewati kalau tertutup modal) | |
| 2 | Kolom Your Affiliated Campaign | Pilih Shopee |
| 3 | Kolom Custom Name | Nama untuk lacak |
| 4 | Kolom Custom URL | Link produk |
| 5 | Tombol GENERATE | |

- Laporan: label persis setiap kolom dan tombol, serta teks penjelasan di atas form

### SS-AT-03 · Hasil GENERATE (wajib)

- Posisi di artikel: H3 Lewat Custom Link ACCESSTRADE, langkah 6
- Fitur: F-CUSTOM-LINK (menjawab Pertanyaan Terbuka no. 6 di peta fitur)
- Langkah: dari kondisi SS-AT-02, klik GENERATE. Tunggu hasil muncul. Jangan klik COPY.
- Kondisi yang harus terlihat: link hasil generate, tombol COPY, dan opsi Add Sub ID / Tracking (kalau ada)
- Samarkan: bagian link setelah domain
- Crop: modal utuh

| No | Elemen | Label |
|---|---|---|
| 1 | Kotak link hasil generate | Link affiliate kamu |
| 2 | Tombol COPY | |
| 3 | Add Sub ID / Tracking (kalau ada) | Opsional |

- Laporan: semua label yang muncul setelah GENERATE (termasuk ADD NEW), domain link hasil generate, dan pesan error kalau URL ditolak

### Catatan untuk item non-dashboard

SS-EXT-01 (menu bagikan di halaman produk aplikasi Shopee) dan SS-EXT-02 (halaman profil atau toko dengan ikon bagikan) diambil manual oleh Harist dari HP, sekaligus mengecek label "Salin Link", keterangan komisi di menu bagikan, dan lokasi link akun di tab Saya. ILUS-01 lewat /generatesubimages.

## 6. Format hasil

1. Satu file PDF bernama `SS_P0239_dashboard_accesstrade.pdf`.
   - Satu halaman per kode, isinya versi **beranotasi**.
   - Baris pertama di setiap halaman: kode. Di bawah gambar: satu baris keterangan.
2. PNG terpisah untuk setiap kode, dua versi:
   - `{kode}.png` (beranotasi)
   - `{kode}_bersih.png` (sudah disamarkan, tanpa anotasi)
3. Halaman terakhir PDF berisi tabel laporan:

| Kode | Berhasil? | Bahasa UI saat diambil | Jalur menu sebenarnya | Beda dari MD | Catatan (label, error, data kosong) |
|---|---|---|---|---|---|

4. Kalau PDF tidak bisa dibuat, kirim PNG saja, lalu tulis tabel laporan sebagai teks di chat.
