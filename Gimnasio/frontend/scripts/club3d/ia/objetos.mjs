// Genera las siluetas de los objetos con hover y su eje en 3D para el recorrido del club.
//
// Uso: en frontend/scripts/club3d/ia (npm install una vez; tiene @huggingface/transformers):
//   node objetos.mjs [vista]
//
// Para cada objeto de objetos.json:
// - Silueta: la pintada por Bruno (scripts/.cache/club3d/hq/<vista>-painted.png) dentro del recuadro;
//   si no hay, SAM (Segment Anything) recorta el objeto a partir de puntos sobre él.
// - Eje: con la profundidad (Depth Anything) se reconstruye cada pixel del objeto en 3D y se calcula
//   su dirección principal (PCA). La luz del hover recorre el objeto a lo largo de ese eje.
// Salida: public/media/club3/<vista>-ids.png (cada pixel guarda el número de objeto) y
//         src/app/club3d/objects.ts (nombre, texto, centro y eje de cada objeto).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { SamModel, AutoProcessor, RawImage } from '@huggingface/transformers';

const HERE = path.resolve(import.meta.dirname, '..');
const ROOT = path.resolve(HERE, '../..');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');
sharp.cache(false);
const HQ = path.join(HERE, 'hq');
const CACHE = path.join(ROOT, 'scripts/.cache/club3d/hq');
const OUT = path.join(ROOT, 'projects/gym-umbral/public/media/club3');
const TS = path.join(ROOT, 'projects/gym-umbral/src/app/club3d/objects.ts');
const DEPTH_SCALE = 1.4; // misma escala que usa el shader
const LONG = 1024; // lado largo del mapa de objetos

const all = JSON.parse(fs.readFileSync(path.join(HERE, 'objetos.json'), 'utf8'));
delete all._nota;
const only = process.argv[2];
const prev = fs.existsSync(path.join(CACHE, 'objects.json')) ? JSON.parse(fs.readFileSync(path.join(CACHE, 'objects.json'), 'utf8')) : {};

const model = await SamModel.from_pretrained(process.env.SAM ?? 'Xenova/sam-vit-base', { dtype: 'fp32' });
const processor = await AutoProcessor.from_pretrained(process.env.SAM ?? 'Xenova/sam-vit-base');

async function gray(file, w, h) {
  return sharp(file).resize(w, h, { fit: 'fill' }).greyscale().raw().toBuffer();
}

