// Prepara las fotos mejoradas por Bruno (referencias/gym/imagenes mejoradas/gym_textura) para el sitio:
// las lleva a un tamaño de trabajo y vuelve a aplicar los cambios de letreros (escalando las
// coordenadas que se midieron sobre las referencias originales de ~735 px).
//
// Uso (desde frontend/):  node scripts/club3d/hq.mjs [vista]
// Salida: scripts/club3d/hq/<vista>.jpg (y la ropa de Atelier en scripts/club3d/merch/)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SRC = path.resolve(ROOT, '../referencias/gym/imagenes mejoradas/gym_textura');
const OUT = path.join(ROOT, 'scripts/club3d/hq');
fs.mkdirSync(OUT, { recursive: true });
sharp.cache(false);

const glowWarm = 'rgba(255,196,120,0.95)';

// origW: ancho de la referencia original sobre la que se midieron las coordenadas.
const VIEWS = {
  'v-entrada1': {
    file: 'posible_entrada_1_textura.jpg', origW: 735,
    patch: { boxes: [{ box: [286, 218, 160, 64], noise: 4, blur: 1.2 }], text: [
      { s: 'UMBRAL', font: '400 34px IS', color: '#4a3a2b', spacing: 9, x: 370, y: 252, shadow: 'rgba(0,0,0,0.35)', blur: 2, dy: 1 },
      { s: 'BOUTIQUE FITNESS CLUB', font: '600 6.5px MR', color: '#5a4a3a', spacing: 3, x: 370, y: 271, alpha: 0.9 },
    ], crop: [0, 10, 723, 558] },
  },
  'v-entrada2': {
    file: 'posible_entrada_2_textura.jpg', origW: 735,
    patch: { boxes: [{ box: [100, 76, 195, 182], noise: 2, blur: 4 }], text: [
      { s: 'UMBRAL', font: '400 40px IS', color: '#f6e2bf', spacing: 8, x: 193, y: 202, shadow: glowWarm, blur: 9, dy: 0, passes: 2 },
      { s: 'BOUTIQUE FITNESS CLUB', font: '600 7px MR', color: '#f3dcb4', spacing: 3, x: 193, y: 222, shadow: 'rgba(255,196,120,0.8)', blur: 5, dy: 0 },
    ], logos: [{ x: 193, y: 120, s: 1.25, color: '#f8e4c2', glow: glowWarm, blur: 10, width: 1.5, passes: 2 }] },
  },
  'v-pesas1': { file: 'gimnasio_aestetic_3_textura.jpg', origW: 735 },
  'v-pesas2': { file: 'gimnasio_aestetic_4_textura.jpg', origW: 1024 },
  'v-pesas3': { file: 'gimnasio_aestetic_1_textura.jpg', origW: 736 },
  'v-pesas4': { file: 'gimnasio_aestetic_6_textura.jpg', origW: 736 },
  'v-fuerza1': {
    file: 'gimnasio_aestetic_8_textura.jpg', origW: 1200,
    patch: { boxes: [{ box: [535, 270, 130, 56], noise: 5, blur: 1.2 }], text: [
      { s: 'UMBRAL', font: '500 21px MR', color: '#ece2d4', spacing: 6, x: 603, y: 298 },
      { s: 'Estudio de fuerza', font: '400 11px MR', color: '#ece2d4', spacing: 2, x: 600, y: 316, alpha: 0.9 },
    ] },
  },
  'v-fuerza2': { file: 'gimnasio_aestetic_2_textura.jpg', origW: 736 },
  'v-fuerza3': {
    file: 'gimnasio_aestetic_5_textura.jpg', origW: 736,
    patch: { boxes: [{ box: [306, 516, 76, 36], noise: 3, blur: 1.5 }], text: [{ s: 'UMBRAL', font: '600 11px MR', color: '#d6d0c6', spacing: 2, x: 343, y: 540 }] },
  },
  'v-fuerza4': { file: 'gimnasio_aestetic_7_textura.jpg', origW: 736 },
  'v-vest1': {
    file: 'vestidor_1_textura.jpg', origW: 735,
    patch: { boxes: [{ box: [286, 126, 74, 82], noise: 3, blur: 1.2 }, { box: [389, 326, 28, 30], noise: 3, blur: 1 }, { box: [482, 336, 16, 22], noise: 3, blur: 1 }], text: [
      { s: 'UMBRAL', font: '400 19px IS', color: '#f0d8ae', spacing: 3, x: 323, y: 191, shadow: 'rgba(255,196,120,0.9)', blur: 6, dy: 0, passes: 2 },
      { s: 'VESTIDORES', font: '600 5px MR', color: '#f0d8ae', spacing: 2, x: 323, y: 201, shadow: 'rgba(255,196,120,0.7)', blur: 3, dy: 0 },
    ], logos: [
      { x: 323, y: 149, s: 0.6, color: '#f4dcb4', glow: 'rgba(255,196,120,0.9)', blur: 6, width: 1.6, passes: 2 },
      { x: 403, y: 341, s: 0.42, color: '#9c8e7c', width: 2.2 },
    ] },
  },
  'v-vest2': { file: 'vestidor_2_textura.jpg', origW: 736 },
  'v-regaderas': {
    file: 'vestidor_zona_de_regaderas_textura.jpg', origW: 736, cropH: 0.92,
    patch: { boxes: [{ box: [86, 350, 60, 84], noise: 3, blur: 2 }], text: [
      { s: 'UMBRAL', font: '600 9px MR', color: '#f3dfc2', spacing: 2, x: 116, y: 371, shadow: 'rgba(255,210,150,0.8)', blur: 4, dy: 0 },
      { s: 'Recovery', font: '400 7px MR', color: '#e8d4b8', x: 116, y: 384 },
      { s: 'Suite privada', font: '400 6.5px MR', color: '#e8d4b8', x: 116, y: 405, alpha: 0.85 },
    ] },
  },
  'v-spa': { file: 'vestidor_zona_de_bano_privado_textura.jpg', origW: 1200 },
  exterior: {
    file: 'Imagen_gimnasio_por_fuera_textura.jpg', origW: 735,
    patch: { boxes: [{ box: [306, 138, 78, 92], noise: 3, blur: 2 }, { box: [445, 270, 150, 58], noise: 3, blur: 2 }], text: [
      { s: 'UMBRAL', font: '600 25px MR', color: '#ffffff', spacing: 7, x: 522, y: 309, shadow: 'rgba(255,255,255,0.9)', blur: 7, dy: 0, passes: 2 },
    ], logos: [{ x: 344, y: 180, s: 0.95, color: '#ffffff', glow: 'rgba(255,255,255,0.95)', blur: 7, width: 1.8, passes: 2 }] },
  },
  // Merch (sección Atelier): se guardan en scripts/club3d/merch.
  chamarra: {
    file: 'referencia_logo_con_chamarra_textura.jpg', origW: 736, out: 'merch',
    patch: { boxes: [{ box: [262, 344, 226, 178], noise: 6, blur: 2.5 }], logos: [{ x: 368, y: 432, s: 2.6, color: '#c9a46a', glow: 'rgba(0,0,0,0.7)', blur: 3, width: 1.7 }] },
  },
  caminando: {
    file: 'diseño_de_sección_textura.jpg', origW: 736, out: 'merch', targetW: 3200,
    patch: {
      boxes: [[464, 290, 132, 40, 4, 1.5], [510, 332, 48, 36, 4, 1.5], [452, 278, 142, 66, 0, 0, null, [0, 124]], [500, 324, 70, 54, 0, 0, null, [0, 100]], [570, 528, 34, 24, 4, 1.2], [664, 548, 46, 36, 4, 1.2], [536, 786, 30, 18, 3, 1.2], [514, 804, 22, 16, 3, 1.2], [578, 22, 150, 72, 2, 1.5], [628, 844, 84, 80, 2, 1.5]]
        .map(([x, y, w, h, noise, blur, detail, from]) => (from ? { box: [x, y, w, h], from, feather: 0.22, blur: 0 } : { box: [x, y, w, h], noise, blur, detail })),
      text: [{ s: 'UMBRAL', font: '600 15px MR', color: '#efe9df', spacing: 3, x: 530, y: 318 }],
      logos: [{ x: 531, y: 350, s: 0.42, color: '#efe9df', width: 2.2 }],
      crop: [442, 0, 294, 981],
    },
  },
  active: {
    file: 'referencia_personaje_o_seccion_textura.jpg', origW: 1179, out: 'merch',
    patch: {
      boxes: [[1036, 1182, 124, 64, 3, 2], [846, 1240, 312, 150, 3, 2], [1004, 1430, 156, 52, 3, 2], [776, 1482, 384, 64, 3, 2], [76, 1356, 94, 56, 3, 1.5]]
        .map(([x, y, w, h, noise, blur]) => ({ box: [x, y, w, h], noise, blur })),
      // Sin la franja clara del borde derecho.
      crop: [0, 0, 1150, 1870],
    },
    // El morado de la ropa y el fondo pasa a moka; la piel no se toca (ver recolor()).
    recolor: { from: [262, 332], feather: 14, hue: 28, sat: 0.75 },
  },
  // Playera y gorra: referencias originales (no hay versión mejorada).
  camiseta: {
    ref: 'referencia logo en camiseta.jpg', origW: 736, out: 'merch', targetW: 1600,
    patch: {
      boxes: [{ box: [284, 380, 144, 150], from: [-112, -8], feather: 0.17, blur: 0 }],
      // Sin logo: solo se borra el original y queda la malla.
    },
  },
  gorra: {
    ref: 'referencia logo en gorra.jpg', origW: 736, out: 'merch', targetW: 1600,
    patch: {
      boxes: [{ box: [334, 356, 78, 58], noise: 0, blur: 1.2, detail: [0, -64] }],
      logos: [{ mode: 'embroider', x: 372, y: 392, s: 2.15, width: 3.4, color: '#c39a5c', ref: 150, threads: 1.6, relief: 0.7, alpha: 1 }],
      crop: [0, 0, 736, 700],
    },
  },
};

