// Contenido de la demo. Marca y datos ficticios.

export const CONTACT = {
  address: 'Calle Fresno 27, Barrio de la Purísima',
  city: 'Aguascalientes, Ags.',
  phone: '(449) 318 72 46',
  instagram: 'tilde.cafe',
  // day: 0 = domingo … 6 = sábado. Horas en formato 24 h.
  hours: [
    { days: 'Lun a vie', time: '7:30 a 21:00', from: [1, 2, 3, 4, 5], open: 7.5, close: 21 },
    { days: 'Sábado', time: '8:30 a 21:00', from: [6], open: 8.5, close: 21 },
    { days: 'Domingo', time: '9:00 a 15:00', from: [0], open: 9, close: 15 },
  ],
};

export const NAV_LEFT = [
  { label: 'Arma tu taza', href: '#taza' },
  { label: 'Menú', href: '#menu' },
];

export const NAV_RIGHT = [
  { label: 'Pan del día', href: '#horno' },
  { label: 'Visítanos', href: '#visita' },
];

/* ===== Arma tu taza ===== */
export type Ingredient = 'agua' | 'leche' | 'espuma' | 'chocolate' | 'hielo';

export const INGREDIENTS: { id: Ingredient; label: string }[] = [
  { id: 'agua', label: 'Agua caliente' },
  { id: 'leche', label: 'Leche' },
  { id: 'espuma', label: 'Espuma' },
  { id: 'chocolate', label: 'Cacao' },
  { id: 'hielo', label: 'Hielo' },
];

export interface Recipe {
  name: string;
  price: number;
  note: string;
}

/** Recetas por combinación (ingredientes ordenados y unidos con "+"). El espresso siempre va. */
export const RECIPES: Record<string, Recipe> = {
  '': { name: 'Espresso', price: 38, note: 'Doble, corto y directo. Así empieza todo.' },
  agua: { name: 'Americano', price: 45, note: 'El de toda la vida, en taza de 12 oz.' },
  espuma: { name: 'Macchiato', price: 45, note: 'Espresso con una nube de espuma encima.' },
  leche: { name: 'Latte', price: 62, note: 'Suave. El que más servimos antes de las 10.' },
  'espuma+leche': { name: 'Cappuccino', price: 58, note: 'Mitad leche, mitad espuma, nada de prisa.' },
  'chocolate+leche': { name: 'Mocha', price: 70, note: 'Con cacao de Tabasco, sin jarabes.' },
  'chocolate+espuma+leche': { name: 'Mocha con espuma', price: 72, note: 'Para los días que piden postre.' },
  hielo: { name: 'Espresso en las rocas', price: 42, note: 'Para el calor de la tarde.' },
  'agua+hielo': { name: 'Americano frío', price: 50, note: 'Ligero y muy frío.' },
  'hielo+leche': { name: 'Latte frío', price: 68, note: 'Con leche entera o de avena.' },
  'chocolate+hielo+leche': { name: 'Mocha frío', price: 74, note: 'Se toma con popote y sin hablar.' },
  chocolate: { name: 'Espresso con cacao', price: 48, note: 'Amargo con amargo. Muy de aquí.' },
};

export const INVENTED: Recipe = { name: 'Invento de la casa', price: 75, note: 'No está en el menú, pero si lo pides, te lo hacemos.' };

/* ===== Menú (pizarrón) ===== */
export interface MenuItem {
  name: string;
  desc?: string;
  price: number;
  tag?: string;
}

export const MENU: { id: string; label: string; items: MenuItem[] }[] = [
  {
    id: 'barra',
    label: 'Barra',
    items: [
      { name: 'Espresso', price: 38 },
      { name: 'Americano', price: 45 },
      { name: 'Cappuccino', price: 58 },
      { name: 'Latte', price: 62, tag: 'el que más sale' },
      { name: 'Flat white', price: 64 },
      { name: 'Café de olla', desc: 'piloncillo y canela', price: 48 },
    ],
  },
  {
    id: 'metodos',
    label: 'Filtrados',
    items: [
      { name: 'V60', desc: 'limpio, resalta la fruta', price: 75 },
      { name: 'Chemex para dos', desc: '500 ml', price: 120 },
      { name: 'Aeropress', price: 70 },
      { name: 'Prensa francesa', price: 65 },
    ],
  },
  {
    id: 'frios',
    label: 'Fríos',
    items: [
      { name: 'Cold brew', desc: '18 horas en frío', price: 65 },
      { name: 'Espresso tónico', desc: 'con naranja', price: 72, tag: 'nuevo' },
      { name: 'Matcha frío', desc: 'con avena', price: 78 },
      { name: 'Horchata latte', price: 74 },
    ],
  },
  {
    id: 'comer',
    label: 'Para comer',
    items: [
      { name: 'Pan de masa madre con aguacate', desc: 'huevo pochado y aceite de chile', price: 135 },
      { name: 'Chilaquiles verdes', desc: 'con huevo o pollo', price: 129 },
      { name: 'Molletes de la casa', price: 98 },
      { name: 'Avena horneada', desc: 'frutos rojos y yogurt', price: 92 },
      { name: 'Sándwich de pavo', desc: 'queso de cabra y arúgula', price: 118 },
    ],
  },
];

/* ===== Pan del día ===== */
export const OVEN = [
  { at: 7.5, label: '7:30', name: 'Conchas', detail: 'Vainilla y cacao. Las de cacao se acaban primero.', img: 'conchas', price: 32 },
  { at: 9, label: '9:00', name: 'Brioche', detail: 'Con mantequilla de Chihuahua. Se deshace.', img: 'brioche', price: 45 },
  { at: 11, label: '11:00', name: 'Rol de canela', detail: 'Con glaseado de queso crema, todavía tibio.', img: 'rol', price: 52 },
  { at: 13, label: '13:00', name: 'Pan de masa madre', detail: 'El de los desayunos. También se vende entero.', img: 'masa-madre', price: 95 },
  { at: 17, label: '17:00', name: 'Galletas de avena', detail: 'Chispas de chocolate amargo, para la tarde.', img: 'galletas', price: 35 },
];

/* ===== El lugar ===== */
export const STRIPS = [
  ['interior', 'latte', 'mesas'],
  ['barra', 'tostador', 'amigos'],
];

/* ===== Reseñas en vasos ===== */
export const REVIEWS = [
  { name: 'Andrea', order: 'Latte de avena', text: 'Ya es parte de mi mañana. Y las conchas de cacao vuelan antes de las 10.' },
  { name: 'Rodrigo', order: 'Americano', text: 'Vengo a trabajar dos veces por semana. Hay enchufes y nadie te apura.' },
  { name: 'Lucía', order: 'V60', text: 'Me explicaron la diferencia entre V60 y Chemex sin hacerme sentir tonta.' },
  { name: 'Héctor', order: 'Cold brew', text: 'Pido por WhatsApp y cuando llego ya está. Así sí.' },
  { name: 'Mariel', order: 'Cappuccino', text: 'A mi perrita le dieron agua antes que a mí. Volvimos el domingo.' },
  { name: 'Iván', order: 'Café de olla', text: 'Sabe como el de mi abuela, pero sin que me regañen.' },
];
