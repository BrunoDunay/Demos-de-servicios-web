// Contenido de la demo. Marca, fotógrafa y datos ficticios.

export const CONTACT = {
  studio: 'Calle Hornedo 512, Zona Centro',
  city: 'Aguascalientes, Ags.',
  phone: '(449) 562 18 30',
  email: 'hola@nidoestudio.mx',
  instagram: 'nido.fotografia',
  hours: 'Sesiones de martes a sábado, con cita',
};

/** Índice del álbum: cada entrada es una sección con su "página". */
export const INDEX = [
  { id: 'cap-1', num: 'I', title: 'Los primeros días', page: '04', img: 'nb-mama' },
  { id: 'cap-2', num: 'II', title: 'La espera', page: '12', img: 'mt-trigo' },
  { id: 'cap-3', num: 'III', title: 'Los de casa', page: '20', img: 'fm-campo' },
  { id: 'cap-4', num: 'IV', title: 'El primer pastel', page: '28', img: 'pa-pastel' },
  { id: 'contactos', num: '', title: 'Hoja de contactos', page: '36', img: 'nb-bn' },
  { id: 'ines', num: '', title: 'Inés, en sus palabras', page: '40', img: 'ines' },
  { id: 'dia', num: '', title: 'Un día de sesión', page: '44', img: 'nb-luz' },
  { id: 'tarifas', num: '', title: 'Tarifas', page: '48', img: 'nb-abrazo' },
  { id: 'cartas', num: '', title: 'Cartas', page: '52', img: 'mt-dos' },
  { id: 'reserva', num: '', title: 'Reserva', page: '60', img: 'mt-encaje' },
];

export interface Chapter {
  id: string;
  num: string;
  session: string;
  title: string;
  page: string;
  spec: string[];
  text: string[];
  quote?: string;
  photos: { img: string; alt: string; caption: string; w: number; h: number }[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'cap-1',
    num: 'I',
    session: 'Newborn',
    title: 'Los primeros días',
    page: '04',
    spec: ['De 5 a 15 días de nacido', '3 a 4 horas', 'En estudio, a 27 °C'],
    text: [
      'A los diez días todavía se acurrucan como en la panza. Es la única ventana para las fotos en las que caben en tus manos, y se cierra rápido.',
      'La sesión dura lo que tu bebé necesite. Si quiere comer, comemos. Si quiere brazos, se los damos. Tú te sientas, tomas café y yo me encargo del resto.',
    ],
    quote: 'Nunca forzamos una pose. Si no está cómodo, cambiamos de set.',
    photos: [
      { img: 'nb-mama', alt: 'Mamá sonriendo con su bebé recién nacido en brazos', caption: 'Valeria y Tomás, 12 días.', w: 1000, h: 1500 },
      { img: 'nb-pies', alt: 'Pies de un recién nacido en las manos de su mamá', caption: 'Lo que más piden las abuelas.', w: 1400, h: 933 },
      { img: 'nb-manos', alt: 'Manos sosteniendo a una bebé envuelta sobre fondo rosa', caption: 'Emilia, 7 días.', w: 1400, h: 933 },
    ],
  },
  {
    id: 'cap-2',
    num: 'II',
    session: 'Maternidad',
    title: 'La espera',
    page: '12',
    spec: ['Entre la semana 28 y la 34', 'Hora y media', 'Estudio o campo'],
    text: [
      'Casi todas las mamás me dicen que no se sienten bonitas en esta etapa. Luego ven las fotos.',
      'Tengo vestidos en varias tallas y colores, así que no necesitas comprar nada. Tu pareja y los hermanos mayores también caben, y los perros si se portan bien.',
    ],
    quote: 'La mejor luz para esta sesión llega media hora antes de que se meta el sol.',
    photos: [
      { img: 'mt-trigo', alt: 'Pareja esperando bebé en un campo de trigo al atardecer', caption: 'Andrea y Luis, semana 31. Campo en Jesús María.', w: 1600, h: 1066 },
      { img: 'mt-silueta', alt: 'Silueta de una mujer embarazada en blanco y negro', caption: 'En estudio, con una sola luz.', w: 1000, h: 1501 },
      { img: 'mt-encaje', alt: 'Mujer embarazada con vestido de encaje sosteniendo su panza', caption: 'Vestido del estudio, talla mediana.', w: 1400, h: 933 },
    ],
  },
  {
    id: 'cap-3',
    num: 'III',
    session: 'Familia',
    title: 'Los de casa',
    page: '20',
    spec: ['Todas las edades', 'Una hora', 'Al atardecer o en su casa'],
    text: [
      'No les voy a pedir que miren a la cámara y sonrían. Jueguen, abrácense, peléense un poco. Yo me quedo cerca y espero.',
      'Las mejores fotos de familia casi siempre salen cuando alguien se ríe de algo que no tiene nada que ver conmigo.',
    ],
    photos: [
      { img: 'fm-campo', alt: 'Familia con tres hijos sentada en el pasto al atardecer', caption: 'Los Rangel, en el campo.', w: 1000, h: 1500 },
      { img: 'fm-hermanos', alt: 'Dos hermanos abrazados en un sillón', caption: 'Diez minutos sin pelear. Récord.', w: 1000, h: 1500 },
      { img: 'fm-risa', alt: 'Bebé riendo en brazos de su mamá', caption: 'Santiago, 14 meses.', w: 1000, h: 1500 },
    ],
  },
  {
    id: 'cap-4',
    num: 'IV',
    session: 'Primer año',
    title: 'El primer pastel',
    page: '28',
    spec: ['De 10 a 12 meses', 'Hora y media', 'Decoración incluida'],
    text: [
      'Cumplir un año es un desastre precioso: betún en el pelo, globos que se escapan y un pastel que dura cuatro minutos.',
      'Yo pongo la decoración y el pastel lo hace una repostería de la colonia. La limpieza también corre por mi cuenta.',
    ],
    quote: 'Traigan ropa de cambio. Para ustedes, no para el bebé.',
    photos: [
      { img: 'pa-pastel', alt: 'Bebé comiendo su pastel de cumpleaños con las manos', caption: 'Regina, un año y mucho betún.', w: 1400, h: 933 },
      { img: 'pa-globo', alt: 'Bebé sentada junto a un globo y un pastel blanco', caption: 'Set blanco del estudio.', w: 1000, h: 1500 },
    ],
  },
];