/** Cambia un rango de tonos a otro de forma suave (sin escalones ni manchas en la piel). */
async function recolor(file, r) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (let i = 0; i < data.length; i += info.channels) {
    const R = data[i] / 255, G = data[i + 1] / 255, B = data[i + 2] / 255;
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
    if (d < 0.02) continue;
    let h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h = (h * 60 + 360) % 360;
    const w = sm(r.from[0] - r.feather, r.from[0], h) * (1 - sm(r.from[1], r.from[1] + r.feather, h)) * sm(0.04, 0.12, d);
    if (w <= 0) continue;
    // Mismo brillo (luma), con el tono y la saturación nuevos.
    const Y = 0.299 * R + 0.587 * G + 0.114 * B;
    const tr = [0.62, 0.48, 0.36], tY = 0.299 * tr[0] + 0.587 * tr[1] + 0.114 * tr[2];
    const c = tr.map((t) => Y + (Y * t / tY - Y) * r.sat);
    for (let j = 0; j < 3; j++) data[i + j] = Math.round(Math.min(255, Math.max(0, (data[i + j] / 255) * (1 - w) + c[j] * w)) * 255);
  }
  const tmp = file + '.tmp.jpg';
  await sharp(data, { raw: info }).jpeg({ quality: 94 }).toFile(tmp);
  fs.renameSync(tmp, file);
}

