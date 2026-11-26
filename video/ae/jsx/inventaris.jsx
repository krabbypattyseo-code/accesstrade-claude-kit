/*
 * inventaris.jsx - kenali After Effects di PC ini, sekali saja (ulang kalau AE di-update).
 *
 * Cara pakai:
 *   - lewat kit: node ae/build.mjs --inventaris   (dari folder video/)
 *   - manual   : AE > File > Scripts > Run Script File... > pilih file ini
 *
 * Menulis profil-ae.json (dibaca ae/build.mjs: nama PostScript font, template H.264, lokasi AfterFX/aerender)
 * dan profil-ae.md (ringkasan untuk manusia) ke folder ae/ (atau AEKIT_INVENTARIS_OUT dari pembungkus).
 *
 * ES3 saja, ASCII saja (sama dengan aekit.jsx). Semua API dicek dulu; yang tidak ada dicatat, bukan error.
 * Proyek yang sedang terbuka tidak ditutup. Untuk membaca template render, satu comp sementara ditambahkan
 * lalu dihapus lagi (proyek jadi berstatus "berubah", isinya tetap sama).
 */

(function () {
  function has(o, k) { return o !== null && o !== undefined && Object.prototype.hasOwnProperty.call(o, k); }
  function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
  function hasFn(o, n) { try { return o !== null && o !== undefined && typeof o[n] === 'function'; } catch (e) { return false; } }
  function pad2(n) { var s = String(n); return s.length < 2 ? '0' + s : s; }
  function errText(e) { var s = (e && e.message) ? e.message : String(e); if (e && e.line) s += ' (baris ' + e.line + ')'; return s; }
  function nowText() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function safe(fn, d) { try { var v = fn(); return v === undefined ? d : v; } catch (e) { return d; } }
  function jsonStr(s) {
    s = String(s);
    var out = '"';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), code = s.charCodeAt(i);
      if (c === '"') out += '\\"';
      else if (c === '\\') out += '\\\\';
      else if (c === '\n') out += '\\n';
      else if (c === '\r') out += '\\r';
      else if (code < 32 || code > 126) { var h = code.toString(16); while (h.length < 4) h = '0' + h; out += '\\u' + h; }
      else out += c;
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
  function writeText(path, s) {
    var f = new File(path);
    if (!f.parent.exists) f.parent.create();
    f.encoding = 'UTF-8';
    if (!f.open('w')) throw new Error('tidak bisa membuka ' + path + ' untuk ditulis');
    f.write(s);
    f.close();
    return f.fsName;
  }
  function exists(p) { try { return new File(p).exists; } catch (e) { return false; } }
  function folderExists(p) { try { return new Folder(p).exists; } catch (e) { return false; } }

  var OUT = (typeof AEKIT_INVENTARIS_OUT !== 'undefined' && AEKIT_INVENTARIS_OUT) ? String(AEKIT_INVENTARIS_OUT) : null;
  if (!OUT) OUT = safe(function () { return new File($.fileName).parent.parent.fsName; }, null);
  if (!OUT) OUT = Folder.desktop.fsName;
  var RUN = (typeof AEKIT_RUN_ID !== 'undefined') ? String(AEKIT_RUN_ID) : '';
  var FAMS = (typeof AEKIT_FONT_FAMILIES !== 'undefined' && isArr(AEKIT_FONT_FAMILIES)) ? AEKIT_FONT_FAMILIES : [];

  var notes = [];
  var P = {kit: 'aekit-inventaris', versiInventaris: 1, runId: RUN, dibuat: nowText()};

  // ------------------------------------------------------------ After Effects + sistem
  var isWin = /win/i.test(String(safe(function () { return $.os; }, '')));
  var pkg = safe(function () { return Folder.appPackage.fsName; }, null);
  P.ae = {
    version: safe(function () { return String(app.version); }, null),
    buildNumber: safe(function () { return app.buildNumber; }, null),
    buildName: safe(function () { return String(app.buildName); }, null),
    language: safe(function () { return String(app.isoLanguage); }, null),
    os: safe(function () { return String($.os); }, null),
    extendScript: safe(function () { return String($.version); }, null),
    appPackage: pkg,
    expressionEngine: safe(function () { return String(app.project.expressionEngine); }, null),
    gpu: safe(function () { return String(app.availableGPUAccelTypes); }, null)
  };
  var exeCands = isWin ? [pkg + '/AfterFX.exe'] : [];
  var renderCands = isWin ? [pkg + '/aerender.exe'] : [];
  if (!isWin && pkg) {
    var f1 = new Folder(pkg);
    for (var up = 0; up < 4 && f1; up++) { renderCands.push(f1.fsName + '/aerender'); f1 = f1.parent; }
  }
  P.ae.afterfx = null;
  P.ae.aerender = null;
  for (var a = 0; a < exeCands.length; a++) if (exists(exeCands[a])) { P.ae.afterfx = new File(exeCands[a]).fsName; break; }
  for (var b = 0; b < renderCands.length; b++) if (exists(renderCands[b])) { P.ae.aerender = new File(renderCands[b]).fsName; break; }
  if (!P.ae.aerender) notes.push('aerender tidak ditemukan di dekat ' + pkg + ': isi ae.aerender di profil-ae.json secara manual.');

  // ------------------------------------------------------------ preferensi tulis file
  var prefVal = null, prefSec = null, secs = ['Main Pref Section v2', 'Main Pref Section'];
  for (var s = 0; s < secs.length && prefVal === null; s++) {
    try { prefVal = app.preferences.getPrefAsLong(secs[s], 'Pref_SCRIPTING_FILE_NETWORK_SECURITY'); prefSec = secs[s]; } catch (e1) {}
    if (prefVal === null) {
      try { prefVal = app.preferences.getPrefAsLong(secs[s], 'Pref_SCRIPTING_FILE_NETWORK_SECURITY', PREFType.PREF_Type_MACHINE_SPECIFIC); prefSec = secs[s] + ' (machine)'; } catch (e2) {}
    }
  }
  P.prefs = {scriptsCanWriteFiles: prefVal === null ? null : prefVal === 1, rawValue: prefVal, section: prefSec};

  // ------------------------------------------------------------ folder
  var major = safe(function () { return parseInt(String(app.version), 10); }, 0);
  var year = major >= 17 ? 2000 + major + (major >= 22 ? 0 : 3) : null; // AE 22 = 2022, ... AE 27 = 2027
  var docs = safe(function () { return Folder.myDocuments.fsName; }, null);
  var userData = safe(function () { return Folder.userData.fsName; }, null);
  P.folders = {
    userData: userData,
    documents: docs,
    scripts: pkg ? pkg + '/Scripts' : null,
    scriptUIPanels: pkg ? pkg + '/Scripts/ScriptUI Panels' : null,
    userScripts: (userData && major) ? userData + '/Adobe/After Effects/' + major + '.0/Scripts' : null,
    userPresets: (docs && year) ? docs + '/Adobe/After Effects ' + year + '/User Presets' : null
  };
  P.folders.exists = {};
  for (var fk in P.folders) if (has(P.folders, fk) && typeof P.folders[fk] === 'string') P.folders.exists[fk] = folderExists(P.folders[fk]);

  // ------------------------------------------------------------ efek
  var fx = [];
  try {
    for (var i = 0; i < app.effects.length; i++) {
      var ef = app.effects[i];
      fx.push({displayName: ef.displayName, matchName: ef.matchName, category: ef.category});
    }
  } catch (e3) { notes.push('app.effects tidak bisa dibaca: ' + errText(e3)); }
  P.effects = {count: fx.length, list: fx};
  var needFx = ['ADBE Ramp'], fxStatus = {};
  for (var n = 0; n < needFx.length; n++) {
    fxStatus[needFx[n]] = false;
    for (var m = 0; m < fx.length; m++) if (fx[m].matchName === needFx[n]) fxStatus[needFx[n]] = true;
  }
  P.effects.dipakaiKit = fxStatus;

  // ------------------------------------------------------------ font
  P.fonts = {available: false, list: [], brand: []};
  try {
    if (app.fonts && app.fonts.allFonts) {
      var all = app.fonts.allFonts;
      P.fonts.available = true;
      for (var g = 0; g < all.length; g++) {
        var grp = isArr(all[g]) || (all[g] && all[g].length !== undefined && typeof all[g] !== 'string') ? all[g] : [all[g]];
        for (var h2 = 0; h2 < grp.length; h2++) {
          var ft = grp[h2];
          P.fonts.list.push({family: safe(function () { return String(ft.familyName); }, ''), style: safe(function () { return String(ft.styleName); }, ''), postScriptName: safe(function () { return String(ft.postScriptName); }, '')});
        }
      }
    } else notes.push('app.fonts tidak ada di AE ini (baru ada di AE 24+): nama PostScript font ditebak, atau isi ae/font-manual.json.');
  } catch (e4) { notes.push('daftar font gagal dibaca: ' + errText(e4)); }
  for (var q = 0; q < FAMS.length; q++) {
    var fam = String(FAMS[q]).toLowerCase(), styles = [];
    for (var r = 0; r < P.fonts.list.length; r++) if (String(P.fonts.list[r].family).toLowerCase() === fam) styles.push(P.fonts.list[r].style + ' = ' + P.fonts.list[r].postScriptName);
    P.fonts.brand.push({family: FAMS[q], terpasang: P.fonts.available ? styles.length > 0 : null, styles: styles});
  }

  // ------------------------------------------------------------ template render + uji fitur kit (comp sementara)
  P.render = {outputModuleTemplates: [], renderSettingsTemplates: [], h264: null};
  P.kitProbe = {};
  var proj = app.project;
  if (!proj) { proj = app.newProject(); notes.push('tidak ada proyek terbuka, dibuat proyek baru kosong'); }
  var tmp = null;
  try {
    app.beginUndoGroup('AEKIT inventaris');
    tmp = proj.items.addComp('_aekit_inventaris', 320, 180, 1, 2, 30);
    try {
      var rq = proj.renderQueue.items.add(tmp);
      P.render.outputModuleTemplates = safe(function () { return rq.outputModule(1).templates; }, []);
      P.render.renderSettingsTemplates = safe(function () { return rq.templates; }, []);
      P.render.defaultOutputModule = safe(function () { return String(rq.outputModule(1).name); }, null);
      rq.remove();
    } catch (e5) { notes.push('render queue tidak bisa dibaca: ' + errText(e5)); }
    var oms = P.render.outputModuleTemplates, best = null;
    for (var o = 0; o < oms.length; o++) {
      if (/h\.?264/i.test(oms[o])) {
        if (!best) best = oms[o];
        if (/match render settings/i.test(oms[o]) && /15\s*mbps/i.test(oms[o])) best = oms[o];
      }
    }
    P.render.h264 = best;
    if (!best) notes.push('Tidak ada template Output Module H.264. Buat satu: Edit > Templates > Output Module > New, format H.264, simpan dengan nama yang mengandung "H.264", lalu jalankan inventaris lagi.');

    // uji API yang dipakai aekit.jsx
    var K = P.kitProbe;
    K.addBoxText = hasFn(tmp.layers, 'addBoxText');
    K.markerProperty = safe(function () { return !!tmp.markerProperty; }, false);
    K.saveFrameToPng = hasFn(tmp, 'saveFrameToPng');
    K.appFonts = safe(function () { return !!(app.fonts && hasFn(app.fonts, 'getFontsByPostScriptName')); }, false);
    var tl = K.addBoxText ? tmp.layers.addBoxText([200, 100], 'Uji teks kotak') : tmp.layers.addText('Uji teks');
    var td = tl.property('ADBE Text Properties').property('ADBE Text Document').value;
    K.characterRange = hasFn(td, 'characterRange');
    K.boxTextPos = safe(function () { var bp = td.boxTextPos; return isArr(bp) ? [bp[0], bp[1]] : null; }, null);
    K.sourceRectAtTime = safe(function () { var rr = tl.sourceRectAtTime(0, false); return {left: rr.left, top: rr.top, width: rr.width, height: rr.height}; }, null);
    K.setTrackMatte = hasFn(tl, 'setTrackMatte');
    try {
      var an = tl.property('ADBE Text Properties').property('ADBE Text Animators').addProperty('ADBE Text Animator');
      var ai = an.propertyIndex;
      var anim = function () { return tl.property('ADBE Text Properties').property('ADBE Text Animators').property(ai); };
      anim().property('ADBE Text Animator Properties').addProperty('ADBE Text Fill Color');
      anim().property('ADBE Text Selectors').addProperty('ADBE Text Expressible Selector');
      var sels = anim().property('ADBE Text Selectors');
      K.selectorsAfterAdd = sels.numProperties;
      var sel = null;
      for (var z = 1; z <= sels.numProperties; z++) if (anim().property('ADBE Text Selectors').property(z).matchName === 'ADBE Text Expressible Selector') sel = anim().property('ADBE Text Selectors').property(z);
      if (sel) {
        sel.property('ADBE Text Range Type2').setValue(3);
        var amt = sel.property('ADBE Text Expressible Amount');
        amt.expression = 'var s=[0,0.5];var e=[0.5,1];var i=textIndex-1;var on=(i<s.length&&time>=s[i]&&time<e[i])?1:0;selectorValue*on;';
        safe(function () { return amt.valueAtTime(0, false); }, null);
        K.expressionSelector = true;
        K.expressionSelectorError = safe(function () { return String(amt.expressionError || ''); }, '');
      } else K.expressionSelector = false;
    } catch (e6) { K.expressionSelector = false; K.expressionSelectorError = errText(e6); }
    try {
      var sl = tmp.layers.addShape();
      var g2 = sl.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
      g2.property('ADBE Vectors Group').addProperty('ADBE Vector Shape - Rect');
      K.shapeLayer = true;
      var op = sl.property('ADBE Transform Group').property('ADBE Opacity');
      op.expression = 'var o=value;var L=thisLayer;while(L.hasParent){L=L.parent;o=o*L.transform.opacity/100;}o;';
      safe(function () { return op.valueAtTime(0, false); }, null);
      K.opacityExpressionError = safe(function () { return String(op.expressionError || ''); }, '');
      K.rampEffect = sl.property('ADBE Effect Parade').canAddProperty('ADBE Ramp');
    } catch (e7) { K.shapeLayer = false; K.shapeLayerError = errText(e7); }
  } catch (e8) {
    notes.push('uji comp sementara gagal: ' + errText(e8));
  }
  try { if (tmp) tmp.remove(); } catch (e9) { notes.push('comp _aekit_inventaris tidak bisa dihapus, hapus manual'); }
  try { app.endUndoGroup(); } catch (e10) {}

  P.catatan = notes;

  // ------------------------------------------------------------ tulis
  var md = [];
  md.push('# Profil After Effects');
  md.push('');
  md.push('> Dibuat otomatis oleh `ae/jsx/inventaris.jsx` (' + P.dibuat + '). Jalankan ulang kalau AE di-update.');
  md.push('');
  md.push('| | |');
  md.push('|---|---|');
  md.push('| Versi AE | ' + P.ae.version + ' (' + P.ae.buildName + ') |');
  md.push('| Sistem | ' + P.ae.os + ' |');
  md.push('| Bahasa AE | ' + P.ae.language + ' |');
  md.push('| Mesin expression | ' + P.ae.expressionEngine + ' |');
  md.push('| AfterFX | ' + (P.ae.afterfx || '-') + ' |');
  md.push('| aerender | ' + (P.ae.aerender || '-') + ' |');
  md.push('| Izin skrip menulis file | ' + (P.prefs.scriptsCanWriteFiles === null ? 'tidak terbaca' : (P.prefs.scriptsCanWriteFiles ? 'nyala' : 'MATI: nyalakan di Edit > Preferences > Scripting & Expressions')) + ' |');
  md.push('| Template H.264 | ' + (P.render.h264 || 'TIDAK ADA (lihat catatan)') + ' |');
  md.push('| Efek terpasang | ' + P.effects.count + ' (Gradient Ramp: ' + (fxStatus['ADBE Ramp'] ? 'ada' : 'tidak ada') + ') |');
  md.push('| Font terbaca | ' + (P.fonts.available ? P.fonts.list.length + ' gaya' : 'tidak (app.fonts belum ada)') + ' |');
  md.push('');
  if (P.fonts.brand.length) {
    md.push('## Font brand');
    md.push('');
    for (var bf = 0; bf < P.fonts.brand.length; bf++) {
      var it = P.fonts.brand[bf];
      md.push('- **' + it.family + '**: ' + (it.terpasang === null ? 'tidak bisa dicek' : (it.terpasang ? it.styles.join(', ') : 'BELUM TERPASANG')));
    }
    md.push('');
  }
  md.push('## Fitur yang dipakai aekit.jsx');
  md.push('');
  for (var pk in P.kitProbe) if (has(P.kitProbe, pk)) md.push('- `' + pk + '`: ' + toJSON(P.kitProbe[pk]).replace(/\n\s*/g, ' '));
  md.push('');
  md.push('## Template render');
  md.push('');
  md.push('- Output Module: ' + (P.render.outputModuleTemplates.length ? P.render.outputModuleTemplates.join(' | ') : '-'));
  md.push('- Render Settings: ' + (P.render.renderSettingsTemplates.length ? P.render.renderSettingsTemplates.join(' | ') : '-'));
  md.push('');
  if (notes.length) {
    md.push('## Catatan');
    md.push('');
    for (var nn = 0; nn < notes.length; nn++) md.push('- ' + notes[nn]);
    md.push('');
  }

  var written = [];
  try {
    written.push(writeText(OUT + '/profil-ae.json', toJSON(P) + '\n'));
    written.push(writeText(OUT + '/profil-ae.md', md.join('\n')));
  } catch (ew) {
    try {
      alert('Inventaris AE tidak bisa menulis file (' + errText(ew) + ').\n' +
        'Nyalakan Edit > Preferences > Scripting & Expressions > "Allow Scripts to Write Files and Access Network", lalu jalankan lagi.');
    } catch (ea) {}
    return;
  }
  if (typeof AEKIT_NO_ALERT === 'undefined') {
    try { alert('Inventaris After Effects selesai.\n' + written.join('\n')); } catch (eb) {}
  }
})();
