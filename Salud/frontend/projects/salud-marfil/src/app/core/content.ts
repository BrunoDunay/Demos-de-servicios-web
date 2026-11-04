// Contenido de Marfil (marca ficticia). Todo lo que se muestra en el sitio sale de aquí.

export const CLINIC = {
  name: 'Marfil',
  full: 'Marfil · Odontología',
  phone: '(449) 318 72 46',
  email: 'hola@marfildental.mx',
  address: 'Av. Universidad 1102, local 4, Bosques del Prado',
  city: 'Aguascalientes, Ags.',
  rating: 4.9,
  reviews: 312,
};

/** Horario por día de la semana (0 = domingo). null = cerrado. */
export const HOURS: (readonly [number, number] | null)[] = [
  null,
  [9, 20],
  [9, 20],
  [9, 20],
  [9, 20],
  [9, 19],
  [9, 14],
];
export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export interface Treatment {
  id: string;
  name: string;
  short: string;
  text: string;
  /** Dientes que se iluminan en el odontograma (numeración FDI). */
  teeth: number[];
  sessions: string;
  time: string;
  from: number;
  note?: string;
}

const FRONT_UP = [13, 12, 11, 21, 22, 23];
const FRONT_LOW = [43, 42, 41, 31, 32, 33];
export const ALL_TEETH = {
  upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

export const TREATMENTS: Treatment[] = [
  {
    id: 'limpieza',
    name: 'Limpieza y revisión',
    short: 'Limpieza',
    text: 'Quitamos sarro y manchas con ultrasonido, pulimos y revisamos cada diente. Es la cita que evita casi todas las demás.',
    teeth: [...ALL_TEETH.upper, ...ALL_TEETH.lower],
    sessions: '1 cita, cada 6 meses',
    time: '45 min',
    from: 650,
  },
  {
    id: 'blanqueamiento',
    name: 'Blanqueamiento en consultorio',
    short: 'Blanqueamiento',
    text: 'Gel de peróxido activado con luz, con protección para encías. Sube de 2 a 3 tonos en una sola cita y te llevas guardas para mantenerlo.',
    teeth: [14, ...FRONT_UP, 24, 44, ...FRONT_LOW, 34],
    sessions: '1 cita',
    time: '90 min',
    from: 3200,
    note: 'Antes hacemos una limpieza para que el tono quede parejo.',
  },
  {
    id: 'resinas',
    name: 'Resinas del color del diente',
    short: 'Resinas',
    text: 'Cambiamos las amalgamas negras y curamos caries con resina que se iguala a tu tono. Nadie sabrá cuál diente se arregló.',
    teeth: [16, 25, 36, 47],
    sessions: '1 cita por cada 2 o 3 dientes',
    time: '40 min por diente',
    from: 850,
  },
  {
    id: 'ortodoncia',
    name: 'Ortodoncia con alineadores',
    short: 'Ortodoncia',
    text: 'Alineadores transparentes que te quitas para comer. Te mostramos en 3D cómo quedará tu sonrisa antes de empezar.',
    teeth: [...ALL_TEETH.upper.slice(2, 14), ...ALL_TEETH.lower.slice(2, 14)],
    sessions: 'Revisión cada 6 a 8 semanas',
    time: '8 a 18 meses',
    from: 38000,
    note: 'Hasta 12 meses sin intereses con tarjetas participantes.',
  },
  {
    id: 'implantes',
    name: 'Implantes dentales',
    short: 'Implantes',
    text: 'Reemplazamos un diente perdido con un implante de titanio y una corona de zirconia. Se planea con tomografía para colocarlo sin sorpresas.',
    teeth: [36],
    sessions: '2 a 3 citas',
    time: '3 a 4 meses en total',
    from: 18500,
  },
  {
    id: 'endodoncia',
    name: 'Endodoncia (tratamiento de conductos)',
    short: 'Endodoncia',
    text: 'Cuando la caries llega al nervio, limpiamos el interior del diente y lo sellamos. Con anestesia y equipo rotatorio, se siente como una resina larga.',
    teeth: [46],
    sessions: '1 o 2 citas',
    time: '60 a 90 min',
    from: 3900,
  },
  {
    id: 'carillas',
    name: 'Carillas de porcelana',
    short: 'Carillas',
    text: 'Láminas finas que corrigen forma, color y tamaño de los dientes de enfrente. Primero las pruebas en tu boca con un diseño temporal.',
    teeth: [14, ...FRONT_UP, 24],
    sessions: '3 citas',
    time: '3 semanas',
    from: 7800,
    note: 'Precio por diente.',
  },
  {
    id: 'ninos',
    name: 'Odontopediatría',
    short: 'Niños',
    text: 'Primera visita desde que sale el primer diente. Selladores, flúor y una doctora que sabe explicar todo con calma (y con premio al final).',
    teeth: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    sessions: 'Revisión cada 6 meses',
    time: '30 min',
    from: 550,
  },
];

/** Nombre de un diente según la numeración FDI (la que usa el odontograma). */
export function toothName(n: number): string {
  const q = Math.floor(n / 10);
  const p = n % 10;
  const child = q >= 5;
  const side = q === 1 || q === 4 || q === 5 || q === 8 ? 'derecho' : 'izquierdo';
  const arch = q === 1 || q === 2 || q === 5 || q === 6 ? 'superior' : 'inferior';
  const names = child
    ? ['', 'Incisivo central', 'Incisivo lateral', 'Canino', 'Primer molar', 'Segundo molar']
    : ['', 'Incisivo central', 'Incisivo lateral', 'Canino', 'Primer premolar', 'Segundo premolar', 'Primer molar', 'Segundo molar', 'Tercer molar (muela del juicio)'];
  return `${names[p]} ${arch} ${side}${child ? ' (de leche)' : ''}`;
}

export const STEPS = [
  {
    n: '01',
    title: 'Valoración',
    time: '45 min · $350',
    text: 'Revisión completa, radiografía panorámica digital y fotos de tu sonrisa. Te explicamos lo que vemos en la pantalla, sin tecnicismos.',
  },
  {
    n: '02',
    title: 'Plan por escrito',
    time: 'El mismo día',
    text: 'Te llevas un plan con cada tratamiento, el orden, el número de citas y el precio final. Lo urgente primero; lo estético, cuando tú decidas.',
  },
  {
    n: '03',
    title: 'Tratamiento',
    time: 'Citas a tu horario',
    text: 'Agenda de lunes a sábado. Si algo cambia a mitad del tratamiento, te lo decimos antes de hacerlo, nunca en la caja.',
  },
  {
    n: '04',
    title: 'Seguimiento',
    time: 'Cada 6 meses',
    text: 'Te escribimos cuando toca tu revisión. Las garantías de resinas, coronas e implantes quedan en tu expediente.',
  },
];

export const TEAM = [
  {
    name: 'Dra. Renata Ibarra',
    role: 'Rehabilitación oral y estética',
    text: 'Fundó Marfil en 2014. Especialista por la UAA, hace los diseños de sonrisa, carillas e implantes.',
    photo: 'doctora',
    focus: '50% 18%',
    license: 'Céd. esp. 0000000 (demo)',
    stats: ['12 años', '3.1k pacientes', '4.9'],
  },
  {
    name: 'Dr. Tomás Lugo',
    role: 'Ortodoncia',
    text: 'Certificado en alineadores transparentes. Le gusta enseñar en 3D cómo se mueve cada diente antes de empezar.',
    photo: 'consulta-dr',
    focus: '72% 40%',
    license: 'Céd. esp. 0000000 (demo)',
    stats: ['8 años', '1.2k pacientes', '4.8'],
  },
  {
    name: 'Dra. Paula Méndez',
    role: 'Odontopediatría',
    text: 'Atiende a los más chicos con paciencia y un sillón que sube como nave espacial. Mamá o papá siempre pueden entrar.',
    photo: 'ninos',
    focus: '30% 40%',
    license: 'Céd. esp. 0000000 (demo)',
    stats: ['10 años', '2.4k pacientes', '5.0'],
  },
];

export const PROOF = [
  { value: 134, suffix: '°C', label: 'Autoclave clase B: todo el instrumental se esteriliza en bolsa sellada que abrimos frente a ti.' },
  { value: 90, suffix: '%', label: 'Menos radiación con rayos X digitales que con placa tradicional.' },
  { value: 12, suffix: ' años', label: 'Atendiendo familias en Aguascalientes, desde 2014.' },
];

export const REVIEWS = [
  { name: 'Mariana G.', when: 'hace 2 semanas', text: 'Le tenía pánico al dentista desde niña. La Dra. Renata me explicó todo en la pantalla y no sentí nada en la endodoncia. Ya volví con mis hijos.' },
  { name: 'Luis Ernesto R.', when: 'hace 1 mes', text: 'Me dieron el plan con precios por escrito y fue exactamente lo que pagué. Eso no me había pasado nunca.' },
  { name: 'Sofía P.', when: 'hace 1 mes', text: 'Los alineadores me cambiaron la sonrisa en 11 meses. Las citas siempre a tiempo y me escribían para recordarme.' },
  { name: 'Jorge A.', when: 'hace 2 meses', text: 'Llegué un sábado con dolor y me atendieron ese mismo día. Muy limpio todo, abren el instrumental frente a ti.' },
  { name: 'Daniela M.', when: 'hace 3 meses', text: 'Mi hija de 5 años sale feliz de su cita con la Dra. Paula. Le dieron un diploma de valiente.' },
];

export const FAQ = [
  { q: '¿Duele?', a: 'Usamos anestesia con aplicación previa de gel, así que casi no se siente el piquete. Si en algún momento algo te molesta, levantas la mano y paramos.' },
  { q: '¿Atienden urgencias?', a: 'Sí. Si tienes dolor o se te rompió un diente, escríbenos por WhatsApp: guardamos espacios todos los días para urgencias, sábados incluidos.' },
  { q: '¿Aceptan seguros de gastos médicos?', a: 'Te damos factura y el informe que pide tu aseguradora para el reembolso. Trabajamos en convenio con algunas empresas de Aguascalientes: pregúntanos por la tuya.' },
  { q: '¿Puedo pagar a meses?', a: 'Sí, hasta 12 meses sin intereses en ortodoncia, implantes y carillas con tarjetas participantes. También aceptamos transferencia y efectivo.' },
  { q: '¿Cada cuánto debo ir?', a: 'Una limpieza y revisión cada 6 meses. Si tienes brackets, implantes o encías sensibles, te diremos si conviene cada 4.' },
];

export const PLAN = {
  name: 'Plan Familia Marfil',
  price: 1490,
  per: 'por persona, al año',
  items: ['2 limpiezas y revisiones al año', '1 radiografía panorámica', '15% de descuento en todos los tratamientos', 'Urgencias sin costo de consulta', 'Recordatorios por WhatsApp'],
};

/** Motivos de consulta para la agenda. */
export const REASONS = ['Revisión y limpieza', 'Dolor o urgencia', 'Blanqueamiento', 'Ortodoncia', 'Implantes', 'Resinas o caries', 'Mi hijo o hija', 'Otro'];
