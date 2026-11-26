// bedah-proyek.jsx · membaca project After Effects yang sedang terbuka TANPA mengubahnya,
// lalu menulis ringkasan gaya kerja editor ke ae/proyek/_bedah/bedah-<nama>.json.
// Jalankan: File > Scripts > Run Script File... (atau node ae/build.mjs --bedah kalau tersedia).
// ExtendScript (ES3): tanpa let/const/arrow/JSON bawaan.
(function () {
  var MAX_EXPR = 300; // potong teks expression yang panjang
  var MAX_DEPTH = 6;

  function esc(s) {
    s = String(s);
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      var code = s.charCodeAt(i);
      if (c === '"') out += '\\"';
      else if (c === '\\') out += '\\\\';
      else if (c === '\n') out += '\\n';
      else if (c === '\r') out += '\\r';
      else if (c === '\t') out += '\\t';
      else if (code < 32) out += ' ';
      else out += c;
    }
    return out;
  }
  function stringify(v, ind) {
    ind = ind || '';
    var next = ind + '  ';
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'number') return isFinite(v) ? String(v) : 'null';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'string') return '"' + esc(v) + '"';
    if (v instanceof Array) {
      if (!v.length) return '[]';
      var a = [];
      for (var i = 0; i < v.length; i++) a.push(next + stringify(v[i], next));
      return '[\n' + a.join(',\n') + '\n' + ind + ']';
    }
    var parts = [];
    for (var k in v) if (v.hasOwnProperty(k)) parts.push(next + '"' + esc(k) + '": ' + stringify(v[k], next));
    return parts.length ? '{\n' + parts.join(',\n') + '\n' + ind + '}' : '{}';
  }
  function layerKind(l) {
    try {
      if (l instanceof TextLayer) return 'teks';
      if (l instanceof ShapeLayer) return 'shape';
      if (l instanceof CameraLayer) return 'kamera';
      if (l instanceof LightLayer) return 'cahaya';
      if (l.nullLayer) return 'null';
      if (l.adjustmentLayer) return 'adjustment';
      if (l.source && l.source instanceof CompItem) return 'precomp';
      if (l.source && l.source.mainSource && l.source.mainSource instanceof SolidSource) return 'solid';
      if (l.hasAudio && !l.hasVideo) return 'audio';
      return 'footage';
    } catch (e) {
      return 'lain';
    }
  }
  // telusuri properti: kumpulkan expression dan jumlah keyframe
  function walk(prop, depth, acc) {
    if (depth > MAX_DEPTH || !prop) return;
    try {
      if (prop.propertyType === PropertyType.PROPERTY) {
        if (prop.numKeys && prop.numKeys > 0) acc.keyframes += prop.numKeys;
        if (prop.canSetExpression && prop.expressionEnabled && prop.expression) {
          var ex = String(prop.expression);
          acc.expressions.push({properti: prop.name, isi: ex.length > MAX_EXPR ? ex.substr(0, MAX_EXPR) + '…' : ex});
        }
        return;
      }
      for (var i = 1; i <= prop.numProperties; i++) walk(prop.property(i), depth + 1, acc);
    } catch (e) {}
  }

  var proj = app.project;
  if (!proj || proj.numItems === 0) {
    alert('Buka dulu project After Effects yang mau dibedah.');
    return;
  }
  var hasil = {
    project: proj.file ? proj.file.name : '(belum disimpan)',
    aeVersion: app.version,
    dibuat: new Date().toString(),
    comps: [],
    ringkasan: {efek: {}, font: {}, jenisLayer: {}, totalKeyframe: 0, totalExpression: 0},
  };
  for (var i = 1; i <= proj.numItems; i++) {
    var it = proj.item(i);
    if (!(it instanceof CompItem)) continue;
    var comp = {nama: it.name, ukuran: it.width + 'x' + it.height, fps: it.frameRate, durasi: Math.round(it.duration * 100) / 100, layer: []};
    for (var j = 1; j <= it.numLayers; j++) {
      var l = it.layer(j);
      var kind = layerKind(l);
      var info = {nama: l.name, jenis: kind, masuk: Math.round(l.inPoint * 100) / 100, keluar: Math.round(l.outPoint * 100) / 100, efek: [], keyframes: 0, expressions: []};
      hasil.ringkasan.jenisLayer[kind] = (hasil.ringkasan.jenisLayer[kind] || 0) + 1;
      try {
        var fx = l.property('ADBE Effect Parade');
        for (var e = 1; fx && e <= fx.numProperties; e++) {
          var ef = fx.property(e);
          info.efek.push(ef.matchName + ' (' + ef.name + ')');
          hasil.ringkasan.efek[ef.matchName] = (hasil.ringkasan.efek[ef.matchName] || 0) + 1;
        }
      } catch (e1) {}
      if (kind === 'teks') {
        try {
          var td = l.property('ADBE Text Properties').property('ADBE Text Document').value;
          info.font = td.font + ' ' + td.fontSize + 'px';
          hasil.ringkasan.font[td.font] = (hasil.ringkasan.font[td.font] || 0) + 1;
        } catch (e2) {}
      }
      var acc = {keyframes: 0, expressions: []};
      for (var p = 1; p <= l.numProperties; p++) walk(l.property(p), 1, acc);
      info.keyframes = acc.keyframes;
      info.expressions = acc.expressions;
      hasil.ringkasan.totalKeyframe += acc.keyframes;
      hasil.ringkasan.totalExpression += acc.expressions.length;
      comp.layer.push(info);
    }
    hasil.comps.push(comp);
  }

  var here = new File($.fileName).parent; // ae/jsx
  var dir = new Folder(here.parent.fsName + '/proyek/_bedah');
  if (!dir.exists) dir.create();
  var nama = (proj.file ? proj.file.name.replace(/\.aep$/i, '') : 'tanpa-nama').replace(/[^A-Za-z0-9_-]+/g, '-');
  var f = new File(dir.fsName + '/bedah-' + nama + '.json');
  f.encoding = 'UTF-8';
  if (!f.open('w')) {
    alert('Tidak bisa menulis file. Nyalakan Edit > Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network.');
    return;
  }
  f.write(stringify(hasil));
  f.close();
  alert('Selesai: ' + f.fsName);
})();
