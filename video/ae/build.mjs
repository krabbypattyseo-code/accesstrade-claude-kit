#!/usr/bin/env node
// Jalur After Effects: script JSON -> build.jsx -> After Effects membangun proyek .aep (-> opsional render aerender).
// Jalankan dari folder video/:
//
//   node ae/build.mjs scripts/reels/01-slug.json              bangun proyek .aep di output/reels/
//   node ae/build.mjs scripts/reels/01-slug.json --render     bangun lalu render mp4 (aerender, template H.264 dari profil)
//   node ae/build.mjs scripts/reels/01-slug.json --no-run     hanya tulis build.jsx (tanpa membuka AE)
//   flag lain: --frames (PNG tengah tiap adegan) · --draft (render cepat "Draft Settings") · --timpa (boleh menimpa .aep)
//              --om "<template Output Module>" · --rs "<template Render Settings>" · --timeout <detik, default 600>
//   node ae/build.mjs --inventaris                            kenali AE di PC ini -> ae/profil-ae.json + .md
//   node ae/build.mjs --bedah                                 baca project editor yang sedang terbuka -> ae/proyek/_bedah/
//
// Tanpa shell: semua program dipanggil dengan daftar argumen (path boleh berisi spasi).
import fs from 'node:fs';
import path from 'node:path';
import {spawn, spawnSync} from 'node:child_process';
import {checkScript, outputBase, prepareScript, readScript, timestamp, videoName} from '../remotion/lib/scripts.mjs';
import {buildBrand} from '../remotion/lib/brand.mjs';
import {
  AE_DIR, AEKIT_JSX, FONT_MANUAL, INVENTARIS_JSX, PROFIL_JSON, PROYEK_DIR,
  buildData, freeAepPath, renderBuildJsx, renderInventarisJsx,
} from './lib/data.mjs';

const IS_WIN = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const args = process.argv.slice(2);
const flag = (k) => args.includes(k);
const optVal = (k) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null;
};
const rel = (p) => path.relative(process.cwd(), p) || p;
const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const readJson = (file) => {
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    console.warn(`! ${rel(file)} tidak bisa dibaca (${e.message}), diabaikan`);
    return null;
  }
};
const runId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
// build.jsx ditulis UTF-8 dengan BOM supaya ExtendScript membaca path non-ASCII dengan benar
const writeJsx = (file, body) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `\uFEFF${body}`, 'utf8');
};

// ---------------------------------------------------------------- cari After Effects

const yearOf = (name) => {
  const m = String(name).match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
};

/** {exe, aerender, app, name} AE terbaru di PC ini (profil dulu, lalu scan folder standar) */
const findAE = (profil) => {
  const fromProfil = profil?.ae?.afterfx;
  if (IS_WIN) {
    if (fromProfil && fs.existsSync(fromProfil)) {
      const ar = profil?.ae?.aerender && fs.existsSync(profil.ae.aerender) ? profil.ae.aerender : path.join(path.dirname(fromProfil), 'aerender.exe');
      return {exe: fromProfil, aerender: fs.existsSync(ar) ? ar : null, name: path.basename(path.dirname(path.dirname(fromProfil)))};
    }
    const bases = [...new Set([process.env.ProgramFiles, 'C:\\Program Files'].filter(Boolean))];
    const found = [];
    for (const b of bases) {
      const adobe = path.join(b, 'Adobe');
      if (!fs.existsSync(adobe)) continue;
      for (const d of fs.readdirSync(adobe)) {
        if (!/^Adobe After Effects/i.test(d)) continue;
        const exe = path.join(adobe, d, 'Support Files', 'AfterFX.exe');
        if (fs.existsSync(exe)) found.push({exe, aerender: path.join(adobe, d, 'Support Files', 'aerender.exe'), name: d, year: yearOf(d), beta: /beta/i.test(d)});
      }
    }
    found.sort((a, b) => Number(a.beta) - Number(b.beta) || b.year - a.year);
    const hit = found[0];
    if (hit && !fs.existsSync(hit.aerender)) hit.aerender = null;
    return hit ?? null;
  }
  if (IS_MAC) {
    const found = [];
    if (fs.existsSync('/Applications')) {
      for (const d of fs.readdirSync('/Applications')) {
        if (!/^Adobe After Effects/i.test(d)) continue;
        const app = path.join('/Applications', d, `${d}.app`);
        if (fs.existsSync(app)) found.push({app, name: d, aerender: path.join('/Applications', d, 'aerender'), year: yearOf(d), beta: /beta/i.test(d)});
      }
    }
    found.sort((a, b) => Number(a.beta) - Number(b.beta) || b.year - a.year);
    const hit = found[0];
    if (hit && profil?.ae?.aerender && fs.existsSync(profil.ae.aerender)) hit.aerender = profil.ae.aerender;
    if (hit && !fs.existsSync(hit.aerender)) hit.aerender = null;
    return hit ?? null;
  }
  return null;
};