/** Hoja de contactos: tres rollos de película con las fotos de varias sesiones. */
export interface Frame {
  img: string;
  alt: string;
  roll: string;
  w: number;
  h: number;
  pick?: boolean;
}

export const ROLLS = ['Newborn', 'Maternidad', 'Familia'];

export const FRAMES: Frame[] = [
  { img: 'nb-rostro', alt: 'Recién nacido dormido en una manta tejida', roll: 'Newborn', w: 1600, h: 1066, pick: true },
  { img: 'nb-bn', alt: 'Recién nacido en blanco y negro', roll: 'Newborn', w: 1000, h: 1428 },
  { img: 'nb-cama', alt: 'Mamá recostada junto a su bebé dormido', roll: 'Newborn', w: 1400, h: 933 },
  { img: 'nb-papa-bn', alt: 'Papá cargando a su recién nacido, en blanco y negro', roll: 'Newborn', w: 1000, h: 1568, pick: true },
  { img: 'nb-pecho', alt: 'Bebé dormido sobre el pecho de su mamá', roll: 'Newborn', w: 1400, h: 933 },
  { img: 'nb-canasta', alt: 'Bebé dormida en una canasta tejida', roll: 'Newborn', w: 1400, h: 935 },
  { img: 'nb-abrazo', alt: 'Mamá abrazando a su recién nacido', roll: 'Newborn', w: 1400, h: 933 },
  { img: 'nb-ventana', alt: 'Mamá con su bebé junto a la ventana', roll: 'Newborn', w: 1000, h: 1500 },
  { img: 'mt-campo', alt: 'Pareja embarazada en el campo', roll: 'Maternidad', w: 1000, h: 1500, pick: true },
  { img: 'mt-atardecer', alt: 'Manos sobre la panza al atardecer', roll: 'Maternidad', w: 1000, h: 1500 },
  { img: 'mt-otono', alt: 'Pareja esperando bebé con ropa de otoño', roll: 'Maternidad', w: 1000, h: 1500 },
  { img: 'mt-picnic', alt: 'Pareja embarazada en un picnic', roll: 'Maternidad', w: 1000, h: 1334 },
  { img: 'mt-manos', alt: 'Manos de mujer embarazada sobre su panza', roll: 'Maternidad', w: 1400, h: 933 },
  { img: 'mt-dos', alt: 'Dos mujeres embarazadas tocando sus panzas', roll: 'Maternidad', w: 1400, h: 933 },
  { img: 'fm-caminata', alt: 'Familia caminando de la mano al atardecer', roll: 'Familia', w: 1000, h: 1506 },
  { img: 'fm-hombros', alt: 'Papá cargando a su hija en hombros', roll: 'Familia', w: 1000, h: 1418, pick: true },
  { img: 'fm-estudio', alt: 'Retrato de familia en estudio', roll: 'Familia', w: 1000, h: 1500 },
  { img: 'fm-casa', alt: 'Papás jugando con su bebé en casa', roll: 'Familia', w: 1000, h: 1500 },
  { img: 'fm-papa', alt: 'Papá cargando a su bebé contra la pared blanca', roll: 'Familia', w: 1000, h: 1500 },
  { img: 'pa-canasta', alt: 'Bebé con impermeable amarillo dentro de una canasta', roll: 'Familia', w: 1000, h: 1500 },
];

