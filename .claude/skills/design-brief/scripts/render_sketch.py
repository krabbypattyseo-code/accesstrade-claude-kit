#!/usr/bin/env python3
"""
Render sketsa wireframe low-fidelity dari spec JSON ke PNG.

Gaya output: hitam-putih, garis tipis, headline serif, body sans,
placeholder ber-cross untuk foto, line art inline SVG untuk ilustrasi.
Tujuannya bukan bikin desain jadi — tapi memberi designer titik start
soal layout, hierarki, dan konsep visual.

Pakai:
    python3 render_sketch.py spec.json output.png

Struktur spec.json:
{
  "width": 800,
  "height": 1000,
  "headline": "Teks headline",
  "headline_style": "serif-italic",     # serif | serif-italic | sans
  "subline": "Teks pendukung di bawah headline",
  "blocks": [
    {"type": "placeholder", "label": "Foto talent bergandengan tangan", "height": 260},
    {"type": "lineart", "label": "Dua orang berdiri", "height": 300, "svg": "<line .../>"},
    {"type": "divider"},
    {"type": "text", "content": "Paragraf pendukung"},
    {"type": "cta", "content": "Klik link di bio"},
    {"type": "note", "content": "Catatan buat designer, tidak ikut ke desain final"},
    {"type": "spacer", "height": 40}
  ]
}

Semua field opsional kecuali blocks. Blok "lineart" dengan field "svg"
menerima elemen SVG mentah (koordinat relatif terhadap area blok).
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path
from html import escape

PAD = 78
INK = "#111111"
MUTED = "#8a8a8a"
HAIR = "#d8d8d8"
FILL = "#f2f2f2"


def wrap_svg_lineart(svg_body, width, height):
    return (
        f'<svg viewBox="0 0 {width} {height}" width="100%" height="{height}" '
        f'xmlns="http://www.w3.org/2000/svg" '
        f'style="stroke:{INK};stroke-width:1.4;fill:none;'
        f'stroke-linecap:round;stroke-linejoin:round">{svg_body}</svg>'
    )


def render_block(block, content_width):
    t = block.get("type", "text")

    if t == "spacer":
        return f'<div style="height:{block.get("height", 40)}px"></div>'

    if t == "divider":
        return f'<div style="border-top:1px solid {HAIR};margin:26px 0 20px"></div>'

    if t == "text":
        return (
            f'<p style="font-family:Inter,Helvetica,Arial,sans-serif;font-size:17px;'
            f'line-height:1.55;color:{INK};margin:0 0 14px">'
            f'{escape(block.get("content", ""))}</p>'
        )

    if t == "note":
        return (
            f'<p style="font-family:Inter,Helvetica,Arial,sans-serif;font-size:13px;'
            f'line-height:1.5;color:{MUTED};font-style:italic;margin:10px 0 14px">'
            f'{escape(block.get("content", ""))}</p>'
        )

    if t == "cta":
        return (
            f'<div style="display:inline-block;background:{INK};color:#fff;'
            f'padding:15px 26px;font-family:Inter,Helvetica,Arial,sans-serif;'
            f'font-size:19px;font-weight:600;margin:6px 0 14px">'
            f'&#8594;&nbsp;{escape(block.get("content", ""))}</div>'
        )

    if t == "placeholder":
        h = block.get("height", 240)
        label = escape(block.get("label", "Area gambar"))
        return (
            f'<div style="position:relative;height:{h}px;background:{FILL};'
            f'border:1px solid {HAIR};margin:8px 0 18px">'
            f'<svg width="100%" height="{h}" viewBox="0 0 {content_width} {h}" '
            f'preserveAspectRatio="none" style="position:absolute;top:0;left:0">'
            f'<line x1="0" y1="0" x2="{content_width}" y2="{h}" stroke="{HAIR}"/>'
            f'<line x1="{content_width}" y1="0" x2="0" y2="{h}" stroke="{HAIR}"/></svg>'
            f'<div style="position:absolute;top:50%;left:0;right:0;'
            f'transform:translateY(-50%);text-align:center;'
            f'font-family:Inter,Helvetica,Arial,sans-serif;font-size:14px;'
            f'color:{MUTED};padding:0 20px">{label}</div></div>'
        )

    if t == "lineart":
        h = block.get("height", 280)
        svg_body = block.get("svg")
        label = escape(block.get("label", ""))
        if svg_body:
            art = wrap_svg_lineart(svg_body, content_width, h)
            caption = (
                f'<div style="text-align:center;font-family:Inter,Helvetica,Arial,'
                f'sans-serif;font-size:13px;color:{MUTED};margin-top:6px">{label}</div>'
                if label else ""
            )
            return f'<div style="margin:10px 0 16px">{art}{caption}</div>'
        return (
            f'<div style="height:{h}px;border:1px dashed {HAIR};margin:10px 0 16px;'
            f'display:flex;align-items:center;justify-content:center;'
            f'font-family:Inter,Helvetica,Arial,sans-serif;font-size:14px;'
            f'color:{MUTED};text-align:center;padding:0 24px">{label}</div>'
        )

    return ""


def build_html(spec):
    width = spec.get("width", 800)
    height = spec.get("height", 1000)
    content_width = width - (PAD * 2)

    style_map = {
        "serif-italic": "font-family:Georgia,'Times New Roman',serif;font-style:italic",
        "serif": "font-family:Georgia,'Times New Roman',serif",
        "sans": "font-family:Inter,Helvetica,Arial,sans-serif",
    }
    head_style = style_map.get(spec.get("headline_style", "serif"), style_map["serif"])
    head_size = spec.get("headline_size", 36)

    parts = []
    if spec.get("headline"):
        parts.append(
            f'<h1 style="{head_style};font-size:{head_size}px;line-height:1.28;color:{INK};'
            f'font-weight:400;margin:0 0 16px">{escape(spec["headline"])}</h1>'
        )
    if spec.get("subline"):
        parts.append(
            f'<p style="font-family:Inter,Helvetica,Arial,sans-serif;font-size:17px;'
            f'line-height:1.5;color:{MUTED};margin:0 0 34px">'
            f'{escape(spec["subline"])}</p>'
        )
    for block in spec.get("blocks", []):
        parts.append(render_block(block, content_width))

    return (
        f'<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
        f'<body style="margin:0;background:#fff;width:{width}px;'
        f'min-height:{height}px;box-sizing:border-box;padding:{PAD}px">'
        f'{"".join(parts)}</body></html>'
    )


def main():
    if len(sys.argv) < 3:
        print("Pakai: python3 render_sketch.py spec.json output.png")
        sys.exit(1)

    spec = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = sys.argv[2]
    html = build_html(spec)

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        f.write(html)
        tmp = f.name

    cmd = [
        "wkhtmltoimage", "--enable-local-file-access", "--quality", "94",
        "--width", str(spec.get("width", 800)), "--disable-smart-width",
        tmp, out,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Render gagal:", res.stderr[-500:])
        sys.exit(1)

    # wkhtmltoimage menghasilkan PNG 24-bit yang berat (bisa >3MB) padahal
    # sketsa cuma hitam-putih. Turunkan ke palette supaya enak diselipkan ke docx.
    try:
        from PIL import Image
        img = Image.open(out).convert("L").convert(
            "P", palette=Image.ADAPTIVE, colors=16)
        img.save(out, optimize=True)
    except Exception:
        pass

    print(f"OK -> {out}")


if __name__ == "__main__":
    main()
