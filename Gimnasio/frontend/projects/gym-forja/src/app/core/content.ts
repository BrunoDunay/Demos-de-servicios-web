// Contenido de la demo. Marca y datos ficticios.

export const CONTACT = {
  address: 'Calle Fundidores 402, Zona Industrial',
  city: 'Aguascalientes, Ags. · C.P. 20290',
  phone: '(449) 268 47 15',
  hours: [
    { days: 'Lun – Vie', time: '5:30 – 22:00' },
    { days: 'Sábado', time: '7:00 – 13:00' },
    { days: 'Domingo', time: 'Cerrado (descanso)' },
  ],
};

export const NAV = [
  { label: 'Disciplinas', href: '#disciplinas' },
  { label: 'Horarios', href: '#horarios' },
  { label: 'Coaches', href: '#coaches' },
  { label: 'Planes', href: '#planes' },
  { label: 'Contacto', href: '#contacto' },
];

export const VALUES = [
  { icon: 'users', title: 'Entrenamos juntos', text: 'Una comunidad que se empuja hacia adelante, clase tras clase.' },
  { icon: 'barbell', title: 'Disciplina compartida', text: 'Caminos distintos, la misma mentalidad.' },
  { icon: 'target', title: 'Aquí perteneces', text: 'Al tercer día ya te saludan por tu nombre.' },
];

export const DISCIPLINES = [
  {
    icon: 'flame',
    name: 'Crosstraining',
    sub: 'WOD diario',
    img: 'wod',
    text: 'La clase insignia. Fuerza, gimnástica y acondicionamiento en un entrenamiento distinto cada día, escalado a tu nivel.',
    specs: [
      ['Duración', '60 min'],
      ['Nivel', 'Todos'],
      ['Cupo', '14'],
    ],
  },
  {
    icon: 'barbell',
    name: 'Halterofilia',
    sub: 'Técnica olímpica',
    img: 'peso-muerto',
    text: 'Arranque y envión desde cero. Técnica con barra, movilidad y progresiones seguras con un coach cada cuatro atletas.',
    specs: [
      ['Duración', '75 min'],
      ['Nivel', 'Intermedio'],
      ['Cupo', '8'],
    ],
  },
  {
    icon: 'rings',
    name: 'Gimnástica',
    sub: 'Control corporal',
    img: 'gimnastica',
    text: 'Dominadas, paradas de manos y muscle-ups. Fuerza relativa con progresiones por niveles, sin prisas.',
    specs: [
      ['Duración', '60 min'],
      ['Nivel', 'Todos'],
      ['Cupo', '10'],
    ],
  },
  {
    icon: 'pulse',
    name: 'Acondicionamiento',
    sub: 'Motor y cardio',
    img: 'cuerdas',
    text: 'Remo, bici de aire, cuerdas y saltos. Sube tu capacidad aeróbica con intervalos que nunca se repiten.',
    specs: [
      ['Duración', '45 min'],
      ['Nivel', 'Todos'],
      ['Cupo', '16'],
    ],
  },
  {
    icon: 'dumbbell',
    name: 'Fuerza',
    sub: 'Barra y progresión',
    img: 'sentadilla',
    text: 'Ciclos de 8 semanas de sentadilla, peso muerto y press. Medimos cada avance para que lo veas en números.',
    specs: [
      ['Duración', '60 min'],
      ['Nivel', 'Todos'],
      ['Cupo', '12'],
    ],
  },
  {
    icon: 'door',
    name: 'Open box',
    sub: 'Entrena a tu ritmo',
    img: 'box-interior',
    text: 'Acceso libre con coach de guardia para tus propios programas, recuperar clases o pulir tu técnica.',
    specs: [
      ['Duración', 'Libre'],
      ['Nivel', 'Socios'],
      ['Cupo', '20'],
    ],
  },
];

export const STATS = [
  { value: 380, label: 'Atletas activos' },
  { value: 42, label: 'Clases por semana' },
  { value: 9, label: 'Coaches certificados' },
  { value: 7, label: 'Años forjando' },
];

export interface Slot {
  time: string;
  name: string;
  coach: string;
}

