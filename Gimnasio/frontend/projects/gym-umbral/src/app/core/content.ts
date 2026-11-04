// Contenido de la demo. Marca y datos ficticios.

export const CONTACT = {
  address: 'Av. de las Jacarandas 1200, Local 3',
  city: 'Aguascalientes, Ags. · C.P. 20126',
  phone: '(449) 413 86 20',
  email: 'reservas@umbralclub.com.mx',
  hours: [
    { days: 'Lunes a viernes', time: '6:00 – 22:00' },
    { days: 'Sábado y domingo', time: '8:00 – 14:00' },
  ],
};

export const NAV = [
  { label: 'Disciplinas', path: '/disciplinas' },
  { label: 'El club', path: '/club' },
  { label: 'Membresías', path: '/membresias' },
  { label: 'Contacto', path: '/contacto' },
];

export interface Discipline {
  id: string;
  name: string;
  tagline: string;
  img: string;
  gallery: string[];
  video?: string;
  /** Video horizontal de fondo (escena del inicio). */
  bg?: string;
  /** Video vertical (paneles y arcos). */
  vert?: string;
  /** Foto horizontal de fondo cuando no hay video. */
  wide?: string;
  /** Video vertical para el arco de su sección en /disciplinas. */
  arch?: string;
  text: string;
  long: string;
  specs: [string, string][];
  benefits: string[];
}

