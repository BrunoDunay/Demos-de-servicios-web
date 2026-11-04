// Prepara las fotos y videos de las demos de gimnasio (Brío, Forja y Umbral).
// Uso: node scripts/media-gym.mjs [brio|forja|umbral]
// - Descarga fotos de Pexels (licencia libre, sin atribución obligatoria) a scripts/.cache/
// - Toma fotos y videos de ../referencias/gym/
// - Genera WebP en dos tamaños (normal y -sm para celular) y MP4 ligeros en public/media/ de cada app.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import ffmpeg from 'ffmpeg-static';

const ROOT = path.resolve(import.meta.dirname, '..');
const REFS = path.resolve(ROOT, '../referencias/gym');
const CACHE = path.join(ROOT, 'scripts/.cache');
fs.mkdirSync(CACHE, { recursive: true });

// w: ancho principal. crop: recorte en proporción {left, top, width, height} (0 a 1).
// Color de Umbral para los videos: cálido, apagado y un poco más oscuro.
const WARM = 'eq=brightness=-0.04:saturation=0.55:contrast=1.06,colorbalance=rs=0.09:gs=0.02:bs=-0.08:rm=0.06:bm=-0.06';
const WARM_DIM = 'eq=brightness=-0.1:saturation=0.5:contrast=1.1,colorbalance=rs=0.1:gs=0.02:bs=-0.09:rm=0.07:bm=-0.07';

