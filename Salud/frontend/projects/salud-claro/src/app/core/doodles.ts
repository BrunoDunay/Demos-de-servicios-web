// Dibujos "a mano" del sitio, generados con código para que siempre salgan igual (semilla fija):
// la maraña (ansiedad), la espiral (calma), la cabeza de perfil y orillas de papel rasgado.

/** Generador pseudoaleatorio con semilla (mulberry32). */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Une puntos con curvas suaves (Catmull-Rom → Bézier cúbicas). */
function smooth(points: [number, number][]): string {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Maraña: muchos lazos al azar dentro de un óvalo (cx, cy, rx, ry). */
export function scribble(cx: number, cy: number, rx: number, ry: number, loops = 34, seed = 7): string {
  const r = rng(seed);
  const pts: [number, number][] = [];
  let a = r() * Math.PI * 2;
  for (let i = 0; i < loops; i++) {
    a += 1.2 + r() * 2.6;
    const k = 0.35 + r() * 0.65;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts);
}

/** Espiral de Arquímedes de afuera hacia el centro. */
export function spiral(cx: number, cy: number, r: number, turns = 4.5, steps = 140): string {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2 - Math.PI / 2;
    const rr = r * (1 - t * 0.94);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smooth(pts);
}

/** Cabeza de perfil (mira a la derecha), estilo de los cuadros de referencia. Caja 220 × 220. */
export const HEAD =
  'M40 214 C40 190 26 168 26 132 C26 66 70 24 124 24 C170 24 198 56 200 96 C201 108 199 114 204 124 L214 142 C216 146 212 149 206 150 C207 157 210 162 206 167 C209 172 207 178 200 180 C197 192 186 196 170 194 L166 214 Z';

/** Polígono de papel rasgado para clip-path (orillas dentadas e irregulares). */
export function torn(seed: number, depth = 1.6, teeth = 18): string {
  const r = rng(seed);
  const edge = (from: [number, number], to: [number, number], inward: [number, number]) => {
    const out: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const t = i / teeth;
      const j = (r() - 0.3) * depth;
      const x = from[0] + (to[0] - from[0]) * t + inward[0] * j;
      const y = from[1] + (to[1] - from[1]) * t + inward[1] * j;
      out.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
    }
    return out;
  };
  return `polygon(${[
    ...edge([0, 0], [100, 0], [0, 1]),
    ...edge([100, 0], [100, 100], [-1, 0]),
    ...edge([100, 100], [0, 100], [0, -1]),
    ...edge([0, 100], [0, 0], [1, 0]),
  ].join(', ')})`;
}

/** Sillones dibujados a línea (referencia "La primera sesión"). Caja 360 × 220. */
export const CHAIRS = [
  // Sillón izquierdo
  'M30 200 L34 150 M110 200 L106 150 M24 152 C22 130 28 118 48 116 L92 114 C110 114 116 124 114 150 Z M34 116 C30 80 34 52 40 40 C52 26 86 26 96 40 C102 54 104 84 100 116 M24 124 C14 124 12 134 16 150 L28 152 M114 126 C124 124 128 134 124 150 L112 152',
  // Silla derecha con respaldo de barrotes
  'M240 200 L244 120 M320 200 L316 120 M236 122 L324 118 L326 128 L236 132 Z M244 120 C242 70 250 36 280 30 C310 36 318 70 316 118 M262 118 L262 50 M280 118 L280 34 M298 118 L298 50',
  // Planta en maceta
  'M170 200 L166 168 L196 168 L192 200 Z M181 168 C180 140 176 120 168 104 M182 168 C186 138 194 118 206 106 M181 150 C170 146 160 138 156 126 M184 140 C196 136 204 128 208 118 M168 104 C164 100 162 94 164 88 C170 92 172 98 168 104 M206 106 C212 104 216 98 216 92 C210 92 206 98 206 106',
];

/** Hojas tipo acuarela (referencia de cuadros con hojas azules). */
export const LEAF = 'M0 0 C18 -26 52 -34 80 -20 C60 4 28 14 0 0 Z';
