// Movimientos del glosario de Forja con el esqueleto de Fitness by Evidence (figure-rig.ts).
// Sentadilla, peso muerto, press, dominada, cuerda y remo salen del catálogo de FbE;
// swing y salto al cajón se armaron aquí con el mismo sistema.

import { FLOOR as FLOOR_Y, FigureDef, FrontPose, GROUND as G, LEN, Limb, P, Prop, SidePose } from './figure-rig';

const FLOOR: Prop = { k: 'floor' };
const foot = (x: number, b = 1, ft = 90): Limb => ({ to: [x, G], b, ft });
const side = (a: SidePose, b: Partial<SidePose>, gear: FigureDef['gear'] = [], props: Prop[] = [FLOOR], extra: Partial<FigureDef> = {}): FigureDef => ({ view: 'side', a, b: { ...a, ...b }, gear, props, ...extra });

// ---------------------------------------------------------------- Del catálogo de FbE

/** Sentadilla con barra alta: el tobillo no se mueve; la cadera baja y se va hacia atrás. */
const SQUAT: FigureDef = side({ hip: [29, G - 22], torso: 176, arm: { on: 'back', b: 1 }, leg: foot(30) }, { hip: [23.5, 48.5], torso: 150 }, [{ k: 'plate', at: 'back', r: 4.2 }]);

/** Peso muerto convencional: de la barra en el piso a la cadera extendida. */
const DEADLIFT: FigureDef = side(
  { hip: [23, 47], torso: 128, arm: { to: [34, 54.6], b: -1 }, leg: foot(30) },
  { hip: [29, G - 22], torso: 180, arm: { to: [30.5, 39.8], b: -1 } },
  [{ k: 'plate', at: 'hand', r: 5 }],
);

/** Press militar de pie, de frente: la barra sube de los hombros a la vertical. */
const FRONT_HIP: P = [32, G - 22];
const pressBase: FrontPose = { hip: FRONT_HIP, lift: 0, arm: { to: [22.5, 21.5], b: 1 }, leg: [6, 0] };
const PRESS: FigureDef = { view: 'front', a: pressBase, b: { ...pressBase, arm: { to: [24.5, FRONT_HIP[1] - LEN.torso - 16.4], b: 1 } }, gear: [{ k: 'bar', ext: 9 }], props: [FLOOR] };

/** Dominada, de frente: la cadera sube hasta que la barbilla pasa la barra. */
const PULLUP: FigureDef = {
  view: 'front',
  a: { hip: [32, 39.5], arm: { to: [23.5, 9], b: 1 }, leg: [3, 0] },
  b: { hip: [32, 29], arm: { to: [23.5, 9], b: 1 }, leg: [3, 0] },
  gear: [],
  props: [{ k: 'line', p: [[13, 4], [13, 9], [51, 9], [51, 4]] }],
};

/** Cuerda: dos saltos por ciclo; la cuerda pasa bajo los pies cuando están en el aire. */
const HOP = 5;
const hop = (up: number): FrontPose => ({ hip: [32, G - 20.6 - up * (HOP + 1.4)], thigh: 9.6 + up * 1.4, arm: [14, 62], leg: [4, 0] });
const JUMP = [0, 0.75, 1, 0.75].map(hop);
const ROPE: FigureDef = { view: 'front', a: JUMP[0]!, b: JUMP[0]!, cycle: [...JUMP.slice(1), ...JUMP], gear: [{ k: 'rope', top: 4.5, bottom: 60.6, turns: 2 }], props: [FLOOR] };

/** Remo ergómetro: primero empujan las piernas, luego el torso se va atrás y al final jalan los brazos. */
const BASE = 59.8;
const feet = (...xs: number[]): P[][] => xs.map((x) => [[x - 2, BASE + 0.4], [x + 2, BASE + 0.4]]);
const RAIL = 54.6;
const FAN: P = [56.5, 44];
const STRAP: P = [40, 49.5];
const rowCatch: SidePose = { hip: [30.5, 47.5], torso: 158, arm: { to: [50.5, 39.5], b: -1 }, leg: { to: STRAP, b: 1, ft: 135 } };
const ROWER: FigureDef = {
  view: 'side',
  a: rowCatch,
  m: { ...rowCatch, hip: [19.5, 47.5], torso: 176, arm: { to: [36.5, 38], b: -1 } },
  b: { ...rowCatch, hip: [18.5, 47.5], torso: 198, arm: { to: [25, 40.5], b: -1 } },
  hold: 0.08,
  gear: [
    { k: 'wheel', c: FAN, r: 5.6 },
    { k: 'tube', p: [[[10.5, RAIL], [44.5, RAIL], FAN], [[12.5, RAIL], [12.5, BASE]], [[FAN[0], FAN[1] + 5.6], [FAN[0], BASE]], [[54.5, 38.6], [51, 31.5]]] },
    { k: 'tube', w: 'thick', p: [...feet(12.5, FAN[0]), [[41, 52.6], [45.6, 48]], [[49.6, 30.4], [51.8, 33.2]]] },
    { k: 'plat', at: 'hip', d: [0, 3.7], ang: 90, len: 6.5 },
    { k: 'cable', from: [53.4, 41.2], at: 'hand', end: 'rope' },
  ],
  props: [FLOOR],
};