export const DISCIPLINES: Discipline[] = [
  {
    id: 'reformer',
    name: 'Reformer',
    tagline: 'Control, postura y fuerza profunda',
    img: 'reformer-1',
    gallery: ['reformer-sala', 'reformer-flow', 'reformer-arcos'],
    bg: 'h-reformer',
    vert: 'v-reformer',
    arch: 'v-pilates',
    text: 'Pilates en máquina con resistencia de resortes. Trabajas el centro del cuerpo, la postura y la movilidad, sin impacto.',
    long: 'Doce reformers de maple frente a un muro de espejo con luz cálida. Cada sesión combina respiración, control y fuerza con progresiones para que notes el cambio desde la tercera clase.',
    specs: [
      ['Duración', '50 min'],
      ['Grupo', '12 personas'],
      ['Intensidad', 'Media'],
    ],
    benefits: ['Mejor postura y menos dolor de espalda', 'Abdomen fuerte sin impacto', 'Movilidad de cadera y hombros'],
  },
  {
    id: 'ride',
    name: 'Ride',
    tagline: 'Cardio a oscuras, al ritmo de la música',
    img: 'ride-sombra',
    wide: 'ride-led',
    gallery: ['ride-rojo', 'ride-ritmo', 'ride-luz'],
    text: 'Indoor cycling con luces y música curada por el coach. 45 minutos que se sienten como un concierto.',
    long: 'Una sala a oscuras con 20 bicis, sonido envolvente y luz que cambia con cada canción. Pedaleas a tu carga: el coach guía el ritmo, tú decides la intensidad.',
    specs: [
      ['Duración', '45 min'],
      ['Grupo', '20 bicis'],
      ['Intensidad', 'Alta'],
    ],
    benefits: ['Quema de 450 a 650 kcal por sesión', 'Resistencia cardiovascular', 'Desconexión total del día'],
  },
  {
    id: 'fuerza',
    name: 'Fuerza',
    tagline: 'Peso libre con técnica de estudio',
    img: 'fuerza-1',
    gallery: ['fuerza-sala', 'mancuernas', 'detalle-pesas'],
    video: 'fuerza',
    bg: 'fuerza',
    vert: 'v-fuerza-2',
    arch: 'v-fuerza',
    text: 'Entrenamiento de fuerza en grupos de ocho con un coach que corrige cada repetición. Barras, mancuernas y kettlebells.',
    long: 'El estudio de fuerza combina programación por bloques de seis semanas con atención casi personal. Registramos tus cargas para que veas tu progreso en números.',
    specs: [
      ['Duración', '55 min'],
      ['Grupo', '8 personas'],
      ['Intensidad', 'Media-alta'],
    ],
    benefits: ['Más masa muscular y metabolismo activo', 'Huesos y articulaciones fuertes', 'Técnica segura desde el primer día'],
  },
  {
    id: 'pesas',
    name: 'Sala de pesas',
    tagline: 'El gimnasio completo, a tu ritmo',
    img: 'gym-sala',
    wide: 'gym-cardio',
    vert: 'v-rack',
    gallery: ['gym-pasillo', 'gym-ventanal', 'gym-oscuro'],
    text: 'Peso libre, máquinas y cardio frente al jardín interior, con coach de piso que corrige y ajusta tus cargas.',
    long: 'Una sala abierta de 5:30 a 22:00 para entrenar por tu cuenta: mancuernas de 2 a 40 kg, racks, poleas, caminadoras y escaladoras. Tu coach de piso te arma la rutina y la revisa cada mes.',
    specs: [
      ['Horario', '5:30 – 22:00'],
      ['Coach', 'De piso'],
      ['Acceso', 'Libre'],
    ],
    benefits: ['Rutina personalizada cada mes', 'Cardio con vista al jardín', 'Sin filas: aforo controlado'],
  },
  {
    id: 'movilidad',
    name: 'Movilidad',
    tagline: 'Cadera, columna y respiración',
    img: 'mat-studio',
    wide: 'mat-studio',
    gallery: ['reformer-arcos', 'atmosfera', 'niebla'],
    text: 'Una clase lenta y precisa para abrir cadera, soltar la espalda y respirar mejor. El complemento de todo lo demás.',
    long: 'Trabajo en mat con bandas, bloques y rodillos en un estudio de luz tenue. Ideal después de Fuerza o como clase de recuperación activa a media semana.',
    specs: [
      ['Duración', '45 min'],
      ['Grupo', '10 personas'],
      ['Intensidad', 'Suave'],
    ],
    benefits: ['Menos rigidez y dolor de espalda', 'Mejor rango para tus levantamientos', 'Respiración y calma'],
  },
  {
    id: 'privado',
    name: 'Uno a uno',
    tagline: 'Tu coach, tu horario, tu programa',
    img: 'fuerza-1',
    wide: 'barra',
    vert: 'v-edit',
    arch: 'v-edit',
    gallery: ['privado', 'detalle-pesas', 'mancuernas'],
    text: 'Sesiones privadas en el estudio de fuerza con un programa hecho solo para ti y seguimiento entre sesiones.',
    long: 'Empezamos con una valoración completa y armamos un plan por bloques. Cada sesión es en el estudio privado, en el horario que elijas, y tu coach revisa tu avance por WhatsApp.',
    specs: [
      ['Duración', '60 min'],
      ['Grupo', 'Solo tú'],
      ['Horario', 'Flexible'],
    ],
    benefits: ['Resultados medibles cada 4 semanas', 'Técnica cuidada al detalle', 'Plan de alimentación opcional'],
  },
  {
    id: 'recovery',
    name: 'Recovery',
    tagline: 'Sauna, tina fría y vapor',
    img: 'spa-privado',
    wide: 'spa-privado',
    vert: 'v-sauna',
    arch: 'v-piedras',
    gallery: ['spa', 'toallas', 'velas'],
    text: 'El cierre que tu cuerpo agradece: sauna infrarrojo, tina de agua fría, regadera de vapor y toallas tibias.',
    long: 'Un circuito de calor y frío para recuperar músculo y bajar las revoluciones. Reserva tu turno de 30 minutos en la suite privada o entra al sauna después de clase.',
    specs: [
      ['Turno', '30 min'],
      ['Aforo', '4 personas'],
      ['Temperatura', '60 °C / 12 °C'],
    ],
    benefits: ['Menos dolor muscular al día siguiente', 'Mejor descanso por la noche', 'Quince minutos solo para ti'],
  },
];