export const WEEK: { day: string; short: string; slots: Slot[] }[] = [
  { day: 'Lunes', short: 'LUN', slots: [{ time: '06:00', name: 'Crosstraining', coach: 'Andrea' }, { time: '07:00', name: 'Crosstraining', coach: 'Diego' }, { time: '09:00', name: 'Fuerza', coach: 'Vale' }, { time: '18:00', name: 'Crosstraining', coach: 'Marco' }, { time: '19:00', name: 'Halterofilia', coach: 'Andrea' }, { time: '20:00', name: 'Acondicionamiento', coach: 'Marco' }] },
  { day: 'Martes', short: 'MAR', slots: [{ time: '06:00', name: 'Crosstraining', coach: 'Diego' }, { time: '07:00', name: 'Gimnástica', coach: 'Diego' }, { time: '09:00', name: 'Crosstraining', coach: 'Vale' }, { time: '18:00', name: 'Fuerza', coach: 'Vale' }, { time: '19:00', name: 'Crosstraining', coach: 'Andrea' }, { time: '20:00', name: 'Open box', coach: 'Marco' }] },
  { day: 'Miércoles', short: 'MIÉ', slots: [{ time: '06:00', name: 'Crosstraining', coach: 'Andrea' }, { time: '07:00', name: 'Acondicionamiento', coach: 'Marco' }, { time: '09:00', name: 'Fuerza', coach: 'Vale' }, { time: '18:00', name: 'Crosstraining', coach: 'Diego' }, { time: '19:00', name: 'Halterofilia', coach: 'Andrea' }, { time: '20:00', name: 'Crosstraining', coach: 'Marco' }] },
  { day: 'Jueves', short: 'JUE', slots: [{ time: '06:00', name: 'Crosstraining', coach: 'Diego' }, { time: '07:00', name: 'Gimnástica', coach: 'Diego' }, { time: '09:00', name: 'Crosstraining', coach: 'Vale' }, { time: '18:00', name: 'Fuerza', coach: 'Vale' }, { time: '19:00', name: 'Crosstraining', coach: 'Andrea' }, { time: '20:00', name: 'Acondicionamiento', coach: 'Marco' }] },
  { day: 'Viernes', short: 'VIE', slots: [{ time: '06:00', name: 'Crosstraining', coach: 'Andrea' }, { time: '07:00', name: 'Crosstraining', coach: 'Diego' }, { time: '18:00', name: 'WOD en parejas', coach: 'Marco' }, { time: '19:00', name: 'Open box', coach: 'Vale' }] },
  { day: 'Sábado', short: 'SÁB', slots: [{ time: '08:00', name: 'Team WOD', coach: 'Todos' }, { time: '10:00', name: 'Halterofilia', coach: 'Andrea' }, { time: '11:00', name: 'Open box', coach: 'Diego' }] },
];

export const WOD = {
  title: 'Fundición',
  format: 'AMRAP 14 min',
  minutes: 14,
  moves: ['10 Wall balls · 9/6 kg', '10 Saltos al cajón · 60/50 cm', '10 Swings de kettlebell · 24/16 kg', '200 m de carrera'],
};

export const COACHES = [
  { img: 'coach-andrea', name: 'Andrea', nick: 'La jefa', role: 'Head coach · Halterofilia', years: 9, certs: ['Halterofilia N2', 'Entrenamiento funcional L2'] },
  { img: 'coach-diego', name: 'Diego', nick: 'El Gimnasta', role: 'Gimnástica y movilidad', years: 6, certs: ['Gimnástica funcional', 'Movilidad articular'] },
  { img: 'coach-marco', name: 'Marco', nick: 'Motor', role: 'Acondicionamiento', years: 5, certs: ['Entrenamiento funcional L1', 'Primeros auxilios'] },
  { img: 'coach-vale', name: 'Vale', nick: 'Barra', role: 'Fuerza y técnica', years: 7, certs: ['Powerlifting', 'Nutrición deportiva'] },
];

export const PLANS = [
  { name: '12 clases', price: 950, period: '/ mes', note: 'Tres veces por semana', features: ['Clases de horario', 'Valoración inicial', 'Reserva por WhatsApp'], featured: false },
  { name: 'Ilimitado', price: 1150, period: '/ mes', note: 'Para los que ya no paran', features: ['Todas las clases', 'Open box incluido', 'Valoración cada 3 meses', 'Playera Forja de bienvenida'], featured: true },
  { name: 'Open box', price: 750, period: '/ mes', note: 'Para atletas con programa propio', features: ['Acceso libre con coach de guardia', 'Programación mensual sugerida', 'Casillero personal'], featured: false },
];

export const GALLERY = [
  { img: 'magnesia', label: 'Magnesia antes del WOD' },
  { img: 'cajon', label: 'Box jumps por parejas' },
  { img: 'cuerda', label: 'Subida de cuerda' },
  { img: 'balones', label: 'Wall balls al unísono' },
  { img: 'agarre', label: 'Agarre de gancho' },
  { img: 'dobles', label: 'Dobles sin fallar' },
  { img: 'ropes', label: 'Battle ropes' },
  { img: 'fuerte', label: 'Día de fuerza' },
  { img: 'discos', label: 'Discos listos' },
  { img: 'intensidad', label: 'Último round' },
];

export const TESTIMONIALS = [
  { quote: 'Llegué sin poder hacer una lagartija. Hoy hago dominadas y, más importante, tengo amigos que me esperan a las 6 de la mañana.', name: 'Rodrigo M.', meta: 'Atleta desde 2022' },
  { quote: 'Lo que más me gustó es que nadie te ve raro por escalar los pesos. Aquí cada quien compite contra sí mismo.', name: 'Daniela P.', meta: 'Atleta desde 2023' },
  { quote: 'Andrea me enseñó a hacer un arranque bien hecho en tres meses. La técnica aquí es en serio.', name: 'Luis F.', meta: 'Halterofilia' },
  { quote: 'Probé tres boxes antes. Forja es el único donde el coach se sabe mis lesiones y me adapta el WOD.', name: 'Mónica R.', meta: 'Atleta desde 2021' },
];

export const LEVELS = ['Nunca he entrenado', 'Entreno en gym', 'Ya hago funcional'];
