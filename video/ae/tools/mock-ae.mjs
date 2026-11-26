#!/usr/bin/env node
// Uji aekit.jsx dan inventaris.jsx tanpa After Effects: model objek AE tiruan di node:vm.
//
//   node ae/tools/mock-ae.mjs            (dari folder video/) -> keluar 0 kalau semua lulus
//   node ae/tools/mock-ae.mjs --verbose  tampilkan peringatan AE dari tiap uji
//
// Yang diuji: tidak ada exception, comp utama (ukuran, durasi), satu precomp per adegan, semua adegan ok
// (tanpa placeholder GAGAL), caption, suara, marker, file hasil JSON, expression bisa di-parse dan dievaluasi,
// letak teks di dalam kanvas, cadangan untuk AE lama (tanpa addBoxText / sourceRectAtTime / characterRange / ...),
// dan lint ES3 kasar. Mock ini ketat: referensi properti lama setelah addProperty/remove dianggap error,
// setValue pada properti berkeyframe error, dimensi nilai dicek.
// Mock TIDAK membuktikan perilaku AE asli. Daftar asumsi: README.md bagian "Belum dites di After Effects asli".
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {AE_DIR, AEKIT_JSX, INVENTARIS_JSX, buildData, renderBuildJsx, renderInventarisJsx} from '../lib/data.mjs';
import {buildBrand} from '../../remotion/lib/brand.mjs';
import {ROOT, SCRIPTS} from '../../remotion/lib/paths.mjs';
import {prepareScript, readScript} from '../../remotion/lib/scripts.mjs';

const VERBOSE = process.argv.includes('--verbose');
const SVG_DIR = (() => {
  const i = process.argv.indexOf('--svg');
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : null;
})();
const CONTOH = path.join(AE_DIR, 'contoh-data');
let failed = 0;
let passed = 0;
const fail = (msg) => {
  failed++;
  console.error(`  ✗ ${msg}`);
};
const check = (cond, msg) => {
  if (cond) passed++;
  else fail(msg);
  return cond;
};

// =============================================================== enum AE
const PVT = {NO_VALUE: 6412, ThreeD_SPATIAL: 6413, ThreeD: 6414, TwoD_SPATIAL: 6415, TwoD: 6416, OneD: 6417, COLOR: 6418, CUSTOM_VALUE: 6419, MARKER: 6420, LAYER_INDEX: 6421, MASK_INDEX: 6422, SHAPE: 6423, TEXT_DOCUMENT: 6424};
const KIT = {LINEAR: 6612, BEZIER: 6613, HOLD: 6614};
const JUST = {LEFT_JUSTIFY: 7413, RIGHT_JUSTIFY: 7414, CENTER_JUSTIFY: 7415, FULL_JUSTIFY_LASTLINE_LEFT: 7416};
const ENUMS = {
  PropertyValueType: PVT,
  KeyframeInterpolationType: KIT,
  ParagraphJustification: JUST,
  PropertyType: {PROPERTY: 6812, INDEXED_GROUP: 6813, NAMED_GROUP: 6814},
  BlendingMode: {NORMAL: 5212, ADD: 5220, MULTIPLY: 5216, SCREEN: 5219},
  CloseOptions: {DO_NOT_SAVE_CHANGES: 1212, PROMPT_TO_SAVE_CHANGES: 1213, SAVE_CHANGES: 1214},
  TrackMatteType: {ALPHA: 5012, ALPHA_INVERTED: 5013, LUMA: 5014, LUMA_INVERTED: 5015, NO_TRACK_MATTE: 5016},
  LayerQuality: {BEST: 4612, DRAFT: 4613, WIREFRAME: 4614},
  ImportAsType: {FOOTAGE: 3812, COMP: 3813, PROJECT: 3814, COMP_CROPPED_LAYERS: 3815},
  PREFType: {PREF_Type_MACHINE_SPECIFIC: 0, PREF_Type_MACHINE_INDEPENDENT: 1},
  MaskMode: {NONE: 6812, ADD: 6813, SUBTRACT: 6814},
};

// =============================================================== skema properti (matchName)
const Pr = (type, value) => ({kind: 'prop', type, value});
const Gr = (children) => ({kind: 'group', children});
const Ix = (allow) => ({kind: 'indexed', allow});
const SCHEMA = {
  'ADBE Transform Group': Gr(['ADBE Anchor Point', 'ADBE Position', 'ADBE Scale', 'ADBE Rotate Z', 'ADBE Opacity']),
  'ADBE Anchor Point': Pr('ThreeD_SPATIAL', [0, 0, 0]),
  'ADBE Position': Pr('ThreeD_SPATIAL', [0, 0, 0]),
  'ADBE Scale': Pr('ThreeD', [100, 100, 100]),
  'ADBE Rotate Z': Pr('OneD', 0),
  'ADBE Opacity': Pr('OneD', 100),
  'ADBE Marker': Pr('MARKER', null),
  'ADBE Effect Parade': Ix(['ADBE Ramp']),
  'ADBE Ramp': Gr(['ADBE Ramp-0001', 'ADBE Ramp-0002', 'ADBE Ramp-0003', 'ADBE Ramp-0004', 'ADBE Ramp-0005', 'ADBE Ramp-0006', 'ADBE Ramp-0007']),
  'ADBE Ramp-0001': Pr('TwoD_SPATIAL', [0, 0]),
  'ADBE Ramp-0002': Pr('COLOR', [0, 0, 0, 1]),
  'ADBE Ramp-0003': Pr('TwoD_SPATIAL', [0, 100]),
  'ADBE Ramp-0004': Pr('COLOR', [1, 1, 1, 1]),
  'ADBE Ramp-0005': Pr('OneD', 1),
  'ADBE Ramp-0006': Pr('OneD', 0),
  'ADBE Ramp-0007': Pr('OneD', 0),
  'ADBE Mask Parade': Ix(['ADBE Mask Atom']),
  'ADBE Mask Atom': Gr(['ADBE Mask Shape', 'ADBE Mask Feather', 'ADBE Mask Opacity', 'ADBE Mask Offset']),
  'ADBE Mask Shape': Pr('SHAPE', null),
  'ADBE Mask Feather': Pr('TwoD', [0, 0]),
  'ADBE Mask Opacity': Pr('OneD', 100),
  'ADBE Mask Offset': Pr('OneD', 0),
  'ADBE Audio Group': Gr(['ADBE Audio Levels']),
  'ADBE Audio Levels': Pr('TwoD', [0, 0]),
  'ADBE Text Properties': Gr(['ADBE Text Document', 'ADBE Text Animators']),
  'ADBE Text Document': Pr('TEXT_DOCUMENT', null),
  'ADBE Text Animators': Ix(['ADBE Text Animator']),
  'ADBE Text Animator': Gr(['ADBE Text Selectors', 'ADBE Text Animator Properties']),
  'ADBE Text Selectors': Ix(['ADBE Text Selector', 'ADBE Text Expressible Selector']),
  'ADBE Text Selector': Gr(['ADBE Text Percent Start', 'ADBE Text Percent End']),
  'ADBE Text Percent Start': Pr('OneD', 0),
  'ADBE Text Percent End': Pr('OneD', 100),
  'ADBE Text Expressible Selector': Gr(['ADBE Text Range Type2', 'ADBE Text Expressible Amount']),
  'ADBE Text Range Type2': Pr('OneD', 1),
  'ADBE Text Expressible Amount': Pr('ThreeD', [100, 100, 100]),
  'ADBE Text Animator Properties': Ix(['ADBE Text Fill Color', 'ADBE Text Position 3D', 'ADBE Text Opacity', 'ADBE Text Scale 3D', 'ADBE Text Stroke Width']),
  'ADBE Text Fill Color': Pr('COLOR', [1, 0, 0, 1]),
  'ADBE Text Position 3D': Pr('ThreeD_SPATIAL', [0, 0, 0]),
  'ADBE Text Opacity': Pr('OneD', 100),
  'ADBE Text Scale 3D': Pr('ThreeD', [100, 100, 100]),
  'ADBE Text Stroke Width': Pr('OneD', 0),
  'ADBE Root Vectors Group': Ix(['ADBE Vector Group']),
  'ADBE Vector Group': Gr(['ADBE Vectors Group', 'ADBE Vector Transform Group']),
  'ADBE Vectors Group': Ix(['ADBE Vector Group', 'ADBE Vector Shape - Rect', 'ADBE Vector Shape - Ellipse', 'ADBE Vector Shape - Group', 'ADBE Vector Graphic - Fill', 'ADBE Vector Graphic - Stroke']),
  'ADBE Vector Transform Group': Gr([]),
  'ADBE Vector Shape - Rect': Gr(['ADBE Vector Rect Size', 'ADBE Vector Rect Position', 'ADBE Vector Rect Roundness']),
  'ADBE Vector Rect Size': Pr('TwoD', [100, 100]),
  'ADBE Vector Rect Position': Pr('TwoD_SPATIAL', [0, 0]),
  'ADBE Vector Rect Roundness': Pr('OneD', 0),
  'ADBE Vector Shape - Ellipse': Gr(['ADBE Vector Ellipse Size', 'ADBE Vector Ellipse Position']),
  'ADBE Vector Ellipse Size': Pr('TwoD', [100, 100]),
  'ADBE Vector Ellipse Position': Pr('TwoD_SPATIAL', [0, 0]),
  'ADBE Vector Shape - Group': Gr(['ADBE Vector Shape']),
  'ADBE Vector Shape': Pr('SHAPE', null),
  'ADBE Vector Graphic - Fill': Gr(['ADBE Vector Fill Color', 'ADBE Vector Fill Opacity']),
  'ADBE Vector Fill Color': Pr('COLOR', [1, 0, 0, 1]),
  'ADBE Vector Fill Opacity': Pr('OneD', 100),
  'ADBE Vector Graphic - Stroke': Gr(['ADBE Vector Stroke Color', 'ADBE Vector Stroke Width', 'ADBE Vector Stroke Opacity', 'ADBE Vector Stroke Line Cap', 'ADBE Vector Stroke Line Join']),
  'ADBE Vector Stroke Color': Pr('COLOR', [1, 1, 1, 1]),
  'ADBE Vector Stroke Width': Pr('OneD', 2),
  'ADBE Vector Stroke Opacity': Pr('OneD', 100),
  'ADBE Vector Stroke Line Cap': Pr('OneD', 1),
  'ADBE Vector Stroke Line Join': Pr('OneD', 1),
};
const DIMS = {OneD: 1, TwoD: 2, ThreeD: 3, TwoD_SPATIAL: 2, ThreeD_SPATIAL: 3, COLOR: 4};
const EASE_N = (type) => (type === 'TwoD' ? 2 : type === 'ThreeD' ? 3 : 1);
const clone = (v) => (Array.isArray(v) ? v.map(clone) : v && typeof v === 'object' && typeof v.clone === 'function' ? v.clone() : v);
const finite = (v) => typeof v === 'number' && Number.isFinite(v);

