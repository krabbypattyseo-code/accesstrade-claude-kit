# Skema script video

Satu file JSON per video. Reels di `scripts/reels/NN-slug.json`, YouTube di `scripts/youtube/NN-slug.json`.
Contoh lengkap: `reels/00-contoh-reels.json` dan `youtube/00-contoh-youtube.json`.
Cek script tanpa render: `cd remotion && npm run cek -- ../scripts/reels/01-slug.json`.

## Bagian atas

```json
{
  "format": "reels",
  "number": "01",
  "slug": "tiga-salah-kaprah",
  "title": "Tiga salah kaprah soal tidur siang",
  "demo": false,
  "captions": true,
  "cover": {"text": "Tidur siang bikin *malas*?", "kicker": "Mitos"},
  "chapterIntro": "Pembuka",
  "media": {"music": {"src": "musik/ceria-pelan.m4a", "volume": 0.4}},
  "scenes": []
}
```

| Field | Wajib | Keterangan |
|---|---|---|
| `format` | ya | `reels` atau `youtube` (harus sama dengan foldernya) |
| `number` | ya | nomor video, dipakai di nama file output dan folder media |
| `slug` | ya | nama pendek huruf kecil-tanda hubung |
| `title` | ya | judul kerja; juga teks cover kalau `cover.text` kosong |
| `demo` | | `true` = contoh, tidak untuk tayang |
| `captions` | | `false` = tanpa caption sama sekali (default menyala) |
| `cover` | | `text` (pakai `*sorotan*`), `kicker`, `image` (default: foto pertama di script) |
| `chapterIntro` | | YouTube: nama chapter pertama (default "Pembuka") |
| `media.music` | | musik latar dari `remotion/public/musik/` (lewat `npm run musik`) |
| `voCut` | | koreksi potongan rekaman manual, diisi sesi Eksekusi |

## Adegan

```json
{
  "id": 3,
  "type": "daftar",
  "dur": 6,
  "onScreen": "Cara meredam *gangguan*",
  "vo": "Ada tiga cara. Mode fokus di HP. Tutup tab. Dan pakai headphone.",
  "visual": "catatan untuk manusia, tidak dibaca mesin",
  "transition": "slide",
  "props": {}
}
```

| Field | Keterangan |
|---|---|
| `id` | nomor adegan, unik, urut (1, 2, 3, ...) |
| `type` | salah satu tipe di bawah |
| `dur` | perkiraan detik. Setelah ada rekaman, durasi otomatis = panjang suara + jeda. |
| `onScreen` | teks besar di layar. `*kata*` = disorot warna accent. |
| `vo` | teks yang **diucapkan**. Kalimat diakhiri titik, tanda tanya, atau tanda seru (dipakai untuk mencocokkan rekaman). |
| `transition` | transisi masuk: `slide`, `fade`, `wipe`, `cut` (default dari brand) |
| `props.kicker` | label kecil di atas judul (semua tipe) |
| `props.sub` | teks kecil di bawah judul (semua tipe) |
| `props.bg` | latar: `dark`, `light`, `brand` (default per tipe) |
| `props.caption` | `on` / `off` untuk adegan ini. Default mati di outro dan di adegan yang `onScreen`-nya sama persis dengan `vo`. |
| `minDur` / `extra` | durasi minimum / detik tambahan setelah suara selesai |
| `sfx` | efek suara: `[{"src": "sfx/whoosh.wav", "at": 0.2, "volume": 0.5}]`, `at` = detik dari awal adegan. Volume 0,4-0,7 (`npm run sfx`) |

## Tipe adegan

| Tipe | Untuk | Props utama | Latar default |
|---|---|---|---|
| `hook` | pembuka, 1-3 detik pertama Reels / 15-30 detik pertama YouTube | `onScreen` (maks 7 kata), `kicker`, `sub` | dark |
| `bab` | pembatas bab YouTube, otomatis jadi chapter | `title`, `number` (opsional), `kicker` | brand |
| `poin` | satu pernyataan penting | `onScreen`, `kicker`, `sub` | dark |
| `daftar` | tips, langkah, poin | `onScreen` (judul), `items`, `numbered` | light |
| `angka` | statistik / angka besar | `value`, `label`, `source` (wajib untuk data asli) | dark |
| `kutipan` | kutipan buku, ahli, pelanggan | `quote`, `by`, `role` | dark |
| `foto` | foto produk, suasana, bukti | `image` atau `images`, `onScreen`, `focus` | dark |
| `banding` | mitos vs fakta, sebelum vs sesudah, A vs B | `left`, `right`, `verdict`, `revealOnWord` | light |
| `outro` | ajakan penutup; di YouTube jadi area end screen | `onScreen` / `cta`, `handle`, `website`, `sub` | brand |
| `klip` | b-roll, rekaman layar, footage (cerita) | `src`, `start`, `audio`, `onScreen`, `kicker`, `text` | footage layar penuh |

