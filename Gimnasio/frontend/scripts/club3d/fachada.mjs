// Separa la fachada en capas: cielo (máscara), edificio de noche, edificio de día y luces.
// Uso (desde frontend/): node scripts/club3d/fachada.mjs  →  public/media/fachada-{noche,dia,luces}.webp
import path from 'node:path';
import sharp from 'sharp';
const ROOT = path.resolve(import.meta.dirname, '../..');
// Usa la ampliación x4 si existe (bordes del cielo más limpios); si no, la x2. Se trabaja a 2400 px.
import fs from 'node:fs';
const srcFile = path.join(ROOT, 'scripts/club3d/hq/exterior.jpg'); // foto mejorada con el letrero cambiado (hq.mjs)
const src = await sharp(srcFile).resize({ width: 2400, withoutEnlargement: true }).png().toBuffer();
const OUT = path.join(ROOT, 'projects/gym-umbral/public/media');
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
// 1) Cielo: relleno desde el borde superior con píxeles azulados y parecidos a su vecino.
const sky = new Uint8Array(N);
const isSkyish = (r, g, b) => b > r + 18 && b > 70 && (r + g + b) / 3 > 55;
const stack = [];
for (let x = 0; x < W; x++) if (isSkyish(...px(x))) { sky[x] = 1; stack.push(x); }
while (stack.length) {
  const i = stack.pop(); const x = i % W, y = (i / W) | 0; const c = px(i);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx; if (sky[j]) continue;
    const d = px(j);
    if (isSkyish(...d) && Math.abs(d[0] - c[0]) + Math.abs(d[1] - c[1]) + Math.abs(d[2] - c[2]) < 18) { sky[j] = 1; stack.push(j); }
  }
}
// 2) Luces: píxeles cálidos y brillantes (ventanas, lámparas) o blancos muy brillantes (letrero).
const light = new Float32Array(N);
for (let i = 0; i < N; i++) {
  if (sky[i]) continue;
  const [r, g, b] = px(i); const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
  const warm = (r - b) / 255;
  const l1 = Math.min(1, Math.max(0, (lum - 0.32) / 0.3)) * Math.min(1, Math.max(0, (warm - 0.06) / 0.18));
  const l2 = Math.min(1, Math.max(0, (lum - 0.78) / 0.15));
  light[i] = Math.max(l1, l2);
}
const out = (arr, name) => sharp(Buffer.from(arr), { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(OUT, name)).then(() => console.log(name));
const skyA = Buffer.alloc(N); for (let i = 0; i < N; i++) skyA[i] = sky[i] ? 255 : 0;
// Máscara del cielo suavizada para bordes limpios.
const soft = await sharp(skyA, { raw: { width: W, height: H, channels: 1 } }).blur(1.6).raw().toBuffer({ resolveWithObject: true });
const skySoft = new Uint8Array(N); for (let i = 0; i < N; i++) skySoft[i] = Math.min(255, soft.data[i * soft.info.channels] * 1.6);
const night = Buffer.alloc(N * 4), day = Buffer.alloc(N * 4), glow = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const [r, g, b] = px(i); const a = 255 - skySoft[i];
  night.set([r, g, b, a], i * 4);
  // Día: más exposición, menos azul y sin luces encendidas (las ventanas quedan como vidrio oscuro).
  const k = light[i];
  const lum = (r + g + b) / 3;
  let dr = Math.min(255, Math.pow(r / 255, 0.62) * 255 * 1.05), dg = Math.min(255, Math.pow(g / 255, 0.62) * 255 * 1.02), db = Math.min(255, Math.pow(b / 255, 0.7) * 255 * 0.86);
  // Sin la luz emitida: se resta la luz y se deja el vidrio como un gris cálido apagado.
  const off = Math.min(1, k * 1.1);
  const base = Math.min(255, lum * 0.55 + 30);
  dr = dr * (1 - off) + base * 1.02 * off; dg = dg * (1 - off) + base * off; db = db * (1 - off) + base * 0.96 * off;
  day.set([dr, dg, db, a], i * 4);
  glow.set([r * k, g * k, b * k, 255], i * 4);
}
await out(night, 'fachada-noche.webp'); await out(day, 'fachada-dia.webp'); await out(glow, 'fachada-luces.webp');