// =============================================================== pabrik AE tiruan
function createAE({mode = 'modern', files = 'ada', cancelNewProject = false, strictFonts = false} = {}) {
  const modern = mode === 'modern';
  const S = {written: new Map(), saved: [], alerts: [], exprs: [], comps: [], newProjectCalls: 0, renderQueue: [], idSeq: 1, mode, files};
  const MEDIA = /\.(jpe?g|png|webp|gif|psd|mp4|mov|webm|wav|mp3|m4a|aac|ogg)$/i;
  const fileExists = (p) => {
    const s = String(p);
    if (S.written.has(s)) return true;
    if (/AfterFX\.exe$|aerender(\.exe)?$/i.test(s)) return modern;
    if (MEDIA.test(s)) return files === 'ada';
    return false;
  };

  // ---------------------------------------------------------------- nilai khusus
  class KeyframeEase {
    constructor(speed, influence) {
      if (!finite(speed)) throw new Error(`mock: KeyframeEase speed tidak valid (${speed})`);
      if (!finite(influence) || influence < 0.1 || influence > 100) throw new Error(`mock: KeyframeEase influence harus 0,1..100 (${influence})`);
      this.speed = speed;
      this.influence = influence;
    }
  }
  class Shape {
    constructor() {
      this.vertices = [];
      this.inTangents = [];
      this.outTangents = [];
      this.closed = true;
    }
    clone() {
      const s = new Shape();
      s.vertices = clone(this.vertices);
      s.inTangents = clone(this.inTangents);
      s.outTangents = clone(this.outTangents);
      s.closed = this.closed;
      return s;
    }
  }
  class MarkerValue {
    constructor(comment = '', chapter = '', url = '', frameTarget = '', cuePointName = '', params = {}) {
      this.comment = String(comment);
      this.chapter = chapter;
      this.url = url;
      this.frameTarget = frameTarget;
      this.cuePointName = cuePointName;
      this.duration = 0;
      this.label = 0;
    }
    clone() {
      return Object.assign(new MarkerValue(), this);
    }
  }
  class ImportOptions {
    constructor(file) {
      if (!(file instanceof File)) throw new Error('mock: ImportOptions butuh File');
      this.file = file;
      this.importAs = ENUMS.ImportAsType.FOOTAGE;
      this.sequence = false;
    }
    canImportAs() {
      return true;
    }
  }
  class TextDocument {
    constructor(text = '') {
      this._v = {text: String(text), font: 'ArialMT', fontSize: 36, fillColor: [1, 1, 1], strokeColor: [0, 0, 0], strokeWidth: 0, applyFill: true, applyStroke: false,
        justification: JUST.LEFT_JUSTIFY, tracking: 0, leading: 43, autoLeading: true, strokeOverFill: false, boxText: false, boxTextSize: [0, 0], ranges: []};
    }
    clone() {
      const t = new TextDocument();
      t._v = clone({...this._v, ranges: this._v.ranges.map((r) => ({...r}))});
      return t;
    }
    resetCharStyle() {}
    resetParagraphStyle() {}
  }
  const tdProps = {
    text: (v) => typeof v === 'string',
    font: (v) => typeof v === 'string' && v.length > 0,
    fontSize: (v) => finite(v) && v > 0,
    fillColor: (v) => Array.isArray(v) && v.length === 3 && v.every(finite),
    strokeColor: (v) => Array.isArray(v) && v.length === 3 && v.every(finite),
    strokeWidth: (v) => finite(v) && v >= 0,
    applyFill: (v) => typeof v === 'boolean',
    applyStroke: (v) => typeof v === 'boolean',
    justification: (v) => Object.values(JUST).includes(v),
    tracking: (v) => Number.isInteger(v),
    leading: (v) => finite(v) && v > 0,
    autoLeading: (v) => typeof v === 'boolean',
    strokeOverFill: (v) => typeof v === 'boolean',
  };
  for (const [k, ok] of Object.entries(tdProps)) {
    if (k === 'autoLeading' && !modern) continue;
    Object.defineProperty(TextDocument.prototype, k, {
      get() {
        return clone(this._v[k]);
      },
      set(v) {
        if (!ok(v)) throw new Error(`mock: TextDocument.${k} nilai tidak valid: ${JSON.stringify(v)}`);
        if (k === 'fillColor' && !this._v.applyFill) throw new Error('mock: fillColor diisi saat applyFill false');
        if (k === 'strokeColor' && !this._v.applyStroke) throw new Error('mock: strokeColor diisi saat applyStroke false');
        this._v[k] = clone(v);
      },
    });
  }
  Object.defineProperty(TextDocument.prototype, 'boxText', {get() { return this._v.boxText; }});
  if (modern) {
    Object.defineProperty(TextDocument.prototype, 'boxTextPos', {
      get() {
        return this._v.boxText ? [-this._v.boxTextSize[0] / 2, -this._v.boxTextSize[1] / 2] : undefined;
      },
    });
    TextDocument.prototype.characterRange = function (a, b) {
      const n = this._v.text.length;
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b > n || a >= b) throw new Error(`mock: characterRange(${a}, ${b}) di luar teks (${n})`);
      const r = {start: a, end: b, fillColor: null};
      this._v.ranges.push(r);
      return {
        set applyFill(v) {},
        set fillColor(v) {
          if (!Array.isArray(v) || v.length !== 3) throw new Error('mock: CharacterRange.fillColor harus [r,g,b]');
          r.fillColor = clone(v);
        },
      };
    };
  }

  // ---------------------------------------------------------------- file
  class File {
    constructor(p) {
      this._p = String(p);
      this.encoding = 'BINARY';
      this._buf = null;
    }
    get fsName() { return this._p; }
    get fullName() { return this._p; }
    get name() { return this._p.replace(/\\/g, '/').split('/').pop(); }
    get parent() { return new Folder(this._p.replace(/\\/g, '/').split('/').slice(0, -1).join('/') || '/'); }
    get exists() { return fileExists(this._p); }
    open(mode) {
      this._mode = mode;
      this._buf = '';
      return true;
    }
    write(s) {
      if (this._mode !== 'w') throw new Error('mock: File.write tanpa open("w")');
      this._buf += String(s);
      return true;
    }
    writeln(s) { return this.write(`${s}\n`); }
    read() { return S.written.get(this._p) ?? ''; }
    close() {
      if (this._mode === 'w') S.written.set(this._p, this._buf);
      this._mode = null;
      return true;
    }
    remove() { return S.written.delete(this._p); }
  }
  class Folder {
    constructor(p) { this._p = String(p); }
    get fsName() { return this._p; }
    get name() { return this._p.split('/').pop(); }
    get parent() { return new Folder(this._p.split('/').slice(0, -1).join('/') || '/'); }
    get exists() { return true; }
    create() { return true; }
  }
  Folder.appPackage = new Folder('C:/Program Files/Adobe/Adobe After Effects 2027/Support Files');
  Folder.userData = new Folder('C:/Users/editor/AppData/Roaming');
  Folder.myDocuments = new Folder('C:/Users/editor/Documents');
  Folder.desktop = new Folder('C:/Users/editor/Desktop');
  Folder.temp = new Folder('C:/Users/editor/AppData/Local/Temp');

  // ---------------------------------------------------------------- properti
  class Node {
    constructor(mn, layer, parent) {
      const def = SCHEMA[mn];
      if (!def) throw new Error(`mock: matchName tidak dikenal "${mn}"`);
      this.mn = mn;
      this.def = def;
      this.layer = layer;
      this.parent = parent;
      this.name = mn.replace(/^ADBE /, '');
      this.children = [];
      this.removed = false;
      if (def.kind === 'group') for (const c of def.children) this.children.push(new Node(c, layer, this));
      if (def.kind === 'prop') {
        this.value = clone(def.value);
        this.keys = [];
        this.expression = '';
        this.expressionEnabled = true;
        if (def.type === 'TEXT_DOCUMENT') this.value = new TextDocument('');
      }
    }
    staticValue() {
      if (this.keys.length) return clone(this.keys[this.keys.length - 1].v);
      return clone(this.value);
    }
    valueAt(t) {
      if (!this.keys.length) return clone(this.value);
      if (t <= this.keys[0].t) return clone(this.keys[0].v);
      for (let i = 0; i < this.keys.length - 1; i++) {
        const a = this.keys[i], b = this.keys[i + 1];
        if (t <= b.t) {
          const k = (t - a.t) / (b.t - a.t || 1);
          return Array.isArray(a.v) ? a.v.map((x, j) => x + (b.v[j] - x) * k) : typeof a.v === 'number' ? a.v + (b.v - a.v) * k : clone(a.v);
        }
      }
      return clone(this.keys[this.keys.length - 1].v);
    }
  }
  const validate = (node, v) => {
    const t = node.def.type, where = `${node.mn} (layer "${node.layer.name}")`;
    if (t === 'OneD') {
      if (!finite(v)) throw new Error(`mock: ${where} butuh angka, dapat ${JSON.stringify(v)}`);
      return v;
    }
    if (t in DIMS) {
      const want = DIMS[t];
      if (!Array.isArray(v) || !v.every(finite)) throw new Error(`mock: ${where} butuh array angka, dapat ${JSON.stringify(v)}`);
      if (t === 'COLOR' && v.length !== 4) throw new Error(`mock: ${where} warna harus [r,g,b,a]`);
      if ((t === 'ThreeD' || t === 'ThreeD_SPATIAL') && !(v.length === 2 || v.length === 3)) throw new Error(`mock: ${where} butuh 2 atau 3 nilai`);
      if ((t === 'TwoD' || t === 'TwoD_SPATIAL') && v.length !== 2) throw new Error(`mock: ${where} butuh 2 nilai, dapat ${v.length}`);
      const out = [...v];
      while (out.length < want && t !== 'COLOR') out.push(node.value?.[out.length] ?? 0);
      return out;
    }
    if (t === 'SHAPE') {
      if (!(v instanceof Shape)) throw new Error(`mock: ${where} butuh Shape`);
      const n = v.vertices.length;
      if (!n || v.inTangents.length !== n || v.outTangents.length !== n) throw new Error(`mock: ${where} Shape tidak konsisten (${n}/${v.inTangents.length}/${v.outTangents.length})`);
      for (const arr of [v.vertices, v.inTangents, v.outTangents]) for (const p of arr) if (!Array.isArray(p) || p.length !== 2 || !p.every(finite)) throw new Error(`mock: ${where} titik Shape tidak valid ${JSON.stringify(p)}`);
      return v.clone();
    }
    if (t === 'TEXT_DOCUMENT') {
      if (v instanceof TextDocument && strictFonts && v._v.font !== 'ArialMT' && !/^(Poppins|Inter)-/.test(v._v.font)) throw new Error(`mock: font ${v._v.font} tidak ada`);
      if (v instanceof TextDocument) return v.clone();
      if (typeof v === 'string') {
        const td = node.value.clone();
        td._v.text = v;
        return td;
      }
      throw new Error(`mock: ${where} butuh TextDocument`);
    }
    if (t === 'MARKER') {
      if (!(v instanceof MarkerValue)) throw new Error(`mock: ${where} butuh MarkerValue`);
      return v.clone();
    }
    throw new Error(`mock: ${where} tidak bisa diberi nilai`);
  };
  const keyAt = (node, k) => {
    if (!Number.isInteger(k) || k < 1 || k > node.keys.length) throw new Error(`mock: key ${k} tidak ada di ${node.mn} (${node.keys.length} key)`);
    return node.keys[k - 1];
  };
  const api = (node) => {
    const L = node.layer, ver = L.pver;
    const chk = () => {
      if (L.pver !== ver) throw new Error(`mock: Object is invalid: referensi ${node.mn} dipakai lagi setelah addProperty/remove di layer "${L.name}"`);
      if (node.removed) throw new Error(`mock: properti ${node.mn} sudah dihapus`);
    };
    const isProp = node.def.kind === 'prop';
    const o = {};
    Object.defineProperties(o, {
      name: {get() { chk(); return node.name; }, set(v) { chk(); if (typeof v !== 'string') throw new Error('mock: name harus string'); node.name = v; }},
      matchName: {get() { chk(); return node.mn; }},
      propertyIndex: {get() { chk(); return node.parent ? node.parent.children.indexOf(node) + 1 : 1; }},
      numProperties: {get() { chk(); return node.children.length; }},
      propertyValueType: {get() { chk(); return isProp ? PVT[node.def.type] : PVT.NO_VALUE; }},
      value: {get() { chk(); if (!isProp) throw new Error(`mock: grup ${node.mn} tidak punya value`); return node.def.type === 'TEXT_DOCUMENT' ? node.staticValue().clone() : node.valueAt(0); }},
      numKeys: {get() { chk(); return isProp ? node.keys.length : 0; }},
      expression: {
        get() { chk(); return node.expression ?? ''; },
        set(code) {
          chk();
          if (!isProp) throw new Error('mock: expression di grup');
          if (typeof code !== 'string') throw new Error('mock: expression harus string');
          try {
            new vm.Script(code, {filename: `expr ${node.mn}`});
          } catch (e) {
            throw new Error(`mock: expression tidak valid di ${node.mn}: ${e.message}\n${code}`);
          }
          node.expression = code;
          S.exprs.push({node, code, layer: L});
        },
      },
      expressionEnabled: {get() { chk(); return true; }, set() { chk(); }},
      expressionError: {get() { chk(); return ''; }},
    });
    o.property = (x) => {
      chk();
      if (isProp) throw new Error(`mock: ${node.mn}.property() pada properti`);
      let c = null;
      if (typeof x === 'number') c = node.children[x - 1];
      else c = node.children.find((n) => n.mn === x);
      if (!c) throw new Error(`mock: ${node.mn} tidak punya anak ${JSON.stringify(x)}`);
      return api(c);
    };
    o.canAddProperty = (mn) => {
      chk();
      return node.def.kind === 'indexed' && node.def.allow.includes(mn);
    };
    o.addProperty = (mn) => {
      chk();
      if (node.def.kind !== 'indexed') throw new Error(`mock: addProperty("${mn}") di grup bernama ${node.mn}`);
      if (!node.def.allow.includes(mn)) throw new Error(`mock: ${node.mn} tidak menerima "${mn}"`);
      const c = new Node(mn, L, node);
      node.children.push(c);
      L.pver++;
      return api(c);
    };
    o.remove = () => {
      chk();
      if (!node.parent || node.parent.def.kind !== 'indexed') throw new Error(`mock: ${node.mn} tidak bisa dihapus`);
      node.parent.children.splice(node.parent.children.indexOf(node), 1);
      node.removed = true;
      L.pver++;
    };
    const needProp = () => {
      chk();
      if (!isProp) throw new Error(`mock: ${node.mn} bukan properti`);
    };
    o.setValue = (v) => {
      needProp();
      if (node.keys.length) throw new Error(`mock: setValue pada ${node.mn} yang sudah punya keyframe (layer "${L.name}")`);
      node.value = validate(node, v);
    };
    o.setValueAtTime = (t, v) => {
      needProp();
      if (!finite(t)) throw new Error(`mock: waktu keyframe tidak valid ${t}`);
      const val = validate(node, v);
      const hit = node.keys.find((k) => Math.abs(k.t - t) < 1e-6);
      if (hit) hit.v = val;
      else {
        node.keys.push({t, v: val, inI: KIT.LINEAR, outI: KIT.LINEAR, inE: null, outE: null});
        node.keys.sort((a, b) => a.t - b.t);
      }
    };
    o.addKey = (t) => {
      needProp();
      o.setValueAtTime(t, node.def.type === 'TEXT_DOCUMENT' ? node.value : node.valueAt(t));
      return o.nearestKeyIndex(t);
    };
    o.setValueAtKey = (k, v) => {
      needProp();
      keyAt(node, k).v = validate(node, v);
    };
    o.nearestKeyIndex = (t) => {
      needProp();
      if (!node.keys.length) throw new Error(`mock: nearestKeyIndex tanpa keyframe di ${node.mn}`);
      let best = 0;
      node.keys.forEach((k, i) => {
        if (Math.abs(k.t - t) < Math.abs(node.keys[best].t - t)) best = i;
      });
      return best + 1;
    };
    o.keyTime = (k) => {
      needProp();
      return keyAt(node, k).t;
    };
    o.keyValue = (k) => {
      needProp();
      return clone(keyAt(node, k).v);
    };
    const easeN = () => (node.def.type === 'TwoD' ? 2 : node.def.type === 'ThreeD' ? 3 : 1);
    const defEase = () => Array.from({length: easeN()}, () => new KeyframeEase(0, 16.666667));
    o.keyInTemporalEase = (k) => {
      needProp();
      return keyAt(node, k).inE ?? defEase();
    };
    o.keyOutTemporalEase = (k) => {
      needProp();
      return keyAt(node, k).outE ?? defEase();
    };
    o.setTemporalEaseAtKey = (k, inE, outE) => {
      needProp();
      const key = keyAt(node, k), n = easeN();
      for (const arr of [inE, outE]) {
        if (!Array.isArray(arr) || arr.length !== n) throw new Error(`mock: ease untuk ${node.mn} harus ${n} KeyframeEase, dapat ${arr?.length}`);
        for (const e of arr) if (!(e instanceof KeyframeEase)) throw new Error('mock: ease bukan KeyframeEase');
      }
      key.inE = inE;
      key.outE = outE;
    };
    o.setInterpolationTypeAtKey = (k, a, b) => {
      needProp();
      const key = keyAt(node, k);
      for (const x of [a, b ?? a]) if (!Object.values(KIT).includes(x)) throw new Error('mock: tipe interpolasi tidak dikenal');
      key.inI = a;
      key.outI = b ?? a;
    };
    o.valueAtTime = (t) => {
      needProp();
      return node.valueAt(t);
    };
    return o;
  };

  // ---------------------------------------------------------------- layer
  const ROOTS = {
    common: ['ADBE Marker', 'ADBE Transform Group', 'ADBE Effect Parade', 'ADBE Mask Parade'],
    text: ['ADBE Text Properties'],
    shape: ['ADBE Root Vectors Group'],
  };
  class Layer {
    constructor(comp, kind, {name, source = null, duration = null, hasAudio = false, box = null} = {}) {
      this.comp = comp;
      this.kind = kind;
      this.pver = 0;
      this._name = name ?? kind;
      this.source = source;
      this._start = 0;
      this._in = 0;
      this._out = duration ?? comp.duration;
      this.srcDuration = duration;
      this.enabled = true;
      this.guideLayer = false;
      this.audioEnabled = hasAudio;
      this.hasAudio = hasAudio;
      this.hasVideo = kind !== 'audio';
      this.locked = false;
      this.comment = '';
      this._parent = null;
      this.box = box;
      this.nodes = {};
      const roots = [...ROOTS.common, ...(kind === 'text' ? ROOTS.text : []), ...(kind === 'shape' ? ROOTS.shape : []), ...(hasAudio ? ['ADBE Audio Group'] : [])];
      for (const r of roots) this.nodes[r] = new Node(r, this, null);
      if (kind !== 'audio') {
        const w = source?.width ?? comp.width, h = source?.height ?? comp.height;
        const anchor = kind === 'text' || kind === 'shape' ? [0, 0, 0] : [w / 2, h / 2, 0];
        this.nodes['ADBE Transform Group'].children[0].value = anchor;
        this.nodes['ADBE Transform Group'].children[1].value = [comp.width / 2, comp.height / 2, 0];
      }
    }
    get name() { return this._name; }
    set name(v) {
      if (typeof v !== 'string' || !v) throw new Error('mock: nama layer kosong');
      this._name = v;
    }
    get index() { return this.comp._layers.indexOf(this) + 1; }
    get startTime() { return this._start; }
    set startTime(t) {
      if (!finite(t)) throw new Error('mock: startTime tidak valid');
      const d = t - this._start;
      this._start = t;
      this._in += d;
      this._out += d;
    }
    get inPoint() { return this._in; }
    set inPoint(t) {
      if (!finite(t) || t >= this._out) throw new Error(`mock: inPoint ${t} >= outPoint ${this._out} (layer "${this.name}")`);
      this._in = t;
    }
    get outPoint() { return this._out; }
    set outPoint(t) {
      if (!finite(t) || t <= this._in) throw new Error(`mock: outPoint ${t} <= inPoint ${this._in} (layer "${this.name}")`);
      if (this.srcDuration && t > this._start + this.srcDuration + 1e-6) throw new Error(`mock: outPoint ${t} melewati durasi sumber (layer "${this.name}")`);
      this._out = t;
    }
    get parent() { return this._parent; }
    set parent(p) {
      if (p !== null && !(p instanceof Layer)) throw new Error('mock: parent harus Layer atau null');
      if (p && p.comp !== this.comp) throw new Error('mock: parent beda comp');
      for (let q = p; q; q = q._parent) if (q === this) throw new Error('mock: parenting berputar');
      // AE mengompensasi transform anak supaya tidak melompat (mock: posisi saja; induk harus skala 100 dan tanpa rotasi)
      const world = this.worldPoint(this.tval('ADBE Anchor Point'));
      if (p) {
        const sc = p.tval('ADBE Scale'), rot = p.tval('ADBE Rotate Z');
        if (Math.abs(sc[0] - 100) > 1e-6 || Math.abs(sc[1] - 100) > 1e-6 || Math.abs(rot) > 1e-6) S.parentWarn = `induk "${p.name}" sudah diskala/diputar saat parenting`;
      }
      this._parent = p;
      const local = p ? p.toLocal(world) : world;
      this.nodes['ADBE Transform Group'].children[1].value = [local[0], local[1], 0];
    }
    get threeDLayer() { return false; }
    tnode(mn) { return this.nodes['ADBE Transform Group'].children.find((n) => n.mn === mn); }
    tval(mn) { return this.tnode(mn).staticValue(); }
    /** titik di ruang layer -> ruang comp (pakai nilai akhir keyframe) */
    worldPoint(pt) {
      const a = this.tval('ADBE Anchor Point'), p = this.tval('ADBE Position'), s = this.tval('ADBE Scale'), r = (this.tval('ADBE Rotate Z') * Math.PI) / 180;
      const x = (pt[0] - a[0]) * s[0] / 100, y = (pt[1] - a[1]) * s[1] / 100;
      const q = [p[0] + x * Math.cos(r) - y * Math.sin(r), p[1] + x * Math.sin(r) + y * Math.cos(r)];
      return this._parent ? this._parent.worldPoint(q) : q;
    }
    toLocal(world) {
      const q = this._parent ? this._parent.toLocal(world) : world;
      const a = this.tval('ADBE Anchor Point'), p = this.tval('ADBE Position'), s = this.tval('ADBE Scale'), r = (-this.tval('ADBE Rotate Z') * Math.PI) / 180;
      const x = q[0] - p[0], y = q[1] - p[1];
      return [a[0] + (x * Math.cos(r) - y * Math.sin(r)) * 100 / s[0], a[1] + (x * Math.sin(r) + y * Math.cos(r)) * 100 / s[1]];
    }
    property(x) {
      const n = this.nodes[x];
      if (!n) throw new Error(`mock: layer ${this.kind} "${this.name}" tidak punya grup ${JSON.stringify(x)}`);
      return api(n);
    }
    moveAfter(L) { this.comp._move(this, L, 1); }
    moveBefore(L) { this.comp._move(this, L, 0); }
    moveToBeginning() { this.comp._layers.splice(this.comp._layers.indexOf(this), 1); this.comp._layers.unshift(this); }
    moveToEnd() { this.comp._layers.splice(this.comp._layers.indexOf(this), 1); this.comp._layers.push(this); }
    remove() { this.comp._layers.splice(this.comp._layers.indexOf(this), 1); }
    textDoc() { return this.nodes['ADBE Text Properties'].children[0].staticValue(); }
  }
  if (modern) {
    Layer.prototype.sourceRectAtTime = function () {
      if (this.kind !== 'text') return {left: 0, top: 0, width: this.source?.width ?? 100, height: this.source?.height ?? 100};
      const td = this.textDoc()._v, size = td.fontSize, lh = td.leading || size * 1.2, cw = size * 0.55 * (1 + td.tracking / 1000);
      let lines;
      if (td.boxText) {
        const max = Math.max(1, Math.floor(td.boxTextSize[0] / cw));
        lines = [];
        let cur = '';
        for (const w of td.text.split(' ')) {
          if (!cur) cur = w;
          else if ((`${cur} ${w}`).length <= max) cur += ` ${w}`;
          else {
            lines.push(cur);
            cur = w;
          }
        }
        lines.push(cur);
      } else lines = td.text.split('\r');
      const w = Math.max(1, ...lines.map((l) => l.length * cw)), h = size * 0.9 + (lines.length - 1) * lh;
      const j = td.justification;
      if (td.boxText) {
        const [bw, bh] = td.boxTextSize, bx = -bw / 2, by = -bh / 2;
        return {left: j === JUST.CENTER_JUSTIFY ? bx + (bw - w) / 2 : j === JUST.RIGHT_JUSTIFY ? bx + bw - w : bx, top: by + size * 0.22, width: w, height: h};
      }
      return {left: j === JUST.CENTER_JUSTIFY ? -w / 2 : j === JUST.RIGHT_JUSTIFY ? -w : 0, top: -size * 0.72, width: w, height: h};
    };
    Layer.prototype.setTrackMatte = function () {};
  }

  // ---------------------------------------------------------------- item, comp, proyek
  class FolderItem {
    constructor(name) {
      this.name = name;
      this.id = S.idSeq++;
      this.typeName = 'Folder';
      this._parentFolder = null;
    }
    get parentFolder() { return this._parentFolder; }
    set parentFolder(f) {
      if (!(f instanceof FolderItem)) throw new Error('mock: parentFolder harus FolderItem');
      this._parentFolder = f;
    }
  }
  class FootageItem extends FolderItem {
    constructor(file) {
      super(file.name);
      this.typeName = 'Footage';
      this.file = file;
      const p = file.fsName;
      if (/\.(jpe?g|png|webp|gif|psd)$/i.test(p)) Object.assign(this, {width: 1600, height: 1067, duration: 0, hasVideo: true, hasAudio: false});
      else if (/\.(mp4|mov|webm)$/i.test(p)) Object.assign(this, {width: 1920, height: 1080, duration: 8, hasVideo: true, hasAudio: true});
      else Object.assign(this, {width: 0, height: 0, duration: /musik/i.test(p) ? 20 : 6, hasVideo: false, hasAudio: true});
    }
  }
  class LayerCollection {
    constructor(comp) { this.comp = comp; }
    get length() { return this.comp._layers.length; }
    _push(L) {
      this.comp._layers.unshift(L);
      return L;
    }
    addText(t = '') {
      const L = new Layer(this.comp, 'text', {name: 'Text'});
      const td = t instanceof TextDocument ? t.clone() : new TextDocument(String(t));
      L.nodes['ADBE Text Properties'].children[0].value = td;
      return this._push(L);
    }
    addShape() { return this._push(new Layer(this.comp, 'shape', {name: 'Shape Layer'})); }
    addSolid(color, name, w, h, par, dur) {
      if (!Array.isArray(color) || color.length !== 3 || !color.every(finite)) throw new Error(`mock: addSolid warna harus [r,g,b], dapat ${JSON.stringify(color)}`);
      if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1) throw new Error(`mock: addSolid ukuran harus bilangan bulat (${w}x${h})`);
      const L = new Layer(this.comp, 'solid', {name, source: {width: w, height: h}, duration: null});
      L.color = [...color];
      return this._push(L);
    }
    addNull(dur) { return this._push(new Layer(this.comp, 'null', {name: 'Null', source: {width: 100, height: 100}})); }
    add(item, dur) {
      if (item instanceof CompItem) {
        if (item === this.comp) throw new Error('mock: comp dimasukkan ke dirinya sendiri');
        const hasAudio = item._layers.some((l) => l.hasAudio);
        return this._push(new Layer(this.comp, 'comp', {name: item.name, source: item, duration: item.duration, hasAudio}));
      }
      if (!(item instanceof FootageItem)) throw new Error('mock: layers.add butuh item');
      const still = item.duration === 0;
      const kind = item.hasVideo ? 'footage' : 'audio';
      return this._push(new Layer(this.comp, kind, {name: item.name, source: item, duration: still ? null : item.duration, hasAudio: item.hasAudio}));
    }
  }
  if (modern) {
    LayerCollection.prototype.addBoxText = function (size, t = '') {
      if (!Array.isArray(size) || size.length !== 2 || !size.every((v) => Number.isInteger(v) && v > 0)) throw new Error(`mock: addBoxText ukuran tidak valid ${JSON.stringify(size)}`);
      const L = this.addText(t);
      const td = L.nodes['ADBE Text Properties'].children[0].value;
      td._v.boxText = true;
      td._v.boxTextSize = [...size];
      L.box = size;
      return L;
    };
  }
  class CompItem extends FolderItem {
    constructor(name, w, h, par, dur, fps) {
      super(name);
      if (typeof name !== 'string' || !name) throw new Error('mock: nama comp kosong');
      if (!Number.isInteger(w) || !Number.isInteger(h) || w < 4 || h < 4 || w > 30000 || h > 30000) throw new Error(`mock: ukuran comp ${w}x${h} tidak valid`);
      if (!finite(dur) || dur <= 0 || dur > 10800) throw new Error(`mock: durasi comp ${dur} tidak valid`);
      if (!finite(fps) || fps <= 0) throw new Error('mock: fps tidak valid');
      this.typeName = 'Composition';
      Object.assign(this, {width: w, height: h, pixelAspect: par, duration: dur, frameRate: fps, frameDuration: 1 / fps});
      this._layers = [];
      this.layers = new LayerCollection(this);
      this.bgColor = [0, 0, 0];
      this.saved = [];
      if (modern) {
        const holder = {name: `comp ${name}`, pver: 0};
        this._marker = new Node('ADBE Marker', holder, null);
        Object.defineProperty(this, 'markerProperty', {get: () => api(this._marker)});
        this.saveFrameToPng = (t, f) => {
          if (!(f instanceof File)) throw new Error('mock: saveFrameToPng butuh File');
          this.saved.push([t, f.fsName]);
        };
      }
      S.comps.push(this);
    }
    get numLayers() { return this._layers.length; }
    layer(i) { return this._layers[i - 1]; }
    _move(L, ref, after) {
      if (L === ref) throw new Error('mock: layer dipindah relatif ke dirinya');
      if (ref.comp !== this) throw new Error('mock: layer beda comp');
      this._layers.splice(this._layers.indexOf(L), 1);
      this._layers.splice(this._layers.indexOf(ref) + after, 0, L);
    }
    openInViewer() {}
    remove() {
      project.items._list.splice(project.items._list.indexOf(this), 1);
      S.comps.splice(S.comps.indexOf(this), 1);
    }
  }
  class ItemCollection {
    constructor() { this._list = []; }
    get length() { return this._list.length; }
    addComp(name, w, h, par, dur, fps) {
      const c = new CompItem(name, w, h, par, dur, fps);
      this._list.push(c);
      return c;
    }
    addFolder(name) {
      const f = new FolderItem(name);
      this._list.push(f);
      return f;
    }
  }
  const makeProject = () => {
    const p = {
      items: new ItemCollection(),
      expressionEngine: 'javascript-1.0',
      importFile(io) {
        if (!(io instanceof ImportOptions)) throw new Error('mock: importFile butuh ImportOptions');
        if (!io.file.exists) throw new Error(`mock: file tidak ada ${io.file.fsName}`);
        const it = new FootageItem(io.file);
        this.items._list.push(it);
        return it;
      },
      save(f) {
        if (!(f instanceof File)) throw new Error('mock: save butuh File');
        if (!/\.aep$/i.test(f.fsName)) throw new Error('mock: proyek harus .aep');
        S.saved.push(f.fsName);
        S.written.set(f.fsName, '<aep>');
        return true;
      },
      item(i) { return this.items._list[i - 1]; },
      get numItems() { return this.items._list.length; },
      renderQueue: {
        items: {
          add(comp) {
            if (!(comp instanceof CompItem)) throw new Error('mock: render queue butuh comp');
            const rq = {
              templates: ['Best Settings', 'Current Settings', 'DV Settings', 'Draft Settings', 'Multi-Machine Settings'],
              outputModule() {
                return {name: 'H.264 - Match Render Settings - 15 Mbps', templates: modern ? ['High Quality', 'H.264 - Match Render Settings - 15 Mbps', 'H.264 - Match Render Settings - 40 Mbps', 'Lossless', 'Lossless with Alpha'] : ['Lossless', 'Lossless with Alpha']};
              },
              remove() { S.renderQueue.splice(S.renderQueue.indexOf(rq), 1); },
            };
            S.renderQueue.push(rq);
            return rq;
          },
        },
      },
    };
    return p;
  };
  let project = makeProject();

  const fonts = [
    ['Poppins', ['Bold', 'ExtraBold']],
    ['Inter', ['Medium', 'SemiBold', 'Bold', 'ExtraBold']],
  ].map(([fam, styles]) => styles.map((st) => ({familyName: fam, styleName: st, postScriptName: `${fam}-${st}`})));
  const app = {
    version: modern ? '27.0x45' : '17.7x12',
    buildNumber: 45,
    buildName: modern ? '27.0.0' : '17.7.0',
    isoLanguage: 'en_US',
    get project() { return project; },
    newProject() {
      S.newProjectCalls++;
      if (cancelNewProject) return null;
      project = makeProject();
      return project;
    },
    beginUndoGroup(n) { S.undo = (S.undo ?? 0) + 1; },
    endUndoGroup() { S.undo--; },
    beginSuppressDialogs() {},
    endSuppressDialogs() {},
    preferences: {
      getPrefAsLong(sec, key) {
        if (key !== 'Pref_SCRIPTING_FILE_NETWORK_SECURITY') throw new Error('mock: pref tidak dikenal');
        if (!modern && sec === 'Main Pref Section v2') throw new Error('mock: section tidak ada');
        return 1;
      },
    },
    effects: [
      {displayName: 'Gradient Ramp', matchName: 'ADBE Ramp', category: 'Generate'},
      {displayName: 'Gaussian Blur', matchName: 'ADBE Gaussian Blur 2', category: 'Blur & Sharpen'},
    ],
  };
  if (modern) {
    app.fonts = {
      allFonts: fonts,
      getFontsByPostScriptName: (ps) => fonts.flat().filter((f) => f.postScriptName === ps),
    };
    app.availableGPUAccelTypes = ['CUDA'];
  }

  const G = {
    app, File, Folder, TextDocument, KeyframeEase, Shape, MarkerValue, ImportOptions, ...ENUMS,
    $: {os: 'Windows 10/64', version: '4.5.5', fileName: 'C:/kit/video/ae/jsx/inventaris.jsx', writeln() {}, global: null},
    alert: (m) => S.alerts.push(String(m)),
  };
  return {G, S, getProject: () => project, classes: {Layer, CompItem, FootageItem, TextDocument}};
}

