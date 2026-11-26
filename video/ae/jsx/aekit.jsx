/*
 * aekit.jsx - pustaka ExtendScript untuk jalur After Effects kit video (Reels 1080x1920, YouTube 1920x1080).
 *
 * Dipanggil dari build.jsx buatan ae/build.mjs:
 *     #include "<path>/ae/jsx/aekit.jsx"
 *     var DATA = { ... };
 *     AEKIT.build(DATA);
 *
 * Hasilnya proyek .aep yang bisa diedit: comp utama, satu precomp per adegan, caption, suara, marker.
 * Tampilan meniru jalur Remotion (video/remotion/src/scenes/*.tsx), angka ukuran dari src/theme.ts.
 *
 * Aturan file ini:
 * - ES3 saja (ExtendScript): tanpa let/const, arrow function, template literal, Array map/forEach/filter/indexOf,
 *   Object.keys, JSON, String.trim. Helper kecil ada di bagian "util".
 * - API yang bisa berbeda antar versi AE dicek dulu (typeof === 'function' / try-catch) dan punya cadangan.
 *   Semua asumsi dicatat di README.md bagian "Belum dites di After Effects asli".
 * - File ini hanya berisi karakter ASCII (karakter lain ditulis \uXXXX), aman dibaca ExtendScript di Windows.
 */

