// Dijalankan otomatis sebelum Studio dan render. Menulis src/generated/ (jangan diedit manual):
//  - brand.json   : warna, font, ukuran, caption, motion dari ../brand/tokens.json (+ default kit)
//  - fonts.ts     : import Google Fonts sesuai brand (statis, supaya bundle kecil)
//  - scripts.json : semua script di ../scripts/reels/ dan ../scripts/youtube/ → composition di Studio
// Logo brand (tokens.logo.file, relatif ke brand/) disalin ke public/brand/.
import fs from 'node:fs';
import path from 'node:path';
import {BRAND, GENERATED, PUBLIC, ROOT} from './lib/paths.mjs';
import {DEFAULT_BRAND, buildBrand} from './lib/brand.mjs';
import {formatOf, listScripts, prepareScript, readScript, videoName} from './lib/scripts.mjs';

fs.mkdirSync(GENERATED, {recursive: true});
const writeIfChanged = (file, body) => {
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== body) fs.writeFileSync(file, body);
};

// ------------------------------------------------------------ brand + logo
const brand = buildBrand();
if (brand.logo.file) {
  const srcFile = path.resolve(BRAND, brand.logo.file);
  if (fs.existsSync(srcFile)) {
    const dest = path.join(PUBLIC, 'brand', `logo${path.extname(srcFile).toLowerCase()}`);
    fs.mkdirSync(path.dirname(dest), {recursive: true});
    fs.copyFileSync(srcFile, dest);
    brand.logo.src = path.posix.join('brand', path.basename(dest));
  } else {
    console.warn(`! logo tidak ditemukan: brand/${brand.logo.file} (outro memakai nama brand)`);
  }
}

// ------------------------------------------------------------ fonts.ts (Google Fonts)
const gfIndexFile = path.join(ROOT, 'node_modules', '@remotion', 'google-fonts', 'dist', 'esm', 'index.mjs');
const gfIndex = fs.existsSync(gfIndexFile) ? fs.readFileSync(gfIndexFile, 'utf8') : '';
const importNameOf = (family) => {
  const m = [...gfIndex.matchAll(/fontFamily: '([^']+)',\s*importName: '([^']+)'/g)].find((x) => x[1].toLowerCase() === family.toLowerCase());
  return m?.[2];
};
for (const k of ['display', 'body']) {
  if (!importNameOf(brand.font[k].family)) {
    console.warn(`! font "${brand.font[k].family}" tidak ada di Google Fonts, pakai ${DEFAULT_BRAND.font[k].family}`);
    brand.font[k] = structuredClone(DEFAULT_BRAND.font[k]);
  }
}
const families = [...new Set([brand.font.display.family, brand.font.body.family])];
const weightsOf = (fam) => [
  ...new Set([...(fam === brand.font.display.family ? brand.font.display.weights : []), ...(fam === brand.font.body.family ? brand.font.body.weights : [])]),
];
const fontsTs = [
  '// Dibuat otomatis oleh sync.mjs dari brand/tokens.json. Jangan diedit manual.',
  ...families.map((f, i) => `import {loadFont as load${i}, getInfo as info${i}} from '@remotion/google-fonts/${importNameOf(f)}';`),
  '',
  'const pick = (info: {fonts: Record<string, Record<string, unknown>>}, want: string[]) =>',
  '  want.filter((w) => Object.keys(info.fonts.normal ?? {}).includes(w));',
  ...families.flatMap((f, i) => [
    `const w${i} = pick(info${i}() as never, ${JSON.stringify(weightsOf(f))});`,
    `const family${i} = load${i}('normal', {weights: (w${i}.length ? w${i} : undefined) as never, subsets: ['latin']}).fontFamily;`,
  ]),
  '',
  `export const FONT_DISPLAY = \`\${family${families.indexOf(brand.font.display.family)}}, 'Helvetica Neue', Arial, sans-serif\`;`,
  `export const FONT_BODY = \`\${family${families.indexOf(brand.font.body.family)}}, 'Helvetica Neue', Arial, sans-serif\`;`,
  '',
].join('\n');
writeIfChanged(path.join(GENERATED, 'fonts.ts'), fontsTs);
writeIfChanged(path.join(GENERATED, 'brand.json'), JSON.stringify(brand, null, 2));

// ------------------------------------------------------------ scripts
const out = [];
for (const file of listScripts()) {
  try {
    const script = prepareScript(readScript(file), {quiet: true});
    out.push({id: `${formatOf(script)}-${videoName(script)}`.replace(/[^a-zA-Z0-9-]/g, '-'), format: script.format, script});
  } catch (e) {
    console.warn(`- lewati ${path.basename(file)}: ${e.message}`);
  }
}
writeIfChanged(path.join(GENERATED, 'scripts.json'), JSON.stringify(out, null, 2));

console.log(`sync: brand dari ${brand.source} · font ${families.join(' + ')} · ${out.length} script${out.length ? ` (${out.map((o) => o.id).join(', ')})` : ''}`);