/** Jalankan file .jsx di After Effects (AE dibuka kalau belum). Tidak menunggu AE selesai. */
const launchJsx = (ae, jsxFile) => {
  if (IS_WIN) {
    const child = spawn(ae.exe, ['-r', jsxFile], {detached: true, stdio: 'ignore', windowsHide: false});
    child.on('error', (e) => console.error(`✗ AfterFX.exe gagal dijalankan: ${e.message}`));
    child.unref();
    return true;
  }
  if (IS_MAC) {
    const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const script = `tell application "${esc(ae.name)}" to DoScriptFile "${esc(jsxFile)}"`;
    const child = spawn('osascript', ['-e', script], {detached: true, stdio: 'ignore'});
    child.on('error', (e) => console.error(`✗ osascript gagal: ${e.message}`));
    child.unref();
    return true;
  }
  return false;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Tunggu file JSON dengan runId yang cocok (dan status bukan "berjalan"). */
const waitResult = async (file, id, timeoutSec, label) => {
  const until = Date.now() + timeoutSec * 1000;
  let started = false;
  let lastDot = Date.now();
  while (Date.now() < until) {
    if (fs.existsSync(file)) {
      try {
        const j = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
        if (j.runId === id) {
          if (j.status !== 'berjalan') return j;
          if (!started) {
            started = true;
            console.log(`  AE mulai ${label}...`);
          }
        }
      } catch {
        // file sedang ditulis, coba lagi
      }
    }
    if (Date.now() - lastDot > 30000) {
      console.log(`  masih menunggu AE (${Math.round((until - Date.now()) / 1000)} dtk lagi)`);
      lastDot = Date.now();
    }
    await sleep(1000);
  }
  return null;
};

const timeoutSec = Number(optVal('--timeout')) > 0 ? Number(optVal('--timeout')) : 600;
const profil = readJson(PROFIL_JSON);
const manualFonts = readJson(FONT_MANUAL) ?? {};

const noAE = () => {
  console.log('');
  console.log('  After Effects tidak ditemukan otomatis. Jalankan manual:');
  console.log('  AE > File > Scripts > Run Script File... > pilih file .jsx di atas.');
};

const waitHelp = (what) => {
  console.error(`✗ AE belum menulis ${what} dalam ${timeoutSec} dtk. Cek:`);
  console.error('  1. AE terbuka dan tidak ada dialog yang menunggu jawaban (mis. simpan proyek lama, font hilang)');
  console.error('  2. Edit > Preferences > Scripting & Expressions > "Allow Scripts to Write Files and Access Network" nyala');
  console.error('  3. Jalankan ulang perintah ini, atau tambah --timeout 1200 untuk proyek besar');
};

// ---------------------------------------------------------------- --bedah
// Baca project yang sedang terbuka di AE (tanpa mengubahnya) -> ae/proyek/_bedah/bedah-<nama>.json.
// Dipakai di chat pertama /video-ae untuk mempelajari gaya kerja editor.

if (flag('--bedah')) {
  const BEDAH_JSX = path.join(AE_DIR, 'jsx', 'bedah-proyek.jsx');
  const outDir = path.join(PROYEK_DIR, '_bedah');
  fs.mkdirSync(outDir, {recursive: true});
  console.log(`▶ bedah project AE yang sedang terbuka · ${rel(BEDAH_JSX)}`);
  if (flag('--no-run')) {
    console.log('  --no-run: AE tidak dibuka. Jalankan manual lewat File > Scripts > Run Script File...');
    process.exit(0);
  }
  const ae = findAE(profil);
  const mulai = Date.now();
  if (!ae || !launchJsx(ae, BEDAH_JSX)) {
    noAE();
    process.exit(1);
  }
  console.log(`  menunggu hasil di ${rel(outDir)} (maks ${timeoutSec} dtk). AE menampilkan pesan "Selesai": klik OK.`);
  const until = Date.now() + timeoutSec * 1000;
  while (Date.now() < until) {
    const baru = fs.readdirSync(outDir).filter((f) => f.endsWith('.json')).map((f) => path.join(outDir, f)).filter((f) => fs.statSync(f).mtimeMs >= mulai - 1000);
    if (baru.length) {
      console.log(`✓ ${rel(baru[0])}`);
      process.exit(0);
    }
    await sleep(1000);
  }
  waitHelp('hasil bedah');
  process.exit(1);
}

// ---------------------------------------------------------------- --inventaris

if (flag('--inventaris')) {
  const id = runId();
  const brand = buildBrand();
  const families = [...new Set([brand.font.display.family, brand.font.body.family])];
  const wrapper = path.join(PROYEK_DIR, '_inventaris', 'inventaris-run.jsx');
  writeJsx(wrapper, renderInventarisJsx({outDir: AE_DIR, runId: id, families, inventarisPath: INVENTARIS_JSX}));
  console.log(`▶ inventaris AE · pembungkus: ${rel(wrapper)}`);
  if (flag('--no-run')) {
    console.log('  --no-run: AE tidak dibuka.');
    process.exit(0);
  }
  const ae = findAE(profil);
  if (!ae || !launchJsx(ae, wrapper)) {
    noAE();
    process.exit(1);
  }
  console.log(`  membuka ${ae.name} ... (menunggu profil-ae.json, maks ${timeoutSec} dtk)`);
  const p = await waitResult(PROFIL_JSON, id, timeoutSec, 'inventaris');
  if (!p) {
    waitHelp('profil-ae.json');
    process.exit(1);
  }
  console.log(`✓ ${rel(PROFIL_JSON)} + profil-ae.md`);
  console.log(`  AE ${p.ae?.version} · ${p.ae?.os}`);
  console.log(`  izin tulis file: ${p.prefs?.scriptsCanWriteFiles === false ? 'MATI' : p.prefs?.scriptsCanWriteFiles ? 'nyala' : 'tidak terbaca'}`);
  console.log(`  template H.264: ${p.render?.h264 ?? 'tidak ada (lihat profil-ae.md)'}`);
  console.log(`  font: ${p.fonts?.available ? `${p.fonts.list.length} gaya terbaca` : 'tidak terbaca (isi ae/font-manual.json kalau perlu)'}`);
  for (const f of p.fonts?.brand ?? []) console.log(`  - ${f.family}: ${f.terpasang === false ? 'BELUM TERPASANG' : f.terpasang ? 'ada' : 'tidak bisa dicek'}`);
  for (const n of p.catatan ?? []) console.warn(`! ${n}`);
  process.exit(0);
}

// ---------------------------------------------------------------- build proyek

const input = args.find((a) => !a.startsWith('--') && /\.(json|md)$/i.test(a));
if (!input) {
  console.error('Pakai: node ae/build.mjs <file script> [--no-run] [--render] [--frames] [--draft] [--timpa] [--om "<template>"] [--rs "<template>"]');
  console.error('       node ae/build.mjs --inventaris');
  process.exit(1);
}
const file = path.resolve(process.cwd(), input);
if (!fs.existsSync(file)) die(`script tidak ditemukan: ${input}`);

const script = prepareScript(readScript(file));
const {errors, warnings} = checkScript(script);
const brand = buildBrand();
const fmt = script.format;
const base = outputBase(script);
const options = {frames: flag('--frames'), draft: flag('--draft'), overwrite: flag('--timpa')};
const aep = freeAepPath(base, options.overwrite);
const mp4 = `${base}-ae${options.draft ? '-draft' : ''}.mp4`;
const proyek = path.join(PROYEK_DIR, `${fmt}-${videoName(script)}`);
const resultFile = path.join(proyek, 'hasil.json');
const id = runId();
const dur = script.scenes[script.scenes.length - 1]?.end ?? 0;

console.log(`▶ AE · ${fmt} · ${videoName(script)} · ${script.title ?? ''}`);
console.log(`  adegan  : ${script.scenes.map((s) => `${s.id}:${s.type}`).join(' · ')}`);
console.log(`  durasi  : ${timestamp(dur)}`);
console.log(`  suara   : ${script.media.clips.length ? `${script.media.clips.length} potongan rekaman` : 'belum ada rekaman (timing dari dur)'}`);
for (const w of warnings) console.warn(`! ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}

const data = buildData(script, brand, {
  profil,
  manual: manualFonts,
  options,
  runId: id,
  paths: {aep, mp4, result: resultFile, frames: path.join(proyek, 'frames'), proyek},
});
const guessed = data.fontDetail.filter((f) => f.sumber.startsWith('tebakan'));
console.log(`  font    : ${[...new Set(data.fontDetail.map((f) => f.postScriptName))].join(', ')}`);
if (guessed.length) console.warn(`! nama font ditebak (${profil ? 'tidak ada di profil' : 'belum ada profil-ae.json'}). Jalankan: node ae/build.mjs --inventaris`);
if (aep !== `${base}.aep`) console.log(`  .aep lama tidak ditimpa, proyek baru: ${rel(aep)} (pakai --timpa untuk menimpa)`);

const jsxFile = path.join(proyek, 'build.jsx');
writeJsx(jsxFile, renderBuildJsx(data, AEKIT_JSX));
console.log(`✓ build.jsx: ${rel(jsxFile)}`);

const render = async (aepFile, compName) => {
  const ae = findAE(profil);
  const om = optVal('--om') ?? profil?.render?.h264 ?? null;
  if (!om) {
    console.error('✗ Template Output Module H.264 belum diketahui, render dibatalkan (tidak menebak nama template).');
    console.error('  Jalankan dulu: node ae/build.mjs --inventaris   (mengisi render.h264 di ae/profil-ae.json)');
    console.error('  Kalau AE tidak punya template H.264: Edit > Templates > Output Module > New > Format H.264, lalu inventaris lagi.');
    console.error('  Atau sebut langsung: --om "H.264 - Match Render Settings - 15 Mbps"');
    return 1;
  }
  const aerender = ae?.aerender ?? profil?.ae?.aerender ?? null;
  if (!aerender || !fs.existsSync(aerender)) {
    console.error('✗ aerender tidak ditemukan. Isi ae.aerender di ae/profil-ae.json (jalankan --inventaris).');
    return 1;
  }
  const rs = optVal('--rs') ?? (options.draft ? 'Draft Settings' : 'Best Settings');
  const known = profil?.render?.renderSettingsTemplates ?? [];
  if (known.length && !known.includes(rs)) {
    console.error(`✗ Template Render Settings "${rs}" tidak ada di AE ini (AE berbahasa lain memakai nama lain).`);
    console.error(`  Pilihan: ${known.join(' | ')}`);
    console.error('  Sebut dengan --rs "<nama>"');
    return 1;
  }
  fs.mkdirSync(path.dirname(mp4), {recursive: true});
  console.log(`▶ render: ${rel(mp4)} · ${om} · ${rs}`);
  const r = spawnSync(aerender, ['-project', aepFile, '-comp', compName, '-output', mp4, '-OMtemplate', om, '-RStemplate', rs], {stdio: 'inherit'});
  if (r.error) {
    console.error(`✗ aerender gagal dijalankan: ${r.error.message}`);
    return 1;
  }
  if (r.status !== 0 || !fs.existsSync(mp4)) {
    console.error(`✗ aerender selesai dengan kode ${r.status}${fs.existsSync(mp4) ? '' : ', file mp4 tidak ada'}. Baca log di atas.`);
    return 1;
  }
  console.log(`✓ video: ${rel(mp4)}`);
  return 0;
};

if (flag('--no-run')) {
  console.log('  --no-run: AE tidak dibuka. Jalankan file di atas lewat AE > File > Scripts > Run Script File.');
  if (flag('--render')) {
    const existing = fs.existsSync(`${base}.aep`) ? `${base}.aep` : null;
    if (!existing) die('--render dengan --no-run butuh .aep yang sudah ada di output/.');
    process.exit(await render(existing, data.names.main));
  }
  process.exit(0);
}

const ae = findAE(profil);
if (!ae) {
  noAE();
  process.exit(1);
}
if (!launchJsx(ae, jsxFile)) {
  noAE();
  process.exit(1);
}
console.log(`  membuka ${ae.name} ... (menunggu hasil, maks ${timeoutSec} dtk)`);
console.log('  kalau AE bertanya "simpan proyek?", jawab dulu di AE: proyekmu tidak ditutup tanpa ditanya.');
const res = await waitResult(resultFile, id, timeoutSec, 'membangun proyek');
if (!res) {
  waitHelp('hasil.json');
  if (fs.existsSync(aep)) console.error(`  (${rel(aep)} sudah ada: buka manual di AE)`);
  process.exit(1);
}

const ok = res.scenes?.filter((s) => s.status === 'ok').length ?? 0;
console.log(`${res.status === 'ok' ? '✓' : '✗'} proyek: ${res.project ? rel(res.project) : '(tidak tersimpan)'} · ${res.seconds} dtk di AE ${res.aeVersion ?? ''}`);
console.log(`  comp    : ${res.mainComp} · ${res.size?.join('x')} · ${res.duration} dtk`);
console.log(`  adegan  : ${ok}/${res.scenes?.length ?? 0} ok${res.scenes?.some((s) => s.status !== 'ok') ? ` · gagal: ${res.scenes.filter((s) => s.status !== 'ok').map((s) => s.id).join(', ')}` : ''}`);
console.log(`  caption : ${res.captions?.count ?? 0} (${res.captions?.style ?? '-'}) · suara ${res.audio?.vo ?? 0} · sfx ${res.audio?.sfx ?? 0} · musik ${res.audio?.music ? 'ya' : 'tidak'}`);
if (res.frames?.length) console.log(`  frame   : ${res.frames.length} PNG di ${rel(path.join(proyek, 'frames'))}`);
for (const w of res.warnings ?? []) console.warn(`! AE: ${w}`);
for (const e of res.errors ?? []) console.error(`✗ AE: ${e}`);
console.log(`  laporan : ${rel(resultFile)}`);

let code = res.status === 'ok' ? 0 : 1;
if (flag('--render')) {
  if (!res.project) die('proyek tidak tersimpan, render dibatalkan');
  code = (await render(res.project, res.mainComp)) || code;
}
process.exit(code);
