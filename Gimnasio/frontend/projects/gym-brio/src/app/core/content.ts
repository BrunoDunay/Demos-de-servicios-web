// Contenido de la demo. Marca y datos ficticios.

export const CONTACT = {
  address: 'Calle Arboledas 118, Fracc. Los Pinos',
  city: 'Aguascalientes, Ags. · C.P. 20270',
  phone: '(449) 975 31 08',
  hours: [
    { days: 'Lunes a viernes', time: '5:00 – 23:00' },
    { days: 'Sábado', time: '7:00 – 15:00' },
    { days: 'Domingo', time: '8:00 – 13:00' },
  ],
};

export const NAV = [
  { label: 'Áreas', href: '#areas' },
  { label: 'Clases', href: '#clases' },
  { label: 'Planes', href: '#planes' },
  { label: 'Opiniones', href: '#opiniones' },
  { label: 'Contacto', href: '#contacto' },
];

export const BENEFITS = [
  { icon: 'shield', title: 'Sin inscripción', text: 'Pagas tu mes y listo. Sin contratos forzosos ni letras chiquitas.' },
  { icon: 'users', title: 'Coach en piso', text: 'Siempre hay alguien para corregir tu técnica o armarte una rutina.' },
  { icon: 'clock', title: 'Abierto 18 horas', text: 'De 5:00 a 23:00 entre semana, para que entrenes cuando puedas.' },
  { icon: 'smile', title: 'Cero juicios', text: 'Aquí entrenan vecinos de 16 a 70 años. Todos empezamos en cero.' },
];

export const AREAS = [
  { img: 'pesas', title: 'Zona de pesas', text: 'Mancuernas de 2 a 50 kg, racks, bancos y discos de sobra.', tags: ['Peso libre', 'Racks'] },
  { img: 'caminadora', title: 'Cardio', text: 'Caminadoras, elípticas y bicis frente al ventanal.', tags: ['14 equipos', 'Pantallas'] },
  { img: 'funcional', title: 'Funcional', text: 'TRX, kettlebells, cajones, cuerdas y remo.', tags: ['Circuitos', 'Pista'] },
  { img: 'clase-grupal', title: 'Salón de clases', text: 'Spinning, yoga, funcional y baile con aire acondicionado.', tags: ['25 clases', 'Sonido pro'] },
];

export const STATS = [
  { value: 600, suffix: '+', label: 'vecinos entrenando' },
  { value: 18, suffix: ' h', label: 'abierto entre semana' },
  { value: 25, suffix: '', label: 'clases a la semana' },
  { value: 4.9, suffix: '', label: 'en Google', decimals: 1 },
];

export interface ClassItem {
  time: string;
  name: string;
  coach: string;
  level: 1 | 2 | 3;
  mins: number;
}

