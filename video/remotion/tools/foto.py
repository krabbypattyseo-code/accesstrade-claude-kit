#!/usr/bin/env python3
"""Salin foto ke folder media video dengan nama netral dan TANPA metadata. Dipanggil lewat tools/foto.mjs.

Pakai: python tools/foto.py <folder-tujuan> <foto-sumber> <nama> [--blur x,y,w,h ...] [--max 1920]

- Rotasi EXIF diterapkan, lalu SEMUA metadata dibuang (lokasi GPS, kamera, tanggal).
- Sisi terpanjang maksimal 1920 px (--max untuk mengubah), JPEG kualitas 90.
- --blur x,y,w,h (boleh berkali-kali): area dipikselkan + diburamkan, untuk data pribadi
  (nama, alamat, nomor telepon, plat nomor, wajah yang belum izin). Koordinat dalam piksel foto asli setelah rotasi.
- Asal foto dicatat di <folder-video>/sumber-foto.txt (catatan internal, tidak pernah tampil di video).
"""
import os
import sys
from datetime import date

from PIL import Image, ImageFilter, ImageOps

try:  # foto HEIC dari iPhone (Windows); di macOS sudah diubah ke JPEG lewat sips
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass


def main():
    args = sys.argv[1:]
    blurs = []
    while "--blur" in args:
        i = args.index("--blur")
        blurs.append(tuple(int(v) for v in args[i + 1].split(",")))
        del args[i:i + 2]
    max_side = 1920
    if "--max" in args:
        i = args.index("--max")
        max_side = int(args[i + 1])
        del args[i:i + 2]
    if len(args) < 3:
        print(__doc__)
        sys.exit(1)
    out_dir, src, name = args[0], args[1], args[2]
    name = "".join(c if c.isalnum() or c in "-_" else "-" for c in name.lower()).strip("-")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, f"{name}.jpg")

    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    for (x, y, w, h) in blurs:
        box = (max(0, x), max(0, y), min(im.width, x + w), min(im.height, y + h))
        region = im.crop(box)
        small = region.resize((max(1, region.width // 14), max(1, region.height // 14)), Image.BILINEAR)
        region = small.resize(region.size, Image.NEAREST).filter(ImageFilter.GaussianBlur(6))
        im.paste(region, box)
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    clean = Image.new("RGB", im.size)
    clean.paste(im)
    clean.save(out, "JPEG", quality=90, optimize=True)

    video_dir = os.path.dirname(out_dir.rstrip("/"))
    with open(os.path.join(video_dir, "sumber-foto.txt"), "a", encoding="utf-8") as f:
        note = f"\tblur {';'.join(','.join(map(str, b)) for b in blurs)}" if blurs else ""
        f.write(f"{date.today().isoformat()}\tfoto/{name}.jpg\t{os.environ.get('FOTO_ASAL', os.path.basename(src))}{note}\n")
    print(f"✓ {out}  ({clean.size[0]}x{clean.size[1]}, tanpa metadata{f', {len(blurs)} area diburamkan' if blurs else ''})")


if __name__ == "__main__":
    main()
