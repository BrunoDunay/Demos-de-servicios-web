// Prepara las escenas del recorrido del club para la web.
//
// Uso (desde frontend/):  node scripts/club3d/vistas.mjs
//
// Entrada: scripts/club3d/hq/<vista>.jpg (fotos mejoradas por Bruno, con letreros cambiados; ver hq.mjs).
// Salida:  projects/gym-umbral/public/media/club3/<vista>.webp y <vista>-sm.webp
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '../..');
const HQ = path.join(ROOT, 'scripts/club3d/hq');
const OUT = path.join(ROOT, 'projects/gym-umbral/public/media/club3');
fs.mkdirSync(OUT, { recursive: true });
sharp.cache(false);

const views = fs.readdirSync(HQ).filter((f) => f.startsWith('v-') && f.endsWith('.jpg')).map((f) => f.replace('.jpg', ''));
for (const v of views) {
  const base = sharp(path.join(HQ, `${v}.jpg`)).modulate({ saturation: 0.94 });
  await base.clone().resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(path.join(OUT, `${v}.webp`));
  await base.clone().resize({ width: 1000, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(path.join(OUT, `${v}-sm.webp`));
  const kb = ['', '-sm'].map((s) => Math.round(fs.statSync(path.join(OUT, `${v}${s}.webp`)).size / 1024));
  console.log(v, kb.join(' / '), 'KB');
}