### daftar

```json
"props": {
  "items": [
    {"text": "Aktifkan *mode fokus*", "icon": "alert", "onWord": "mode"},
    {"text": "Tutup tab", "icon": "x", "onWord": "tutup"},
    "Pakai headphone"
  ],
  "numbered": false
}
```

- `onWord`: poin muncul tepat saat kata itu diucapkan (kata harus ada di `vo`). Tanpa `onWord`: dibagi rata, atau `at` (detik dari awal adegan).
- Ikon: `check x star heart bulb clock chart chat book alert arrow target money user`. Tanpa ikon: bernomor.
- Reels idealnya 3-4 poin, YouTube sampai 6.

### angka

```json
"props": {"value": "73%", "label": "pekerja merasa *kurang fokus*", "source": "Nama survei, tahun"}
```

`value` boleh `"1.250.000"`, `"Rp49.000"`, `"2,5 jam"`, `"73%"` (menghitung naik dari 0). Teks non-angka langsung tampil.

### foto

```json
"props": {
  "images": [
    {"src": "video/reels-01/foto/sebelum.jpg", "text": "Sebelum"},
    {"src": "video/reels-01/foto/sesudah.jpg", "text": "Sesudah", "onWord": "sekarang"}
  ],
  "focus": "50% 30%"
}
```

Path foto selalu `video/<format>-NN/foto/<nama>.jpg`, hasil `npm run foto`. `focus` = titik fokus crop (`"50% 30%"` = agak atas).

### banding

```json
"props": {
  "left":  {"label": "Mitos", "text": "Multitasking bikin *lebih cepat*"},
  "right": {"label": "Fakta", "text": "Pindah tugas bikin *lebih lambat*", "image": "video/youtube-02/foto/x.jpg"},
  "verdict": "right",
  "revealOnWord": "faktanya"
}
```

`verdict`: sisi yang benar dapat centang, sisi lain silang (`none` = tanpa tanda). Sisi kanan muncul saat `revealOnWord` diucapkan (default ±40% durasi adegan).

### klip

```json
"props": {"src": "video/reels-01/klip/rekaman-layar.mp4", "start": 2.5, "audio": false, "kicker": "Langkah 1", "text": "Menu Report"}
```

- `src`: hasil `npm run klip` (metadata dibuang, HEVC diubah ke H.264). `start`: detik di file klip yang diputar di awal adegan.
- `audio`: `true` = pakai suara klip (talking head); adegan itu tidak diberi `vo`. Default tanpa suara klip.
- Klip berurutan: `"transition": "cut"` (playbook-footage.md aturan 5).
- Aturan lengkap: `alur/playbook-footage.md`.

### outro

Reels: logo + ajakan + handle. YouTube: teks di kiri, sisi kanan dikosongkan untuk elemen end screen (dipasang di YouTube Studio). Outro YouTube minimal 12 detik (aturan end screen YouTube: 5-20 detik terakhir).

## Aturan per format

| | Reels | YouTube |
|---|---|---|
| Kanvas | 1080×1920 | 1920×1080 |
| Durasi | 20-60 dtk (peringatan di atas 90) | bebas; setiap chapter minimal 10 dtk |
| Adegan | 5-9 | 15-60 |
| Struktur | hook → isi → outro | hook → bab → isi → bab → isi → ... → outro |
| Chapter | - | minimal 3 (pembuka + 2 bab) supaya muncul di YouTube |
| Caption | karaoke 4 kata | subtitle 8 kata + file `.srt` |
| Output | `NN-slug.mp4`, `-cover.jpg` | `NN-slug.mp4`, `-thumbnail.jpg`, `.srt`, `-chapter.txt` |

## Penanda khusus

- `*kata*` di `onScreen`, `items`, `label`, `quote`, `cover.text`: disorot.
- `[KONFIRMASI]` di teks layar mana pun: render tetap jalan, tapi ada cap merah dan status "belum boleh tayang".
