// Cambia el letrero de otra marca por el de Umbral: rellena el área con el color de la pared
// (interpolado desde los bordes + textura) y escribe UMBRAL con las fuentes reales del sitio.
// Uso: node scripts/club3d/letrero.mjs <foto> <salida.jpg> '<json con box, noise y text>'
// (ver el historial de docs/gym/umbral.md para los valores usados en la entrada y en fuerza).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const puppeteer = createRequire(import.meta.url)('puppeteer-core');
const NM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules');
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(f).toString('base64');
const serif = font(`${NM}/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2`);
const sans = font(`${NM}/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2`);
const [src, out, cfgJson] = process.argv.slice(2);
const cfg = JSON.parse(cfgJson);
const img = 'data:image/jpeg;base64,' + fs.readFileSync(src).toString('base64');
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const p = await b.newPage();
await p.setContent('<html><body></body></html>');
const data = await p.evaluate(async ({ img, serif, sans, cfg }) => {
  const f1 = new FontFace('IS', `url(${serif})`); const f2 = new FontFace('MR', `url(${sans})`, { weight: '200 800' });
  await f1.load(); await f2.load(); document.fonts.add(f1); document.fonts.add(f2);
  const im = new Image(); im.src = img; await im.decode();
  const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0);
  // Rellena cada área con el color de alrededor (interpolado desde los bordes) y un poco de textura.
  const fill = ({ box, noise = 3, blur = 1.2, detail }) => {
    const [x0, y0, w, h] = box;
    const d = g.getImageData(0, 0, c.width, c.height); const px = d.data;
    const at = (x, y) => { const i = (y * c.width + x) * 4; return [px[i], px[i + 1], px[i + 2]]; };
    // Promedio de una franja de 4 px en cada borde para que la interpolación no herede ruido.
    const edge = (x, y, dx, dy) => { let s = [0, 0, 0]; for (let k = 0; k < 4; k++) { const v = at(x + dx * k, y + dy * k); s = s.map((a, j) => a + v[j]); } return s.map((a) => a / 4); };
    const out = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const L = edge(x0 - 1, y0 + y, -1, 0), R = edge(x0 + w, y0 + y, 1, 0), T = edge(x0 + x, y0 - 1, 0, -1), B = edge(x0 + x, y0 + h, 0, 1);
      const u = x / (w - 1), v = y / (h - 1);
      const hor = L.map((a, j) => a * (1 - u) + R[j] * u), ver = T.map((a, j) => a * (1 - v) + B[j] * v);
      const wv = Math.min(u, 1 - u) < Math.min(v, 1 - v) ? 0.65 : 0.35;
      const n = (Math.random() - 0.5) * noise;
      const i = (y * w + x) * 4;
      for (let j = 0; j < 3; j++) out.data[i + j] = hor[j] * wv + ver[j] * (1 - wv) + n;
      out.data[i + 3] = 255;
    }
    // Textura opcional: el detalle fino (original menos su versión desenfocada) de un área vecina.
    if (detail) {
      const s = document.createElement('canvas'); s.width = w; s.height = h;
      const sg = s.getContext('2d'); sg.drawImage(c, x0 + detail[0], y0 + detail[1], w, h, 0, 0, w, h);
      const sb = document.createElement('canvas'); sb.width = w; sb.height = h;
      const sbg = sb.getContext('2d'); sbg.filter = 'blur(3px)'; sbg.drawImage(s, 0, 0);
      const a = sg.getImageData(0, 0, w, h).data, bl = sbg.getImageData(0, 0, w, h).data;
      for (let i = 0; i < a.length; i += 4) for (let j = 0; j < 3; j++) out.data[i + j] += a[i + j] - bl[i + j];
    }
    g.putImageData(out, x0, y0);
    if (detail) return;
    // Suaviza la costura con un desenfoque leve solo dentro del área.
    g.save(); g.beginPath(); g.rect(x0 - 2, y0 - 2, w + 4, h + 4); g.clip(); g.filter = 'blur(' + blur + 'px)'; g.drawImage(c, 0, 0); g.restore();
  };
  // Clonado: copia un pedazo vecino (desplazado dx, dy) con bordes difuminados; conserva la textura de la tela.
  const clone = ({ box, from, feather = 0.35 }) => {
    const [x0, y0, w, h] = box;
    const t = document.createElement('canvas'); t.width = w; t.height = h;
    const tg = t.getContext('2d');
    tg.drawImage(c, x0 + from[0], y0 + from[1], w, h, 0, 0, w, h);
    tg.globalCompositeOperation = 'destination-in';
    const gx = tg.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(feather, '#000'); gx.addColorStop(1 - feather, '#000'); gx.addColorStop(1, 'rgba(0,0,0,0)');
    tg.fillStyle = gx; tg.fillRect(0, 0, w, h);
    const gy = tg.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, 'rgba(0,0,0,0)'); gy.addColorStop(feather, '#000'); gy.addColorStop(1 - feather, '#000'); gy.addColorStop(1, 'rgba(0,0,0,0)');
    tg.fillStyle = gy; tg.fillRect(0, 0, w, h);
    for (let k = 0; k < 2; k++) g.drawImage(t, x0, y0);
  };
  for (const b of cfg.boxes ?? [{ box: cfg.box, noise: cfg.noise, blur: cfg.blur }]) (b.from ? clone(b) : fill(b));
  for (const t of cfg.text ?? []) {
    g.save();
    g.font = t.font; g.fillStyle = t.color; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    if ('letterSpacing' in g) g.letterSpacing = t.spacing ?? '0px';
    if (t.shadow) { g.shadowColor = t.shadow; g.shadowBlur = t.blur ?? 2; g.shadowOffsetY = t.dy ?? 1; }
    g.globalAlpha = t.alpha ?? 1;
    for (let k = 0; k < (t.passes ?? 1); k++) g.fillText(t.s, t.x, t.y);
    g.restore();
  }
  // Logo sobre tela: 'print' (estampado que toma la textura y la luz de la tela) o 'embroider'
  // (bordado: hilos en diagonal, relieve y sombra). Acepta rotación (rot, grados) y ancho (sx).
  function fabricLogo(l) {
    const m = document.createElement('canvas'); m.width = c.width; m.height = c.height;
    const mg = m.getContext('2d');
    mg.translate(l.x, l.y); mg.rotate(((l.rot ?? 0) * Math.PI) / 180); mg.scale(l.s * (l.sx ?? 1), l.s); mg.translate(-20, -24);
    mg.strokeStyle = '#fff'; mg.lineWidth = l.width ?? 1.6; mg.lineCap = 'round'; mg.lineJoin = 'round';
    for (const d of ['M8 44V18a12 12 0 0 1 24 0v26', 'M20 12v32', 'M2 44h36']) mg.stroke(new Path2D(d));
    const pad = Math.ceil(40 * l.s);
    const x0 = Math.max(0, Math.floor(l.x - pad)), y0 = Math.max(0, Math.floor(l.y - pad));
    const w = Math.min(c.width - x0, pad * 2), h = Math.min(c.height - y0, pad * 2);
    const A = mg.getImageData(x0, y0, w, h).data;
    const im = g.getImageData(x0, y0, w, h); const P = im.data;
    const bl = document.createElement('canvas'); bl.width = w; bl.height = h;
    const blg = bl.getContext('2d'); blg.filter = `blur(${l.texBlur ?? 4}px)`; blg.drawImage(c, x0, y0, w, h, 0, 0, w, h);
    const B = blg.getImageData(0, 0, w, h).data;
    const col = [1, 3, 5].map((k) => parseInt(l.color.slice(k, k + 2), 16));
    const lum = (d, i) => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : A[(y * w + x) * 4 + 3] / 255);
    const ref = l.ref ?? 120;
    const o = Math.max(1, Math.round(l.s * (l.relief ?? 0.9)));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const al = a(x, y);
      const mean = lum(B, i);
      const light = Math.pow(Math.max(mean, 8) / ref, l.mode === 'print' ? 0.75 : 0.45);
      if (l.mode === 'embroider') {
        // Sombra del bordado sobre la tela.
        const sh = a(x - o, y - Math.round(o * 1.5)) * (1 - al);
        if (sh > 0) for (let j = 0; j < 3; j++) P[i + j] *= 1 - 0.38 * sh;
      }
      if (al <= 0) continue;
      let k;
      if (l.mode === 'print') {
        const tex = Math.min(1.5, Math.max(0.55, lum(P, i) / (mean + 1)));
        k = light * (0.45 + 0.55 * tex);
      } else {
        const shade = 1 + 0.9 * (a(x - o, y - o) - a(x + o, y + o));
        const thread = 0.8 + 0.2 * Math.sin((x - y) * (l.threads ?? 1.7));
        k = light * shade * thread;
      }
      const f = al * (l.alpha ?? 0.92);
      for (let j = 0; j < 3; j++) P[i + j] = P[i + j] * (1 - f) + Math.min(255, col[j] * k) * f;
    }
    g.putImageData(im, x0, y0);
  }
  // Etiquetas (parche tejido) opcionales: rectángulo redondeado con borde fino y sombra suave.
  for (const b of cfg.badges ?? []) {
    g.save();
    g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 6; g.shadowOffsetY = 2;
    g.fillStyle = b.fill; g.beginPath(); g.roundRect(b.x, b.y, b.w, b.h, b.r ?? 6); g.fill();
    g.shadowColor = 'transparent';
    g.strokeStyle = b.stroke; g.lineWidth = 1; g.beginPath(); g.roundRect(b.x + 3, b.y + 3, b.w - 6, b.h - 6, (b.r ?? 6) - 2); g.stroke();
    g.restore();
  }
  // Logo de Umbral (arco, línea de luz y base), opcional, con resplandor de letrero retroiluminado.
  for (const l of cfg.logos ?? []) {
    if (l.mode) { fabricLogo(l); continue; }
    g.save();
    g.translate(l.x, l.y); g.scale(l.s, l.s); g.translate(-20, -24);
    g.strokeStyle = l.color; g.lineWidth = l.width ?? 1.6; g.lineCap = 'round';
    if (l.glow) { g.shadowColor = l.glow; g.shadowBlur = l.blur ?? 6; }
    for (let k = 0; k < (l.passes ?? 1); k++) {
      g.stroke(new Path2D('M8 44V18a12 12 0 0 1 24 0v26'));
      g.stroke(new Path2D('M20 12v32'));
      g.stroke(new Path2D('M2 44h36'));
    }
    g.restore();
  }
  // Recorte final opcional [x, y, ancho, alto].
  if (cfg.crop) {
    const [cx, cy, cw, ch] = cfg.crop;
    const o = document.createElement('canvas'); o.width = cw; o.height = ch;
    o.getContext('2d').drawImage(c, cx, cy, cw, ch, 0, 0, cw, ch);
    return o.toDataURL('image/jpeg', 0.95);
  }
  return c.toDataURL('image/jpeg', 0.95);
}, { img, serif, sans, cfg });
fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
await b.close(); console.log('listo', out);
