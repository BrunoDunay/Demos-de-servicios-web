// Extrae las siluetas que Bruno pintó en amarillo (hovers señalados): compara la foto marcada con la
// misma foto sin marcar y guarda una máscara en blanco y negro al tamaño de trabajo de la vista.
// Uso (desde frontend/): node scripts/club3d/pintados.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIR = path.resolve(ROOT, '../referencias/gym/imagenes mejoradas/gym_textura');
const MARKED = path.join(DIR, 'hovers señalados');
const OUT = path.join(ROOT, 'scripts/.cache/club3d/hq');
const MAP = { gimnasio_aestetic_1: 'v-pesas3', gimnasio_aestetic_2: 'v-fuerza2', gimnasio_aestetic_3: 'v-pesas1', gimnasio_aestetic_4: 'v-pesas2' };
sharp.cache(false);

for (const f of fs.readdirSync(MARKED)) {
  const key = Object.keys(MAP).find((k) => f.startsWith(k + '_'));
  if (!key) continue;
  const view = MAP[key];
  const work = await sharp(path.join(ROOT, 'scripts/club3d/hq', `${view}.jpg`)).metadata();
  const size = { width: work.width, height: work.height };
  const a = await sharp(path.join(MARKED, f)).resize(size).removeAlpha().raw().toBuffer();
  const b = await sharp(path.join(DIR, `${key}_textura.jpg`)).resize(size).removeAlpha().raw().toBuffer();
  const mask = Buffer.alloc(size.width * size.height);
  for (let i = 0, p = 0; p < mask.length; i += 3, p++) {
    // El trazo amarillo sube rojo y verde y baja el azul respecto al original.
    const dr = a[i] - b[i], dg = a[i + 1] - b[i + 1], db = a[i + 2] - b[i + 2];
    const yellow = dr + dg - 2 * db;
    mask[p] = yellow > 70 ? 255 : 0;
  }
  // Limpia ruido y cierra huecos pequeños del trazo.
  await sharp(mask, { raw: { ...size, channels: 1 } }).blur(2.5).threshold(110).png().toFile(path.join(OUT, `${view}-painted.png`));
  console.log(view, 'máscara pintada');
}