const MEDIA = {
  brio: {
    out: 'projects/gym-brio/public/media',
    images: [
      { name: 'hero', pexels: 3757937, w: 1400 },
      { name: 'sonrisa', pexels: 863986, w: 1000 },
      { name: 'coach-remo', pexels: 6551078, w: 1000 },
      { name: 'cardio', pexels: 6550860, w: 1000 },
      { name: 'equipo', pexels: 13451904, w: 1000 },
      { name: 'comunidad', pexels: 4853687, w: 1000 },
      { name: 'recepcion', pexels: 7031717, w: 1400 },
      { name: 'sala', pexels: 7031706, w: 1400 },
      { name: 'caminadora', pexels: 40006615, w: 1000 },
      { name: 'clase-grupal', pexels: 903171, w: 1000 },
      { name: 'estiramiento', pexels: 3984353, w: 1000 },
      { name: 'airbike', pexels: 4853854, w: 1000 },
      { name: 'pesas', pexels: 32610333, w: 1000 },
      { name: 'funcional', pexels: 9545914, w: 1000 },
      { name: 'asesoria', pexels: 37963582, w: 1000 },
      { name: 'coach-ana', pexels: 6739935, w: 800 },
      { name: 'coach-luis', pexels: 8611938, w: 800 },
      { name: 'coach-sofia', pexels: 4498509, w: 800 },
    ],
    videos: [],
  },
  forja: {
    out: 'projects/gym-forja/public/media',
    images: [
      { name: 'magnesia', pexels: 1552245, w: 1400 },
      { name: 'cajon', pexels: 7676548, w: 1200 },
      { name: 'salto', pexels: 7676553, w: 1000 },
      { name: 'peso-muerto', pexels: 9958673, w: 1200 },
      { name: 'wod', pexels: 9958671, w: 1400 },
      { name: 'cuerda', pexels: 6388366, w: 1000 },
      { name: 'cuerdas', pexels: 1552242, w: 1200 },
      { name: 'balones', pexels: 27433192, w: 1200 },
      { name: 'discos', pexels: 703012, w: 1000 },
      { name: 'wallball', pexels: 12416973, w: 1000 },
      { name: 'barra', pexels: 6389074, w: 1400 },
      { name: 'placas', pexels: 949131, w: 1000 },
      { name: 'dobles', pexels: 20882554, w: 1000 },
      { name: 'ropes', pexels: 22748549, w: 1000 },
      { name: 'intensidad', pexels: 6388387, w: 1000 },
      { name: 'agarre', pexels: 791763, w: 1000 },
      { name: 'gimnastica', pexels: 2379613, w: 1000 },
      { name: 'cardio', pexels: 6389075, w: 1000 },
      { name: 'mancuernas', pexels: 20897696, w: 1000 },
      { name: 'cuerda-saltar', pexels: 6388391, w: 1000 },
      { name: 'sentadilla', pexels: 1552249, w: 1200 },
      { name: 'back-squat', pexels: 1552106, w: 1000 },
      { name: 'fuerte', pexels: 3112004, w: 1000 },
      { name: 'coach-andrea', pexels: 6389084, w: 900 },
      { name: 'coach-diego', pexels: 6388457, w: 900 },
      { name: 'coach-marco', pexels: 6388382, w: 900 },
      { name: 'coach-vale', pexels: 5750632, w: 900 },
      { name: 'box-interior', local: 'referencia 2.jpg', w: 675 },
      { name: 'box-noche', local: 'referencia 3.jpg', w: 736 },
    ],
    videos: [
      { name: 'hero', local: 'video 4.mp4', w: 720, filter: 'hue=s=0,eq=contrast=1.12:brightness=-0.03' },
      { name: 'suelo', local: 'video suelo de gym.mp4', w: 720, filter: 'hue=s=0,eq=contrast=1.08' },
    ],
  },
  umbral: {
    out: 'projects/gym-umbral/public/media',
    images: [
      { name: 'reformer-sala', local: 'referencia camillas.jpg', w: 1000, crop: { left: 0, top: 0, width: 0.9, height: 0.9 } },
      { name: 'mat-studio', local: 'referencia pilates.jpg', w: 1045 },
      { name: 'fuerza-sala', local: 'referencia 5.jpg', w: 1080 },
      { name: 'vestidores', local: 'referencia baños.jpg', w: 736 },
      { name: 'senaletica', local: 'referencia iconos del baño.jpg', w: 1080 },
      { name: 'privado', local: 'referencia 1.jpg', w: 474 },
      { name: 'tocador', local: 'posible referencia baño mujeres.jpg', w: 867 },
      { name: 'reformer-1', pexels: 35553893, w: 1600 },
      { name: 'reformer-clase', pexels: 8769163, w: 1600 },
      { name: 'reformer-arcos', pexels: 36833355, w: 1600 },
      { name: 'ride-1', pexels: 11870841, w: 1600 },
      { name: 'ride-2', pexels: 11870826, w: 1400 },
      { name: 'ride-3', pexels: 13896068, w: 1400 },
      { name: 'ride-detalle', pexels: 7690211, w: 1200 },
      { name: 'ride-grupo', pexels: 8766368, w: 1400 },
      { name: 'club', pexels: 37352354, w: 1600 },
      { name: 'mancuernas', pexels: 30147880, w: 1400 },
      { name: 'sauna', pexels: 38796263, w: 1400 },
      { name: 'detalle-pesas', pexels: 14289784, w: 1200 },
      { name: 'niebla', pexels: 6389516, w: 1600 },
      { name: 'fuerza-1', pexels: 39259261, w: 1600 },
      { name: 'vista', pexels: 36877065, w: 1600 },
      { name: 'barra', pexels: 1552252, w: 1600 },
      { name: 'atmosfera', pexels: 4753890, w: 1400 },
      { name: 'toallas', pexels: 6188050, w: 1200 },
      { name: 'spa', pexels: 29962514, w: 1200 },
      { name: 'velas', pexels: 1926811, w: 1200 },
      { name: 'coach-renata', pexels: 3875503, w: 1000 },
      { name: 'coach-ines', pexels: 6809857, w: 1000 },
      { name: 'coach-paula', pexels: 14219896, w: 1000 },
      { name: 'coach-emilio', pexels: 3912944, w: 1000, mono: true },
      { name: 'socia-valeria', pexels: 39725013, w: 700 },
      { name: 'socio-jorge', pexels: 15422160, w: 700 },
      { name: 'socia-sofia', pexels: 20760712, w: 700 },
      { name: 'socio-andres', pexels: 36712225, w: 700 },
      { name: 'socia-mar', pexels: 38451328, w: 700 },
      { name: 'socio-dani', pexels: 18844936, w: 700 },
      { name: 'reformer-warm', pexels: 33360086, w: 1400 },
      // Paredes verdes y luces moradas pasadas a tonos cálidos para que no desentone.
      { name: 'reformer-flow', pexels: 33360047, w: 1400, warmHues: [[70, 215, 30, 0.3], [235, 320, 36, 0.4]] },
      { name: 'reformer-dark', pexels: 35553892, w: 1400 },
      { name: 'lockers-madera', pexels: 3875521, w: 1400 },
      { name: 'lockers-banca', pexels: 3875514, w: 1400 },
      { name: 'lockers-spa', pexels: 9145350, w: 1200 },
      { name: 'locker-digital', pexels: 9144541, w: 1000 },
      // Ride (Unsplash): sala oscura con luz de color.
      { name: 'ride-led', unsplash: 'vCzRMEDMZus', w: 1800 },
      { name: 'ride-rojo', unsplash: 'W79G7kIZ5OE', w: 1200 },
      { name: 'ride-sombra', unsplash: '43GZBXNOQq8', w: 1200 },
      { name: 'ride-luz', unsplash: '6AR19heCkrg', w: 1200 },
      { name: 'ride-ritmo', unsplash: 'hjGnCci7CGw', w: 1200 },
      { name: 'gym-oscuro', unsplash: 'iW79tgCbiMs', w: 1800 },
      // Referencias nuevas de gimnasio convencional y vestidores (24 oct).
      { name: 'gym-sala', file: 'scripts/club3d/hq/v-pesas2.jpg', w: 1400 },
      { name: 'gym-pasillo', file: 'scripts/club3d/hq/v-pesas3.jpg', w: 1200 },
      { name: 'gym-ventanal', file: 'scripts/club3d/hq/v-pesas4.jpg', w: 1200 },
      { name: 'gym-cardio', file: 'scripts/club3d/hq/v-pesas1.jpg', w: 1470 },
      { name: 'vestidor-lockers', file: 'scripts/club3d/hq/v-vest2.jpg', w: 1400 },
      { name: 'spa-privado', file: 'scripts/club3d/hq/v-spa.jpg', w: 1800 },
      { name: 'recepcion', file: 'scripts/club3d/hq/v-entrada2.jpg', w: 1470 },
      { name: 'vestidor-umbral', file: 'scripts/club3d/hq/v-vest1.jpg', w: 1470 },
      { name: 'regaderas', file: 'scripts/club3d/hq/v-regaderas.jpg', w: 1400 },
      { name: 'fachada', file: 'scripts/club3d/hq/exterior.jpg', w: 1470 },
      // Merch con el logo de Umbral (fotos de referencia con el logo cambiado en scripts/club3d/merch).
      { name: 'merch-chamarra', file: 'scripts/club3d/merch/chamarra.jpg', w: 900 },
      { name: 'merch-playera', file: 'scripts/club3d/merch/camiseta.jpg', w: 900 },
      { name: 'merch-gorra', file: 'scripts/club3d/merch/gorra.jpg', w: 900 },
      { name: 'merch-caminando', file: 'scripts/club3d/merch/caminando.jpg', w: 600 },
      { name: 'merch-active', file: 'scripts/club3d/merch/active.jpg', w: 1100 },
    ],
    videos: [
      { name: 'hero', local: 'video 1.mp4', w: 1280, filter: 'eq=brightness=-0.06:saturation=0.55:contrast=1.08,colorbalance=rs=0.08:gs=0.02:bs=-0.08:rm=0.06:bm=-0.06' },
      { name: 'fuerza', local: 'video 3.mp4', w: 1280, filter: 'eq=brightness=-0.05:saturation=0.5:contrast=1.06,colorbalance=rs=0.08:bs=-0.08' },
      { name: 'pesas', local: 'video 2.mp4', w: 1280, filter: 'eq=brightness=-0.04:saturation=0.5,colorbalance=rs=0.06:bs=-0.06' },
      // Videos de Pexels: se recorta solo el segmento (ss + t) directo del servidor.
      { name: 'v-reformer', pexelsVideo: 35576710, ss: 0.5, t: 7.5, vertical: true, filter: WARM_DIM },
      { name: 'v-fuerza', pexelsVideo: 36072028, ss: 3, t: 8, vertical: true, filter: WARM },
      { name: 'v-fuerza-2', pexelsVideo: 35757588, ss: 2, t: 7, vertical: true, filter: WARM },
      { name: 'v-piedras', pexelsVideo: 5979944, ss: 1, t: 7, vertical: true, filter: WARM },
      { name: 'v-pila', pexelsVideo: 34324809, ss: 1, t: 7, vertical: true, filter: WARM },
      { name: 'v-pilates', pexelsVideo: 29474205, ss: 4, t: 8, vertical: true, filter: WARM_DIM },
      { name: 'v-sauna', pexelsVideo: 6617119, ss: 2, t: 8, vertical: true, filter: WARM },
      { name: 'h-reformer', pexelsVideo: 6023191, ss: 2, t: 9, filter: WARM_DIM },
      { name: 'h-mancuernas', pexelsVideo: 6053511, ss: 1, t: 9, filter: WARM },
      { name: 'h-vapor', pexelsVideo: 9165945, ss: 6, t: 9, filter: WARM },
      // Referencias de gimnasio: rack de mancuernas, caminadora (recortada para quitar la marca) y edit.
      { name: 'v-rack', local: 'video 5.mp4', vertical: true, filter: WARM },
      { name: 'v-suelo', local: 'video suelo de gym.mp4', vertical: true, filter: WARM_DIM },
      { name: 'v-edit', local: 'video tipo edit entrenando.mp4', vertical: true, ss: 5.2, t: 2.6, filter: 'eq=brightness=-0.05:saturation=0.35:contrast=1.08,colorbalance=rs=0.1:gs=0.02:bs=-0.1:rm=0.07:bm=-0.07' },
    ],
  },
};

