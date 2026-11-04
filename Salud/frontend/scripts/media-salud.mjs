// Baja las fotos de Pexels de las dos demos de salud y genera WebP (normal y -sm) en public/media de cada app.
// Uso: npm run media  (desde frontend/). Los IDs vienen de la URL de cada foto en pexels.com.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const APPS = {
  'salud-marfil': {
    'hero-paciente': 3881161,
    'consulta-sonrisa': 3845553,
    'consulta-dr': 14052564,
    'consulta-charla': 3845810,
    'espejo': 6627574,
    'ninos': 12917374,
    'consultorio': 30902075,
    'sillon': 6812479,
    'sonrisa': 11956948,
    'sonrisa-bn': 14796031,
  },
  'salud-claro': {
    'bosque': 4500037,
    'claro': 28961234,
    'amanecer': 31359311,
    'valeria': 7176288,
    'manos': 7176319,
    'escucha': 7176322,
    'sala': 7176026,
    'sala-2': 7176027,
    'pareja': 8560013,
    'individual': 6255877,
    'jovenes': 8560223,
    'en-linea': 7195087,
  },
};

const cache = path.resolve('scripts/.cache');
fs.mkdirSync(cache, { recursive: true });

async function bajar(id) {
  const file = path.join(cache, `${id}.jpg`);
  if (fs.existsSync(file)) return file;
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${id}: ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

for (const [app, fotos] of Object.entries(APPS)) {
  const out = path.resolve(`projects/${app}/public/media`);
  fs.mkdirSync(out, { recursive: true });
  for (const [name, id] of Object.entries(fotos)) {
    const src = await bajar(id);
    await sharp(src).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(out, `${name}.webp`));
    await sharp(src).resize({ width: 820, withoutEnlargement: true }).webp({ quality: 72 }).toFile(path.join(out, `${name}-sm.webp`));
    console.log(app, name);
  }
}

// Máscara de los dientes para el simulador de blanqueamiento de Marfil. En la foto los labios son rojos y los
// dientes claros y sin color: dentro del recuadro de la boca, lo claro y poco saturado queda blanco; lo demás, transparente.
{
  const src = await bajar(APPS['salud-marfil'].sonrisa);
  const { data, info } = await sharp(src).resize({ width: 1800 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const BOCA = { x0: 0.25, x1: 0.8, y0: 0.37, y1: 0.53 }; // en proporción 0–1 de la foto
  const alpha = Buffer.alloc(W * H);
  for (let y = Math.floor(BOCA.y0 * H); y < BOCA.y1 * H; y++) {
    for (let x = Math.floor(BOCA.x0 * W); x < BOCA.x1 * W; x++) {
      const i = y * W + x;
      const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const sat = max ? (max - min) / max : 0;
      const light = (r + g + b) / 3;
      const t = Math.min(1, Math.max(0, (light - 140) / 40)) * Math.min(1, Math.max(0, (0.3 - sat) / 0.12));
      alpha[i] = Math.round(t * 255);
    }
  }
  const mask = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.6).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(W * H * 4, 255);
  for (let i = 0; i < W * H; i++) rgba[i * 4 + 3] = mask[i];
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile(path.resolve('projects/salud-marfil/public/media/sonrisa-mascara.png'));
  console.log('máscara de dientes lista');
}