export interface ScheduleClass {
  time: string;
  day: number;
  discipline: 'reformer' | 'ride' | 'fuerza' | 'movilidad';
  name: string;
  coach: string;
}

export const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const TIMES = ['06:00', '07:15', '08:30', '13:00', '18:00', '19:15', '20:30'];

const plan: [string, number, ScheduleClass['discipline'], string, string][] = [
  ['06:00', 0, 'ride', 'Ride Sunrise', 'Emilio'], ['06:00', 1, 'reformer', 'Reformer Core', 'Renata'], ['06:00', 2, 'ride', 'Ride Sunrise', 'Emilio'], ['06:00', 3, 'reformer', 'Reformer Core', 'Renata'], ['06:00', 4, 'fuerza', 'Fuerza Total', 'Paula'],
  ['07:15', 0, 'reformer', 'Reformer Flow', 'Inés'], ['07:15', 1, 'fuerza', 'Fuerza Superior', 'Paula'], ['07:15', 2, 'reformer', 'Reformer Flow', 'Inés'], ['07:15', 3, 'fuerza', 'Fuerza Inferior', 'Paula'], ['07:15', 4, 'reformer', 'Reformer Flow', 'Inés'],
  ['08:30', 0, 'movilidad', 'Movilidad', 'Inés'], ['08:30', 2, 'movilidad', 'Movilidad', 'Inés'], ['08:30', 5, 'ride', 'Ride Long', 'Emilio'], ['08:30', 6, 'reformer', 'Reformer Slow', 'Renata'],
  ['13:00', 1, 'ride', 'Ride Express', 'Emilio'], ['13:00', 3, 'ride', 'Ride Express', 'Emilio'], ['13:00', 5, 'reformer', 'Reformer Core', 'Renata'], ['13:00', 6, 'movilidad', 'Recovery', 'Inés'],
  ['18:00', 0, 'fuerza', 'Fuerza Total', 'Paula'], ['18:00', 1, 'reformer', 'Reformer Burn', 'Renata'], ['18:00', 2, 'fuerza', 'Fuerza Total', 'Paula'], ['18:00', 3, 'reformer', 'Reformer Burn', 'Renata'], ['18:00', 4, 'ride', 'Ride Friday', 'Emilio'],
  ['19:15', 0, 'ride', 'Ride Night', 'Emilio'], ['19:15', 1, 'fuerza', 'Fuerza Superior', 'Paula'], ['19:15', 2, 'ride', 'Ride Night', 'Emilio'], ['19:15', 3, 'fuerza', 'Fuerza Inferior', 'Paula'], ['19:15', 4, 'reformer', 'Reformer Flow', 'Inés'],
  ['20:30', 0, 'reformer', 'Reformer Slow', 'Renata'], ['20:30', 1, 'movilidad', 'Recovery', 'Inés'], ['20:30', 2, 'reformer', 'Reformer Slow', 'Renata'], ['20:30', 3, 'movilidad', 'Recovery', 'Inés'],
];

export const SCHEDULE: ScheduleClass[] = plan.map(([time, day, discipline, name, coach]) => ({ time, day, discipline, name, coach }));

export const SPACES = [
  { img: 'reformer-sala', title: 'Estudio Reformer', text: 'Doce máquinas de maple, espejo de muro a muro y luz que baja al ritmo de la respiración.', size: 'tall' },
  { img: 'vestidores', title: 'Vestidores', text: 'Lockers digitales, regaderas de lluvia, amenidades de autor y toallas de algodón turco.', size: 'wide' },
  { img: 'sauna', title: 'Sauna infrarrojo', text: 'Quince minutos después de entrenar para recuperar músculo y bajar las revoluciones.', size: 'tall' },
  { img: 'fuerza-sala', title: 'Estudio de Fuerza', text: 'Peso libre, racks y un espacio privado para sesiones uno a uno.', size: 'wide' },
  { img: 'mat-studio', title: 'Sala Mat', text: 'Movilidad, recovery y estiramiento guiado sobre duela clara.', size: 'tall' },
  { img: 'senaletica', title: 'Detalles', text: 'Señalética retroiluminada y materiales nobles: así se siente llegar a Umbral.', size: 'wide' },
];