async function sourceFor(item) {
  if (item.local) return fs.readFileSync(path.join(REFS, item.local));
  // Archivos del proyecto (fotos con letrero corregido o ampliadas x2 en scripts/.cache/club3d/hd).
  if (item.file) return fs.readFileSync(path.join(ROOT, item.file));
  if (item.unsplash) {
    // Unsplash (licencia libre): la descarga redirige a la imagen original.
    const file = path.join(CACHE, `unsplash-${item.unsplash}.jpg`);
    if (!fs.existsSync(file)) {
      const res = await fetch(`https://unsplash.com/photos/${item.unsplash}/download?force=true&w=2000`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`No se pudo bajar ${item.unsplash}: ${res.status}`);
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return fs.readFileSync(file);
  }
  const file = path.join(CACHE, `pexels-${item.pexels}.jpg`);
  if (!fs.existsSync(file)) {
    const url = `https://images.pexels.com/photos/${item.pexels}/pexels-photo-${item.pexels}.jpeg?auto=compress&cs=tinysrgb&w=2000`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`No se pudo bajar ${item.pexels}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file);
}

/**
 * Lleva a tonos cálidos los colores que desentonan con la marca (p. ej. paredes verdes y luces
 * moradas), sin tocar piel ni ropa: cada rango [desde, hasta] de tono (grados) se lleva al tono
 * `a` y su saturación se multiplica por `sat`. El cambio se suaviza en los bordes del rango.
 */
async function warmHues(buffer, ranges) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    if (d < 0.012) continue;
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    for (const [from, to, a, sat] of ranges) {
      if (h < from - 15 || h > to + 15) continue;
      const edge = Math.min(1, Math.max(0, Math.min(h - (from - 15), to + 15 - h) / 15));
      const nh = h + (a - h) * edge, ns = s * (1 + (sat - 1) * edge);
      const c = (1 - Math.abs(2 * l - 1)) * ns, x = c * (1 - Math.abs(((nh / 60) % 2) - 1)), m = l - c / 2;
      const [rr, gg, bb] = nh < 60 ? [c, x, 0] : nh < 120 ? [x, c, 0] : nh < 180 ? [0, c, x] : nh < 240 ? [0, x, c] : nh < 300 ? [x, 0, c] : [c, 0, x];
      data[i] = (rr + m) * 255;
      data[i + 1] = (gg + m) * 255;
      data[i + 2] = (bb + m) * 255;
      break;
    }
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

async function processImage(item, outDir) {
  const input = await sourceFor(item);
  let img = sharp(input).rotate();
  if (item.crop) {
    const m = await sharp(input).metadata();
    img = img.extract({
      left: Math.round(m.width * item.crop.left),
      top: Math.round(m.height * item.crop.top),
      width: Math.round(m.width * item.crop.width),
      height: Math.round(m.height * item.crop.height),
    });
  }
  if (item.mono) img = img.grayscale();
  let base = await img.toBuffer();
  if (item.warmHues) base = await warmHues(base, item.warmHues);
  const meta = await sharp(base).metadata();
  const sizes = [
    { suffix: '', w: Math.min(item.w, meta.width) },
    { suffix: '-sm', w: Math.min(720, meta.width) },
  ];
  for (const s of sizes) {
    await sharp(base)
      .resize({ width: s.w, withoutEnlargement: true })
      .webp({ quality: 72, effort: 5 })
      .toFile(path.join(outDir, `${item.name}${s.suffix}.webp`));
  }
  return { name: item.name, width: sizes[0].w, height: Math.round((meta.height * sizes[0].w) / meta.width) };
}

async function videoInput(item) {
  if (item.local) return path.join(REFS, item.local);
  // La descarga de Pexels redirige al archivo; ffmpeg lee solo el tramo que necesita.
  const res = await fetch(`https://www.pexels.com/download/video/${item.pexelsVideo}/`, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } });
  const url = res.headers.get('location');
  if (!url) throw new Error(`Sin enlace para el video ${item.pexelsVideo}`);
  return url;
}

async function processVideo(item, outDir) {
  const out = path.join(outDir, `${item.name}.mp4`);
  const poster = path.join(outDir, `${item.name}-poster.jpg`);
  // Los de Pexels ya procesados no se vuelven a pedir (son 4K en origen).
  if (item.pexelsVideo && fs.existsSync(out)) return { name: item.name, kb: Math.round(fs.statSync(out).size / 1024), cached: true };
  const input = await videoInput(item);
  const size = item.vertical ? 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280' : `scale=${item.w ?? 1600}:-2`;
  const vf = `${item.pre ? item.pre + "," : ""}${size},${item.filter ?? "null"},fps=30`;
  const cut = item.pexelsVideo || item.t ? ["-ss", String(item.ss ?? 0), "-t", String(item.t ?? 8)] : [];
  execFileSync(ffmpeg, ['-y', '-v', 'error', ...cut, '-i', input, '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', item.pexelsVideo ? '28' : '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', out, '-frames:v', '1', '-q:v', '4', poster]);
  return { name: item.name, kb: Math.round(fs.statSync(out).size / 1024) };
}

const only = process.argv[2];
for (const [brand, cfg] of Object.entries(MEDIA)) {
  if (only && only !== brand) continue;
  const outDir = path.join(ROOT, cfg.out);
  fs.mkdirSync(outDir, { recursive: true });
  const results = await Promise.all(cfg.images.map((i) => processImage(i, outDir)));
  const videos = [];
  for (const v of cfg.videos) videos.push(await processVideo(v, outDir));
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ images: results, videos }, null, 2));
  console.log(`${brand}: ${results.length} fotos, ${videos.length} videos`, videos);
}