// ---------------------------------------------------------------- Propios de Forja

/** Swing ruso: bisagra de cadera con la pesa entre las piernas → la cadera empuja y la pesa sube al frente. */
// Los brazos van por ángulos en las tres posturas: así se interpolan sin saltos.
const swingBottom: SidePose = { hip: [23.5, 40.5], torso: 118, head: 128, arm: [-30, -30], leg: foot(30), leg2: foot(26.5) };
const SWING: FigureDef = {
  view: 'side',
  a: swingBottom,
  m: { hip: [27.5, G - 22.4], torso: 168, arm: [44, 48], leg: foot(30), leg2: foot(26.5) },
  b: { hip: [29, G - 22], torso: 184, arm: [92, 94], leg: foot(30), leg2: foot(26.5) },
  hold: 0.06,
  gear: [{ k: 'plate', at: 'hand', d: [0.8, 3], r: 3.1 }],
  props: [FLOOR],
};

/**
 * Salto al cajón: carga, despega, punto alto con rodillas al pecho, cae en cuclillas sobre el
 * cajón, se para y baja de espaldas. Todas las piernas van como punto de destino ({ to }) para que
 * la mezcla entre posturas sea continua.
 */
const BOX_TOP = 44;
const ON_BOX = BOX_TOP - 2.2;
const at = (x: number, y: number, ft = 90): Limb => ({ to: [x, y], b: 1, ft });
const onBox = (x: number): Limb => at(x, ON_BOX);
const boxStand: SidePose = { hip: [26.5, G - 22], torso: 179, arm: [6, 12], leg: foot(28), leg2: foot(24.5) };
const BOXJUMP: FigureDef = {
  view: 'side',
  a: boxStand,
  b: boxStand,
  cycle: [
    { hip: [22.5, 46.5], torso: 138, arm: [-52, -36], leg: foot(28), leg2: foot(24.5) },
    { hip: [28, 37], torso: 166, arm: [158, 170], leg: at(29, G - 0.5, 125), leg2: at(26, G - 0.5, 125) },
    { hip: [36, 26.5], torso: 158, arm: [118, 128], leg: at(44.5, 39.5, 100), leg2: at(41, 38.5, 100) },
    { hip: [39, 32], torso: 146, arm: [82, 96], leg: onBox(44), leg2: onBox(40.5) },
    { hip: [43, ON_BOX - 22], torso: 180, arm: [4, 8], leg: onBox(44), leg2: onBox(40.5) },
    { hip: [37, 38], torso: 176, arm: [8, 14], leg: onBox(42), leg2: at(30, G) },
  ],
  gear: [],
  props: [FLOOR, { k: 'line', p: [[37, FLOOR_Y], [37, BOX_TOP], [55, BOX_TOP], [55, FLOOR_Y]] }],
};

export interface Move {
  id: string;
  name: string;
  text: string;
  def: FigureDef;
  /** Duración de una repetición o de un ciclo completo. */
  ms: number;
}

export const MOVES: Move[] = [
  { id: 'squat', name: 'Sentadilla', text: 'Cadera abajo y atrás, pecho arriba, rodillas siguiendo la punta.', def: SQUAT, ms: 1700 },
  { id: 'deadlift', name: 'Peso muerto', text: 'Del piso a la cadera con la espalda neutra y la barra pegada.', def: DEADLIFT, ms: 1800 },
  { id: 'press', name: 'Press militar', text: 'La barra sube en línea recta y la cabeza pasa al frente.', def: PRESS, ms: 1500 },
  { id: 'pullup', name: 'Dominada', text: 'Del colgado completo a la barbilla sobre la barra.', def: PULLUP, ms: 1500 },
  { id: 'swing', name: 'Swing', text: 'La cadera impulsa la pesa; los brazos solo la acompañan.', def: SWING, ms: 1300 },
  { id: 'boxjump', name: 'Salto al cajón', text: 'Carga, despega y cae suave en cuclillas sobre el cajón.', def: BOXJUMP, ms: 2600 },
  { id: 'rope', name: 'Dobles', text: 'Dos vueltas de cuerda por cada salto, muñecas rápidas.', def: ROPE, ms: 900 },
  { id: 'row', name: 'Remo', text: 'Piernas, torso y brazos; de regreso en orden inverso.', def: ROWER, ms: 2000 },
];