export const AMENITIES = [
  { icon: 'towel', title: 'Toallas incluidas', text: 'Grande y chica en cada visita.' },
  { icon: 'drop', title: 'Regaderas de lluvia', text: 'Con amenidades de autor.' },
  { icon: 'lock', title: 'Lockers digitales', text: 'Con tu código personal.' },
  { icon: 'flame', title: 'Sauna infrarrojo', text: 'Incluido en Platinum.' },
  { icon: 'coffee', title: 'Barra de café', text: 'Espresso y smoothies post entreno.' },
  { icon: 'car', title: 'Estacionamiento', text: 'Gratis con valet en horas pico.' },
  { icon: 'wifi', title: 'Wifi y lounge', text: 'Para llegar antes o quedarte después.' },
  { icon: 'leaf', title: 'Aroma propio', text: 'Cedro, bergamota y madera.' },
];

export const COACHES = [
  { img: 'coach-renata', name: 'Renata Solís', role: 'Head coach Reformer', bio: 'Doce años enseñando pilates clásico y contemporáneo. Le obsesiona la respiración.', since: 2026 },
  { img: 'coach-ines', name: 'Inés Barragán', role: 'Movilidad y Recovery', bio: 'Fisioterapeuta de formación. Hace que estirar se sienta como un ritual.', since: 2026 },
  { img: 'coach-paula', pos: 'center 85%', name: 'Paula Ortega', role: 'Fuerza', bio: 'Exatleta de halterofilia. Técnica impecable y paciencia infinita.', since: 2026 },
  { img: 'coach-emilio', name: 'Emilio Vargas', role: 'Ride', bio: 'DJ antes que coach. Sus playlists tienen lista de espera.', since: 2026 },
];

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  note: string;
  classes: string;
  /** Plan anterior que este incluye completo (se muestra como "Todo lo de ..."). */
  includes?: string;
  /** Solo lo que este plan agrega sobre el anterior. */
  features: string[];
  featured: boolean;
}

// Los nombres siguen los metales y piedras de las tarjetas premium: Gold, Platinum y Diamond.
export const PLANS: Plan[] = [
  {
    id: 'gold',
    name: 'Gold',
    monthly: 1890,
    note: 'Para empezar con constancia',
    classes: '8 clases al mes',
    features: [
      'Reformer, Ride, Fuerza y sala de pesas',
      'Reserva con 7 días de anticipación',
      'Valoración inicial con coach',
      'Toallas y amenidades de autor',
      'Locker digital en cada visita',
      'Agua mineral y fruta de temporada',
      '10% en paquetes de clases extra',
    ],
    featured: false,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    monthly: 2690,
    note: 'La experiencia completa',
    classes: 'Clases ilimitadas',
    includes: 'gold',
    features: [
      'Clases ilimitadas en todas las disciplinas',
      'Reserva con 14 días de anticipación',
      'Sauna infrarrojo ilimitado',
      'Valoración corporal cada 3 meses',
      'Locker fijo con tu nombre',
      'Café o smoothie post entreno, 2 por semana',
      'Valet sin costo en horas pico',
      '2 pases de invitado al mes',
      'Masterclasses y eventos privados',
    ],
    featured: true,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    monthly: 3900,
    note: 'Uno a uno con tu coach',
    classes: '8 sesiones privadas al mes',
    includes: 'platinum',
    features: [
      'Programa hecho a tu medida, revisado cada mes',
      'Estudio privado y horario flexible',
      'Seguimiento diario por WhatsApp',
      'Plan de alimentación con nutrióloga aliada',
      'Spa privado: tina fría y vapor',
      'Valoración corporal mensual',
      'Kit de bienvenida: botella, toalla y calcetas',
      'Prioridad en eventos y viajes del club',
    ],
    featured: false,
  },
];

