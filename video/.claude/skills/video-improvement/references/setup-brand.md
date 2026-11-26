# Setup brand

Dipakai di chat pertama setelah kit diterima, atau saat brand berganti. Hasil akhirnya: `brand/brand-guidelines.md` terisi, `brand/tokens.json` sesuai brand, logo terpasang, dan dua video contoh dirender dengan brand baru.

## 1. Kumpulkan bahan

Minta ke user dalam satu pesan:
- Brand guideline yang sudah ada (PDF, gambar, link, Figma, atau teks). Kalau belum ada: logo + 2-4 warna + nama font + 3 contoh postingan yang mewakili.
- File logo: PNG transparan atau SVG. Versi untuk latar gelap kalau ada.
- Handle media sosial, channel YouTube, website.
- Cara brand menyapa penonton (kamu / Anda / kalian), nada bicara, kata yang dihindari, klaim yang wajib dikonfirmasi.
- CTA utama untuk Reels dan YouTube.

Baca semua bahan yang diberikan (PDF dengan Read per halaman, gambar dibuka langsung).

## 2. Isi brand-guidelines.md

Ganti setiap `[ISI]` di `brand/brand-guidelines.md`. Yang tidak ada di bahan: tanyakan, jangan mengarang. Bagian yang memang tidak relevan boleh dihapus.

## 3. Isi tokens.json

Penjelasan tiap field: `brand/README.md`.

**Warna.** Petakan warna brand ke peran:
- `background`: warna gelap untuk latar utama (kalau brand tidak punya warna gelap, pakai versi sangat gelap dari warna primer).
- `backgroundLight`: putih hangat atau warna terang brand.
- `primary`: warna utama brand (latar bab dan outro).
- `accent`: warna yang paling "menyala", untuk sorotan.
- `accentText`: teks di atas accent, biasanya sama dengan `background`.

Cek kontras (minimal 4,5:1; teks besar minimal 3:1) untuk pasangan teks/latar yang dipakai: `text` di `background`, `textOnBrand` dan `accentOnBrand` di `primary`, `textOnLight` di `backgroundLight`, `accentText` di `accent`, `accent` di `background`. Jalankan dari folder kit:

```bash
node -e 'const L=h=>{const c=h.replace("#","").match(/../g).map(x=>{x=parseInt(x,16)/255;return x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};const r=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+0.05)/(y+0.05)).toFixed(2)};const t=JSON.parse(require("fs").readFileSync("brand/tokens.json","utf8")).color;for(const[a,b]of[["text","background"],["textOnBrand","primary"],["accentOnBrand","primary"],["textOnLight","backgroundLight"],["accentText","accent"],["accent","background"]])console.log(a,"di",b,r(t[a],t[b]))'
```

Pasangan di bawah 4,5: sarankan penyesuaian ke user (mis. accent sedikit lebih terang), jangan diam-diam mengubah warna brand.

**Font.** Harus ada di Google Fonts (nama persis). `npm run sync` memberi peringatan kalau tidak ketemu. Font brand bukan Google Fonts: pilih yang paling mirip di Google Fonts dan beri tahu user. (Memasang font lokal = pekerjaan tambahan: lihat `remotion-markup/local-fonts.md` di skill resmi.)

**Logo.** Salin ke `brand/logo.png` (atau `.svg`), isi `logo.file: "logo.png"`. Logo harus terbaca di latar `primary` (latar outro). Kalau tidak, minta versi putih/terang.

**Aturan kata.** Isi `rules.bannedWords` dari bagian 3 brand guideline. Hapus dua contoh bawaan kalau tidak berlaku.

## 4. Render dan tunjukkan

```bash
cd remotion && npm run sync
```

```bash
npm run demo-vo -- ../scripts/reels/00-contoh-reels.json && npm run render -- ../scripts/reels/00-contoh-reels.json --draft
```

```bash
npm run demo-vo -- ../scripts/youtube/00-contoh-youtube.json && npm run render -- ../scripts/youtube/00-contoh-youtube.json --draft
```

```bash
npm run render -- ../scripts/reels/00-contoh-reels.json --cover-only && npm run render -- ../scripts/youtube/00-contoh-youtube.json --cover-only
```

Ambil 1 frame dari tengah setiap adegan (waktu ada di `.render-props/`), gabungkan jadi satu lembar kalau perlu, lihat sendiri dulu: kontras, font, logo, sorotan, caption. Perbaiki yang jelas salah, lalu tunjukkan ke user beserta cover dan thumbnail. Ulangi sampai user setuju.

## 5. Opsional: sesuaikan contoh

Tawarkan mengganti isi `00-contoh-*` dengan topik brand (supaya demo relevan untuk orang baru). Tetap `"demo": true`.

## 6. Catat

- `CHANGELOG.md`: "Brand dipasang: <nama brand>" (versi naik angka terakhir).
- `history/video-improvement.md`: ringkasan + keputusan yang diambil (mis. font pengganti).
- `kotak-masuk/untuk-script.md`: "Brand guideline sudah terisi, siap menulis script."