export const SCHEDULE: { day: string; short: string; classes: ClassItem[] }[] = [
  {
    day: 'Lunes',
    short: 'Lun',
    classes: [
      { time: '06:00', name: 'Funcional', coach: 'Luis', level: 2, mins: 50 },
      { time: '07:30', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '09:00', name: 'Yoga suave', coach: 'Sofía', level: 1, mins: 60 },
      { time: '18:00', name: 'Funcional', coach: 'Luis', level: 2, mins: 50 },
      { time: '19:00', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '20:00', name: 'Baile fit', coach: 'Sofía', level: 1, mins: 50 },
    ],
  },
  {
    day: 'Martes',
    short: 'Mar',
    classes: [
      { time: '06:00', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '07:30', name: 'Glúteo y pierna', coach: 'Luis', level: 2, mins: 50 },
      { time: '09:30', name: 'Funcional 50+', coach: 'Luis', level: 1, mins: 45 },
      { time: '18:30', name: 'Core', coach: 'Sofía', level: 2, mins: 30 },
      { time: '19:00', name: 'Yoga', coach: 'Sofía', level: 1, mins: 60 },
      { time: '20:00', name: 'Box fit', coach: 'Luis', level: 3, mins: 45 },
    ],
  },
  {
    day: 'Miércoles',
    short: 'Mié',
    classes: [
      { time: '06:00', name: 'Funcional', coach: 'Luis', level: 2, mins: 50 },
      { time: '07:30', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '09:00', name: 'Movilidad', coach: 'Sofía', level: 1, mins: 45 },
      { time: '18:00', name: 'Tren superior', coach: 'Luis', level: 2, mins: 50 },
      { time: '19:00', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '20:00', name: 'Baile fit', coach: 'Sofía', level: 1, mins: 50 },
    ],
  },
  {
    day: 'Jueves',
    short: 'Jue',
    classes: [
      { time: '06:00', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '07:30', name: 'Glúteo y pierna', coach: 'Luis', level: 2, mins: 50 },
      { time: '09:30', name: 'Funcional 50+', coach: 'Luis', level: 1, mins: 45 },
      { time: '18:30', name: 'Core', coach: 'Sofía', level: 2, mins: 30 },
      { time: '19:00', name: 'Yoga', coach: 'Sofía', level: 1, mins: 60 },
      { time: '20:00', name: 'Box fit', coach: 'Luis', level: 3, mins: 45 },
    ],
  },
  {
    day: 'Viernes',
    short: 'Vie',
    classes: [
      { time: '06:00', name: 'Funcional', coach: 'Luis', level: 2, mins: 50 },
      { time: '07:30', name: 'Spinning', coach: 'Ana', level: 3, mins: 45 },
      { time: '18:00', name: 'Circuito total', coach: 'Luis', level: 3, mins: 50 },
      { time: '19:00', name: 'Spinning rítmico', coach: 'Ana', level: 2, mins: 45 },
    ],
  },
  {
    day: 'Sábado',
    short: 'Sáb',
    classes: [
      { time: '08:00', name: 'Funcional en pareja', coach: 'Luis', level: 2, mins: 60 },
      { time: '09:30', name: 'Spinning largo', coach: 'Ana', level: 3, mins: 60 },
      { time: '11:00', name: 'Yoga', coach: 'Sofía', level: 1, mins: 60 },
    ],
  },
];

export const PLANS = [
  {
    name: 'Visita',
    price: 80,
    period: 'por día',
    note: 'Para probar o si vienes de paso.',
    features: ['Acceso a todas las áreas', 'Clases grupales del día', 'Regaderas y lockers'],
    featured: false,
  },
  {
    name: 'Mensual',
    price: 549,
    period: 'al mes',
    note: 'El que eligen 8 de cada 10 socios.',
    features: [
      'Acceso ilimitado 18 horas',
      'Todas las clases grupales',
      'Rutina personalizada al inscribirte',
      'Medición corporal cada mes',
      'Sin inscripción ni anualidad',
    ],
    featured: true,
  },
  {
    name: 'Trimestral',
    price: 1399,
    period: 'cada 3 meses',
    note: 'Te ahorras $248 contra el mensual.',
    features: ['Todo lo del plan mensual', '1 sesión con coach personal al mes', 'Toalla Brío de regalo'],
    featured: false,
  },
];

export const TEAM = [
  { img: 'coach-ana', name: 'Ana Ruiz', role: 'Spinning y cardio', quote: 'Si sudas y sonríes, la clase salió bien.' },
  { img: 'coach-luis', name: 'Luis Herrera', role: 'Fuerza y funcional', quote: 'La técnica primero, el peso después.' },
  { img: 'coach-sofia', name: 'Sofía Medina', role: 'Yoga y movilidad', quote: 'Moverte sin dolor también es progreso.' },
];

export const REVIEWS = [
  { name: 'Mariana G.', text: 'Llevo 8 meses y es el primer gym donde no me siento observada. Los coaches te saludan por tu nombre.' },
  { name: 'Jorge R.', text: 'Me queda a dos cuadras y abren a las 5. Ya no tengo pretexto, jaja.' },
  { name: 'Ramiro T.', text: 'Entré con 62 años y miedo a lastimarme. Luis me armó una rutina y hoy subo escaleras sin problema.' },
  { name: 'Fer L.', text: 'Las clases de spinning de Ana son otra cosa. Salgo nueva.' },
  { name: 'Daniel M.', text: 'Limpio, con buen equipo y sin el ambiente pesado de otros gyms.' },
  { name: 'Karla S.', text: 'Pagué un mes para probar y ya voy en el tercero. El precio está muy bien para lo que dan.' },
  { name: 'Paty V.', text: 'Vengo con mi hija los sábados al funcional en pareja. Ya es nuestro plan de fin de semana.' },
  { name: 'Óscar B.', text: 'Me midieron y me dieron rutina desde el primer día. Así sí dan ganas de regresar.' },
];