export const PACKS = [
  { name: 'Primera sesión', price: 0, note: 'Por nuestra cuenta' },
  { name: '1 clase', price: 320, note: 'Vigencia 15 días' },
  { name: '5 clases', price: 1450, note: 'Vigencia 45 días' },
  { name: '10 clases', price: 2700, note: 'Vigencia 90 días' },
];

export const COMPARE: { feature: string; values: (string | boolean)[] }[] = [
  { feature: 'Clases al mes', values: ['8', 'Ilimitadas', 'Ilimitadas + 8 privadas'] },
  { feature: 'Reformer, Ride, Fuerza y sala de pesas', values: [true, true, true] },
  { feature: 'Reserva anticipada', values: ['7 días', '14 días', 'Flexible'] },
  { feature: 'Toallas y amenidades de autor', values: [true, true, true] },
  { feature: 'Sauna infrarrojo', values: [false, true, true] },
  { feature: 'Valoración corporal', values: ['Inicial', 'Trimestral', 'Mensual'] },
  { feature: 'Locker personal fijo', values: [false, true, true] },
  { feature: 'Café o smoothie post entreno', values: [false, '2 por semana', 'Diario'] },
  { feature: 'Valet en horas pico', values: [false, true, true] },
  { feature: 'Pases de invitado', values: [false, '2 al mes', '4 al mes'] },
  { feature: 'Masterclasses y eventos', values: [false, true, 'Prioridad'] },
  { feature: 'Programa personalizado', values: [false, false, true] },
  { feature: 'Plan de alimentación', values: [false, false, true] },
  { feature: 'Spa privado', values: [false, false, true] },
  { feature: 'Congelamiento', values: ['15 días', '30 días', '60 días'] },
];

export const TESTIMONIALS = [
  { img: 'socia-valeria', quote: 'Es el único lugar al que llego cansada y salgo con más energía. La luz, el olor, la música… todo está pensado.', name: 'Valeria C.', meta: 'Platinum · 2 años' },
  { img: 'socio-jorge', quote: 'Tenía años con dolor de espalda. Tres meses de Reformer con Renata y ya ni me acuerdo de él.', name: 'Jorge A.', meta: 'Gold · 8 meses' },
  { img: 'socia-sofia', quote: 'El Ride de los viernes es mi terapia. Emilio pone música que no escuchas en ningún otro lado.', name: 'Sofía M.', meta: 'Platinum · 1 año' },
  { img: 'socio-andres', quote: 'Lo que más valoro es el trato. Te reciben por tu nombre y saben exactamente cómo vas.', name: 'Andrés R.', meta: 'Diamond · 6 meses' },
  { img: 'socia-mar', quote: 'Entro al sauna después de Fuerza y salgo como nueva. Es mi hora del día para mí.', name: 'Mariana T.', meta: 'Platinum · 1 año' },
  { img: 'socio-dani', quote: 'Me gusta que los grupos sean chicos. El coach corrige cada repetición y se nota en los números.', name: 'Daniel P.', meta: 'Gold · 4 meses' },
];

export interface DayStop {
  time: string;
  title: string;
  /** Espacio del club donde sucede. */
  place: string;
  text: string;
  img: string;
  video?: string;
  /** Color del cielo detrás de la tarjeta (de madrugada a noche). */
  sky: [string, string];
}