var AEKIT = (function () {
  var K = {version: '1.0.0'};
  var X = null; // konteks satu kali build
  var C = null; // warna brand (array 0..1)
  var BIG = 1e12;

  // =================================================================== util ES3

  function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
  function isNum(v) { return typeof v === 'number' && !isNaN(v) && isFinite(v); }
  function has(o, k) { return o !== null && o !== undefined && Object.prototype.hasOwnProperty.call(o, k); }
  function num(v, d) { return isNum(v) ? v : d; }
  function trim(s) { return String(s).replace(/^\s+|\s+$/g, ''); }
  function str(v, d) {
    if (v === null || v === undefined) return d;
    var s = String(v);
    return trim(s) === '' ? d : s;
  }
  function obj(v) { return (v && typeof v === 'object') ? v : {}; }
  function each(a, fn) { if (!a) return; for (var i = 0; i < a.length; i++) fn(a[i], i); }
  function compact(a) { var o = []; each(a, function (v) { if (v) o.push(v); }); return o; }
  function inList(a, v) { for (var i = 0; i < a.length; i++) if (a[i] === v) return true; return false; }
  function pad2(n) { var s = String(n); return s.length < 2 ? '0' + s : s; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function r3(v) { return Math.round(v * 1000) / 1000; }
  function hasFn(o, name) {
    try { return o !== null && o !== undefined && typeof o[name] === 'function'; } catch (e) { return false; }
  }
  function errText(e) {
    var s = (e && e.message) ? e.message : String(e);
    if (e && e.line) s += ' (baris ' + e.line + ')';
    return s;
  }
  function countWords(s) {
    var n = 0;
    each(String(s).split(/\s+/), function (w) { if (w !== '') n++; });
    return n;
  }
  function lettersOnly(s) { return String(s).replace(/[^A-Za-z0-9\u00C0-\u024F]/g, ''); }
  function timecode(sec) {
    var s = Math.floor(sec), m = Math.floor(s / 60), r = s % 60;
    return m + ':' + pad2(r);
  }
  function isoNow() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' +
      pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  function warn(msg) {
    if (X.warnSeen['w:' + msg]) return;
    X.warnSeen['w:' + msg] = true;
    X.warnings.push(msg);
    if (X.cur) X.cur.warnings.push(msg);
  }
  function warnOnce(key, msg) {
    if (X.warnSeen['k:' + key]) return;
    X.warnSeen['k:' + key] = true;
    warn(msg);
  }

  // JSON sendiri (ExtendScript tidak punya JSON)
  function jsonStr(s) {
    s = String(s);
    var out = '"';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), code = s.charCodeAt(i);
      if (c === '"') out += '\\"';
      else if (c === '\\') out += '\\\\';
      else if (c === '\n') out += '\\n';
      else if (c === '\r') out += '\\r';
      else if (c === '\t') out += '\\t';
      else if (code < 32 || code > 126) {
        var h = code.toString(16);
        while (h.length < 4) h = '0' + h;
        out += '\\u' + h;
      } else out += c;
    }
    return out + '"';
  }
  function toJSON(v, pre) {
    pre = pre || '';
    if (v === null || v === undefined) return 'null';
    var t = typeof v;
    if (t === 'number') return isFinite(v) ? String(v) : 'null';
    if (t === 'boolean') return v ? 'true' : 'false';
    if (t === 'string') return jsonStr(v);
    if (t === 'function') return 'null';
    var nx = pre + '  ', parts = [], i;
    if (isArr(v)) {
      if (!v.length) return '[]';
      for (i = 0; i < v.length; i++) parts.push(nx + toJSON(v[i], nx));
      return '[\n' + parts.join(',\n') + '\n' + pre + ']';
    }
    for (var k in v) if (has(v, k) && typeof v[k] !== 'function') parts.push(nx + jsonStr(k) + ': ' + toJSON(v[k], nx));
    if (!parts.length) return '{}';
    return '{\n' + parts.join(',\n') + '\n' + pre + '}';
  }
  K.toJSON = toJSON;

  // =================================================================== warna

  function hex(h, d) {
    if (isArr(h)) return h;
    var s = String(h === null || h === undefined ? '' : h).replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(s)) s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    if (!/^[0-9a-fA-F]{6}/.test(s)) return d || [1, 1, 1];
    return [parseInt(s.substr(0, 2), 16) / 255, parseInt(s.substr(2, 2), 16) / 255, parseInt(s.substr(4, 2), 16) / 255];
  }
  /** campur warna: t = 0 -> a, t = 1 -> b (dipakai untuk meniru rgba di atas latar solid) */
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function c4(c) { return [c[0], c[1], c[2], 1]; }

  function setupColors(brand) {
    var c = obj(brand.color);
    var defs = {
      background: '#14171F', surface: '#232836', backgroundLight: '#F5F3EE', primary: '#3D5AFE', accent: '#FFC93C',
      accentText: '#14171F', text: '#FFFFFF', textOnLight: '#14171F', muted: '#9AA3B5', alert: '#E5484D'
    };
    var out = {};
    for (var k in defs) if (has(defs, k)) out[k] = hex(c[k], hex(defs[k]));
    // token baru (opsional): teks dan sorotan di latar brand (primary)
    out.textOnBrand = c.textOnBrand ? hex(c.textOnBrand, out.text) : out.text;
    out.accentOnBrand = c.accentOnBrand ? hex(c.accentOnBrand, out.accent) : out.accent;
    out.white = [1, 1, 1];
    out.black = [0, 0, 0];
    return out;
  }
  function bgColor(bg) { return bg === 'light' ? C.backgroundLight : (bg === 'brand' ? C.primary : C.background); }
  function textColor(bg) { return bg === 'light' ? C.textOnLight : (bg === 'brand' ? C.textOnBrand : C.text); }
  function accentOn(bg) { return bg === 'brand' ? C.accentOnBrand : C.accent; }
  /** sorotan *kata*. Latar terang di Remotion memakai stabilo; di AE diganti warna primary (lihat README). */
  function hiColor(bg) { return bg === 'light' ? C.primary : accentOn(bg); }
  function muted(bg, a) { return mix(bgColor(bg), textColor(bg), isNum(a) ? a : (bg === 'light' ? 0.7 : 0.78)); }

  // =================================================================== teks: sorotan, ukuran, bungkus baris

  /** "Tiga *salah kaprah*" -> {plain: "Tiga salah kaprah", ranges: [[5, 17]]} (indeks karakter, akhir eksklusif) */
  function parseHi(text) {
    var s = String(text === null || text === undefined ? '' : text), out = '', ranges = [], i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (ch === '*') {
        var j = String(s).indexOf('*', i + 1);
        if (j > i + 1) {
          var a = out.length;
          out += s.substring(i + 1, j);
          ranges.push([a, out.length]);
          i = j + 1;
          continue;
        }
        i++;
        continue;
      }
      out += ch;
      i++;
    }
    return {plain: out, ranges: ranges};
  }
  function stripHi(t) { return String(t === null || t === undefined ? '' : t).replace(/\*/g, ''); }

  /** sama dengan fitSize di theme.ts */
  function fitSize(text, sizes, perLine) {
    var clean = stripHi(text), longest = 1;
    each(clean.split(/\s+/), function (w) { if (w.length > longest) longest = w.length; });
    var chars = clean.length;
    for (var i = 0; i < sizes.length; i++) {
      var cpl = perLine / (sizes[i] * 0.56);
      if (longest <= cpl && Math.ceil(chars / cpl) <= 4) return sizes[i];
    }
    return sizes[sizes.length - 1];
  }

  /** perkiraan pecah baris (lebar huruf rata-rata 0,56 em, sama dengan fitSize) */
  function wrapLines(text, size, width, tracking) {
    var t = String(text);
    if (!width) return t.split('\r');
    var cw = size * 0.56 * (1 + (tracking || 0) / 1000);
    var maxC = Math.max(1, Math.floor(width / cw));
    var words = t.split(' '), lines = [], cur = '';
    each(words, function (w) {
      if (cur === '') cur = w;
      else if ((cur + ' ' + w).length <= maxC) cur += ' ' + w;
      else { lines.push(cur); cur = w; }
    });
    lines.push(cur);
    return lines;
  }

  function estRect(o) {
    var size = o.size, lh = o.lh || 1.2;
    var lines = wrapLines(o.text, size, o.box ? o.width : 0, o.tracking);
    var cw = size * 0.56 * (1 + (o.tracking || 0) / 1000), maxLen = 0;
    each(lines, function (l) { if (l.length > maxLen) maxLen = l.length; });
    var w = Math.max(1, maxLen * cw), h = size * 0.95 + (lines.length - 1) * size * lh, l, t;
    if (o.box) {
      var bp = o.boxPos || [-o.width / 2, -(o.boxH || 0) / 2];
      t = bp[1] + size * 0.25;
      l = o.align === 'center' ? bp[0] + (o.width - w) / 2 : (o.align === 'right' ? bp[0] + o.width - w : bp[0]);
    } else {
      t = -size * 0.75;
      l = o.align === 'center' ? -w / 2 : (o.align === 'right' ? -w : 0);
    }
    return {l: l, t: t, w: w, h: h, est: true};
  }

  // =================================================================== properti, keyframe, easing

  function tp(L, mn) { return L.property('ADBE Transform Group').property(mn); }
  function setPos(L, xy) { tp(L, 'ADBE Position').setValue([xy[0], xy[1]]); }
  function setAnchor(L, xy) { tp(L, 'ADBE Anchor Point').setValue([xy[0], xy[1]]); }
  function getPos(L) { var v = tp(L, 'ADBE Position').value; return [v[0], v[1]]; }
  function fps() { return X.fps; }

  /** sesuaikan jumlah dimensi nilai dengan properti (mis. posisi animator teks bisa 2D atau 3D) */
  function fitDims(prop, v) {
    var cur = null;
    try { cur = prop.value; } catch (e) { return v; }
    if (!isArr(cur) || !isArr(v)) return v;
    var out = [];
    for (var i = 0; i < cur.length; i++) out.push(i < v.length ? v[i] : cur[i]);
    return out;
  }

  function easeDims(prop) {
    var t = null;
    try { t = prop.propertyValueType; } catch (e) { return 1; }
    try {
      if (t === PropertyValueType.TwoD) return 2;
      if (t === PropertyValueType.ThreeD) return 3;
    } catch (e2) {}
    return 1;
  }
  function isSpatial(prop) {
    try {
      var t = prop.propertyValueType;
      return t === PropertyValueType.TwoD_SPATIAL || t === PropertyValueType.ThreeD_SPATIAL;
    } catch (e) { return false; }
  }

  /**
   * Ubah kurva cubic-bezier CSS (x1, y1, x2, y2) jadi KeyframeEase AE untuk satu segmen.
   * Kecepatan = kemiringan kurva x kecepatan rata-rata, pengaruh = x1 / (1 - x2).
   */
  function easeSeg(prop, k0, k1, v0, v1, dt, bz) {
    try {
      var n = easeDims(prop), d = [], i;
      if (isSpatial(prop)) {
        var sum = 0;
        for (i = 0; i < Math.max(v0.length, v1.length); i++) { var dd = (v1[i] || 0) - (v0[i] || 0); sum += dd * dd; }
        d = [Math.sqrt(sum)];
      } else if (isArr(v0)) {
        for (i = 0; i < n; i++) d.push((v1[i] || 0) - (v0[i] || 0));
      } else d = [v1 - v0];
      while (d.length < n) d.push(0);
      var x1 = clamp(bz[0], 0.001, 1), y1 = bz[1], x2 = clamp(bz[2], 0, 0.999), y2 = bz[3];
      var outE = [], inE = [];
      for (i = 0; i < n; i++) {
        var avg = d[i] / Math.max(dt, 0.0001);
        outE.push(new KeyframeEase(avg * y1 / x1, clamp(x1 * 100, 0.1, 100)));
        inE.push(new KeyframeEase(avg * (1 - y2) / (1 - x2), clamp((1 - x2) * 100, 0.1, 100)));
      }
      prop.setInterpolationTypeAtKey(k0, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
      prop.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
      prop.setTemporalEaseAtKey(k0, prop.keyInTemporalEase(k0), outE);
      prop.setTemporalEaseAtKey(k1, inE, prop.keyOutTemporalEase(k1));
    } catch (e) {
      warnOnce('ease', 'Easing keyframe gagal dipasang (' + errText(e) + '); animasi memakai interpolasi bawaan AE.');
    }
  }

  /** keyframe berurutan [[detik, nilai], ...]; ez = satu bezier untuk semua segmen, atau array per segmen, null = linear */
  function keys(prop, list, ez) {
    var i, idx = [];
    for (i = 0; i < list.length; i++) prop.setValueAtTime(list[i][0], fitDims(prop, list[i][1]));
    for (i = 0; i < list.length; i++) idx.push(prop.nearestKeyIndex(list[i][0]));
    for (i = 0; i < list.length - 1; i++) {
      var bz = (ez && isArr(ez[0])) ? ez[i] : ez;
      if (bz) easeSeg(prop, idx[i], idx[i + 1], list[i][1], list[i + 1][1], list[i + 1][0] - list[i][0], bz);
      else {
        try {
          prop.setInterpolationTypeAtKey(idx[i], KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
          prop.setInterpolationTypeAtKey(idx[i + 1], KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
        } catch (e) {}
      }
    }
  }

  // kurva: soft = pegas SPRING.soft (Rise), enter = bezier(0.16,1,0.3,1) transisi Remotion, inout = cubic in-out (wipe)
  var EZ = {
    soft: [0.2, 1, 0.3, 1],
    out: [0.3, 0.7, 0.4, 1],
    enter: [0.16, 1, 0.3, 1],
    inout: [0.65, 0, 0.35, 1],
    cubicOut: [0.33, 1, 0.68, 1],
    pop1: [0.3, 0.4, 0.5, 1],
    pop2: [0.4, 0, 0.6, 1]
  };

  /** Rise (Motion.tsx): naik/geser 40 px + memudar, pegas lembut 18 frame */
  function rise(el, delayF, from, dist) {
    if (!el) return;
    from = from || 'below';
    dist = isNum(dist) ? dist : 40;
    var t0 = delayF / fps(), t1 = (delayF + 18) / fps(), tO = (delayF + 6) / fps();
    each(el.roots, function (L) {
      var p = getPos(L), st = [p[0], p[1] + dist];
      if (from === 'left') st = [p[0] - dist, p[1]];
      else if (from === 'right') st = [p[0] + dist, p[1]];
      keys(tp(L, 'ADBE Position'), [[t0, st], [t1, p]], EZ.soft);
      keys(tp(L, 'ADBE Opacity'), [[t0, 0], [tO, 100]], EZ.out);
    });
  }

  /** Pop (Motion.tsx): skala 60 -> 102 -> 100 (pegas SPRING.pop, lewat sedikit), opasitas cepat */
  function pop(el, delayF) {
    if (!el) return;
    var t = function (f) { return (delayF + f) / fps(); };
    each(el.roots, function (L) {
      keys(tp(L, 'ADBE Scale'), [[t(0), [60, 60]], [t(7), [102.3, 102.3]], [t(16), [100, 100]]], [EZ.pop1, EZ.pop2]);
      keys(tp(L, 'ADBE Opacity'), [[t(0), 0], [t(3), 100]], EZ.out);
    });
  }

  // opasitas anak ikut induk (parenting AE tidak mewariskan opasitas)
  var OPX = 'var o=value;var L=thisLayer;while(L.hasParent){L=L.parent;o=o*L.transform.opacity/100;}o;';
  function setExpr(prop, code) {
    try { prop.expression = code; return true; } catch (e) {
      warnOnce('expr', 'Expression tidak bisa dipasang (' + errText(e) + ').');
      return false;
    }
  }
  /** jadikan child anak root (AE mengompensasi posisi, jadi letak di layar tidak berubah) */
  function adopt(child, root) {
    child.parent = root;
    setExpr(tp(child, 'ADBE Opacity'), OPX);
  }

  // =================================================================== nama layer, comp, impor

  function uname(comp, base) {
    var key = 'c' + comp.id;
    if (!X.names[key]) X.names[key] = {};
    var m = X.names[key];
    if (!m[base]) { m[base] = 1; return base; }
    m[base]++;
    return base + ' ' + m[base];
  }

  function newComp(name, w, h, dur, folder) {
    var c = app.project.items.addComp(name, Math.round(w), Math.round(h), 1, Math.max(dur, 1 / X.fps), X.fps);
    if (folder) c.parentFolder = folder;
    try { c.bgColor = C.background; } catch (e) {}
    return c;
  }

  function importFile(path, folderKey) {
    if (!path) return null;
    var key = 'f:' + path;
    if (has(X.cache, key)) return X.cache[key];
    var item = null;
    if (/^https?:/i.test(path)) {
      warn('AE tidak bisa mengimpor URL: ' + path + ' (unduh dulu ke remotion/public/).');
    } else {
      var f = new File(path);
      if (!f.exists) warn('File tidak ditemukan: ' + path);
      else {
        try {
          var io = new ImportOptions(f);
          try { if (io.canImportAs(ImportAsType.FOOTAGE)) io.importAs = ImportAsType.FOOTAGE; } catch (e1) {}
          item = app.project.importFile(io);
          if (X.folders[folderKey]) item.parentFolder = X.folders[folderKey];
        } catch (e) {
          warn('Gagal impor ' + path + ': ' + errText(e));
          item = null;
        }
      }
    }
    X.cache[key] = item;
    return item;
  }

  function fileName(p) { var s = String(p).replace(/\\/g, '/'); return s.substr(s.lastIndexOf('/') + 1); }

  // =================================================================== bentuk (shape layer)

  function newShape(comp, name) {
    var L = comp.layers.addShape();
    L.name = uname(comp, name || 'Bentuk');
    setAnchor(L, [0, 0]);
    setPos(L, [0, 0]);
    return L;
  }
  function shapeGroup(L, name) {
    var g = L.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    try { g.name = name; } catch (e) {}
    return g.propertyIndex;
  }
  function vecs(L, gi) { return L.property('ADBE Root Vectors Group').property(gi).property('ADBE Vectors Group'); }
  function paint(L, gi, o) {
    if (o.fill) {
      var f = vecs(L, gi).addProperty('ADBE Vector Graphic - Fill');
      f.property('ADBE Vector Fill Color').setValue(c4(o.fill));
      if (isNum(o.fillOpacity)) f.property('ADBE Vector Fill Opacity').setValue(o.fillOpacity);
    }
    if (o.stroke) {
      var s = vecs(L, gi).addProperty('ADBE Vector Graphic - Stroke');
      s.property('ADBE Vector Stroke Color').setValue(c4(o.stroke));
      s.property('ADBE Vector Stroke Width').setValue(o.strokeW || 2);
      if (isNum(o.strokeOpacity)) s.property('ADBE Vector Stroke Opacity').setValue(o.strokeOpacity);
      if (o.cap) {
        try {
          s.property('ADBE Vector Stroke Line Cap').setValue(2); // 2 = round
          s.property('ADBE Vector Stroke Line Join').setValue(2); // 2 = round
        } catch (e) {}
      }
    }
  }
  /** kotak bersudut bulat, pusat (o.x, o.y) di ruang layer */
  function addRect(L, o) {
    var gi = shapeGroup(L, o.name || 'Kotak');
    var rc = vecs(L, gi).addProperty('ADBE Vector Shape - Rect');
    rc.property('ADBE Vector Rect Size').setValue([Math.max(0, o.w), Math.max(0, o.h)]);
    rc.property('ADBE Vector Rect Position').setValue([o.x || 0, o.y || 0]);
    rc.property('ADBE Vector Rect Roundness').setValue(Math.max(0, o.r || 0));
    paint(L, gi, o);
    return gi;
  }
  function rectProp(L, gi, mn) { return vecs(L, gi).property('ADBE Vector Shape - Rect').property(mn); }
  function addEllipse(L, o) {
    var gi = shapeGroup(L, o.name || 'Lingkaran');
    var el = vecs(L, gi).addProperty('ADBE Vector Shape - Ellipse');
    el.property('ADBE Vector Ellipse Size').setValue([o.w, o.h]);
    el.property('ADBE Vector Ellipse Position').setValue([o.x || 0, o.y || 0]);
    paint(L, gi, o);
    return gi;
  }

  /** bentuk mask kotak bersudut bulat (koordinat layer) */
  function roundedShape(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    var k = 0.5523 * r, s = new Shape();
    s.vertices = [[x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r], [x, y + r]];
    s.inTangents = [[-k, 0], [0, 0], [0, -k], [0, 0], [k, 0], [0, 0], [0, k], [0, 0]];
    s.outTangents = [[0, 0], [k, 0], [0, 0], [0, k], [0, 0], [-k, 0], [0, 0], [0, -k]];
    s.closed = true;
    return s;
  }
  function addMask(L, x, y, w, h, r, feather) {
    var m = L.property('ADBE Mask Parade').addProperty('ADBE Mask Atom');
    m.property('ADBE Mask Shape').setValue(roundedShape(x, y, w, h, r));
    if (feather) m.property('ADBE Mask Feather').setValue(feather);
    return m;
  }

  // ikon garis (sama dengan components/Icon.tsx, viewBox 24)
  var ICONS = {
    check: 'M4 12.5l5 5L20 6.5',
    x: 'M6 6l12 12M18 6L6 18',
    star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
    heart: 'M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0112 7a4.4 4.4 0 017.5 2.9C19.5 15.4 12 20 12 20z',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z',
    clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3.5 2',
    chart: 'M4 20h16M7 16v-5M12 16V7M17 16v-8',
    chat: 'M4 5h16v11H9l-5 4z',
    book: 'M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z M12 5.5V19',
    alert: 'M12 4l9 16H3zM12 10v4M12 17.2v.1',
    arrow: 'M4 12h15M13 6l6 6-6 6',
    target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 12.2v-.4',
    money: 'M3 7h18v10H3zM12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6.5 10v4M17.5 10v4',
    user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5'
  };
  K.ICONS = ICONS;

  /** busur SVG -> kurva cubic (SVG spec F.6.5), tiap potongan maks 90 derajat */
  function arcToCubics(x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) {
    if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) return [[x1, y1, x2, y2, x2, y2]];
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    var phi = phiDeg * Math.PI / 180, co = Math.cos(phi), si = Math.sin(phi);
    var dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
    var xp = co * dx + si * dy, yp = -si * dx + co * dy;
    var lam = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
    if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
    var num1 = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
    var den = rx * rx * yp * yp + ry * ry * xp * xp;
    var f = Math.sqrt(Math.max(0, num1 / den));
    if (fa === fs) f = -f;
    var cxp = f * rx * yp / ry, cyp = -f * ry * xp / rx;
    var cx = co * cxp - si * cyp + (x1 + x2) / 2, cy = si * cxp + co * cyp + (y1 + y2) / 2;
    var ang = function (ux, uy, vx, vy) { return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); };
    var ux = (xp - cxp) / rx, uy = (yp - cyp) / ry, vx = (-xp - cxp) / rx, vy = (-yp - cyp) / ry;
    var t1 = ang(1, 0, ux, uy), dt = ang(ux, uy, vx, vy);
    if (!fs && dt > 0) dt -= 2 * Math.PI;
    if (fs && dt < 0) dt += 2 * Math.PI;
    var n = Math.max(1, Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9)), seg = dt / n, k = 4 / 3 * Math.tan(seg / 4);
    var map = function (px, py) { return [cx + rx * px * co - ry * py * si, cy + rx * px * si + ry * py * co]; };
    var out = [];
    for (var i = 0; i < n; i++) {
      var a1 = t1 + i * seg, a2 = a1 + seg;
      var c1 = map(Math.cos(a1) - k * Math.sin(a1), Math.sin(a1) + k * Math.cos(a1));
      var c2 = map(Math.cos(a2) + k * Math.sin(a2), Math.sin(a2) - k * Math.cos(a2));
      var p2 = map(Math.cos(a2), Math.sin(a2));
      out.push([c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]]);
    }
    return out;
  }

  /** path SVG (M L H V C S Q A Z, absolut/relatif) -> [{pts, ins, outs, closed}] untuk Shape AE */
  function svgPath(d) {
    var s = String(d), i = 0, n = s.length, subs = [], cur = null, cmd = '';
    var x = 0, y = 0, sx = 0, sy = 0, lcx = 0, lcy = 0, lastC = false;
    function skip() {
      while (i < n) {
        var c = s.charAt(i);
        if (c === ' ' || c === ',' || c === '\n' || c === '\t' || c === '\r') i++;
        else break;
      }
    }
    function isCmd(c) { return /[MmLlHhVvCcSsQqAaZz]/.test(c); }
    function more() { skip(); return i < n && !isCmd(s.charAt(i)); }
    function numb() {
      skip();
      var m = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.substr(i));
      if (!m) throw new Error('path ikon rusak di posisi ' + i + ': ' + s);
      i += m[0].length;
      return parseFloat(m[0]);
    }
    function flag() { skip(); var c = s.charAt(i); i++; return c === '1'; }
    function start(px, py) { cur = {pts: [[px, py]], ins: [[0, 0]], outs: [[0, 0]], closed: false}; subs.push(cur); }
    function ensure() { if (!cur || cur.closed) start(x, y); }
    function line(px, py) { ensure(); cur.pts.push([px, py]); cur.ins.push([0, 0]); cur.outs.push([0, 0]); }
    function cubic(c1x, c1y, c2x, c2y, px, py) {
      ensure();
      var k = cur.pts.length - 1;
      cur.outs[k] = [c1x - cur.pts[k][0], c1y - cur.pts[k][1]];
      cur.pts.push([px, py]);
      cur.ins.push([c2x - px, c2y - py]);
      cur.outs.push([0, 0]);
    }
    while (i < n) {
      skip();
      if (i >= n) break;
      var ch = s.charAt(i);
      if (isCmd(ch)) { cmd = ch; i++; }
      else if (!cmd) throw new Error('path ikon tanpa perintah: ' + s);
      var rel = cmd !== cmd.toUpperCase(), U = cmd.toUpperCase();
      if (U === 'Z') {
        if (cur) cur.closed = true;
        x = sx; y = sy; lastC = false;
        continue;
      }
      var first = true;
      do {
        var ox = rel ? x : 0, oy = rel ? y : 0, c1x, c1y, c2x, c2y, px, py;
        switch (U) {
          case 'M':
            px = numb() + ox; py = numb() + oy;
            if (first) { start(px, py); sx = px; sy = py; } else line(px, py);
            x = px; y = py; lastC = false;
            break;
          case 'L':
            px = numb() + ox; py = numb() + oy; line(px, py); x = px; y = py; lastC = false;
            break;
          case 'H':
            px = numb() + ox; line(px, y); x = px; lastC = false;
            break;
          case 'V':
            py = numb() + oy; line(x, py); y = py; lastC = false;
            break;
          case 'C':
            c1x = numb() + ox; c1y = numb() + oy; c2x = numb() + ox; c2y = numb() + oy; px = numb() + ox; py = numb() + oy;
            cubic(c1x, c1y, c2x, c2y, px, py); lcx = c2x; lcy = c2y; x = px; y = py; lastC = true;
            break;
          case 'S':
            c1x = lastC ? 2 * x - lcx : x; c1y = lastC ? 2 * y - lcy : y;
            c2x = numb() + ox; c2y = numb() + oy; px = numb() + ox; py = numb() + oy;
            cubic(c1x, c1y, c2x, c2y, px, py); lcx = c2x; lcy = c2y; x = px; y = py; lastC = true;
            break;
          case 'Q':
            var qx = numb() + ox, qy = numb() + oy;
            px = numb() + ox; py = numb() + oy;
            cubic(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), px + 2 / 3 * (qx - px), py + 2 / 3 * (qy - py), px, py);
            x = px; y = py; lastC = false;
            break;
          case 'A':
            var rx = numb(), ry = numb(), rot = numb(), fa = flag(), fs = flag();
            px = numb() + ox; py = numb() + oy;
            var cs = arcToCubics(x, y, rx, ry, rot, fa, fs, px, py);
            for (var q = 0; q < cs.length; q++) cubic(cs[q][0], cs[q][1], cs[q][2], cs[q][3], cs[q][4], cs[q][5]);
            x = px; y = py; lastC = false;
            break;
          default:
            throw new Error('perintah path "' + cmd + '" belum didukung');
        }
        first = false;
      } while (more());
    }
    // titik akhir = titik awal pada path tertutup: gabungkan
    each(subs, function (sp) {
      var a = sp.pts[0], b = sp.pts[sp.pts.length - 1];
      if (sp.closed && sp.pts.length > 1 && Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3) {
        sp.ins[0] = sp.ins[sp.ins.length - 1];
        sp.pts.pop();
        sp.ins.pop();
        sp.outs.pop();
      }
    });
    return subs;
  }
  K.svgPath = svgPath;

  /** layer ikon (garis), pusat di (0,0) ruang layer */
  function iconLayer(comp, name, size, color, stroke) {
    var key = has(ICONS, name) ? name : 'check';
    var L = newShape(comp, 'Ikon ' + key);
    var gi = shapeGroup(L, 'Ikon');
    var sc = size / 24, subs = svgPath(ICONS[key]);
    each(subs, function (sp) {
      var sh = new Shape(), v = [], ti = [], to = [];
      for (var j = 0; j < sp.pts.length; j++) {
        v.push([(sp.pts[j][0] - 12) * sc, (sp.pts[j][1] - 12) * sc]);
        ti.push([sp.ins[j][0] * sc, sp.ins[j][1] * sc]);
        to.push([sp.outs[j][0] * sc, sp.outs[j][1] * sc]);
      }
      sh.vertices = v;
      sh.inTangents = ti;
      sh.outTangents = to;
      sh.closed = sp.closed;
      var pg = vecs(L, gi).addProperty('ADBE Vector Shape - Group');
      pg.property('ADBE Vector Shape').setValue(sh);
    });
    paint(L, gi, {stroke: color, strokeW: (stroke || 2.2) * sc, cap: true});
    return L;
  }

  // =================================================================== teks

  function textProp(L) { return L.property('ADBE Text Properties').property('ADBE Text Document'); }
  function textAnims(L) { return L.property('ADBE Text Properties').property('ADBE Text Animators'); }
  function fontPS(role) {
    var f = obj(X.D.fonts);
    return str(f[role], str(f.body700, 'ArialMT'));
  }
  function justOf(align) {
    try {
      if (align === 'center') return ParagraphJustification.CENTER_JUSTIFY;
      if (align === 'right') return ParagraphJustification.RIGHT_JUSTIFY;
      return ParagraphJustification.LEFT_JUSTIFY;
    } catch (e) { return undefined; }
  }

  /**
   * Buat layer teks. o.width diisi = teks kotak (paragraph text, baris dibungkus AE), kosong = point text.
   * o: text, role (display800 display700 body800 body700 body600 body500), size, color, align, lh (line height), tracking,
   *    stroke {color, width}, name
   */
  function makeText(comp, o) {
    var txt = String(o.text), L = null, box = false, bh = 0, lh = o.lh || 1.2;
    if (o.width) {
      var lines = wrapLines(txt, o.size, o.width, o.tracking).length;
      bh = Math.round(Math.max(o.size * 4, lines * lh * o.size * 3 + o.size * 2));
      if (X.feat.boxText !== false) {
        try {
          if (!hasFn(comp.layers, 'addBoxText')) throw new Error('LayerCollection.addBoxText tidak ada');
          L = comp.layers.addBoxText([Math.round(o.width), bh], txt);
          box = true;
          X.feat.boxText = true;
        } catch (e) {
          X.feat.boxText = false;
          warnOnce('boxtext', 'Teks kotak (addBoxText) tidak tersedia (' + errText(e) + '): baris dipecah manual dengan perkiraan lebar huruf.');
        }
      }
    }
    if (!L) {
      if (o.width) txt = wrapLines(txt, o.size, o.width, o.tracking).join('\r');
      L = comp.layers.addText(txt);
    }
    var ps = fontPS(o.role);
    try {
      textProp(L).setValue(styleText(textProp(L).value, o, ps));
    } catch (eSet) {
      // AE menolak nama font (belum terpasang?): pakai font bawaan, gaya lain tetap
      warnOnce('setfont:' + ps, 'Font ' + ps + ' ditolak AE (' + errText(eSet) + '): teks memakai font bawaan.');
      textProp(L).setValue(styleText(textProp(L).value, o, null));
    }
    var after = textProp(L).value, bp = null;
    try {
      if (after.font && after.font !== ps) warnOnce('fontsub:' + ps, 'AE memakai ' + after.font + ' sebagai ganti ' + ps + ' (font belum terpasang?).');
    } catch (e8) {}
    if (box) {
      try { bp = after.boxTextPos; if (!isArr(bp) || bp.length < 2) bp = null; } catch (e9) { bp = null; }
    }
    L.name = uname(comp, o.name || 'Teks');
    if (X.feat.setTrackMatte === undefined) X.feat.setTrackMatte = hasFn(L, 'setTrackMatte');
    return {layer: L, box: box, boxH: bh, boxPos: bp, text: txt};
  }

  /** gaya TextDocument (font, ukuran, warna, garis tepi, rata, tracking, leading); ps null = font tidak diubah */
  function styleText(td, o, ps) {
    try { td.resetCharStyle(); } catch (e1) {}
    try { td.resetParagraphStyle(); } catch (e2) {}
    if (ps) { try { td.font = ps; } catch (e3) { warnOnce('font:' + ps, 'Font ' + ps + ' tidak bisa dipasang: ' + errText(e3)); } }
    td.fontSize = o.size;
    td.applyFill = true;
    td.fillColor = o.color || C.text;
    if (o.stroke) {
      td.applyStroke = true;
      td.strokeColor = o.stroke.color;
      td.strokeWidth = o.stroke.width;
      try { td.strokeOverFill = false; } catch (e4) {}
    } else td.applyStroke = false;
    var j = justOf(o.align);
    if (j !== undefined) td.justification = j;
    try { td.tracking = Math.round(o.tracking || 0); } catch (e5) {}
    if (o.lh) {
      try { td.autoLeading = false; } catch (e6) {}
      try { td.leading = Math.round(o.size * o.lh); } catch (e7) {}
    }
    return td;
  }

  /** ukuran teks sebenarnya (sourceRectAtTime), kalau tidak ada: perkiraan */
  function measure(L, o) {
    if (X.feat.sourceRect !== false) {
      try {
        if (!hasFn(L, 'sourceRectAtTime')) throw new Error('Layer.sourceRectAtTime tidak ada');
        var r = L.sourceRectAtTime(0, false);
        X.feat.sourceRect = true;
        if (r && r.width > 0.5 && r.height > 0.5) {
          var boxLike = o.box && r.width >= o.width - 0.5 && r.height >= o.boxH * 0.9;
          if (!boxLike) return {l: r.left, t: r.top, w: r.width, h: r.height, est: false};
          warnOnce('rectbox', 'sourceRectAtTime mengembalikan ukuran kotak paragraf, bukan ukuran teks: tata letak memakai perkiraan.');
        }
      } catch (e) {
        X.feat.sourceRect = false;
        warnOnce('srcrect', 'sourceRectAtTime tidak bisa dipakai (' + errText(e) + '): ukuran teks diperkirakan.');
      }
    }
    return estRect(o);
  }

  function animAt(L, ai) { return textAnims(L).property(ai); }
  function findSel(L, ai) {
    var sels = animAt(L, ai).property('ADBE Text Selectors');
    for (var k = 1; k <= sels.numProperties; k++) {
      if (animAt(L, ai).property('ADBE Text Selectors').property(k).matchName === 'ADBE Text Expressible Selector') {
        return animAt(L, ai).property('ADBE Text Selectors').property(k);
      }
    }
    throw new Error('Expression Selector tidak ditemukan');
  }
  /**
   * Text Animator dengan satu Expression Selector.
   * basedOn: 1 karakter, 2 karakter tanpa spasi, 3 kata, 4 baris (nilai dropdown "Based On").
   */
  function addAnimator(L, name, propMn, value, basedOn, expr) {
    var an = textAnims(L).addProperty('ADBE Text Animator');
    var ai = an.propertyIndex;
    try { an.name = name; } catch (e) {}
    var ap = animAt(L, ai).property('ADBE Text Animator Properties').addProperty(propMn);
    ap.setValue(fitDims(ap, value));
    animAt(L, ai).property('ADBE Text Selectors').addProperty('ADBE Text Expressible Selector');
    // kalau AE ikut menambah Range Selector bawaan, buang supaya hanya expression yang menentukan
    var nSel = animAt(L, ai).property('ADBE Text Selectors').numProperties;
    for (var k = nSel; k >= 1; k--) {
      var sp = animAt(L, ai).property('ADBE Text Selectors').property(k);
      if (sp.matchName !== 'ADBE Text Expressible Selector') sp.remove();
    }
    findSel(L, ai).property('ADBE Text Range Type2').setValue(basedOn);
    setExpr(findSel(L, ai).property('ADBE Text Expressible Amount'), expr);
  }

  /** sorotan *kata*: characterRange (AE baru) -> Text Animator berbasis karakter -> polos */
  function applyHi(L, ranges, color) {
    if (!ranges.length) return;
    if (X.feat.characterRange) {
      try {
        var prop = textProp(L), td = prop.value;
        for (var i = 0; i < ranges.length; i++) {
          var cr = td.characterRange(ranges[i][0], ranges[i][1]);
          try { cr.applyFill = true; } catch (e0) {}
          cr.fillColor = color;
        }
        prop.setValue(td);
        X.hiMode = 'characterRange';
        return;
      } catch (e) {
        X.feat.characterRange = false;
        warnOnce('charrange', 'TextDocument.characterRange gagal (' + errText(e) + '): sorotan memakai Text Animator.');
      }
    }
    var list = [];
    each(ranges, function (r) { list.push('[' + r[0] + ',' + r[1] + ']'); });
    var expr = 'var r=[' + list.join(',') + '];var i=textIndex-1;var on=0;' +
      'for(var k=0;k<r.length;k++){if(i>=r[k][0]&&i<r[k][1]){on=1;}}selectorValue*on;';
    try {
      addAnimator(L, 'Sorotan', 'ADBE Text Fill Color', c4(color), 1, expr);
      if (X.hiMode !== 'characterRange') X.hiMode = 'animator';
    } catch (e2) {
      X.hiMode = 'polos';
      warnOnce('hianim', 'Sorotan *kata* tidak bisa dipasang (' + errText(e2) + '): teks tampil polos.');
    }
  }

  /** PopWords (Text.tsx): kata muncul satu per satu, naik 0,35 em + memudar, pegas SPRING.pop */
  function addWordPop(L, delayF, staggerF, size) {
    var d = r3(delayF / fps()), s = r3(staggerF / fps());
    var spr = 'var t=time-(' + d + '+(textIndex-1)*' + s + ');var p=0;' +
      'if(t>0){p=1-Math.exp(-11.667*t)*(Math.cos(12.802*t)+0.9113*Math.sin(12.802*t));}';
    addAnimator(L, 'Muncul geser', 'ADBE Text Position 3D', [0, r3(size * 0.35), 0], 3, spr + 'selectorValue*(1-p);');
    addAnimator(L, 'Muncul pudar', 'ADBE Text Opacity', 0, 3, spr + 'selectorValue*(1-Math.min(1,Math.max(0,p/0.35)));');
  }

  /**
   * Elemen teks untuk tata letak. Anchor dipasang di tengah kotak teks, jadi skala (Pop) berpusat di tengah.
   * o tambahan: hi (warna sorotan), upper, inline (lebar elemen = lebar teks), pop {delay, stagger} dalam frame
   */
  function elText(comp, o) {
    var parsed = parseHi(o.text);
    var plain = o.upper ? parsed.plain.toUpperCase() : parsed.plain;
    var t = makeText(comp, {text: plain, role: o.role, size: o.size, color: o.color, width: o.width, align: o.align, lh: o.lh, tracking: o.tracking, stroke: o.stroke, name: o.name});
    var L = t.layer;
    if (o.hi && parsed.ranges.length) applyHi(L, parsed.ranges, o.hi);
    var r = measure(L, {text: t.text, size: o.size, width: o.width, box: t.box, boxH: t.boxH, boxPos: t.boxPos, align: o.align, lh: o.lh, tracking: o.tracking});
    var lh = o.lh || 1.2, padT = o.size * Math.max(0.04, (lh - 0.85) / 2);
    var el = {layer: L, r: r, roots: [L], plain: plain, words: countWords(plain)};
    el.w = (o.width && !o.inline) ? o.width : r.w;
    el.h = r.h + 2 * padT;
    setAnchor(L, [r.l + r.w / 2, r.t + r.h / 2]);
    el.place = function (x, y) {
      var cx = o.align === 'center' ? x + el.w / 2 : (o.align === 'right' ? x + el.w - r.w / 2 : x + r.w / 2);
      setPos(L, [cx, y + padT + r.h / 2]);
    };
    setPos(L, [r.w / 2, r.h / 2]);
    if (o.pop) addWordPop(L, o.pop.delay || 0, isNum(o.pop.stagger) ? o.pop.stagger : 3, o.size);
    return el;
  }

  /**
   * Pil: teks + kotak bulat di belakangnya. Kotak ikut ukuran teks lewat expression sourceRectAtTime,
   * jadi kalau teks diedit di AE, pil ikut melebar.
   */
  function elPill(comp, o) {
    var txt = stripHi(o.text);
    if (o.upper) txt = txt.toUpperCase();
    var t = makeText(comp, {text: txt, role: o.role, size: o.size, color: o.color, tracking: o.tracking || 0, name: o.name || 'Pil'});
    var L = t.layer;
    var r = measure(L, {text: txt, size: o.size, tracking: o.tracking, box: false, align: 'left'});
    var pw = r.w + 2 * o.padX, ph = o.size * (o.lineH || 1.2) + 2 * o.padY, py = (ph - r.h) / 2;
    setAnchor(L, [r.l + r.w / 2, r.t + r.h / 2]);
    var S = newShape(comp, (o.name || 'Pil') + ' latar');
    var sw = o.stroke ? (o.strokeW || 4) : 0;
    var gi = addRect(S, {w: pw - sw, h: ph - sw, x: r.l + r.w / 2, y: r.t + r.h / 2, r: isNum(o.radius) ? o.radius : ph / 2,
      fill: o.fill, fillOpacity: o.fillOpacity, stroke: o.stroke, strokeW: sw});
    S.moveAfter(L);
    S.parent = L;
    setAnchor(S, [0, 0]);
    setPos(S, [0, 0]);
    setExpr(tp(S, 'ADBE Opacity'), OPX);
    if (X.feat.sourceRect) {
      setExpr(rectProp(S, gi, 'ADBE Vector Rect Size'),
        'var r=thisLayer.parent.sourceRectAtTime(time,false);[r.width+' + r3(2 * o.padX - sw) + ',r.height+' + r3(2 * py - sw) + '];');
      setExpr(rectProp(S, gi, 'ADBE Vector Rect Position'),
        'var r=thisLayer.parent.sourceRectAtTime(time,false);[r.left+r.width/2,r.top+r.height/2];');
    }
    var el = {layer: L, shape: S, w: pw, h: ph, roots: [L]};
    el.place = function (x, y) { setPos(L, [x + pw / 2, y + ph / 2]); };
    return el;
  }

  function kicker(comp, text, bg) {
    var S = X.S;
    return elPill(comp, {
      text: text, role: 'body700', size: S.label, upper: true, tracking: 60, padX: S.label * 0.7, padY: S.label * 0.32,
      fill: bg === 'brand' ? C.textOnBrand : C.primary, color: bg === 'brand' ? C.primary : C.white, name: 'Kicker'
    });
  }

  // =================================================================== elemen lain + tata letak

  /** garis aksen yang memanjang (GrowBar). grow 'start' = dari kiri/atas, 'center' = dari tengah */
  function elBar(comp, o) {
    var L = newShape(comp, o.name || 'Garis aksen');
    var len = o.length, th = o.thickness, w = o.vertical ? th : len, h = o.vertical ? len : th;
    var start = o.grow === 'start';
    addRect(L, {w: w, h: h, x: (!o.vertical && start) ? w / 2 : 0, y: (o.vertical && start) ? h / 2 : 0, r: th / 2, fill: o.color});
    var el = {w: w, h: h, roots: [L]};
    el.place = function (x, y) {
      setPos(L, [(start && !o.vertical) ? x : x + w / 2, (start && o.vertical) ? y : y + h / 2]);
    };
    var t0 = (o.delay || 0) / fps(), t1 = ((o.delay || 0) + (o.dur || 20)) / fps();
    keys(tp(L, 'ADBE Scale'), [[t0, o.vertical ? [100, 0] : [0, 100]], [t1, [100, 100]]], EZ.soft);
    return el;
  }

  function spacer(w, h) { return {w: w, h: h, roots: [], place: function () {}}; }

  /** kolom (flex column). align: 'center' | 'start'. el.mt = margin atas tambahan */
  function vstack(els, gap, align, width) {
    var list = compact(els), h = 0, w = width || 0, roots = [];
    each(list, function (e, i) {
      h += e.h + (i ? gap : 0) + (e.mt || 0);
      if (!width && e.w > w) w = e.w;
      each(e.roots, function (r) { roots.push(r); });
    });
    var el = {w: w, h: h, roots: roots, kids: list};
    el.place = function (x, y) {
      var cy = y;
      each(list, function (e, i) {
        cy += (i ? gap : 0) + (e.mt || 0);
        e.place(align === 'center' ? x + (w - e.w) / 2 : x, cy);
        cy += e.h;
      });
    };
    return el;
  }
  /** baris (flex row), anak di tengah vertikal */
  function hstack(els, gap) {
    var list = compact(els), w = 0, h = 0, roots = [];
    each(list, function (e, i) {
      w += e.w + (i ? gap : 0);
      if (e.h > h) h = e.h;
      each(e.roots, function (r) { roots.push(r); });
    });
    var el = {w: w, h: h, roots: roots, kids: list};
    el.place = function (x, y) {
      var cx = x;
      each(list, function (e, i) {
        cx += i ? gap : 0;
        e.place(cx, y + (h - e.h) / 2);
        cx += e.w;
      });
    };
    return el;
  }
  /** baris pil yang turun ke baris baru kalau tidak muat (flex-wrap) */
  function wrapRow(els, gap, maxW, align) {
    var rows = [], cur = [], cw = 0;
    each(compact(els), function (e) {
      if (cur.length && cw + gap + e.w > maxW) { rows.push(cur); cur = []; cw = 0; }
      cw += (cur.length ? gap : 0) + e.w;
      cur.push(e);
    });
    if (cur.length) rows.push(cur);
    var lines = [];
    each(rows, function (r) { lines.push(hstack(r, gap)); });
    return vstack(lines, gap, align === 'center' ? 'center' : 'start', maxW);
  }
  function placeIn(el, box, vjust, halign) {
    var x = halign === 'center' ? box.x + (box.w - el.w) / 2 : (halign === 'right' ? box.x + box.w - el.w : box.x);
    var y = vjust === 'center' ? box.y + (box.h - el.h) / 2 : (vjust === 'end' ? box.y + box.h - el.h : box.y);
    el.place(x, y);
  }

  function background(comp, bg) {
    var col = bgColor(bg);
    var L = comp.layers.addSolid(col, uname(comp, 'Latar'), X.W, X.H, 1, comp.duration);
    // cahaya lembut di satu sudut (Frame.tsx Background): Gradient Ramp radial
    var glow = bg === 'brand' ? accentOn('brand') : C.primary, a = bg === 'brand' ? 0.16 : (bg === 'light' ? 0.1 : 0.22);
    var cx = X.W * (X.spec.vertical ? 0.85 : 0.88), cy = X.H * (X.spec.vertical ? 0.08 : 0.12);
    var far = Math.max(Math.sqrt(cx * cx + cy * cy), Math.sqrt((X.W - cx) * (X.W - cx) + cy * cy),
      Math.sqrt(cx * cx + (X.H - cy) * (X.H - cy)), Math.sqrt((X.W - cx) * (X.W - cx) + (X.H - cy) * (X.H - cy)));
    try {
      var fx = L.property('ADBE Effect Parade').addProperty('ADBE Ramp');
      fx.property('ADBE Ramp-0001').setValue([cx, cy]);
      fx.property('ADBE Ramp-0002').setValue(c4(mix(col, glow, a)));
      fx.property('ADBE Ramp-0003').setValue([cx, cy + far * 0.55]);
      fx.property('ADBE Ramp-0004').setValue(c4(col));
      fx.property('ADBE Ramp-0005').setValue(2); // 2 = radial
    } catch (e) {
      warnOnce('ramp', 'Efek Gradient Ramp tidak bisa dipasang (' + errText(e) + '): latar polos tanpa cahaya sudut.');
    }
    return L;
  }

  function elFootage(comp, path, width, folderKey, name) {
    var item = importFile(path, folderKey);
    if (!item || !(item.width > 0)) return null;
    var L = comp.layers.add(item);
    L.name = uname(comp, name || fileName(path));
    var sc = width / item.width * 100, h = item.height * sc / 100;
    tp(L, 'ADBE Scale').setValue([sc, sc]);
    var el = {layer: L, w: width, h: h, roots: [L]};
    el.place = function (x, y) { setPos(L, [x + width / 2, y + h / 2]); };
    return el;
  }

  function parseFocus(f) {
    var parts = String(f || '50% 50%').split(/\s+/), out = [0.5, 0.5];
    for (var i = 0; i < 2 && i < parts.length; i++) {
      var t = parts[i].toLowerCase();
      if (/%$/.test(t)) out[i] = clamp(parseFloat(t) / 100, 0, 1);
      else if (t === 'left' || t === 'top') out[i] = 0;
      else if (t === 'right' || t === 'bottom') out[i] = 1;
      else if (t === 'center') out[i] = 0.5;
    }
    return out;
  }
  /** skala "cover" + object-position untuk layer footage di kotak w x h (koordinat comp, kiri atas x,y) */
  function coverLayer(L, item, x, y, w, h, focus) {
    var sc = Math.max(w / item.width, h / item.height), f = parseFocus(focus);
    var dw = item.width * sc, dh = item.height * sc;
    tp(L, 'ADBE Scale').setValue([sc * 100, sc * 100]);
    setPos(L, [x + (w - dw) * f[0] + dw / 2, y + (h - dh) * f[1] + dh / 2]);
    return sc;
  }

  function missingBox(comp, x, y, w, h, label) {
    var L = comp.layers.addSolid(mix(C.background, C.text, 0.2), uname(comp, 'Media hilang'), Math.max(4, Math.round(w)), Math.max(4, Math.round(h)), 1, comp.duration);
    setPos(L, [x + w / 2, y + h / 2]);
    var t = elText(comp, {text: label, role: 'body700', size: Math.max(24, Math.min(48, w / 16)), color: C.text, width: w * 0.8, align: 'center', name: 'Media hilang teks'});
    t.place(x + w * 0.1, y + h / 2 - t.h / 2);
    return {layer: L, text: t.layer};
  }

  // =================================================================== adegan

  var DEFAULT_BG = {hook: 'dark', bab: 'brand', poin: 'dark', daftar: 'light', angka: 'dark', kutipan: 'dark', foto: 'dark', banding: 'light', outro: 'brand', klip: 'dark'};
  var B = {};

  B.hook = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg, center = F.vertical, al = center ? 'center' : 'left';
    background(c, bg);
    var text = str(s.scene.onScreen, str(p.title, ''));
    var width = center ? F.content.w : F.content.w * 0.8;
    var size = fitSize(text, [S.hook * 1.15, S.hook, S.hook * 0.86, S.hook * 0.74], width);
    var n = countWords(stripHi(text)), els = [];
    if (p.kicker) { var k = kicker(c, p.kicker, bg); els.push(k); s.after(function () { rise(k, 0); }); }
    if (text) els.push(elText(c, {text: text, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: width, align: al, lh: 1.08, tracking: -10, pop: {delay: 4, stagger: 3}, name: 'Judul'}));
    els.push(elBar(c, {length: center ? 180 : 260, thickness: S.label * 0.32, color: C.accent, grow: center ? 'center' : 'start', delay: 6 + n * 3}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: width * 0.9, align: al, lh: 1.35, name: 'Sub'});
      els.push(sub);
      s.after(function () { rise(sub, 10 + n * 3); });
    }
    placeIn(vstack(els, S.label * 0.9, center ? 'center' : 'start', F.content.w), F.content, 'center');
  };

  function elDots(comp, chapter, bg) {
    var L = newShape(comp, 'Titik bab'), ws = [], total = 0, i;
    for (i = 0; i < chapter.total; i++) { ws.push(i === chapter.index ? 54 : 18); total += ws[i] + (i ? 14 : 0); }
    var x = -total / 2;
    for (i = 0; i < chapter.total; i++) {
      addRect(L, {w: ws[i], h: 18, x: x + ws[i] / 2, y: 0, r: 9, fill: i === chapter.index ? accentOn(bg) : mix(bgColor(bg), textColor(bg), 0.35), name: 'Titik ' + (i + 1)});
      x += ws[i] + 14;
    }
    var el = {w: total, h: 18, roots: [L]};
    el.place = function (x0, y0) { setPos(L, [x0 + total / 2, y0 + 9]); };
    return el;
  }

  B.bab = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg;
    background(c, bg);
    var nVal = has(p, 'number') ? p.number : (s.chapter ? s.chapter.index + 1 : '');
    var title = str(p.title, str(s.scene.onScreen, ''));
    var label = str(p.kicker, 'Bagian ' + nVal);
    var numTxt = String(nVal);
    if (numTxt.length < 2) numTxt = ('00' + numTxt).slice(-2);
    var big = elText(c, {text: numTxt, role: 'display800', size: S.big * (F.vertical ? 1.1 : 1.5), color: accentOn(bg), lh: 0.9, tracking: -40, align: 'left', name: 'Nomor bab'});
    s.after(function () { pop(big, 2); });
    var dots = (s.chapter && s.chapter.total > 1) ? elDots(c, s.chapter, bg) : null;
    if (dots) { dots.mt = S.label * 0.6; s.after(function () { rise(dots, 14); }); }
    var kick = kicker(c, label, bg);
    s.after(function () { rise(kick, 6); });
    if (F.vertical) {
      var size = fitSize(title, [S.title * 1.2, S.title, S.title * 0.85], F.content.w);
      var els = [big, kick];
      if (title) els.push(elText(c, {text: title, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: F.content.w, align: 'center', lh: 1.08, tracking: -10, pop: {delay: 10, stagger: 3}, name: 'Judul bab'}));
      if (p.sub) els.push(elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: F.content.w, align: 'center', lh: 1.35, name: 'Sub'}));
      els.push(dots);
      placeIn(vstack(els, S.label, 'center', F.content.w), F.content, 'center');
      return;
    }
    var avail = F.content.w - 166, leftW = avail * 0.3 / 0.92, rightW = avail * 0.62 / 0.92;
    var size2 = fitSize(title, [S.title * 1.2, S.title, S.title * 0.85], rightW);
    var col = [kick];
    if (title) col.push(elText(c, {text: title, role: 'display800', size: size2, color: textColor(bg), hi: hiColor(bg), width: rightW, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 10, stagger: 3}, name: 'Judul bab'}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: rightW, align: 'left', lh: 1.35, name: 'Sub'});
      col.push(sub);
      s.after(function () { rise(sub, 18); });
    }
    col.push(dots);
    var colEl = vstack(col, S.label * 0.8, 'start', rightW);
    var x0 = F.content.x, cy = F.content.y + F.content.h / 2;
    big.place(x0 + leftW - big.w, cy - big.h / 2);
    var dv = newShape(c, 'Pembatas');
    addRect(dv, {w: 6, h: F.content.h - 240, r: 3, fill: mix(bgColor(bg), textColor(bg), 0.25)});
    setPos(dv, [x0 + leftW + 83, cy]);
    colEl.place(x0 + leftW + 166, cy - colEl.h / 2);
  };

  B.poin = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg;
    background(c, bg);
    var text = str(s.scene.onScreen, str(p.title, ''));
    var width = F.vertical ? F.content.w - 58 : F.content.w * 0.78;
    var size = fitSize(text, [S.title * 1.1, S.title, S.title * 0.85, S.title * 0.72], width);
    var n = countWords(stripHi(text)), els = [];
    if (p.kicker) { var k = kicker(c, p.kicker, bg); els.push(k); s.after(function () { rise(k, 0); }); }
    if (text) els.push(elText(c, {text: text, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: width, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 4, stagger: 2}, name: 'Pernyataan'}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: width, align: 'left', lh: 1.35, name: 'Sub'});
      els.push(sub);
      s.after(function () { rise(sub, 8 + n * 2); });
    }
    var bar = elBar(c, {length: F.vertical ? 420 : 380, thickness: 14, color: C.accent, vertical: true, grow: 'center', delay: 2});
    placeIn(hstack([bar, vstack(els, S.label * 0.8, 'start', width)], 44), F.content, 'center');
  };

  function itemTimes(items, durSec, first) {
    first = isNum(first) ? first : 0.5;
    var n = items.length, step = Math.min(1.6, Math.max(0.35, (durSec - first - 1) / Math.max(1, n))), out = [];
    each(items, function (it, i) { out.push(isNum(it.at) ? it.at : first + i * step); });
    return out;
  }

  function elListRow(c, item, i, numbered, size, bg, width) {
    var light = bg === 'light', badge = size * 1.5, padX = size * 0.6, padY = size * 0.42, gap = size * 0.6;
    var textW = width - 2 * padX - badge - gap;
    var tx = elText(c, {text: item.text, role: 'body600', size: size, color: textColor(bg), hi: hiColor(bg), width: textW, align: 'left', lh: 1.25, name: 'Poin ' + (i + 1)});
    var cardH = Math.max(badge, tx.h) + 2 * padY;
    var card = newShape(c, 'Poin ' + (i + 1) + ' kartu');
    addRect(card, {w: width, h: cardH, r: X.radius * 0.7, fill: light ? C.white : mix(bgColor(bg), C.text, 0.08)});
    card.moveAfter(tx.layer);
    var bx = -width / 2 + padX + badge / 2;
    var bd = newShape(c, 'Poin ' + (i + 1) + ' lencana');
    addEllipse(bd, {w: badge, h: badge, fill: C.primary});
    setPos(bd, [bx, 0]);
    adopt(bd, card);
    if (numbered) {
      var nt = elText(c, {text: String(i + 1), role: 'display800', size: size * 0.8, color: C.text, align: 'center', name: 'Poin ' + (i + 1) + ' nomor'});
      setPos(nt.layer, [bx, 0]);
      adopt(nt.layer, card);
    } else {
      var ic = iconLayer(c, item.icon, size * 0.85, C.text, 2.2);
      setPos(ic, [bx, 0]);
      adopt(ic, card);
    }
    setPos(tx.layer, [-width / 2 + padX + badge + gap + tx.r.w / 2, 0]);
    adopt(tx.layer, card);
    var el = {w: width, h: cardH, roots: [card]};
    el.place = function (x, y) { setPos(card, [x + width / 2, y + cardH / 2]); };
    return el;
  }

  B.daftar = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg;
    background(c, bg);
    var items = [], anyIcon = false;
    each(isArr(p.items) ? p.items : [], function (it) {
      var o = (typeof it === 'string') ? {text: it} : obj(it);
      if (o.icon) anyIcon = true;
      items.push({text: str(o.text, ''), icon: o.icon, at: o.at});
    });
    var times = itemTimes(items, s.durSec);
    var title = str(s.scene.onScreen, str(p.title, ''));
    var numbered = has(p, 'numbered') ? !!p.numbered : !anyIcon;
    var many = items.length > 4;
    var itemSize = F.vertical ? (many ? S.body * 0.92 : S.body * 1.08) : (many ? S.body * 0.95 : S.body * 1.1);
    var leftW = F.content.w * 0.36, colGap = F.content.w * 0.06;
    var listW = F.vertical ? F.content.w : F.content.w - leftW - colGap;
    var rows = [];
    each(items, function (it, i) {
      var row = elListRow(c, it, i, numbered, itemSize, bg, listW);
      rows.push(row);
      s.after(function () { rise(row, Math.round(times[i] * fps()), 'right', 60); });
    });
    var list = vstack(rows, itemSize * (many ? 0.55 : 0.8), 'start', listW);
    var headW = F.vertical ? F.content.w : leftW;
    var size = fitSize(title, [S.title, S.title * 0.85, S.title * 0.72], headW);
    var head = [];
    if (p.kicker) head.push(kicker(c, p.kicker, bg));
    if (title) head.push(elText(c, {text: title, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: headW, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 0, stagger: 2}, name: 'Judul daftar'}));
    var header = head.length ? vstack(head, S.label * (F.vertical ? 0.6 : 0.7), 'start', headW) : null;
    if (F.vertical) {
      placeIn(vstack([header, list], S.label * 1.4, 'start', F.content.w), F.content, 'center');
      return;
    }
    var cy = F.content.y + F.content.h / 2;
    if (header) header.place(F.content.x, cy - header.h / 2);
    list.place(F.content.x + leftW + colGap, cy - list.h / 2);
  };

  /** "73%" -> {prefix, n, decimals, suffix, grouping} (sama dengan parseNumber di parse.ts), gagal -> null */
  function parseNumber(value) {
    if (typeof value === 'number') {
      var sv = String(value), dot = String(sv).indexOf('.');
      return {prefix: '', n: value, decimals: dot >= 0 ? sv.length - dot - 1 : 0, suffix: '', grouping: true};
    }
    var m = /^([^\d-]*)(-?[,.\d]+)(.*)$/.exec(String(value));
    if (!m) return null;
    var raw = m[2];
    var norm = raw.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
    var n = parseFloat(norm);
    if (!isNum(n)) return null;
    var di = String(norm).indexOf('.');
    return {prefix: m[1], n: n, decimals: di >= 0 ? norm.length - di - 1 : 0, suffix: m[3], grouping: /\.\d{3}/.test(raw)};
  }
  K.parseNumber = parseNumber;

  /** expression Source Text: hitung naik 0 -> nilai dalam 1 dtk (ease-out cubic), format Indonesia */
  function countUpExpr(pn, delaySec) {
    return 'var t=Math.min(1,Math.max(0,(time-' + r3(delaySec) + ')/1));var k=1-Math.pow(1-t,3);' +
      'var v=' + pn.n + '*k;var s=Math.abs(v).toFixed(' + pn.decimals + ');var parts=s.split(".");var ip=parts[0];' +
      (pn.grouping ? 'var o="";while(ip.length>3){o="."+ip.substr(ip.length-3)+o;ip=ip.substr(0,ip.length-3);}ip=ip+o;' : '') +
      'var neg=(v<0&&Number(s)!==0)?"-":"";' +
      jsonStr(pn.prefix) + '+neg+ip+(parts.length>1?","+parts[1]:"")+' + jsonStr(pn.suffix) + ';';
  }
  K.countUpExpr = countUpExpr;

  B.angka = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg, v = F.vertical;
    background(c, bg);
    var label = str(p.label, str(s.scene.onScreen, ''));
    var value = has(p, 'value') && p.value !== null ? String(p.value) : '';
    var bigSize = Math.min(S.big * (v ? 1 : 1.25), (v ? F.content.w : F.content.w * 0.5) / Math.max(2, value.length * 0.58));
    var numEl = elText(c, {text: value, role: 'display800', size: bigSize, color: accentOn(bg), lh: 1, tracking: -30, align: 'center', name: 'Angka'});
    var pn = parseNumber(has(p, 'value') ? p.value : '');
    if (pn) setExpr(textProp(numEl.layer), countUpExpr(pn, 4 / fps()));
    s.after(function () { pop(numEl, 2); });
    var textW = v ? F.content.w : F.content.w * 0.42, al = v ? 'center' : 'left';
    var lsize = fitSize(label, [S.title * 0.9, S.title * 0.75, S.title * 0.62], textW);
    var info = [];
    if (p.kicker) info.push(kicker(c, p.kicker, bg));
    if (label) info.push(elText(c, {text: label, role: 'display800', size: lsize, color: textColor(bg), hi: hiColor(bg), width: textW, align: al, lh: 1.08, tracking: -10, pop: {delay: 10, stagger: 2}, name: 'Label angka'}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: textW, align: al, lh: 1.35, name: 'Sub'});
      info.push(sub);
      s.after(function () { rise(sub, 16); });
    }
    if (p.source) {
      var src = elText(c, {text: 'Sumber: ' + p.source, role: 'body500', size: S.label * 0.8, color: muted(bg), width: textW, align: al, lh: 1.35, name: 'Sumber'});
      info.push(src);
      s.after(function () { rise(src, 20); });
    }
    var infoEl = vstack(info, S.label * 0.7, v ? 'center' : 'start', textW);
    if (v) {
      placeIn(vstack([numEl, infoEl], S.label, 'center', F.content.w), F.content, 'center');
      return;
    }
    var cy = F.content.y + F.content.h / 2, boxW = F.content.w * 0.52;
    numEl.place(F.content.x + (boxW - numEl.w) / 2, cy - numEl.h / 2);
    infoEl.place(F.content.x + F.content.w - textW, cy - infoEl.h / 2);
  };

  B.kutipan = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg;
    background(c, bg);
    var quote = str(p.quote, str(s.scene.onScreen, ''));
    var width = F.vertical ? F.content.w : F.content.w * 0.8;
    var size = fitSize(quote, [S.title * 0.95, S.title * 0.8, S.title * 0.66, S.title * 0.56], width);
    var mark = elText(c, {text: '\u201C', role: 'display800', size: S.big * 0.9, color: C.accent, align: 'left', name: 'Tanda kutip'});
    mark.h = S.big * 0.45;
    s.after(function () { pop(mark, 0); });
    var q = elText(c, {text: quote, role: 'display700', size: size, color: textColor(bg), hi: hiColor(bg), width: width, align: 'left', lh: 1.22, name: 'Kutipan'});
    s.after(function () { rise(q, 4); });
    var els = [mark, q];
    if (p.by) {
      var who = [elText(c, {text: p.by, role: 'body700', size: S.body * 0.9, color: textColor(bg), width: width - 94, align: 'left', lh: 1.3, name: 'Nama'})];
      if (p.role) who.push(elText(c, {text: p.role, role: 'body500', size: S.body * 0.9, color: mix(bgColor(bg), textColor(bg), bg === 'light' ? 0.65 : 0.7), width: width - 94, align: 'left', lh: 1.3, name: 'Keterangan'}));
      var byRow = hstack([elBar(c, {length: 70, thickness: 8, color: C.accent, grow: 'start', delay: 14}), vstack(who, 0, 'start', width - 94)], 24);
      els.push(byRow);
      s.after(function () { rise(byRow, 14); });
    }
    var col = vstack(els, S.label, 'start', width);
    placeIn(col, F.content, 'center', F.vertical ? 'start' : 'center');
  };

  /** kartu foto: precomp (foto berganti + zoom pelan) dengan mask sudut bulat */
  function elPhotoCard(c, s, w, h) {
    var p = s.p, bg = s.bg, raw = [];
    if (isArr(p.images) && p.images.length) raw = p.images;
    else if (p.image) raw = [p.image];
    var n = Math.max(1, raw.length), imgs = [];
    each(raw, function (im, i) {
      if (typeof im === 'string') imgs.push({src: im, at: i * s.durSec / n});
      else {
        var o = obj(im);
        imgs.push({src: o.src, at: isNum(o.at) ? o.at : i * s.durSec / n, text: o.text, focus: o.focus});
      }
    });
    w = Math.round(w);
    h = Math.round(h);
    var cp = newComp(s.name + ' kartu foto', w, h, c.duration, X.folders.adegan);
    cp.layers.addSolid(mix(bgColor(bg), C.text, 0.08), uname(cp, 'Latar kartu'), w, h, 1, cp.duration);
    var zoom = cp.layers.addNull(cp.duration);
    zoom.name = uname(cp, 'Zoom pelan');
    setPos(zoom, [w / 2, h / 2]);
    var labels = [], f8 = 8 / fps();
    each(imgs, function (im, i) {
      var next = imgs[i + 1], tIn = Math.max(0, im.at), tOut = next ? Math.min(cp.duration, next.at + f8) : cp.duration;
      if (tOut <= tIn) return;
      var item = importFile(im.src, 'foto'), list = [];
      if (item && item.width > 0) {
        var L = cp.layers.add(item);
        L.name = uname(cp, 'Foto ' + (i + 1));
        coverLayer(L, item, 0, 0, w, h, im.focus || p.focus);
        adopt(L, zoom);
        list.push(L);
      } else {
        var mb = missingBox(cp, 0, 0, w, h, 'FOTO TIDAK DITEMUKAN\r' + fileName(im.src || '(kosong)'));
        list.push(mb.layer, mb.text);
      }
      each(list, function (Lx) {
        Lx.inPoint = tIn;
        Lx.outPoint = tOut;
        if (i > 0) keys(tp(Lx, 'ADBE Opacity'), [[tIn, 0], [tIn + f8, 100]], null);
      });
      if (im.text) labels.push({text: im.text, tIn: tIn, tOut: tOut, fade: i > 0});
    });
    // zoom pelan 100 -> 108% sepanjang adegan (keyframe dipasang setelah parenting)
    keys(tp(zoom, 'ADBE Scale'), [[0, [100, 100]], [s.durSec, [108, 108]]], null);
    each(labels, function (lb) {
      var S = X.S;
      var pill = elPill(cp, {text: lb.text, role: 'body700', size: S.label, padX: S.label * 0.65, padY: S.label * 0.3, fill: C.accent, color: C.accentText, name: 'Label foto'});
      pill.place(28, h - 28 - pill.h);
      each([pill.layer, pill.shape], function (L) { L.inPoint = lb.tIn; L.outPoint = lb.tOut; });
      if (lb.fade) keys(tp(pill.layer, 'ADBE Opacity'), [[lb.tIn, 0], [lb.tIn + f8, 100]], null);
    });
    var L2 = c.layers.add(cp);
    L2.name = uname(c, 'Kartu foto');
    addMask(L2, 0, 0, w, h, X.radius, null);
    var el = {layer: L2, w: w, h: h, roots: [L2]};
    el.place = function (x, y) { setPos(L2, [x + w / 2, y + h / 2]); };
    return el;
  }

  B.foto = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg;
    background(c, bg);
    var title = str(s.scene.onScreen, str(p.title, ''));
    if (F.vertical) {
      var size = fitSize(title, [S.title * 0.9, S.title * 0.75, S.title * 0.62], F.content.w), header = null;
      if (title) {
        var hd = [];
        if (p.kicker) hd.push(kicker(c, p.kicker, bg));
        hd.push(elText(c, {text: title, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: F.content.w, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 0, stagger: 2}, name: 'Judul foto'}));
        header = vstack(hd, S.label * 0.5, 'start', F.content.w);
      }
      var gap = S.label * 0.8, cardH = F.content.h - (header ? header.h + gap : 0);
      var card = elPhotoCard(c, s, F.content.w, Math.max(200, cardH));
      s.after(function () { rise(card, 2); });
      vstack([header, card], gap, 'start', F.content.w).place(F.content.x, F.content.y);
      return;
    }
    var textW = F.content.w * 0.34, colGap = F.content.w * 0.04, side = !!(title || p.sub);
    var cardW = F.content.w - (side ? textW + colGap : 0);
    var card2 = elPhotoCard(c, s, cardW, F.content.h);
    card2.place(F.content.x, F.content.y);
    s.after(function () { rise(card2, 2, 'left'); });
    if (!side) return;
    var size2 = fitSize(title, [S.title * 0.9, S.title * 0.75, S.title * 0.62], textW), col = [];
    if (p.kicker) col.push(kicker(c, p.kicker, bg));
    if (title) col.push(elText(c, {text: title, role: 'display800', size: size2, color: textColor(bg), hi: hiColor(bg), width: textW, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 0, stagger: 2}, name: 'Judul foto'}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: textW, align: 'left', lh: 1.35, name: 'Sub'});
      col.push(sub);
      s.after(function () { rise(sub, 12); });
    }
    var colEl = vstack(col, S.label * 0.7, 'start', textW);
    colEl.place(F.content.x + cardW + colGap, F.content.y + (F.content.h - colEl.h) / 2);
  };

  /** satu panel banding: kartu (induk) + foto opsional + label + teks + lencana centang/silang */
  function elPanel(c, side, mark, bg, strong, markDelayF, w, h, s) {
    var F = X.spec, S = X.S, light = bg === 'light';
    var cardCol = light ? C.white : mix(bgColor(bg), C.text, 0.08), tcol = textColor(bg);
    var padY = S.label * 0.8, padX = S.label, innerW = w - 2 * padX;
    var card = newShape(c, 'Panel ' + s.sideName);
    addRect(card, {w: strong ? w - 6 : w, h: strong ? h - 6 : h, r: X.radius, fill: cardCol, stroke: strong ? C.accent : null, strokeW: 6});
    var kids = [], blk = [];
    if (side.label) blk.push(elText(c, {text: side.label, role: 'body800', size: S.label, upper: true, tracking: 60, color: strong ? (light ? C.primary : C.accent) : mix(cardCol, tcol, light ? 0.6 : 0.65), width: innerW, align: 'left', lh: 1.2, name: 'Label ' + s.sideName}));
    var fitW = F.vertical ? F.content.w * 0.8 : F.content.w * 0.4;
    var tsize = fitSize(side.text || '', [S.body * 1.3, S.body * 1.1, S.body * 0.95], fitW);
    blk.push(elText(c, {text: side.text || '', role: 'body700', size: tsize, color: tcol, hi: hiColor(bg), width: innerW, align: 'left', lh: 1.25, name: 'Teks ' + s.sideName}));
    var block = vstack(blk, S.label * 0.4, 'start', innerW);
    var blockH = block.h + 2 * padY;
    if (side.image) {
      var imgH = Math.max(40, h - blockH);
      var item = importFile(side.image, 'foto');
      if (item && item.width > 0) {
        var IL = c.layers.add(item);
        IL.name = uname(c, 'Foto ' + s.sideName);
        var sc = coverLayer(IL, item, -w / 2, -h / 2, w, imgH, null);
        var mw = w / sc, mh = imgH / sc;
        addMask(IL, item.width / 2 - mw / 2, item.height / 2 - mh / 2, mw, mh, X.radius / sc, null);
        kids.push(IL);
      } else {
        var mb = missingBox(c, -w / 2, -h / 2, w, imgH, 'FOTO TIDAK DITEMUKAN');
        kids.push(mb.layer, mb.text);
      }
      block.place(-w / 2 + padX, h / 2 - blockH + padY);
    } else {
      block.place(-w / 2 + padX, -block.h / 2);
    }
    each(block.roots, function (L) { kids.push(L); });
    if (mark) {
      var mb = S.label * 1.8;
      var bd = newShape(c, 'Tanda ' + s.sideName);
      addEllipse(bd, {w: mb, h: mb, fill: mark === 'good' ? C.accent : C.alert});
      var bpos = [w / 2 - 18 - mb / 2, -h / 2 + 18 + mb / 2];
      setPos(bd, bpos);
      var ic = iconLayer(c, mark === 'good' ? 'check' : 'x', S.label * 1.1, mark === 'good' ? C.accentText : C.white, 3);
      setPos(ic, bpos);
      adopt(ic, bd);
      kids.push(bd);
      s.after(function () { pop({roots: [bd]}, markDelayF); });
    }
    each(kids, function (L) { adopt(L, card); });
    var el = {w: w, h: h, roots: [card]};
    el.place = function (x, y) { setPos(card, [x + w / 2, y + h / 2]); };
    return el;
  }

  B.banding = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg, v = F.vertical;
    background(c, bg);
    var left = obj(p.left), right = obj(p.right);
    var reveal = Math.round((isNum(p.revealAt) ? p.revealAt : s.durSec * 0.4) * fps());
    var verdict = str(p.verdict, 'none');
    var title = str(s.scene.onScreen, str(p.title, ''));
    var tsize = fitSize(title, [S.title * 0.85, S.title * 0.72, S.title * 0.6], F.content.w);
    var hd = [];
    if (p.kicker) hd.push(kicker(c, p.kicker, bg));
    if (title) hd.push(elText(c, {text: title, role: 'display800', size: tsize, color: textColor(bg), hi: hiColor(bg), width: F.content.w, align: v ? 'left' : 'center', lh: 1.08, tracking: -10, pop: {delay: 0, stagger: 2}, name: 'Judul banding'}));
    var header = hd.length ? vstack(hd, S.label * 0.5, v ? 'start' : 'center', F.content.w) : null;
    var availH = F.content.h - (header ? header.h + S.label : 0), gap = S.label * 0.8;
    var pw = v ? F.content.w : (F.content.w - gap) / 2, ph = v ? (availH - gap) / 2 : availH;
    var markL = verdict === 'none' ? null : (verdict === 'left' ? 'good' : 'bad');
    var markR = verdict === 'none' ? null : (verdict === 'right' ? 'good' : 'bad');
    s.sideName = 'kiri';
    var pl = elPanel(c, left, markL, bg, false, 10, pw, ph, s);
    s.sideName = 'kanan';
    var pr = elPanel(c, right, markR, bg, verdict === 'right', reveal + 8, pw, ph, s);
    var panels = v ? vstack([pl, pr], gap, 'start', pw) : hstack([pl, pr], gap);
    vstack([header, panels], S.label, 'start', F.content.w).place(F.content.x, F.content.y);
    s.after(function () {
      rise(pl, 4, v ? 'below' : 'left');
      rise(pr, reveal, v ? 'below' : 'right');
    });
  };

  function elLogo(c, width, bg) {
    var lg = obj(X.brand.logo);
    if (lg.path) {
      var f = elFootage(c, lg.path, width, 'foto', 'Logo');
      if (f) return f;
    }
    return elText(c, {text: str(X.brand['short'], str(X.brand.name, 'Brand')), role: 'display800', size: width * 0.2, color: textColor(bg), tracking: -20, align: 'left', name: 'Logo (nama brand)'});
  }

  function endScreenGuide(c) {
    // panduan posisi elemen end screen YouTube (Outro.tsx EndScreenGuide): guide layer, tidak ikut render
    var L = newShape(c, 'PANDUAN END SCREEN (tidak dirender)');
    var F = X.spec, right = F.safe.left + (X.W - F.safe.left - F.safe.right), top = F.safe.top + 60;
    addRect(L, {w: 760, h: 428, x: right - 380, y: top + 214, r: 16, stroke: C.white, strokeW: 4, strokeOpacity: 60, name: 'Video / playlist'});
    addEllipse(L, {w: 200, h: 200, x: right - 660, y: top + 568, stroke: C.white, strokeW: 4, strokeOpacity: 60, name: 'Subscribe'});
    addRect(L, {w: 520, h: 200, x: right - 260, y: top + 568, r: 16, stroke: C.white, strokeW: 4, strokeOpacity: 60, name: 'Video kedua'});
    try { L.guideLayer = true; } catch (e) {}
    return L;
  }

  B.outro = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, bg = s.bg, v = F.vertical;
    background(c, bg);
    var cta = str(s.scene.onScreen, str(p.cta, ''));
    var handle = str(p.handle, str(X.brand.handle, '')), website = str(p.website, str(X.brand.website, ''));
    var full = {x: F.safe.left, y: F.safe.top, w: X.W - F.safe.left - F.safe.right, h: X.H - F.safe.top - F.safe.bottom};
    var logoW = num(obj(X.brand.logo).width, 360) * (v ? 1 : 0.8);
    var logo = elLogo(c, logoW, bg);
    s.after(function () { pop(logo, 0); });
    var pills = [];
    each(compact([handle, website]), function (t) {
      pills.push(elPill(c, {text: t, role: 'body700', size: S.body * 0.9, padX: S.body * 0.6, padY: S.body * 0.25, radius: S.body,
        fill: bg === 'brand' ? C.textOnBrand : C.accent, color: bg === 'brand' ? C.primary : C.accentText, name: 'Kontak'}));
    });
    var textW = v ? F.content.w : F.content.w * 0.42;
    var pillRow = pills.length ? wrapRow(pills, 16, textW, v ? 'center' : 'start') : null;
    if (pillRow) s.after(function () { rise(pillRow, 16); });
    var size = v ? fitSize(cta, [S.title * 1.1, S.title, S.title * 0.85], F.content.w) : fitSize(cta, [S.title, S.title * 0.85, S.title * 0.72], textW);
    var els = [logo];
    if (cta) els.push(elText(c, {text: cta, role: 'display800', size: size, color: textColor(bg), hi: hiColor(bg), width: textW, align: v ? 'center' : 'left', lh: 1.08, tracking: -10, pop: {delay: 6, stagger: 3}, name: 'Ajakan'}));
    if (p.sub) {
      var sub = elText(c, {text: p.sub, role: 'body500', size: S.body, color: muted(bg), hi: hiColor(bg), width: textW, align: v ? 'center' : 'left', lh: 1.35, name: 'Sub'});
      els.push(sub);
      if (!v) s.after(function () { rise(sub, 12); });
    }
    els.push(pillRow);
    if (v) {
      placeIn(vstack(els, S.label * 1.2, 'center', full.w), full, 'center');
      return;
    }
    var col = vstack(els, S.label * 0.9, 'start', textW);
    col.place(full.x, full.y + (full.h - col.h) / 2);
    endScreenGuide(c);
  };

  B.klip = function (c, s) {
    var F = X.spec, S = X.S, p = s.p, v = F.vertical;
    c.layers.addSolid(C.background, uname(c, 'Latar'), X.W, X.H, 1, c.duration);
    var item = p.src ? importFile(p.src, 'klip') : null;
    if (item && item.width > 0) {
      var L = c.layers.add(item);
      L.name = uname(c, 'Klip ' + fileName(p.src));
      coverLayer(L, item, 0, 0, X.W, X.H, p.focus);
      var st = Math.max(0, Math.round(num(p.start, 0) * fps())) / fps();
      L.startTime = -st;
      var left = num(item.duration, 0) - st;
      if (left < s.durSec - 0.05) warn('Klip ' + fileName(p.src) + ' tinggal ' + r3(left) + ' dtk setelah props.start, adegan ' + r3(s.durSec) + ' dtk: sisa adegan kosong. Majukan props.start atau pakai klip lebih panjang.');
      try { if (item.hasAudio) L.audioEnabled = p.audio === true; } catch (e) {}
    } else {
      missingBox(c, 0, 0, X.W, X.H, 'KLIP TIDAK DITEMUKAN\r' + fileName(p.src || '(props.src kosong)'));
    }
    var title = str(s.scene.onScreen, str(p.title, ''));
    if (title || p.kicker) {
      // gradasi gelap dari atas: alpha 0,78 -> 0 di 38% (Reels) / 45% (YouTube) tinggi layar
      var gEnd = X.H * (v ? 0.38 : 0.45);
      var G = c.layers.addSolid(C.background, uname(c, 'Gradasi atas'), X.W, X.H, 1, c.duration);
      addMask(G, -60, -X.H, X.W + 120, X.H + gEnd / 2, 0, [0, gEnd]);
      tp(G, 'ADBE Opacity').setValue(78);
      var width = v ? F.content.w : F.content.w * 0.6;
      var size = fitSize(title, [S.title * 0.85, S.title * 0.72, S.title * 0.6], width), hd = [];
      if (p.kicker) hd.push(kicker(c, p.kicker, 'dark'));
      if (title) hd.push(elText(c, {text: title, role: 'display800', size: size, color: C.text, hi: C.accent, width: width, align: 'left', lh: 1.08, tracking: -10, pop: {delay: 0, stagger: 2}, name: 'Judul klip'}));
      vstack(hd, S.label * 0.5, 'start', width).place(F.content.x, F.safe.top + (v ? 20 : 10));
    }
    if (p.text) {
      var pill = elPill(c, {text: p.text, role: 'body700', size: S.label, padX: S.label * 0.65, padY: S.label * 0.3, fill: C.accent, color: C.accentText, name: 'Label klip'});
      pill.place(F.content.x, F.content.y + F.content.h - S.label * 2);
      s.after(function () { rise(pill, 6); });
    }
  };

  /** cap merah [KONFIRMASI] (Frame.tsx ConfirmStamp) */
  function confirmStamp(c) {
    var F = X.spec, v = F.vertical, size = v ? 40 : 34;
    var st = elPill(c, {text: '[KONFIRMASI]', role: 'body800', size: size, tracking: 60, padX: 20, padY: 8, radius: 14, fill: C.white, fillOpacity: 92,
      color: C.alert, stroke: C.alert, strokeW: 6, name: 'KONFIRMASI'});
    st.place(X.W - F.safe.right - 10 - st.w, F.safe.top - (v ? 40 : 30));
    tp(st.layer, 'ADBE Rotate Z').setValue(-6);
  }

  function failPlaceholder(c, type, msg) {
    try {
      var t = makeText(c, {text: 'GAGAL: ' + type + ' ' + msg, role: 'body700', size: 44, color: C.alert, width: X.W * 0.8, align: 'center', name: 'GAGAL'});
      setPos(t.layer, [X.W / 2, X.H / 2]);
    } catch (e) {}
  }

  // =================================================================== rencana adegan (Video.tsx planScenes)

  function planScenes() {
    var scenes = X.D.script.scenes || [], out = [], nb = 0, bi = 0, i;
    var dflt = str(obj(X.brand.motion).transition, 'slide');
    for (i = 0; i < scenes.length; i++) if (scenes[i].type === 'bab') nb++;
    for (i = 0; i < scenes.length; i++) {
      var sc = scenes[i], type = has(B, sc.type) ? sc.type : 'poin';
      if (type !== sc.type) warn('adegan ' + sc.id + ': tipe "' + sc.type + '" tidak dikenal, dibuat sebagai poin.');
      var from = Math.round(num(sc.start, 0) * X.fps);
      var dur = Math.max(1, Math.round(num(sc.end, 0) * X.fps) - from);
      var tr = i === 0 ? 'cut' : str(sc.transition, dflt);
      if (!inList(['slide', 'fade', 'wipe', 'cut'], tr)) { warn('adegan ' + sc.id + ': transisi "' + tr + '" tidak dikenal, dipakai cut.'); tr = 'cut'; }
      var p = obj(sc.props), bg = inList(['dark', 'light', 'brand'], p.bg) ? p.bg : (DEFAULT_BG[type] || 'dark');
      out.push({scene: sc, type: type, i: i, from: from, dur: dur, tail: 0, tr: tr, bg: bg,
        name: 'S' + pad2(i + 1) + ' ' + type, chapter: type === 'bab' ? {index: bi++, total: nb} : null});
    }
    for (i = 0; i < out.length - 1; i++) if (out[i + 1].tr === 'slide' || out[i + 1].tr === 'fade') out[i].tail = X.TF;
    return out;
  }

  function buildScenes(main, plan) {
    each(plan, function (pl) {
      var res = {id: pl.scene.id, type: pl.type, comp: pl.name, start: r3(pl.from / X.fps), end: r3((pl.from + pl.dur) / X.fps), transition: pl.tr, status: 'ok', warnings: []};
      X.scenes.push(res);
      X.cur = res;
      var pre = newComp(pl.name, X.W, X.H, (pl.dur + pl.tail) / X.fps, X.folders.adegan);
      var later = [];
      var ctx = {scene: pl.scene, p: obj(pl.scene.props), bg: pl.bg, type: pl.type, durF: pl.dur, durSec: pl.dur / X.fps, chapter: pl.chapter, name: pl.name,
        after: function (fn) { later.push(fn); }};
      try {
        B[pl.type](pre, ctx);
        each(later, function (fn) { fn(); });
        if (pl.scene.needsConfirm) confirmStamp(pre);
      } catch (e) {
        res.status = 'gagal';
        res.error = errText(e);
        X.errors.push('adegan ' + pl.scene.id + ' (' + pl.type + '): ' + res.error);
        failPlaceholder(pre, pl.type, res.error);
      }
      X.cur = null;
      var L = main.layers.add(pre);
      L.name = pl.name;
      L.startTime = pl.from / X.fps;
      var t0 = pl.from / X.fps, t1 = (pl.from + X.TF) / X.fps;
      if (pl.tr === 'slide') {
        var c0 = [X.W / 2, X.H / 2];
        keys(tp(L, 'ADBE Position'), [[t0, X.spec.vertical ? [c0[0], c0[1] + X.H] : [c0[0] + X.W, c0[1]]], [t1, c0]], EZ.enter);
      } else if (pl.tr === 'fade') {
        keys(tp(L, 'ADBE Opacity'), [[t0, 0], [t1, 100]], EZ.enter);
      }
    });
  }

  // =================================================================== caption (Caption.tsx)

  function spreadWords(text, startMs, endMs) {
    var toks = [], ws = [], total = 0, out = [];
    each(String(text || '').split(/\s+/), function (t) { if (t !== '') toks.push(t); });
    if (!toks.length) return out;
    each(toks, function (t) {
      var w = Math.max(2, lettersOnly(t).length) + 1 + (/[.,!?;:]$/.test(t) ? 2 : 0);
      ws.push(w);
      total += w;
    });
    var t0 = startMs;
    each(toks, function (tok, i) {
      var d = (endMs - startMs) * ws[i] / total;
      out.push({text: tok, startMs: Math.round(t0), endMs: Math.round(t0 + d)});
      t0 += d;
    });
    return out;
  }
  function wordsFromScenes(scenes) {
    var out = [];
    each(scenes, function (s) {
      if (!s.vo) return;
      each(spreadWords(s.vo, num(s.start, 0) * 1000 + 200, num(s.end, 0) * 1000 - 300), function (w) { out.push(w); });
    });
    return out;
  }
  function pageWords(words, max) {
    var pages = [], cur = [];
    each(words, function (w, i) {
      var prev = words[i - 1], gap = prev ? w.startMs - prev.endMs : 0, punct = prev && /[.,!?;:]$/.test(prev.text);
      if (cur.length && (cur.length >= max || gap > 500 || punct)) { pages.push(cur); cur = []; }
      cur.push(w);
    });
    if (cur.length) pages.push(cur);
    return pages;
  }
  function sameText(a, b) {
    var n = function (s) { return trim(stripHi(s || '').toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/g, ' ')); };
    return !!(a && b) && n(a) === n(b);
  }

  function buildCaptions(main, plan) {
    var sc = X.D.script;
    if (sc.captions === false) { X.captions = {count: 0, style: 'mati (script.captions = false)'}; return; }
    var words = (isArr(sc.words) && sc.words.length) ? sc.words : wordsFromScenes(sc.scenes);
    var cfg = obj(X.spec.caption), F = X.spec, S = X.S;
    var style = cfg.style === 'subtitle' || cfg.style === 'karaoke' ? cfg.style : (F.vertical ? 'karaoke' : 'subtitle');
    var maxW = num(cfg.maxWords, F.vertical ? 4 : 8), onHook = cfg.onHook !== false;
    var spans = [];
    each(plan, function (pl) {
      var forced = obj(pl.scene.props).caption;
      var auto = !(pl.type === 'outro' || (pl.type === 'hook' && !onHook) || sameText(pl.scene.onScreen, pl.scene.vo));
      spans.push({fromMs: pl.from / X.fps * 1000, toMs: (pl.from + pl.dur) / X.fps * 1000, on: forced ? forced === 'on' : auto, light: pl.bg === 'light'});
    });
    var pages = pageWords(words, maxW), count = 0, f = X.fps;
    each(pages, function (pg, i) {
      var next = pages[i + 1];
      var a = pg[0].startMs, b = Math.min(next ? next[0].startMs : BIG, pg[pg.length - 1].endMs + 500);
      each(spans, function (sp) {
        if (!sp.on) return;
        var a2 = Math.max(a, sp.fromMs), b2 = Math.min(b, sp.toMs);
        var inT = Math.ceil(a2 * f / 1000 - 1e-6) / f, outT = Math.ceil(b2 * f / 1000 - 1e-6) / f;
        if (outT <= inT) return;
        count++;
        if (style === 'subtitle') subtitleLayer(main, pg, inT, outT, count);
        else karaokeLayer(main, pg, inT, outT, count, sp.light);
      });
    });
    X.captions = {count: count, style: style, maxWords: maxW, onHook: onHook};
  }

  function pageText(pg) { var t = []; each(pg, function (w) { t.push(stripHi(w.text)); }); return t.join(' '); }
  function capName(n) { var s = String(n); while (s.length < 3) s = '0' + s; return 'Caption ' + s; }

  function karaokeLayer(main, pg, inT, outT, n, light) {
    var F = X.spec, S = X.S, size = S.caption;
    var el = elText(main, {text: pageText(pg), role: 'display800', size: size, color: light ? C.textOnLight : C.text, width: F.content.w, align: 'center', lh: 1.18,
      stroke: light ? null : {color: C.background, width: Math.round(size * 0.14)}, name: capName(n)});
    el.place(F.content.x, F.captionY);
    var L = el.layer;
    // kata aktif = warna accent. Waktu tiap kata (detik comp utama) ada di expression, bisa diedit.
    var st = [], en = [];
    each(pg, function (w, i) {
      st.push(r3(w.startMs / 1000));
      en.push(r3((pg[i + 1] ? pg[i + 1].startMs : w.endMs + 500) / 1000));
    });
    addAnimator(L, 'Kata aktif', 'ADBE Text Fill Color', c4(C.accent), 3,
      'var s=[' + st.join(',') + '];var e=[' + en.join(',') + '];var i=textIndex-1;var t=time;' +
      'var on=(i<s.length&&t>=s[i]&&t<e[i])?1:0;selectorValue*on;');
    L.inPoint = inT;
    L.outPoint = outT;
    if (Math.abs(inT - pg[0].startMs / 1000) < 1 / X.fps + 0.001) keys(tp(L, 'ADBE Scale'), [[inT, [94, 94]], [inT + 0.12, [100, 100]]], EZ.out);
  }

  function subtitleLayer(main, pg, inT, outT, n) {
    var F = X.spec, size = X.S.caption, boxW = F.content.w * 0.82, px = size * 0.5, py = size * 0.3;
    var el = elText(main, {text: pageText(pg), role: 'body600', size: size, color: C.white, width: boxW, align: 'center', lh: 1.3, name: capName(n)});
    el.place(F.content.x + (F.content.w - boxW) / 2, F.captionY + py);
    var L = el.layer, r = el.r;
    var S2 = newShape(main, capName(n) + ' kotak');
    var gi = addRect(S2, {w: r.w + 2 * px, h: r.h + 2 * py, x: r.l + r.w / 2, y: r.t + r.h / 2, r: 12, fill: C.black, fillOpacity: 62});
    S2.moveAfter(L);
    S2.parent = L;
    setAnchor(S2, [0, 0]);
    setPos(S2, [0, 0]);
    if (X.feat.sourceRect) {
      setExpr(rectProp(S2, gi, 'ADBE Vector Rect Size'), 'var r=thisLayer.parent.sourceRectAtTime(time,false);[r.width+' + r3(2 * px) + ',r.height+' + r3(2 * py) + '];');
      setExpr(rectProp(S2, gi, 'ADBE Vector Rect Position'), 'var r=thisLayer.parent.sourceRectAtTime(time,false);[r.left+r.width/2,r.top+r.height/2];');
    }
    L.inPoint = inT;
    L.outPoint = outT;
    S2.inPoint = inT;
    S2.outPoint = outT;
  }

  // =================================================================== transisi wipe (WipeOverlay)

  function buildWipes(main, plan) {
    var n = 0;
    each(plan, function (pl) {
      if (pl.tr !== 'wipe') return;
      var f0 = Math.max(0, pl.from - X.TF), t0 = f0 / X.fps, tm = (f0 + X.TF) / X.fps, t1 = (f0 + 2 * X.TF) / X.fps;
      var L = newShape(main, 'Wipe ' + pl.name);
      addRect(L, {w: X.W, h: X.H, x: X.W / 2, y: X.H / 2, fill: C.primary, name: 'Panel'});
      addRect(L, {w: 24, h: X.H, x: X.W + 12, y: X.H / 2, fill: C.accent, name: 'Garis'});
      L.inPoint = t0;
      L.outPoint = Math.min(main.duration, t1);
      keys(tp(L, 'ADBE Position'), [[t0, [-X.W, 0]], [tm, [0, 0]], [t1, [X.W, 0]]], [EZ.inout, EZ.inout]);
      n++;
    });
    return n;
  }

  // =================================================================== suara

  function levels(L) { return L.property('ADBE Audio Group').property('ADBE Audio Levels'); }
  function dB(v) { return v > 0 ? 20 * Math.log(v) / Math.LN10 : -96; }

  function buildAudio(main, plan) {
    var sc = X.D.script, f = X.fps, out = {vo: 0, sfx: 0, music: false};
    var clips = isArr(sc.clips) ? sc.clips : [];
    each(clips, function (cl) {
      var item = importFile(cl.src, 'suara');
      if (!item) return;
      var L = main.layers.add(item);
      L.name = uname(main, 'Suara ' + cl.sceneId);
      L.startTime = num(cl.start, 0);
      var outT = num(cl.start, 0) + (Math.ceil(num(cl.duration, 0) * f) + 2) / f;
      if (outT < L.outPoint) L.outPoint = outT;
      out.vo++;
    });
    each(plan, function (pl) {
      each(isArr(pl.scene.sfx) ? pl.scene.sfx : [], function (fx) {
        fx = obj(fx);
        var item = importFile(fx.src, 'suara');
        if (!item) return;
        var L = main.layers.add(item);
        L.name = uname(main, 'SFX ' + pl.name + ' ' + fileName(fx.src));
        L.startTime = (pl.from + Math.round(num(fx.at, 0) * f)) / f;
        var db = dB(num(fx.volume, 0.5));
        try { levels(L).setValue([db, db]); } catch (e) { warn('Volume SFX ' + fileName(fx.src) + ' tidak bisa diatur: ' + errText(e)); }
        out.sfx++;
      });
    });
    var m = sc.music;
    if (m && m.src) {
      var item = importFile(m.src, 'suara');
      if (item && item.duration > 0) {
        // musik diulang di precomp "Musik" sepanjang video, ducking di comp utama
        var mc = newComp('Musik', 64, 64, main.duration, X.folders.suara), k = 0;
        for (var t = 0; t < main.duration && k < 500; t += item.duration, k++) {
          var ML = mc.layers.add(item);
          ML.startTime = t;
        }
        var L = main.layers.add(mc);
        L.name = uname(main, 'Musik');
        try { L.enabled = false; } catch (e0) {}
        var base = dB(num(m.volume, num(obj(X.brand.audio).musicVolume, 0.5))), low = base + num(obj(X.brand.audio).musicDuckDb, -18);
        var ranges = [], sorted = clips.slice(0);
        sorted.sort(function (a, b) { return num(a.start, 0) - num(b.start, 0); });
        each(sorted, function (cl) {
          var a = Math.round(num(cl.start, 0) * f), b = Math.round((num(cl.start, 0) + num(cl.duration, 0)) * f), last = ranges[ranges.length - 1];
          if (last && a - last[1] < 1.5 * f) last[1] = Math.max(last[1], b);
          else ranges.push([a, b]);
        });
        var R = 8, kl = [[0, [base, base]]];
        each(ranges, function (r) {
          var a0 = Math.max(0, r[0] - R);
          if (a0 > kl[kl.length - 1][0] * f) kl.push([a0 / f, [base, base]]);
          kl.push([Math.max(r[0], 1) / f, [low, low]]);
          kl.push([r[1] / f, [low, low]]);
          kl.push([(r[1] + R) / f, [base, base]]);
        });
        try {
          if (kl.length > 1) keys(levels(L), kl, null);
          else levels(L).setValue([base, base]);
        } catch (e1) { warn('Ducking musik tidak bisa dipasang: ' + errText(e1)); }
        out.music = true;
      }
    }
    return out;
  }

  // =================================================================== marker, catatan, frame, simpan

  function buildGuide(main, plan) {
    var sc = X.D.script, conf = [];
    each(plan, function (pl) { if (pl.scene.needsConfirm) conf.push(pl.scene.id); });
    var lines = [
      'CATATAN AEKIT (layer panduan, tidak ikut render)',
      'Judul: ' + str(sc.title, '-'),
      'Nomor: ' + str(sc.number, '-') + ' | Format: ' + X.D.format + ' ' + X.W + 'x' + X.H + ' ' + X.fps + ' fps',
      'Script: ' + str(sc._file, '-'),
      'Adegan: ' + plan.length + ' | Durasi: ' + timecode(main.duration),
      sc.demo ? 'DEMO: tidak untuk tayang' : '',
      conf.length ? '[KONFIRMASI] di adegan ' + conf.join(', ') + ': belum boleh tayang' : '',
      'Dibuat ' + isoNow() + ' oleh aekit.jsx ' + K.version + '. Build ulang membuat file .aep baru, file lama tidak ditimpa.'
    ];
    var t = makeText(main, {text: compact(lines).join('\r'), role: 'body500', size: X.spec.vertical ? 30 : 26, color: C.white, width: X.W * 0.8, align: 'left', lh: 1.3, name: 'CATATAN'});
    setAnchor(t.layer, [0, 0]);
    setPos(t.layer, [X.spec.safe.left, X.spec.safe.top]);
    try { t.layer.guideLayer = true; } catch (e) {}
    try { t.layer.enabled = false; } catch (e2) {}
    try { t.layer.comment = 'Dibuat otomatis oleh aekit.jsx'; } catch (e3) {}
    return t.layer;
  }

  function buildMarkers(main, plan, guide) {
    var mp = null, count = 0;
    try { mp = main.markerProperty || null; } catch (e) { mp = null; }
    X.feat.markerProperty = !!mp;
    if (!mp) {
      mp = guide.property('ADBE Marker');
      warnOnce('marker', 'CompItem.markerProperty tidak ada: marker adegan ditaruh di layer CATATAN.');
    }
    var byF = {}, order = [];
    var add = function (fr, text, durF, chapter) {
      var k = 'f' + fr;
      if (!byF[k]) { byF[k] = {f: fr, parts: [], dur: 0, chapter: null}; order.push(byF[k]); }
      if (text) byF[k].parts.push(text);
      if (durF && !byF[k].dur) byF[k].dur = durF;
      if (chapter) byF[k].chapter = chapter;
    };
    each(plan, function (pl) { add(pl.from, pl.name + ' (' + str(pl.scene.id, '') + ')', pl.dur, null); });
    var chapters = [];
    if (X.D.format === 'youtube') {
      each(plan, function (pl) {
        if (pl.type !== 'bab') return;
        var p = obj(pl.scene.props);
        chapters.push({f: pl.from, title: trim(stripHi(str(p.title, str(pl.scene.onScreen, 'Bab ' + str(p.number, '')))))});
      });
      if (!chapters.length || chapters[0].f > 0.5 * X.fps) chapters.unshift({f: 0, title: str(X.D.script.chapterIntro, 'Pembuka')});
      else chapters[0].f = 0;
      each(chapters, function (ch) { add(ch.f, 'BAB: ' + ch.title, 0, ch.title); });
    }
    each(order, function (o) {
      try {
        var mv = new MarkerValue(o.parts.join(' | '));
        if (o.chapter) mv.chapter = o.chapter;
        if (o.dur) { try { mv.duration = o.dur / X.fps; } catch (e1) {} }
        mp.setValueAtTime(o.f / X.fps, mv);
        count++;
      } catch (e2) { warnOnce('markerset', 'Marker gagal dipasang: ' + errText(e2)); }
    });
    return {count: count, chapters: chapters.length};
  }

  function exportFrames(main, plan) {
    var out = [];
    if (!obj(X.D.options).frames) return out;
    if (!hasFn(main, 'saveFrameToPng')) { warn('CompItem.saveFrameToPng tidak ada di AE ini: frame PNG tidak dibuat.'); return out; }
    var dir = new Folder(X.D.paths.frames);
    if (!dir.exists) dir.create();
    each(plan, function (pl) {
      var f = new File(X.D.paths.frames + '/' + pad2(pl.i + 1) + '-' + pl.type + '.png');
      try { main.saveFrameToPng((pl.from + pl.dur / 2) / X.fps, f); out.push(f.fsName); } catch (e) { warnOnce('png', 'saveFrameToPng gagal: ' + errText(e)); }
    });
    return out;
  }

  function saveProject() {
    var path = X.D.paths.aep, f = new File(path);
    if (f.exists && !obj(X.D.options).overwrite) {
      var base = String(path).replace(/\.aep$/i, ''), alt = null;
      for (var i = 2; i < 200 && !alt; i++) { var g = new File(base + '-v' + i + '.aep'); if (!g.exists) alt = g; }
      if (!alt) alt = new File(base + '-' + new Date().getTime() + '.aep');
      warn(f.name + ' sudah ada dan tidak ditimpa. Proyek disimpan sebagai ' + alt.name + '.');
      f = alt;
    }
    if (!f.parent.exists) f.parent.create();
    app.project.save(f);
    X.saved = f.fsName;
  }

  function writeText(path, s) {
    var f = new File(path);
    if (!f.parent.exists) f.parent.create();
    f.encoding = 'UTF-8';
    if (!f.open('w')) throw new Error('tidak bisa menulis ' + path);
    f.write(s);
    f.close();
  }

  function prefFileWrite() {
    var secs = ['Main Pref Section v2', 'Main Pref Section'], key = 'Pref_SCRIPTING_FILE_NETWORK_SECURITY';
    for (var i = 0; i < secs.length; i++) {
      try { return app.preferences.getPrefAsLong(secs[i], key); } catch (e) {}
      try { return app.preferences.getPrefAsLong(secs[i], key, PREFType.PREF_Type_MACHINE_SPECIFIC); } catch (e2) {}
    }
    return null;
  }

  function checkFonts() {
    var f = obj(X.D.fonts), seen = {}, rep = [];
    for (var role in f) {
      if (!has(f, role) || typeof f[role] !== 'string' || role.charAt(0) === '_') continue;
      var ps = f[role], ok = null;
      if (seen[ps]) continue;
      seen[ps] = true;
      if (X.feat.appFonts) {
        try { var list = app.fonts.getFontsByPostScriptName(ps); ok = !!(list && list.length); } catch (e) { ok = null; }
      }
      rep.push({role: role, postScriptName: ps, terpasang: ok});
      if (ok === false) warn('Font ' + ps + ' belum terpasang di PC ini. AE memakai font pengganti; pasang fontnya lalu build ulang.');
    }
    return rep;
  }

  function detect() {
    var F = X.feat;
    try { var td = new TextDocument('x'); F.characterRange = hasFn(td, 'characterRange'); } catch (e) { F.characterRange = false; }
    try { F.appFonts = !!(app.fonts && hasFn(app.fonts, 'getFontsByPostScriptName')); } catch (e2) { F.appFonts = false; }
    try { F.expressionEngine = String(app.project.expressionEngine); } catch (e3) {}
  }

  function setup(D) {
    var fmt = D.format === 'youtube' ? 'youtube' : 'reels', sp = obj(D.spec);
    X.D = D;
    X.brand = obj(D.brand);
    C = setupColors(X.brand);
    X.spec = sp;
    X.W = num(sp.width, fmt === 'youtube' ? 1920 : 1080);
    X.H = num(sp.height, fmt === 'youtube' ? 1080 : 1920);
    X.fps = num(sp.fps, 30);
    var dS = fmt === 'youtube' ? {hook: 104, title: 80, body: 44, caption: 50, label: 32, big: 220} : {hook: 118, title: 86, body: 50, caption: 70, label: 38, big: 240};
    X.S = {};
    for (var k in dS) if (has(dS, k)) X.S[k] = num(obj(sp.size)[k], dS[k]);
    X.TF = Math.max(1, Math.round(num(obj(X.brand.motion).transitionFrames, 14)));
    X.radius = num(obj(X.brand.radius).card, 32);
    if (!sp.content || !sp.safe) throw new Error('DATA.spec belum lengkap (content/safe kosong)');
  }

  function makeFolders() {
    var names = {comp: '01 Comp', adegan: '02 Adegan', suara: '03 Suara', foto: '04 Foto', klip: '05 Klip'};
    X.folders = {};
    for (var k in names) if (has(names, k)) X.folders[k] = app.project.items.addFolder(names[k]);
  }

  // =================================================================== build

  K.build = function (DATA) {
    var t0 = new Date().getTime(), undo = false, main = null, plan = [], audio = null, markers = null;
    X = {D: DATA || {}, warnings: [], warnSeen: {}, errors: [], scenes: [], feat: {}, cache: {}, names: {}, folders: {}, cur: null, saved: null, hiMode: null, captions: null, frames: []};
    try {
      if (!DATA || !DATA.script || !isArr(DATA.script.scenes)) throw new Error('DATA tidak lengkap: butuh DATA.script.scenes');
      setup(DATA);
      X.feat.prefScriptsWriteFiles = prefFileWrite();
      // uji tulis lebih dulu: tanpa izin tulis, hasil build tidak bisa dibaca ae/build.mjs
      var rp0 = obj(DATA.paths).result;
      if (rp0) {
        try { writeText(rp0, '{"status": "berjalan", "runId": ' + jsonStr(str(DATA.runId, '')) + '}\n'); } catch (ew0) {
          var msg = 'AEKIT tidak bisa menulis file (' + errText(ew0) + ').\n' +
            'Nyalakan Edit > Preferences > Scripting & Expressions > "Allow Scripts to Write Files and Access Network", lalu jalankan ulang.';
          try { alert(msg); } catch (ea) {}
          throw new Error(msg);
        }
      }
      var proj = app.newProject();
      if (!proj) throw new Error('Proyek baru dibatalkan (dialog simpan proyek lama ditutup). Simpan dulu proyekmu, lalu jalankan ulang.');
      app.beginUndoGroup('AEKIT build');
      undo = true;
      detect();
      makeFolders();
      X.fontReport = checkFonts();
      plan = planScenes();
      if (!plan.length) throw new Error('script tidak punya adegan');
      var last = 0;
      each(plan, function (pl) { last = Math.max(last, pl.from + pl.dur, Math.ceil(num(pl.scene.end, 0) * X.fps - 1e-6)); });
      main = newComp(str(obj(DATA.names).main, String(DATA.format).toUpperCase() + ' video'), X.W, X.H, last / X.fps, X.folders.comp);
      buildScenes(main, plan);
      try { buildCaptions(main, plan); } catch (ec) { X.errors.push('caption: ' + errText(ec)); }
      try { buildWipes(main, plan); } catch (ew) { X.errors.push('transisi wipe: ' + errText(ew)); }
      try { audio = buildAudio(main, plan); } catch (eu) { X.errors.push('suara: ' + errText(eu)); }
      var guide = null;
      try { guide = buildGuide(main, plan); } catch (eg) { warn('layer CATATAN gagal: ' + errText(eg)); }
      try { markers = buildMarkers(main, plan, guide); } catch (em) { warn('marker gagal: ' + errText(em)); }
      try { main.openInViewer(); } catch (eo) {}
      try { X.frames = exportFrames(main, plan); } catch (ef) { warn('frame PNG gagal: ' + errText(ef)); }
      saveProject();
    } catch (e) {
      X.errors.push(errText(e));
    }
    if (undo) { try { app.endUndoGroup(); } catch (eu2) {} }
    var res = {
      status: X.errors.length ? 'error' : 'ok',
      kit: 'aekit',
      version: K.version,
      runId: str(obj(DATA).runId, ''),
      aeVersion: (function () { try { return String(app.version); } catch (e) { return null; } })(),
      aeBuild: (function () { try { return String(app.buildName); } catch (e) { return null; } })(),
      os: (function () { try { return String($.os); } catch (e) { return null; } })(),
      selesai: isoNow(),
      seconds: r3((new Date().getTime() - t0) / 1000),
      project: X.saved,
      mainComp: main ? main.name : null,
      format: X.D.format,
      size: [X.W, X.H],
      fps: X.fps,
      duration: main ? r3(main.duration) : null,
      scenes: X.scenes,
      captions: X.captions,
      audio: audio,
      markers: markers,
      frames: X.frames,
      highlight: X.hiMode,
      fonts: X.fontReport || [],
      features: X.feat,
      warnings: X.warnings,
      errors: X.errors
    };
    var rp = obj(X.D.paths).result;
    if (rp) {
      try { writeText(rp, toJSON(res) + '\n'); } catch (ew2) {
        try { alert('AEKIT: hasil build tidak bisa ditulis ke ' + rp + '\n' + errText(ew2)); } catch (ea2) {}
      }
    }
    return res;
  };

  return K;
})();
