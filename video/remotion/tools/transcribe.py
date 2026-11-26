#!/usr/bin/env python3
"""Transkrip per kata (faster-whisper) untuk memotong rekaman utuh per adegan.

Pakai: .venv/bin/python tools/transcribe.py <audio.wav> <output.json> [model]
Output: {"words": [{"text", "start", "end"}], "segments": [{"start", "end", "text"}]} (detik)
Model default "small" (diunduh sekali ke ~/.cache/huggingface, ±460 MB).
Bahasa: Indonesia. Ganti lewat env WHISPER_LANG (mis. "en").
"""
import json
import os
import sys
import warnings

warnings.filterwarnings("ignore")
from faster_whisper import WhisperModel  # noqa: E402

audio, out = sys.argv[1], sys.argv[2]
name = sys.argv[3] if len(sys.argv) > 3 else "small"
model = WhisperModel(name, device="cpu", compute_type="int8")
# vad_filter dimatikan: jeda dan take ulang harus tetap ada di transkrip supaya take terakhir bisa dipilih
segs, info = model.transcribe(audio, language=os.environ.get("WHISPER_LANG", "id"), word_timestamps=True,
                              vad_filter=False, beam_size=5, condition_on_previous_text=False)
words, segments = [], []
for s in segs:
    segments.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip()})
    for w in s.words or []:
        t = w.word.strip()
        if t:
            words.append({"text": t, "start": round(w.start, 3), "end": round(w.end, 3)})
    print(f"  [{s.start:7.2f} → {s.end:7.2f}] {s.text.strip()}", flush=True)
with open(out, "w", encoding="utf-8") as f:
    json.dump({"words": words, "segments": segments}, f, ensure_ascii=False, indent=1)
print(f"✓ {len(words)} kata → {out}")