export const DAY: DayStop[] = [
  { time: '06:00', title: 'Ride Sunrise', place: 'Sala de Ride', text: 'La ciudad todavía duerme y la sala ya vibra. 45 minutos para empezar con todo.', img: 'ride-led', sky: ['#141a30', '#4a3a55'] },
  { time: '06:45', title: 'Sala de pesas', place: 'Gimnasio', text: 'Tu rutina, a tu ritmo, con coach de piso que corrige y ajusta cargas.', img: 'gym-cardio', sky: ['#283050', '#b0787a'] },
  { time: '07:15', title: 'Reformer Flow', place: 'Estudio Reformer', text: 'Luz dorada, respiración lenta y doce reformers alineados frente al espejo.', img: 'reformer-warm', video: 'v-reformer', sky: ['#3d5a86', '#e0a888'] },
  { time: '09:00', title: 'Café en el lounge', place: 'Lounge', text: 'Espresso, smoothie de temporada y la mesa larga donde se queda la conversación.', img: 'velas', sky: ['#4f7fb6', '#bcd3e6'] },
  { time: '10:30', title: 'Movilidad', place: 'Estudio Mat', text: 'Cadera, columna y hombros. La clase que hace que todo lo demás se sienta mejor.', img: 'mat-studio', sky: ['#5a8cc4', '#c9dceb'] },
  { time: '13:00', title: 'Fuerza Express', place: 'Estudio de Fuerza', text: 'Tu hora de comida convertida en fuerza: barra, mancuernas y técnica.', img: 'fuerza-sala', video: 'v-fuerza-2', sky: ['#5f93cc', '#d4e3ee'] },
  { time: '15:30', title: 'Sesión privada', place: 'Estudio privado', text: 'Uno a uno con tu coach, en un estudio solo para ti y con tu programa.', img: 'fuerza-1', sky: ['#5b86b8', '#e2d2b8'] },
  { time: '18:00', title: 'Reformer Burn', place: 'Estudio Reformer', text: 'El atardecer entra por los ventanales mientras el abdomen tiembla.', img: 'reformer-flow', sky: ['#3a3f6e', '#e08a5a'] },
  { time: '19:15', title: 'Ride Night', place: 'Sala de Ride', text: 'Se apagan las luces, sube la música. La clase más pedida del club.', img: 'ride-rojo', sky: ['#1c1d3c', '#6a3f5a'] },
  { time: '20:30', title: 'Sauna', place: 'Recovery', text: 'Quince minutos de calor seco para soltar el día.', img: 'sauna', video: 'v-sauna', sky: ['#0f1226', '#1f1a33'] },
  { time: '21:15', title: 'Spa privado', place: 'Recovery', text: 'Tina fría, vapor y una toalla tibia. El día se queda afuera.', img: 'spa-privado', sky: ['#0b0d1c', '#14111f'] },
];

export const FAQ = [
  { q: '¿Necesito experiencia previa?', a: 'No. Todas las clases tienen opciones para principiantes y el coach te acompaña desde tu primera sesión. Te recomendamos llegar 10 minutos antes.' },
  { q: '¿Cómo reservo mi lugar?', a: 'Por WhatsApp o en recepción. Los socios Gold reservan con 7 días de anticipación y los Platinum con 14.' },
  { q: '¿Qué pasa si no puedo asistir?', a: 'Puedes cancelar sin costo hasta 6 horas antes. Después de eso la clase se considera tomada.' },
  { q: '¿Qué debo llevar?', a: 'Solo ropa cómoda. Para Reformer usamos calcetas antiderrapantes: si no tienes, te regalamos tu primer par.' },
  { q: '¿Tienen estacionamiento?', a: 'Sí, gratuito para socios, con servicio de valet de 6:00 a 9:00 y de 18:00 a 21:00.' },
  { q: '¿Puedo congelar mi membresía?', a: 'Sí, hasta 30 días al año por viaje o motivo médico, avisando con anticipación.' },
  { q: '¿Hay clases para embarazadas?', a: 'Contamos con Reformer prenatal los sábados. Necesitamos la autorización de tu médico.' },
  { q: '¿Facturan?', a: 'Sí, emitimos factura de todas las membresías y paquetes.' },
];

export const INTERESTS = ['Primera sesión de cortesía', 'Membresía Gold', 'Membresía Platinum', 'Membresía Diamond', 'Paquete de clases'];
