# Tugas Screenshot Tutorial Dashboard ACCESSTRADE: P0262

Artikel: Cara Jadi Affiliate Shopee Malaysia dari Indonesia
URL artikel: artikel baru, belum tayang
Sumber jalur menu: Peta Fitur Dashboard ACCESSTRADE 2026-11-05
Dashboard: https://db.accesstrade.co.id/
Jumlah screenshot: 4 (SS-AT-01 sampai SS-AT-03 wajib, SS-AT-04 opsional)

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

### SS-AT-01 · Hasil pencarian "Malaysia" di Daftar Campaign (wajib)

- Posisi di artikel: H2 "Daftar dan Ambil Link Campaign Shopee Malaysia", langkah 1 sampai 3
- Fitur: F-CAMPAIGN-LIST
- Jalur: Direktori Campaign > Daftar Campaign
- Langkah: buka Direktori Campaign > Daftar Campaign. Ketik "Malaysia" di kolom Search by keyword, lalu tekan CARI. Pastikan tab TERSEDIA aktif.
- Kondisi yang harus terlihat: kolom pencarian berisi "Malaysia", tombol CARI, tab TERSEDIA, kartu [New] Shopee Malaysia dengan tombol DETAIL dan DAFTAR
- Samarkan: badge jumlah di tab TERSEDIA dan TERAFILIASI
- Crop: area konten utama dari kolom pencarian sampai baris kartu yang memuat [New] Shopee Malaysia

| No | Elemen | Label |
|---|---|---|
| 1 | Kolom Search by keyword | Ketik Malaysia |
| 2 | Tombol CARI | |
| 3 | Kartu [New] Shopee Malaysia | Campaign Malaysia |
| 4 | Tombol DETAIL di kartu itu | Baca ketentuan |

- Laporan: apakah kartu [New] Shopee Malaysia masih ada dan berstatus tersedia, serta apakah [New] Shopee Malaysia KOL juga muncul

### SS-AT-02 · Detail campaign: blok CAMPAIGN dan KOMISI (wajib)

- Posisi di artikel: H3 "Jalur Lewat Accesstrade" dan langkah 3
- Fitur: F-CAMPAIGN-DETAIL (Direktori Campaign > Daftar Campaign > DETAIL)
- Jalur: Direktori Campaign > Daftar Campaign > DETAIL (/campaign/7915)
- Langkah: tekan DETAIL di kartu [New] Shopee Malaysia. Pastikan bahasa Indonesia aktif.
- Kondisi yang harus terlihat: nama campaign, blok CAMPAIGN (Status RUNNING, Tipe CPS, Negara Malaysia) dan blok KOMISI
- Samarkan: tidak ada tambahan
- Crop: bagian atas halaman detail sampai akhir daftar Hadiah di blok KOMISI

| No | Elemen | Label |
|---|---|---|
| 1 | Status RUNNING | Status campaign |
| 2 | Tipe CPS | |
| 3 | Negara Malaysia | |
| 4 | Blok KOMISI | Komisi per kategori |

- Laporan: apakah label blok tampil dalam bahasa Indonesia (KOMISI) atau tetap bahasa Inggris (COMMISSION). Saat dicek 19 Nov 2026 tampil COMMISSION

### SS-AT-03 · Detail campaign: blok KONVERSI dan TRAFIK (wajib)

- Posisi di artikel: H3 "Jalur Lewat Accesstrade", daftar ketentuan penting
- Fitur: F-CAMPAIGN-DETAIL
- Jalur: Direktori Campaign > Daftar Campaign > DETAIL (/campaign/7915)
- Langkah: scroll ke blok KONVERSI dan TRAFIK di halaman yang sama
- Kondisi yang harus terlihat: Aksi yang Dibutuhkan, Jendela Konversi (7 hari), Pembatasan Trafik dengan centang hijau dan silang merah
- Samarkan: tidak ada tambahan
- Crop: blok KONVERSI dan TRAFIK

| No | Elemen | Label |
|---|---|---|
| 1 | Jendela Konversi | 7 hari |
| 2 | Silang merah Search Engine Marketing | Dilarang |
| 3 | Centang hijau Social Media Platform | Diizinkan |

- Laporan: nilai Jendela Konversi dan label trafik persis seperti di layar

### SS-AT-04 · Tab CUSTOM LINK di detail campaign (opsional)

- Posisi di artikel: H2 "Daftar dan Ambil Link Campaign Shopee Malaysia", langkah 5
- Fitur: F-CUSTOM-LINK (versi tab di Detail Campaign)
- Jalur: Direktori Campaign > Daftar Campaign > TERAFILIASI > DETAIL > tab CUSTOM LINK
- Langkah: hanya bisa diambil kalau akun sudah terafiliasi dengan [New] Shopee Malaysia. Kalau belum, lewati item ini dan catat di laporan. Jangan tekan DAFTAR untuk mengambil gambar ini.
- Kondisi yang harus terlihat: "Create Custom Link", Accepted URL Format, peringatan "Multiple links are Not Allowed", kolom Custom URL, tombol GENERATE
- Samarkan: panel Result
- Crop: area Create Custom Link

| No | Elemen | Label |
|---|---|---|
| 1 | Tab CUSTOM LINK | |
| 2 | Accepted URL Format | Domain yang diterima |
| 3 | Tombol GENERATE | |

- Laporan: apakah domain shopee.com.my tercantum di Accepted URL Format

## 6. Format hasil

1. Satu file PDF bernama `SS_P0262_dashboard_accesstrade.pdf`.
   - Satu halaman per kode, isinya versi **beranotasi**.
   - Baris pertama di setiap halaman: kode. Di bawah gambar: satu baris keterangan.
2. PNG terpisah untuk setiap kode, dua versi:
   - `{kode}.png` (beranotasi)
   - `{kode}_bersih.png` (sudah disamarkan, tanpa anotasi)
3. Halaman terakhir PDF berisi tabel laporan:

| Kode | Berhasil? | Bahasa UI saat diambil | Jalur menu sebenarnya | Beda dari MD | Catatan (label, error, data kosong) |
|---|---|---|---|---|---|

4. Kalau PDF tidak bisa dibuat, kirim PNG saja, lalu tulis tabel laporan sebagai teks di chat.