// =============================================================== jalankan jsx di vm
const stripPre = (code) => code.replace(/^\uFEFF/, '').split('\n').filter((l) => !/^\s*#(include|target|targetengine|script)\b/.test(l)).join('\n');
const AEKIT_CODE = stripPre(fs.readFileSync(AEKIT_JSX, 'utf8'));
const INVENTARIS_CODE = stripPre(fs.readFileSync(INVENTARIS_JSX, 'utf8'));

function runBuild(data, opts = {}) {
  const ae = createAE(opts);
  const ctx = vm.createContext({...ae.G});
  vm.runInContext(AEKIT_CODE, ctx, {filename: 'aekit.jsx'});
  ctx.DATA = data;
  let result = null, error = null;
  try {
    result = vm.runInContext(opts.viaBuildJsx ? stripPre(renderBuildJsx(data)) : 'AEKIT.build(DATA)', ctx, {filename: 'build.jsx'});
  } catch (e) {
    error = e;
  }
  return {ae, ctx, result, error};
}

// =============================================================== data uji
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const brandContoh = readJson(path.join(CONTOH, 'brand-contoh.json'));
const brandLive = buildBrand();
const MOCK_ROOT = 'C:/mock/kit/video';
const mockPaths = (fmt, name) => ({
  aep: `${MOCK_ROOT}/output/${fmt}/${name}.aep`,
  mp4: `${MOCK_ROOT}/output/${fmt}/${name}-ae.mp4`,
  result: `${MOCK_ROOT}/ae/proyek/${fmt}-${name}/hasil.json`,
  frames: `${MOCK_ROOT}/ae/proyek/${fmt}-${name}/frames`,
  proyek: `${MOCK_ROOT}/ae/proyek/${fmt}-${name}`,
});

/** semua tipe adegan + transisi + sfx + musik + caption paksa + [KONFIRMASI] + tipe tidak dikenal */
function campuran(base, fmt) {
  const d = structuredClone(base);
  const outro = d.scenes.pop();
  const key = `${fmt}-00`;
  const foto = `video/${key}/foto/contoh.jpg`;
  const add = [
    {id: 'k1', type: 'klip', onScreen: 'Begini *cara* kerjanya', vo: 'Begini cara kerjanya di layar.', transition: 'fade',
      props: {src: `video/${key}/klip/contoh-broll.mp4`, start: 1.2, kicker: 'Klip', text: 'Rekaman layar', focus: '30% 50%'},
      sfx: [{src: 'sfx/whoosh.wav', at: 0.1, volume: 0.5}, {src: 'sfx/pop.wav', at: 1}]},
    {id: 'k2', type: 'klip', vo: 'Klip tanpa judul dengan suara asli.', props: {src: `video/${key}/klip/contoh-broll.mp4`, audio: true}},
    {id: 'q1', type: 'kutipan', vo: 'Fokus itu memilih.', transition: 'wipe', props: {quote: 'Fokus itu *memilih* yang tidak dikerjakan.', by: 'Tim Contoh', role: 'Catatan'}},
    {id: 'b1', type: 'bab', vo: 'Bagian baru dimulai.', props: {title: 'Bagian *baru*', sub: 'Sub bab singkat'}},
    {id: 'f1', type: 'foto', onScreen: 'Dua *foto* berganti', vo: 'Ini sebelum dan ini sesudah.',
      props: {kicker: 'Foto', sub: 'Keterangan foto', images: [{src: foto, text: 'Sebelum'}, {src: foto, at: 1.5, text: 'Sesudah', focus: 'left top'}, foto]}},
    {id: 'a1', type: 'angka', vo: 'Rata-rata satu juta dua ratus lima puluh ribu.', transition: 'cut', props: {value: 'Rp1.250.000', label: 'rata-rata *per bulan*', source: 'Contoh data', sub: 'Sub angka', kicker: 'Data'}},
    {id: 'a2', type: 'angka', vo: 'Dua koma lima kali.', props: {value: '2,5x', label: 'lebih cepat'}},
    {id: 'a3', type: 'angka', vo: 'Angka bukan angka.', props: {value: 'Dua kali lipat', label: 'tanpa hitung naik'}},
    {id: 'v1', type: 'banding', onScreen: 'Pilih *mana*?', vo: 'Pilih yang mana.', props: {kicker: 'Banding', left: {label: 'A', text: 'Pakai *foto*', image: foto}, right: {label: 'B', text: 'Tanpa foto'}, verdict: 'left', revealAt: 1.2}},
    {id: 'v2', type: 'banding', vo: 'Tanpa judul.', props: {left: {text: 'Kiri saja'}, right: {text: 'Kanan *benar*'}, verdict: 'right'}},
    {id: 'd1', type: 'daftar', onScreen: 'Enam *langkah*', vo: 'Ada enam langkah.', props: {kicker: 'Langkah', numbered: true, items: ['Satu', 'Dua *tiga*', {text: 'Empat', icon: 'star'}, 'Lima', 'Enam', 'Tujuh']}},
    ...[['check', 'x', 'star', 'heart', 'bulb'], ['clock', 'chart', 'chat', 'book', 'alert'], ['arrow', 'target', 'money', 'user', 'tidak-ada']].map((ics, k) => (
      {id: `d${k + 2}`, type: 'daftar', vo: 'Semua ikon.', props: {items: ics.map((ic) => ({text: `Ikon ${ic}`, icon: ic}))}})),
    {id: 'p1', type: 'poin', onScreen: '[KONFIRMASI] angka *ini*', vo: 'Angka ini perlu dicek.', needsConfirm: true, props: {bg: 'brand', kicker: 'Cek', sub: 'Sub *penting*', caption: 'off'}},
    {id: 'h2', type: 'hook', onScreen: 'Hook *kedua* di latar terang', vo: 'Hook kedua di latar terang.', props: {bg: 'light', sub: 'sub hook', caption: 'on'}},
    {id: 'x1', type: 'tipe-aneh', onScreen: 'Tipe tidak dikenal', vo: 'Tipe ini tidak dikenal.'},
  ];
  outro.props = {...(outro.props ?? {}), caption: 'on', handle: '@contoh', website: 'contoh.id', sub: 'Sampai jumpa'};
  let t = outro.start;
  for (const s of add) {
    s.start = +t.toFixed(3);
    s.end = +(t + 4).toFixed(3);
    s.rawType = s.type;
    s.needsConfirm = Boolean(s.needsConfirm);
    t += 4;
  }
  outro.start = +t.toFixed(3);
  outro.end = +(t + (fmt === 'youtube' ? 12 : 3)).toFixed(3);
  d.scenes = [...d.scenes, ...add, outro];
  d.words = [];
  d.media = {...d.media, music: {src: 'musik/contoh.mp3', volume: 0.4}};
  d.slug = `campuran-${fmt}`;
  return d;
}

// =============================================================== pemeriksaan hasil build
const allLayers = (ae) => ae.S.comps.flatMap((c) => c._layers.map((l) => ({c, l})));

function evalExpr(code, extra) {
  const parentLayer = {hasParent: false, transform: {opacity: 80}, sourceRectAtTime: () => ({left: -50, top: -30, width: 100, height: 40})};
  const sandbox = {Math, Number, String, time: 0, textIndex: 1, textTotal: 6, selectorValue: 100, value: 100,
    thisLayer: {hasParent: true, parent: parentLayer, transform: {opacity: 100}}, ...extra};
  return vm.runInNewContext(code, sandbox, {timeout: 200});
}

function verify(label, data, run, {expectCaptions = true, legacy = false, files = 'ada'} = {}) {
  const {ae, result: res, error} = run;
  console.log(`\n▶ ${label}`);
  if (!check(!error, `exception: ${error?.stack ?? error}`)) return;
  if (!check(res && typeof res === 'object', 'AEKIT.build tidak mengembalikan hasil')) return;
  if (VERBOSE) for (const w of res.warnings) console.log(`    ! ${w}`);
  check(res.status === 'ok', `status ${res.status}: ${res.errors.join(' | ')}`);
  check(res.errors.length === 0, `errors: ${res.errors.join(' | ')}`);
  const fps = data.spec.fps, W = data.spec.width, H = data.spec.height;
  const project = ae.getProject();
  const items = project.items._list;
  const folders = items.filter((i) => i.typeName === 'Folder').map((f) => f.name);
  check(['01 Comp', '02 Adegan', '03 Suara', '04 Foto', '05 Klip'].every((n) => folders.includes(n)), `folder proyek: ${folders.join(', ')}`);
  const main = items.find((i) => i.typeName === 'Composition' && i.name === data.names.main);
  if (!check(main, `comp utama "${data.names.main}" tidak ada`)) return;
  check(main.parentFolder?.name === '01 Comp', 'comp utama tidak di folder 01 Comp');
  check(main.width === W && main.height === H && main.frameRate === fps, `ukuran comp ${main.width}x${main.height}@${main.frameRate}`);
  const lastEnd = Math.max(...data.script.scenes.map((s) => s.end));
  const wantDur = Math.ceil(lastEnd * fps - 1e-6) / fps;
  check(Math.abs(main.duration - wantDur) < 1e-6, `durasi comp ${main.duration} != ${wantDur}`);
  const scenes = data.script.scenes;
  const pre = items.filter((i) => i.typeName === 'Composition' && /^S\d\d /.test(i.name) && !/kartu foto$/.test(i.name));
  check(pre.length === scenes.length, `precomp adegan ${pre.length} != ${scenes.length}`);
  check(pre.every((p) => p.parentFolder?.name === '02 Adegan'), 'precomp tidak di folder 02 Adegan');
  scenes.forEach((s, i) => {
    const name = pre[i]?.name;
    const L = main._layers.find((l) => l.source === pre[i]);
    if (!check(L, `layer precomp ${name} tidak ada di comp utama`)) return;
    check(Math.abs(L.startTime - Math.round(s.start * fps) / fps) < 1e-6, `${name} mulai ${L.startTime}, harusnya ${s.start}`);
  });
  check(res.scenes.length === scenes.length && res.scenes.every((s) => s.status === 'ok'), `adegan gagal: ${res.scenes.filter((s) => s.status !== 'ok').map((s) => `${s.id} ${s.error}`).join(' | ')}`);
  const gagal = allLayers(ae).filter(({l}) => l.kind === 'text' && /^GAGAL/.test(l.textDoc().text));
  check(gagal.length === 0, `placeholder GAGAL: ${gagal.map(({c, l}) => `${c.name}: ${l.textDoc().text}`).join(' | ')}`);

  // letak: pusat setiap teks (selain panduan) di dalam kanvas, pakai nilai akhir keyframe
  const out = [];
  for (const {c, l} of allLayers(ae)) {
    if (l.kind !== 'text' || l.guideLayer || !l.enabled || c.width < 300) continue;
    const td = l.textDoc()._v;
    let cx, cy;
    try {
      const r = Layer_rect(ae, l);
      [cx, cy] = l.worldPoint([r.left + r.width / 2, r.top + r.height / 2]);
    } catch {
      [cx, cy] = l.worldPoint(l.tval('ADBE Anchor Point'));
    }
    if (!(cx > -1 && cx < c.width + 1 && cy > -1 && cy < c.height + 1)) out.push(`${c.name} / ${l.name} (${Math.round(cx)}, ${Math.round(cy)}) "${td.text.slice(0, 30)}"`);
  }
  check(out.length === 0, `teks di luar kanvas: ${out.join(' | ')}`);

  // caption
  const caps = main._layers.filter((l) => /^Caption \d+$/.test(l.name));
  if (expectCaptions) check(caps.length > 0 && res.captions?.count === caps.length, `caption ${caps.length} (hasil ${res.captions?.count})`);
  const onHook = data.spec.caption.onHook !== false;
  const spans = scenes.map((s) => {
    const from = Math.round(s.start * fps), dur = Math.max(1, Math.round(s.end * fps) - from);
    const forced = s.props?.caption;
    const norm = (t) => String(t ?? '').replace(/\*/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const same = Boolean(s.onScreen && s.vo) && norm(s.onScreen) === norm(s.vo);
    const auto = !(s.type === 'outro' || (s.type === 'hook' && !onHook) || same);
    return {a: from / fps, b: (from + dur) / fps, on: forced ? forced === 'on' : auto, id: s.id};
  });
  const bad = caps.filter((l) => !spans.some((sp) => sp.on && l.inPoint >= sp.a - 1e-6 && l.outPoint <= sp.b + 1e-6));
  check(bad.length === 0, `caption di adegan yang caption-nya mati: ${bad.map((l) => `${l.name} ${l.inPoint.toFixed(2)}-${l.outPoint.toFixed(2)}`).join(', ')}`);
  const overlap = caps.filter((l, i) => caps.some((m, j) => j !== i && l.inPoint < m.outPoint - 1e-6 && m.inPoint < l.outPoint - 1e-6));
  check(overlap.length === 0, `caption bertumpuk: ${overlap.map((l) => l.name).join(', ')}`);
  if (data.spec.caption.style === 'subtitle') check(main._layers.filter((l) => / kotak$/.test(l.name)).length === caps.length, 'kotak subtitle tidak sejumlah caption');

  // suara
  if (files === 'ada') {
    check(res.audio?.vo === data.script.clips.length, `suara ${res.audio?.vo} != ${data.script.clips.length} klip`);
    const nSfx = scenes.reduce((n, s) => n + (s.sfx?.length ?? 0), 0);
    check(res.audio?.sfx === nSfx, `sfx ${res.audio?.sfx} != ${nSfx}`);
    check(Boolean(res.audio?.music) === Boolean(data.script.music), 'musik');
  } else {
    check(res.warnings.some((w) => /tidak ditemukan/.test(w)), 'tidak ada peringatan file hilang');
  }

  // marker + chapter
  const markerNode = legacy ? main._layers.find((l) => l.name === 'CATATAN')?.nodes['ADBE Marker'] : main._marker;
  check(markerNode && markerNode.keys.length >= scenes.length, `marker ${markerNode?.keys.length} < ${scenes.length}`);
  if (data.format === 'youtube') {
    const nBab = scenes.filter((s) => s.type === 'bab').length;
    const nCh = markerNode?.keys.filter((k) => k.v.chapter).length ?? 0;
    check(nCh >= nBab && nCh >= 1, `chapter marker ${nCh} < ${nBab} bab`);
  }
  const guide = main._layers.find((l) => l.name === 'CATATAN');
  check(guide && guide.enabled === false && guide.guideLayer === true, 'layer CATATAN tidak ada / tidak nonaktif');

  // file hasil
  const raw = ae.S.written.get(data.paths.result);
  if (check(raw, `hasil.json tidak ditulis (${data.paths.result})`)) {
    let j = null;
    try {
      j = JSON.parse(raw);
    } catch (e) {
      fail(`hasil.json bukan JSON valid: ${e.message}`);
    }
    if (j) check(j.status === 'ok' && j.runId === data.runId && j.project === data.paths.aep, `hasil.json: status ${j.status}, runId ${j.runId}, project ${j.project}`);
  }
  check(ae.S.saved.includes(data.paths.aep), `proyek tidak disimpan ke ${data.paths.aep}`);
  check((ae.S.undo ?? 0) === 0, 'beginUndoGroup/endUndoGroup tidak seimbang');
  check(ae.S.newProjectCalls === 1, 'app.newProject tidak dipanggil tepat sekali');
  if (data.options.frames && !legacy) check(main.saved.length === scenes.length, `frame PNG ${main.saved.length} != ${scenes.length}`);
  if (ae.S.parentWarn) fail(`parenting: ${ae.S.parentWarn}`);

  // expression: semua bisa dievaluasi, hasil sesuai jenis properti
  let nExpr = 0;
  for (const {node, code, layer} of ae.S.exprs) {
    if (node.removed) continue;
    nExpr++;
    const mn = node.mn;
    for (const time of [0, 0.3, 1.1, 5, 400]) {
      for (const textIndex of [1, 2, 5]) {
        let v;
        try {
          v = evalExpr(code, {time, textIndex, value: Array.isArray(node.value) ? node.value : 100});
        } catch (e) {
          fail(`expression error di ${mn} (${layer.name}) t=${time}: ${e.message}\n${code}`);
          break;
        }
        const okType = mn === 'ADBE Text Document' ? typeof v === 'string' : /Rect (Size|Position)$/.test(mn) ? Array.isArray(v) && v.length === 2 && v.every(finite) : finite(v);
        if (!okType) {
          fail(`expression ${mn} (${layer.name}) hasil ${JSON.stringify(v)}`);
          break;
        }
      }
    }
    if (mn === 'ADBE Text Document') {
      const want = layer.textDoc().text;
      const end = evalExpr(code, {time: 400});
      check(end === want, `hitung naik berakhir "${end}", harusnya "${want}"`);
      check(/0/.test(evalExpr(code, {time: 0})), `hitung naik tidak mulai dari 0: "${evalExpr(code, {time: 0})}"`);
    }
    const ks = code.match(/^var s=\[([^\]]*)\];var e=\[([^\]]*)\]/);
    if (ks) {
      const st = ks[1].split(',').map(Number), en = ks[2].split(',').map(Number);
      st.forEach((t0, i) => {
        const at = (t0 + Math.min(en[i], t0 + 0.05)) / 2;
        const on = evalExpr(code, {time: at, textIndex: i + 1});
        const other = evalExpr(code, {time: at, textIndex: i === 0 ? 2 : 1});
        if (on !== 100 || (st.length > 1 && other !== 0)) fail(`karaoke ${layer.name}: kata ${i + 1} pada ${at.toFixed(2)} dtk -> ${on}/${other}`);
      });
    }
  }
  check(nExpr > 0, 'tidak ada expression sama sekali');
  console.log(`  ${res.scenes.length} adegan · ${caps.length} caption (${res.captions?.style}) · suara ${res.audio?.vo ?? 0} · sfx ${res.audio?.sfx ?? 0} · musik ${res.audio?.music ? 'ya' : 'tidak'} · ${nExpr} expression · sorotan: ${res.highlight} · ${res.warnings.length} peringatan`);
}

