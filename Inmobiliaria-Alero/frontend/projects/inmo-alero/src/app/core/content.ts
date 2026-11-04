// Contenido de la demo. Marca, propiedades y datos ficticios.

export const CONTACT = {
  address: 'Av. Las Américas 1203, local 4',
  city: 'Fracc. Las Américas · Aguascalientes, Ags.',
  phone: '(449) 251 64 39',
  email: 'hola@aleroinmobiliaria.mx',
  hours: [
    { days: 'Lunes a viernes', time: '9:00 – 19:00' },
    { days: 'Sábado', time: '10:00 – 14:00' },
  ],
};

export const NAV = [
  { label: 'Propiedades', href: '#propiedades' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Calculadora', href: '#calculadora' },
  { label: 'Asesoras', href: '#asesoras' },
  { label: 'Contacto', href: '#contacto' },
];

export type Deal = 'venta' | 'renta';
export type Kind = 'casa' | 'departamento';
export type Zone = 'Norte' | 'Poniente' | 'Oriente' | 'Sur';

export interface Property {
  id: string;
  title: string;
  deal: Deal;
  kind: Kind;
  zone: Zone;
  area: string;
  price: number;
  beds: number;
  baths: number;
  m2: number;
  parking: number;
  imgs: string[];
  tag?: string;
  text: string;
  features: string[];
}

export const PROPERTIES: Property[] = [
  {
    id: 'AL-118',
    title: 'Casa con alberca y jardín',
    deal: 'venta',
    kind: 'casa',
    zone: 'Norte',
    area: 'Fracc. Bosques del Prado Norte',
    price: 4850000,
    beds: 4,
    baths: 3.5,
    m2: 320,
    parking: 2,
    imgs: ['casa-alberca', 'sala-2', 'cocina-isla', 'bano'],
    tag: 'Con alberca',
    text: 'Casa de dos plantas en privada con vigilancia. Sala con doble altura, cocina integral con isla y jardín con alberca climatizada.',
    features: ['Privada con vigilancia 24 h', 'Alberca climatizada', 'Recámara principal con vestidor', 'Paneles solares'],
  },
  {
    id: 'AL-124',
    title: 'Residencia con terraza techada',
    deal: 'venta',
    kind: 'casa',
    zone: 'Poniente',
    area: 'Cañada Honda',
    price: 6200000,
    beds: 4,
    baths: 4.5,
    m2: 410,
    parking: 3,
    imgs: ['casa-terraza', 'sala', 'cocina', 'recamara'],
    tag: 'Exclusiva',
    text: 'Residencia nueva con terraza techada que da a la alberca, cuarto de servicio y estudio. Acabados en madera y piedra.',
    features: ['Estrenar', 'Terraza con asador', 'Estudio y cuarto de servicio', 'Fraccionamiento con casa club'],
  },
  {
    id: 'AL-131',
    title: 'Casa minimalista en esquina',
    deal: 'venta',
    kind: 'casa',
    zone: 'Norte',
    area: 'Fracc. Pulgas Pandas Norte',
    price: 3450000,
    beds: 3,
    baths: 2.5,
    m2: 210,
    parking: 2,
    imgs: ['casa-negra', 'sala-3', 'cocina', 'bano'],
    tag: 'Precio nuevo',
    text: 'Casa en esquina con ventanales de piso a techo y jardín lateral. A cinco minutos de Plaza Universidad.',
    features: ['Ventanales de piso a techo', 'Jardín lateral', 'Cocina abierta', 'Cerca de escuelas'],
  },
  {
    id: 'AL-137',
    title: 'Casa de dos plantas lista para vivir',
    deal: 'venta',
    kind: 'casa',
    zone: 'Oriente',
    area: 'Fracc. Jardines de la Concepción',
    price: 2790000,
    beds: 3,
    baths: 2.5,
    m2: 180,
    parking: 2,
    imgs: ['casa-blanca', 'sala-3', 'recamara'],
    tag: 'Acepta Infonavit',
    text: 'Casa bien cuidada con cochera techada para dos autos, patio de servicio y recámaras amplias. Acepta crédito Infonavit y bancario.',
    features: ['Acepta Infonavit y bancario', 'Cochera techada', 'Patio de servicio', 'Escrituras al corriente'],
  },
  {
    id: 'AL-142',
    title: 'Casa familiar con jardín al frente',
    deal: 'renta',
    kind: 'casa',
    zone: 'Sur',
    area: 'Fracc. Villas del Sur',
    price: 16500,
    beds: 3,
    baths: 2,
    m2: 190,
    parking: 2,
    imgs: ['casa-familiar', 'sala', 'cocina'],
    text: 'Casa en calle cerrada, ideal para familia. Jardín al frente, cocina equipada y cuarto de lavado.',
    features: ['Calle cerrada', 'Cocina equipada', 'Se aceptan mascotas', 'Contrato mínimo de un año'],
  },
  {
    id: 'AL-149',
    title: 'Departamento con balcón',
    deal: 'renta',
    kind: 'departamento',
    zone: 'Norte',
    area: 'Torre Arboleda, Av. Universidad',
    price: 11800,
    beds: 2,
    baths: 2,
    m2: 92,
    parking: 1,
    imgs: ['depas', 'sala-2', 'recamara', 'bano'],
    tag: 'Amueblado',
    text: 'Departamento amueblado en piso 4 con balcón, gimnasio y roof garden. A dos cuadras de la universidad.',
    features: ['Amueblado', 'Gimnasio y roof garden', 'Elevador', 'Mantenimiento incluido'],
  },
  {
    id: 'AL-153',
    title: 'Casa de una planta con jardín amplio',
    deal: 'venta',
    kind: 'casa',
    zone: 'Poniente',
    area: 'Fracc. Lomas del Campestre',
    price: 5300000,
    beds: 3,
    baths: 3,
    m2: 260,
    parking: 2,
    imgs: ['casa-jardin', 'sala', 'cocina-isla'],
    text: 'Todo en una planta, sin escaleras. Terraza que abre al jardín, techos altos y mucha luz natural.',
    features: ['Todo en una planta', 'Jardín de 300 m²', 'Techos de 3.5 m', 'Bodega'],
  },
  {
    id: 'AL-160',
    title: 'Casa de diseño cerca del centro',
    deal: 'renta',
    kind: 'casa',
    zone: 'Oriente',
    area: 'Col. del Valle',
    price: 14000,
    beds: 2,
    baths: 2,
    m2: 150,
    parking: 1,
    imgs: ['fachada', 'sala-3', 'cocina'],
    tag: 'Nueva',
    text: 'Casa nueva de diseño contemporáneo, a diez minutos del centro. Ideal para pareja o home office.',
    features: ['Estrenar', 'Cuarto para oficina', 'Patio con plantas', 'Contrato mínimo de un año'],
  },
];

export const STATS = [
  { value: 12, suffix: ' años', label: 'en Aguascalientes' },
  { value: 640, suffix: '+', label: 'familias con casa nueva' },
  { value: 38, suffix: ' días', label: 'promedio para vender' },
  { value: 4.9, suffix: '', label: 'de calificación en Google', decimals: 1 },
];

export const SERVICES = [
  { icon: 'key', title: 'Comprar', text: 'Te enseñamos solo casas que cumplen lo que buscas y revisamos papeles antes de que firmes.', cta: 'Quiero comprar' },
  { icon: 'tag', title: 'Vender', text: 'Valuamos tu casa sin costo, la fotografiamos bien y filtramos a los interesados por ti.', cta: 'Quiero vender' },
  { icon: 'home', title: 'Rentar', text: 'Para inquilinos y propietarios: investigación, contrato y póliza jurídica en orden.', cta: 'Quiero rentar' },
  { icon: 'calc', title: 'Créditos', text: 'Te ayudamos con Infonavit, Fovissste o crédito bancario, de la precalificación a la firma.', cta: 'Asesoría de crédito' },
];

export const STEPS = [
  { title: 'Platicamos', text: 'Nos cuentas qué buscas, en qué zona y con qué presupuesto. Sin compromiso.' },
  { title: 'Visitas', text: 'Agendamos las visitas en un mismo día para que no pierdas tiempo.' },
  { title: 'Papeles', text: 'Revisamos escrituras, adeudos y gravámenes. Te acompañamos con tu crédito.' },
  { title: 'Llaves', text: 'Firmamos ante notario y te entregamos las llaves de tu nueva casa.' },
];

export const AGENTS = [
  { img: 'asesora-carla', name: 'Carla Méndez', role: 'Compra y venta', years: 14, quote: 'Una casa se vende rápido cuando el precio y las fotos son honestos.' },
  { img: 'asesora-ivonne', name: 'Ivonne Ruelas', role: 'Rentas y créditos', years: 9, quote: 'Mi trabajo es que entiendas cada papel antes de firmar.' },
];

export const TESTIMONIALS = [
  { name: 'Familia Castañeda', place: 'Compraron en Bosques del Prado', text: 'Vimos cinco casas en una mañana y la tercera fue la nuestra. Carla nos acompañó con el Infonavit hasta la firma.' },
  { name: 'Jorge y Daniela', place: 'Rentaron en Av. Universidad', text: 'Todo fue por WhatsApp y súper claro. En una semana ya estábamos instalados.' },
  { name: 'Sra. Leticia Ávila', place: 'Vendió en Jardines de la Concepción', text: 'Mi casa se vendió en 29 días y al precio que acordamos. Nunca me dejaron sola con los compradores.' },
];

export const BUDGETS = {
  venta: [
    { label: 'Cualquier precio', max: Infinity },
    { label: 'Hasta $3,000,000', max: 3000000 },
    { label: 'Hasta $5,000,000', max: 5000000 },
    { label: 'Hasta $7,000,000', max: 7000000 },
  ],
  renta: [
    { label: 'Cualquier precio', max: Infinity },
    { label: 'Hasta $12,000 al mes', max: 12000 },
    { label: 'Hasta $15,000 al mes', max: 15000 },
    { label: 'Hasta $20,000 al mes', max: 20000 },
  ],
};