export const INTERVIEW = [
  { q: '¿Por qué bebés?', a: 'Empecé fotografiando a mis sobrinos en 2017 y me di cuenta de que nadie en mi familia tenía fotos de esos primeros días. Todos se acordaban, nadie las tenía.' },
  { q: '¿Qué es lo más difícil?', a: 'Esperar. Un recién nacido no tiene prisa y yo aprendí a no tenerla. Hay sesiones donde la mejor foto sale en la tercera hora.' },
  { q: '¿Qué no haces?', a: 'No pongo a ningún bebé en una pose que no sea segura, no uso fondos digitales y no les cambio la cara en la edición. Si tiene granitos, se le quitan; si tiene la nariz de su papá, se queda.' },
];

export const DAY = [
  { time: '9:30', title: 'Llegan', text: 'El estudio ya está a 27 grados, con ruido blanco y un sillón para ti. Hay café y agua.' },
  { time: '9:45', title: 'Primero, comer', text: 'Si tiene hambre, come. La sesión empieza cuando se duerme, no cuando lo dice el reloj.' },
  { time: '10:15', title: 'Fotos de bebé', text: 'Envuelto, en la canasta, sobre la manta. Cambiamos de set entre siesta y siesta.' },
  { time: '12:30', title: 'Fotos con ustedes', text: 'Mamá, papá y hermanos, con la ropa que te sugerí en la guía.' },
  { time: '+5 días', title: 'Diez para presumir', text: 'Te mando diez fotos editadas para que las compartas con la familia.' },
  { time: '+15 días', title: 'La galería completa', text: 'En línea, editada a mano y lista para imprimir. El álbum llega dos semanas después.' },
];

export const RATES = [
  { name: 'Esencial', price: 3900, line: 'Una sesión, 15 fotos editadas', details: ['Sesión de 1.5 a 3 horas', 'Galería en línea', '1 set y 2 cambios de ropa'], featured: false },
  { name: 'Nido', price: 6500, line: 'Sin límite de tiempo, 35 fotos y álbum', details: ['Fotos con papás y hermanos', '4 sets y vestuario del estudio', 'Álbum de 20 × 20 cm', 'Es la que más eligen'], featured: true },
  { name: 'Historia completa', price: 11800, line: 'Maternidad, newborn y primer año', details: ['Tres sesiones a lo largo del año', '80 fotos editadas', 'Álbum de lino de 30 × 30 cm', 'Prioridad para elegir fechas'], featured: false },
];

export const EXTRAS = [
  { name: 'Sesión en tu casa, zona urbana', price: 'Sin costo' },
  { name: 'Impresión 30 × 40 en papel de algodón', price: '$650' },
  { name: 'Álbum extra para los abuelos', price: '$1,400' },
];

export const LETTERS = [
  { img: 'mt-dos', name: 'Daniela y Rodrigo', session: 'Maternidad y newborn', text: 'Llegamos nerviosos con una bebé de ocho días y salimos relajados. No sé de dónde saca Inés tanta paciencia. Cada vez que vemos las fotos lloramos un poquito.' },
  { img: 'fm-papa', name: 'Familia Rangel', session: 'Familia', text: 'Nuestro hijo no se está quieto ni dos segundos y aun así salieron fotos de él siendo él. Ya apartamos la del próximo año.' },
  { img: 'pa-canasta', name: 'Mariana T.', session: 'Primer año', text: 'Mi hijo terminó con betún hasta en las orejas. Las fotos son las que más compartimos de todo su cumpleaños.' },
  { img: 'nb-pies-3', name: 'Ana Sofía y Luis', session: 'Newborn', text: 'La guía que nos mandó antes nos quitó todas las dudas. Las primeras diez fotos llegaron un día antes de lo prometido.' },
];

export const NOTES = [
  { q: '¿Cuándo aparto la sesión newborn?', a: 'Durante el embarazo, más o menos en la semana 30. Te reservo una fecha tentativa y la movemos cuando nazca tu bebé.' },
  { q: '¿Es seguro para mi bebé?', a: 'Sí. Estoy certificada en manejo de recién nacidos y las poses complicadas se hacen juntando dos fotos, siempre con una mano cuidándolo.' },
  { q: '¿Y si no se duerme?', a: 'Pasa seguido. Lo alimentamos, lo arrullamos y seguimos. También hay fotos muy bonitas con los ojos abiertos.' },
  { q: '¿Cómo aparto mi fecha?', a: 'Con un anticipo de $1,000 por transferencia. El resto se paga el día de la sesión. Puedes cambiar la fecha sin costo avisando con una semana.' },
];

export const SESSION_TYPES = ['newborn', 'maternidad', 'familia', 'primer año'];