// sourceRectAtTime dari mock (juga dipakai untuk mode legacy, hanya di sisi pemeriksa)
function Layer_rect(ae, l) {
  const fn = ae.classes.Layer.prototype.sourceRectAtTime;
  if (fn) return fn.call(l);
  const td = l.textDoc()._v, size = td.fontSize, lines = td.text.split('\r'), cw = size * 0.55;
  const w = Math.max(...lines.map((x) => x.length * cw)), h = size * 0.9 + (lines.length - 1) * (td.leading || size * 1.2);
  const j = td.justification;
  return {left: j === JUST.CENTER_JUSTIFY ? -w / 2 : j === JUST.RIGHT_JUSTIFY ? -w : 0, top: -size * 0.72, width: w, height: h};
}

// =============================================================== pratinjau SVG (--svg <folder>): letak akhir tiap adegan
let svgClip = 0;
const hexOf = (c) => `#${c.slice(0, 3).map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('')}`;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function layerMatrix(l) {
  const a = l.tval('ADBE Anchor Point'), p = l.tval('ADBE Position'), s = l.tval('ADBE Scale'), r = (l.tval('ADBE Rotate Z') * Math.PI) / 180;
  const sx = s[0] / 100, sy = s[1] / 100, c = Math.cos(r), n = Math.sin(r);
  return `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) matrix(${(c * sx).toFixed(4)} ${(n * sx).toFixed(4)} ${(-n * sy).toFixed(4)} ${(c * sy).toFixed(4)} 0 0) translate(${(-a[0]).toFixed(1)} ${(-a[1]).toFixed(1)})`;
}
function svgLayer(ae, l) {
  const chain = [];
  for (let q = l; q; q = q._parent) chain.unshift(q);
  const open = chain.map((q) => `<g transform="${layerMatrix(q)}">`).join('');
  const close = '</g>'.repeat(chain.length);
  const op = l.tnode('ADBE Opacity').staticValue() / 100;
  let body = '';
  if (l.kind === 'solid') body = `<rect width="${l.source.width}" height="${l.source.height}" fill="${hexOf(l.color)}"/>`;
  else if (l.kind === 'footage') body = `<rect width="${l.source.width}" height="${l.source.height}" fill="#7a8899" stroke="#fff" stroke-width="6"/><text x="20" y="80" font-size="60" fill="#fff">${esc(l.source.name)}</text>`;
  else if (l.kind === 'comp') {
    const id = `clip${++svgClip}`;
    body = `<clipPath id="${id}"><rect width="${l.source.width}" height="${l.source.height}" rx="${l.nodes['ADBE Mask Parade'].children.length ? 28 : 0}"/></clipPath><g clip-path="url(#${id})">`;
    for (const k of [...l.source._layers].reverse()) if (!k.guideLayer && k.enabled) body += svgLayer(ae, k);
    body += '</g>';
  } else if (l.kind === 'shape') {
    for (const g of l.nodes['ADBE Root Vectors Group'].children) {
      const items = g.children[0].children;
      const fill = items.find((x) => x.mn === 'ADBE Vector Graphic - Fill');
      const stroke = items.find((x) => x.mn === 'ADBE Vector Graphic - Stroke');
      const paint = `fill="${fill ? hexOf(fill.children[0].staticValue()) : 'none'}" fill-opacity="${fill ? fill.children[1].staticValue() / 100 : 0}"` +
        (stroke ? ` stroke="${hexOf(stroke.children[0].staticValue())}" stroke-width="${stroke.children[1].staticValue()}" stroke-opacity="${stroke.children[2].staticValue() / 100}" stroke-linecap="round"` : '');
      for (const it of items) {
        if (it.mn === 'ADBE Vector Shape - Rect') {
          const [w, h] = it.children[0].staticValue(), [x, y] = it.children[1].staticValue(), r = it.children[2].staticValue();
          body += `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${Math.min(r, w / 2, h / 2)}" ${paint}/>`;
        } else if (it.mn === 'ADBE Vector Shape - Ellipse') {
          const [w, h] = it.children[0].staticValue(), [x, y] = it.children[1].staticValue();
          body += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h / 2}" ${paint}/>`;
        } else if (it.mn === 'ADBE Vector Shape - Group') {
          const sh = it.children[0].staticValue();
          if (!sh) continue;
          let d = `M${sh.vertices[0][0]} ${sh.vertices[0][1]}`;
          const n = sh.vertices.length, segs = sh.closed ? n : n - 1;
          for (let i = 0; i < segs; i++) {
            const a = sh.vertices[i], b = sh.vertices[(i + 1) % n], o = sh.outTangents[i], q = sh.inTangents[(i + 1) % n];
            d += ` C${a[0] + o[0]} ${a[1] + o[1]} ${b[0] + q[0]} ${b[1] + q[1]} ${b[0]} ${b[1]}`;
          }
          body += `<path d="${d}${sh.closed ? 'Z' : ''}" ${paint}/>`;
        }
      }
    }
  } else if (l.kind === 'text') {
    const td = l.textDoc()._v, r = Layer_rect(ae, l), size = td.fontSize, lh = td.leading || size * 1.2;
    const cw = size * 0.55 * (1 + td.tracking / 1000);
    let lines = td.text.split('\r');
    if (td.boxText) {
      const max = Math.max(1, Math.floor(td.boxTextSize[0] / cw));
      lines = [];
      let cur = '';
      for (const w of td.text.split(' ')) {
        if (!cur) cur = w;
        else if (`${cur} ${w}`.length <= max) cur += ` ${w}`;
        else {
          lines.push(cur);
          cur = w;
        }
      }
      lines.push(cur);
    }
    const anchor = td.justification === JUST.CENTER_JUSTIFY ? 'middle' : td.justification === JUST.RIGHT_JUSTIFY ? 'end' : 'start';
    const x = anchor === 'middle' ? r.left + r.width / 2 : anchor === 'end' ? r.left + r.width : r.left;
    const fam = /Poppins|Jakarta/.test(td.font) ? 'Poppins, Arial' : 'Inter, Arial';
    const weight = /ExtraBold/.test(td.font) ? 800 : /Bold/.test(td.font) ? 700 : /SemiBold/.test(td.font) ? 600 : 500;
    body = lines.map((t, i) => `<text x="${x}" y="${r.top + size * 0.72 + i * lh}" font-family="${fam}" font-weight="${weight}" font-size="${size}" text-anchor="${anchor}" fill="${hexOf(td.fillColor)}"` +
      (td.applyStroke ? ` stroke="${hexOf(td.strokeColor)}" stroke-width="${td.strokeWidth}" paint-order="stroke"` : '') + `>${esc(t)}</text>`).join('');
  }
  const mask = l.nodes['ADBE Mask Parade'].children[0];
  if (mask) {
    const sh = mask.children[0].staticValue(), fe = mask.children[1].staticValue();
    const n = sh.vertices.length;
    let d = `M${sh.vertices[0][0]} ${sh.vertices[0][1]}`;
    for (let i = 0; i < n; i++) {
      const a = sh.vertices[i], b = sh.vertices[(i + 1) % n], o = sh.outTangents[i], q = sh.inTangents[(i + 1) % n];
      d += ` C${a[0] + o[0]} ${a[1] + o[1]} ${b[0] + q[0]} ${b[1] + q[1]} ${b[0]} ${b[1]}`;
    }
    const id = `mask${++svgClip}`;
    // feather mask: gradasi kasar (tepi bawah memudar), cukup untuk pratinjau
    if (fe && fe[1] > 0) {
      const ys = sh.vertices.map((v) => v[1]), bottom = Math.max(...ys);
      body = `<defs><linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="0" y1="${bottom - fe[1] / 2}" x2="0" y2="${bottom + fe[1] / 2}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>` +
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="20000" height="20000"><rect x="-5000" y="-5000" width="20000" height="${5000 + bottom + fe[1] / 2}" fill="url(#${id}g)"/></mask></defs><g mask="url(#${id})">${body}</g>`;
    } else body = `<clipPath id="${id}"><path d="${d}Z"/></clipPath><g clip-path="url(#${id})">${body}</g>`;
  }
  return `<g opacity="${op}">${open}${body}${close}</g>`;
}
function writeSvgs(ae, data, dir) {
  fs.mkdirSync(dir, {recursive: true});
  const items = ae.getProject().items._list;
  const main = items.find((i) => i.name === data.names.main);
  const W = data.spec.width, H = data.spec.height;
  for (const comp of items.filter((i) => i.typeName === 'Composition' && /^S\d\d /.test(i.name) && !/kartu foto$/.test(i.name))) {
    const L = main._layers.find((l) => l.source === comp);
    const mid = L.startTime + Math.min(comp.duration * 0.7, comp.duration - 0.5);
    const caps = main._layers.filter((l) => /^Caption \d+$/.test(l.name) && l.inPoint <= mid + 1.5 && l.outPoint > L.startTime);
    let body = [...comp._layers].reverse().filter((k) => !k.guideLayer && k.enabled).map((k) => svgLayer(ae, k)).join('');
    const cap = caps[0];
    if (cap) {
      const box = main._layers.find((l) => l.name === `${cap.name} kotak`);
      body += (box ? svgLayer(ae, box) : '') + svgLayer(ae, cap);
    }
    const sp = data.spec;
    const guides = `<rect x="${sp.content.x}" y="${sp.content.y}" width="${sp.content.w}" height="${sp.content.h}" fill="none" stroke="#00ffff" stroke-width="2" stroke-dasharray="10 10"/>` +
      `<rect x="${sp.safe.left}" y="${sp.safe.top}" width="${W - sp.safe.left - sp.safe.right}" height="${H - sp.safe.top - sp.safe.bottom}" fill="none" stroke="#ff4444" stroke-width="2" stroke-dasharray="4 8"/>`;
    fs.writeFileSync(path.join(dir, `${comp.name.replace(/\s+/g, '-')}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(W, H) / 2}" height="${Math.max(W, H) / 2}" viewBox="${-(Math.max(W, H) - W) / 2} ${-(Math.max(W, H) - H) / 2} ${Math.max(W, H)} ${Math.max(W, H)}">` +
        `<rect x="-2000" y="-2000" width="6000" height="6000" fill="#555"/><rect width="${W}" height="${H}" fill="#000"/>${body}${guides}</svg>`);
  }
}