const result = { ...prev };
for (const [view, objects] of Object.entries(all)) {
  if (only && only !== view) continue;
  const imgFile = path.join(HQ, `${view}.jpg`);
  const meta = await sharp(imgFile).metadata();
  const aspect = meta.width / meta.height;
  const MW = aspect >= 1 ? LONG : Math.round(LONG * aspect);
  const MH = aspect >= 1 ? Math.round(LONG / aspect) : LONG;
  const depth = await gray(path.join(CACHE, `${view}-depth.png`), MW, MH);
  const paintedFile = path.join(CACHE, `${view}-painted.png`);
  const painted = fs.existsSync(paintedFile) ? await gray(paintedFile, MW, MH) : null;
  const ids = Buffer.alloc(MW * MH);

  let image, imageInputs, embeddings;
  if (!painted) {
    image = await RawImage.read(imgFile);
    imageInputs = await processor(image);
    embeddings = await model.get_image_embeddings(imageInputs);
  }

  for (let k = 0; k < objects.length; k++) {
    const o = objects[k];
    const [u0, v0, u1, v1] = o.box;
    const pad = 0.015;
    const inBox = (x, y) => x / MW >= u0 - pad && x / MW <= u1 + pad && y / MH >= v0 - pad && y / MH <= v1 + pad;
    let mask;
    if (painted) {
      mask = (x, y) => painted[y * MW + x] > 127;
    } else {
      // SAM con puntos sobre el objeto; se queda con la máscara de mejor puntaje (y luego se recorta al recuadro).
      const pts = o.points.map(([pu, pv]) => [pu * image.width, pv * image.height]);
      const prompt = await processor(image, { input_points: [pts], input_labels: [pts.map(() => 1)] });
      const out = await model({ ...embeddings, input_points: prompt.input_points, input_labels: prompt.input_labels });
      const masks = await processor.post_process_masks(out.pred_masks, imageInputs.original_sizes, imageInputs.reshaped_input_sizes);
      const scores = Array.from(out.iou_scores.data);
      const best = scores.indexOf(Math.max(...scores));
      const [, , H, W] = masks[0].dims;
      const data = masks[0].data;
      mask = (x, y) => data[best * W * H + Math.floor((y / MH) * H) * W + Math.floor((x / MW) * W)] === 1;
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (inBox(x, y) && mask(x, y)) ids[y * MW + x] = k + 1;
  }

  // Centro y eje 3D de cada objeto a partir de los pixeles que quedaron suyos.
  const info = objects.map((o, k) => {
    const pts = [];
    let su = 0, sv = 0, vMin = 1;
    for (let y = 0; y < MH; y += 2) for (let x = 0; x < MW; x += 2) {
      if (ids[y * MW + x] !== k + 1) continue;
      const u = x / MW, v = y / MH, d = depth[y * MW + x] / 255;
      pts.push([(u - 0.5) * aspect, v - 0.5, (1 - d) * DEPTH_SCALE]);
      su += u; sv += v; vMin = Math.min(vMin, v);
    }
    const n = pts.length;
    if (n < 20) console.warn('  aviso: objeto casi vacío', view, o.name, n);
    const mean = [0, 1, 2].map((i) => pts.reduce((s, p) => s + p[i], 0) / Math.max(n, 1));
    const cov = [0, 1, 2].map((i) => [0, 1, 2].map((j) => pts.reduce((s, p) => s + (p[i] - mean[i]) * (p[j] - mean[j]), 0) / Math.max(n, 1)));
    let a = [1, 0.2, 0.1];
    for (let it = 0; it < 40; it++) {
      const b = [0, 1, 2].map((i) => cov[i][0] * a[0] + cov[i][1] * a[1] + cov[i][2] * a[2]);
      const l = Math.hypot(...b) || 1;
      a = b.map((x) => x / l);
    }
    if (a[0] < 0) a = a.map((x) => -x); // la luz siempre avanza de izquierda a derecha
    const proj = pts.map((p) => (p[0] - mean[0]) * a[0] + (p[1] - mean[1]) * a[1] + (p[2] - mean[2]) * a[2]);
    const lo = Math.min(...proj), hi = Math.max(...proj);
    const origin = mean.map((m, i) => m + a[i] * lo);
    const r = (x) => Math.round(x * 1000) / 1000;
    return { name: o.name, detail: o.detail, u: r(su / Math.max(n, 1)), v: r(sv / Math.max(n, 1)), top: r(vMin), o: origin.map(r), d: a.map(r), len: r(hi - lo) };
  });
  await sharp(ids, { raw: { width: MW, height: MH, channels: 1 } }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${view}-ids.png`));
  result[view] = info;
  console.log(view, info.map((i) => i.name).join(', '));
  // Vista previa de las siluetas sobre la foto (para revisar).
  const color = Buffer.alloc(MW * MH * 4);
  for (let i = 0; i < MW * MH; i++) if (ids[i]) color.set([...[[255, 200, 0], [0, 220, 255], [255, 80, 160], [120, 255, 120], [180, 120, 255], [255, 140, 60]][(ids[i] - 1) % 6], 140], i * 4);
  await sharp(imgFile).resize(MW, MH).composite([{ input: color, raw: { width: MW, height: MH, channels: 4 } }]).jpeg({ quality: 80 }).toFile(path.join(CACHE, `${view}-check.jpg`));
}

fs.writeFileSync(path.join(CACHE, 'objects.json'), JSON.stringify(result));
const header = '// Generado por scripts/club3d/ia/objetos.mjs: no editar a mano (los nombres y recuadros están en objetos.json).\n';
fs.writeFileSync(TS, `${header}export interface SceneObject {\n  name: string;\n  detail: string;\n  /** Centro y parte superior de la silueta (0 a 1 sobre la foto). */\n  u: number;\n  v: number;\n  top: number;\n  /** Eje 3D del objeto: origen, dirección y largo (coordenadas del shader). */\n  o: [number, number, number];\n  d: [number, number, number];\n  len: number;\n}\n\nexport const OBJECTS: Record<string, SceneObject[]> = ${JSON.stringify(result, null, 2)};\n`);
console.log('objects.ts listo');