/** Escala una configuración de letrero medida en la referencia original al tamaño de trabajo. */
function scale(p, f) {
  const n = (v) => Math.round(v * f * 10) / 10;
  return {
    boxes: p.boxes.map((b) => ({ ...b, box: b.box.map((v) => Math.round(v * f)), blur: b.blur * f, detail: b.detail?.map((v) => Math.round(v * f)), from: b.from?.map((v) => Math.round(v * f)) })),
    text: (p.text ?? []).map((t) => ({
      ...t,
      font: t.font.replace(/([\d.]+)px/, (_, px) => `${n(+px)}px`),
      spacing: `${n(t.spacing ?? 0)}px`,
      x: n(t.x), y: n(t.y),
      blur: t.blur ? n(t.blur) : undefined, dy: t.dy ? n(t.dy) : 0,
    })),
    logos: (p.logos ?? []).map((l) => ({ ...l, x: n(l.x), y: n(l.y), s: l.s * f, blur: l.blur ? n(l.blur) : undefined })),
    crop: p.crop?.map((v) => Math.round(v * f)),
  };
}

const only = process.argv[2];
for (const [id, v] of Object.entries(VIEWS)) {
  if (only && only !== id) continue;
  const src = v.ref ? path.resolve(SRC, '../..', v.ref) : path.join(SRC, v.file);
  const m = await sharp(src).metadata();
  const portrait = m.height > m.width;
  const targetW = v.targetW ?? (portrait ? 1600 : 2400);
  const dir = v.out ? path.join(ROOT, 'scripts/club3d', v.out) : OUT;
  let img = sharp(src);
  if (v.cropH) img = img.extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * v.cropH) });
  const work = path.join(dir, `${id}${v.patch ? '-base' : ''}.jpg`);
  await img.resize({ width: targetW }).jpeg({ quality: 94 }).toFile(work);
  if (v.patch) {
    const cfg = scale(v.patch, targetW / v.origW);
    execFileSync(process.execPath, [path.join(import.meta.dirname, 'letrero.mjs'), work, path.join(dir, `${id}.jpg`), JSON.stringify(cfg)], { stdio: 'inherit' });
    fs.rmSync(work);
  }
  if (v.recolor) await recolor(path.join(dir, `${id}.jpg`), v.recolor);
  console.log(id, 'listo');
}