// =============================================================== lint ES3 kasar
function stripCode(src) {
  let out = '', i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && d === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const q = c;
      out += q;
      i++;
      while (i < n && src[i] !== q) {
        if (src[i] === '\\') i++;
        i++;
      }
      out += q;
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}
const ES3_RULES = [
  [/=>/, 'arrow function'],
  [/\blet\s/, 'let'],
  [/\bconst\s/, 'const'],
  [/`/, 'template literal'],
  [/\.map\(/, '.map('],
  [/\.forEach\(/, '.forEach('],
  [/\.filter\(/, '.filter('],
  [/\.reduce\(/, '.reduce('],
  [/\.some\(/, '.some('],
  [/\.every\(/, '.every('],
  [/\.find\(/, '.find('],
  [/\.includes\(/, '.includes('],
  [/\.startsWith\(|\.endsWith\(|\.padStart\(|\.repeat\(/, 'metode String ES6'],
  [/\.trim\(/, '.trim('],
  [/\bJSON\./, 'JSON.'],
  [/Object\.(keys|assign|create|entries|values|defineProperty)/, 'Object ES5+'],
  [/Array\.isArray|Date\.now/, 'API ES5'],
  [/\.bind\(/, '.bind('],
  [/\.\.\./, 'spread'],
  [/\bclass\s+[A-Z]/, 'class'],
  [/\bfor\s*\([^)]*\bof\b/, 'for...of'],
  [/\.(short|long|int|char|byte|float|double|final|static|public|private|protected|package|native|goto|class|enum|export|import|super|default|delete|new|in|do|if|for|var|void|with|throw|case|catch|const|debugger|extends|implements|interface|synchronized|throws|transient|volatile|boolean|abstract)\b(?!\s*\()/, 'kata cadangan ES3 sebagai nama properti (pakai obj["..."])'],
];
function lintEs3(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const problems = [];
  if (/[^\x00-\x7f]/.test(raw)) problems.push('ada karakter non-ASCII (tulis \\uXXXX)');
  const code = stripCode(raw);
  code.split('\n').forEach((line, i) => {
    for (const [re, what] of ES3_RULES) if (re.test(line)) problems.push(`baris ${i + 1}: ${what}: ${line.trim().slice(0, 90)}`);
    const re = /\.indexOf\(/g;
    let m;
    while ((m = re.exec(line))) {
      if (!/String\([^()]*\)$/.test(line.slice(0, m.index))) problems.push(`baris ${i + 1}: .indexOf( bukan pada String(...): ${line.trim().slice(0, 90)}`);
    }
    if (/,\s*[\]}]/.test(line)) problems.push(`baris ${i + 1}: koma di akhir array/objek: ${line.trim().slice(0, 90)}`);
  });
  return problems;
}

// =============================================================== jalankan semua uji
console.log('Uji aekit.jsx + inventaris.jsx dengan After Effects tiruan');

console.log('\n▶ lint ES3');
for (const f of [AEKIT_JSX, INVENTARIS_JSX]) {
  const p = lintEs3(f);
  check(p.length === 0, `${path.basename(f)}:\n      ${p.join('\n      ')}`);
  if (!p.length) console.log(`  ${path.basename(f)}: bersih`);
}
try {
  new vm.Script(AEKIT_CODE, {filename: 'aekit.jsx'});
  new vm.Script(INVENTARIS_CODE, {filename: 'inventaris.jsx'});
  passed++;
} catch (e) {
  fail(`sintaks: ${e.message}`);
}

console.log('\n▶ ikon SVG -> Shape');
{
  const ae = createAE();
  const ctx = vm.createContext({...ae.G});
  vm.runInContext(AEKIT_CODE, ctx);
  const icons = vm.runInContext('AEKIT.ICONS', ctx);
  for (const k of Object.keys(icons)) {
    try {
      const subs = vm.runInContext(`AEKIT.svgPath(AEKIT.ICONS[${JSON.stringify(k)}])`, ctx);
      const pts = subs.flatMap((s) => s.pts);
      const okPts = pts.length > 1 && pts.every((p) => p.every((v) => finite(v) && v > -1 && v < 25));
      check(okPts, `ikon ${k}: titik di luar viewBox`);
    } catch (e) {
      fail(`ikon ${k}: ${e.message}`);
    }
  }
  const circle = vm.runInContext('AEKIT.svgPath("M12 21a9 9 0 100-18 9 9 0 000 18z")', ctx)[0];
  const r = circle.pts.map(([x, y]) => Math.hypot(x - 12, y - 12));
  check(circle.closed && r.every((v) => Math.abs(v - 9) < 1e-6), `lingkaran dari busur: radius ${r.map((v) => v.toFixed(2)).join(',')}`);
  const pn = vm.runInContext('[AEKIT.parseNumber("Rp1.250.000"), AEKIT.parseNumber("2,5x"), AEKIT.parseNumber("73%"), AEKIT.parseNumber("Dua kali")]', ctx);
  check(pn[0].n === 1250000 && pn[0].grouping && pn[0].prefix === 'Rp' && pn[1].n === 2.5 && pn[1].decimals === 1 && pn[2].suffix === '%' && pn[3] === null, `parseNumber: ${JSON.stringify(pn)}`);
  console.log(`  ${Object.keys(icons).length} ikon, parseNumber ok`);
}

const reels = readJson(path.join(CONTOH, 'reels-00-contoh-reels.json'));
const youtube = readJson(path.join(CONTOH, 'youtube-00-contoh-youtube.json'));
const mk = (script, brand, name, options = {}) =>
  buildData(script, brand, {runId: `uji-${name}`, options, paths: mockPaths(script.format, name)});

const cases = [
  ['contoh Reels · AE baru', mk(reels, brandContoh, 'reels', {frames: true}), {}],
  ['contoh YouTube · AE baru', mk(youtube, brandContoh, 'youtube', {frames: true}), {}],
  ['campuran Reels (10 tipe, sfx, musik, brand kit) · AE baru', mk(campuran(reels, 'reels'), brandLive, 'campuran-reels'), {}],
  ['campuran YouTube · AE baru', mk(campuran(youtube, 'youtube'), brandLive, 'campuran-youtube'), {}],
  ['campuran Reels · AE lama (tanpa addBoxText, sourceRectAtTime, characterRange, markerProperty, app.fonts) + media hilang', mk(campuran(reels, 'reels'), brandLive, 'lama-reels', {frames: true}), {mode: 'legacy', files: 'hilang'}],
  ['contoh YouTube · AE lama', mk(youtube, brandContoh, 'lama-youtube'), {mode: 'legacy'}],
  ['contoh Reels lewat build.jsx (literal DATA + #include)', mk(reels, brandLive, 'buildjsx'), {viaBuildJsx: true}],
  ['contoh Reels · AE menolak font yang belum terpasang', mk(reels, brandContoh, 'font-ditolak'), {strictFonts: true}],
];
// script asli (scripts/*/00-contoh-*.json) lewat prepareScript: butuh Remotion terpasang (ffprobe untuk durasi rekaman)
if (fs.existsSync(path.join(ROOT, 'node_modules', '@remotion', 'cli'))) {
  for (const f of ['reels/00-contoh-reels.json', 'youtube/00-contoh-youtube.json']) {
    const file = path.join(SCRIPTS, f);
    if (!fs.existsSync(file)) continue;
    try {
      const s = prepareScript(readScript(file), {quiet: true});
      cases.push([`script asli ${f} (prepareScript)`, mk(s, brandLive, `asli-${s.format}`), {}]);
    } catch (e) {
      console.warn(`  (lewati script asli ${f}: ${e.message.split('\n')[0]})`);
    }
  }
} else console.log('\n  (Remotion belum terpasang: uji script asli dilewati)');

for (const [label, data, opts] of cases) {
  const run = runBuild(data, opts);
  verify(label, data, run, {legacy: opts.mode === 'legacy', files: opts.files ?? 'ada'});
  if (SVG_DIR && run.result) writeSvgs(run.ae, data, path.join(SVG_DIR, `${cases.findIndex((c) => c[0] === label) + 1}-${data.names.main.replace(/\s+/g, '-')}${opts.mode === 'legacy' ? '-ae-lama' : ''}`));
  if (/campuran Reels · AE baru/.test(label)) {
    const res = run.result;
    check(res.warnings.some((w) => /tipe "tipe-aneh" tidak dikenal/.test(w)), 'tipe tidak dikenal tidak diberi peringatan');
    check(res.highlight === 'characterRange', `mode sorotan ${res.highlight}`);
    const stamp = allLayers(run.ae).filter(({l}) => l.name === 'KONFIRMASI');
    check(stamp.length === 1, `cap [KONFIRMASI] ${stamp.length}`);
    const wipes = run.ae.getProject().items._list.find((i) => i.name === data.names.main)._layers.filter((l) => /^Wipe /.test(l.name));
    check(wipes.length === 1, `layer wipe ${wipes.length}`);
  }
  if (/AE lama/.test(label) && run.result) check(run.result.highlight === 'animator', `mode sorotan AE lama ${run.result.highlight}`);
  if (/menolak font/.test(label) && run.result) check(run.result.warnings.some((w) => /ditolak AE/.test(w)), 'tidak ada peringatan font ditolak');
}

console.log('\n▶ AE tanpa izin / batal: app.newProject() dibatalkan');
{
  const data = mk(reels, brandContoh, 'batal');
  const run = runBuild(data, {cancelNewProject: true});
  check(!run.error, `exception: ${run.error}`);
  check(run.result?.status === 'error' && /dibatalkan/.test(run.result.errors.join(' ')), `status batal: ${run.result?.status} ${run.result?.errors}`);
  const raw = run.ae.S.written.get(data.paths.result);
  check(raw && JSON.parse(raw).status === 'error', 'hasil.json status error tidak ditulis');
  check(run.ae.S.saved.length === 0, 'proyek tetap disimpan padahal batal');
  console.log('  hasil: error, proyek lama tidak disentuh');
}

console.log('\n▶ .aep sudah ada: tidak ditimpa');
{
  const data = mk(reels, brandContoh, 'ada');
  const ae = createAE();
  ae.S.written.set(data.paths.aep, '<aep lama>');
  const ctx = vm.createContext({...ae.G});
  vm.runInContext(AEKIT_CODE, ctx);
  ctx.DATA = data;
  const res = vm.runInContext('AEKIT.build(DATA)', ctx);
  check(res.project === data.paths.aep.replace(/\.aep$/, '-v2.aep'), `disimpan ke ${res.project}`);
  check(ae.S.written.get(data.paths.aep) === '<aep lama>', 'file lama tertimpa');
  console.log(`  disimpan sebagai ${path.basename(res.project)}`);
}

for (const mode of ['modern', 'legacy']) {
  console.log(`\n▶ inventaris.jsx · AE ${mode === 'modern' ? 'baru' : 'lama'}`);
  const ae = createAE({mode});
  const ctx = vm.createContext({...ae.G});
  const wrapper = stripPre(renderInventarisJsx({outDir: 'C:/mock/kit/video/ae', runId: `inv-${mode}`, families: ['Poppins', 'Inter', 'Plus Jakarta Sans']}));
  try {
    vm.runInContext(`${wrapper}\n${INVENTARIS_CODE}`, ctx, {filename: 'inventaris.jsx'});
    passed++;
  } catch (e) {
    fail(`exception: ${e.stack}`);
    continue;
  }
  const raw = ae.S.written.get('C:/mock/kit/video/ae/profil-ae.json');
  if (!check(raw, 'profil-ae.json tidak ditulis')) continue;
  const p = JSON.parse(raw);
  check(p.runId === `inv-${mode}` && p.ae.version === ae.G.app.version, 'profil: runId / versi');
  check(ae.S.written.has('C:/mock/kit/video/ae/profil-ae.md'), 'profil-ae.md tidak ditulis');
  check(ae.S.comps.length === 0 && ae.S.renderQueue.length === 0, 'comp / render queue sementara tidak dihapus');
  check(ae.S.alerts.length === 0, `alert muncul padahal AEKIT_NO_ALERT: ${ae.S.alerts}`);
  if (mode === 'modern') {
    check(p.render.h264 === 'H.264 - Match Render Settings - 15 Mbps', `template H.264: ${p.render.h264}`);
    check(p.fonts.available && p.fonts.list.length === 6 && p.fonts.brand.find((f) => f.family === 'Plus Jakarta Sans')?.terpasang === false, 'daftar font');
    check(p.ae.afterfx && p.ae.aerender, 'path AfterFX / aerender');
    check(p.kitProbe.addBoxText && p.kitProbe.characterRange && p.kitProbe.expressionSelector, `uji fitur: ${JSON.stringify(p.kitProbe)}`);
  } else {
    check(p.render.h264 === null && p.catatan.some((c) => /H\.264/.test(c)), 'AE lama: catatan tanpa template H.264');
    check(!p.fonts.available, 'AE lama: font tidak terbaca');
  }
  console.log(`  profil: AE ${p.ae.version}, H.264 ${p.render.h264 ?? '-'}, font ${p.fonts.list.length}, ${p.catatan.length} catatan`);
}

console.log(`\n${failed ? '✗' : '✓'} ${passed} pemeriksaan lulus, ${failed} gagal`);
process.exit(failed ? 1 : 0);
