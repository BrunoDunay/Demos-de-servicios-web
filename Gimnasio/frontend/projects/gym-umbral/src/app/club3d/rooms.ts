/**
 * Recorrido del club: zonas con varias escenas (fotos del espacio en alta resolución).
 * Cada escena tiene un título corto, una nota y tres detalles que se muestran junto a la foto.
 * `focus` es el punto de la foto que se mantiene a la vista al recortarla (x, y en %).
 */
export interface View {
  id: string;
  title: string;
  note: string;
  tags: string[];
  focus?: [number, number];
}

export interface Zone {
  id: string;
  name: string;
  kicker: string;
  text: string;
  views: View[];
}

export const ZONES: Zone[] = [
  {
    id: 'entrada',
    name: 'La entrada',
    kicker: 'Bienvenida',
    text: 'Te recibe la recepción iluminada, la barra de café y tu toalla lista. Aquí empieza la desconexión.',
    views: [
      { id: 'v-entrada1', title: 'Recepción', note: 'Tu nombre, tu toalla y tu locker listos al llegar.', tags: ['Café de especialidad', 'Amenidades de autor', 'Olivo de bienvenida'], focus: [48, 55] },
      { id: 'v-entrada2', title: 'Check-in', note: 'Entras con tu código en segundos y la sala te espera al fondo.', tags: ['Acceso con código', 'Lockers digitales', 'Aroma de cedro'], focus: [40, 50] },
    ],
  },
  {
    id: 'pesas',
    name: 'Sala de pesas',
    kicker: 'Gimnasio',
    text: 'El gimnasio completo: cardio, peso libre y máquinas, con coach de piso de 5:30 a 22:00.',
    views: [
      { id: 'v-pesas1', title: 'Cardio con vista', note: 'Caminadoras con pantalla frente al jardín interior.', tags: ['Caminadoras', 'Pista de sprints', 'Jardín interior'], focus: [62, 55] },
      { id: 'v-pesas2', title: 'Peso libre', note: 'Mancuernas en pares de 2 a 40 kg, bancos y kettlebells.', tags: ['Mancuernas 2–40 kg', 'Bancos ajustables', 'Kettlebells'] },
      { id: 'v-pesas3', title: 'El pasillo', note: 'Racks de mancuernas y sentadilla bajo luz cálida.', tags: ['Rack de sentadilla', 'Barras olímpicas', 'Bancos'], focus: [50, 45] },
      { id: 'v-pesas4', title: 'Plataformas', note: 'Barra olímpica, discos de goma y anillas para gimnasia.', tags: ['Plataforma', 'Cajón pliométrico', 'Anillas'], focus: [50, 45] },
    ],
  },
  {
    id: 'fuerza',
    name: 'Estudio de fuerza',
    kicker: 'Fuerza',
    text: 'Peso libre con técnica de estudio: racks con espejo de luz, sled, cuerdas y un coach que corrige cada repetición.',
    views: [
      { id: 'v-fuerza1', title: 'Racks con espejo de luz', note: 'Seis estaciones gemelas para grupos de ocho.', tags: ['Racks', 'Bancos de press', 'Mancuernas'] },
      { id: 'v-fuerza2', title: 'Zona funcional', note: 'Sled sobre pasto sintético, cajones y cuerdas de batalla.', tags: ['Sled', 'Cuerdas', 'Cajones'], focus: [50, 55] },
      { id: 'v-fuerza3', title: 'Accesorios', note: 'Todo a la mano para trabajar técnica y estabilidad.', tags: ['Mancuernas 6–22 kg', 'Fitball', 'Tapetes'], focus: [50, 55] },
      { id: 'v-fuerza4', title: 'Estudio privado', note: 'Sesiones uno a uno con tu coach, frente a la ciudad.', tags: ['Discos calibrados', 'Banco de cuero', 'Vista a la ciudad'], focus: [50, 50] },
    ],
  },
  {
    id: 'vestidores',
    name: 'Vestidores',
    kicker: 'Vestidores',
    text: 'Piedra, madera ahumada, tocadores con luz y regaderas de lluvia. Todo listo para que llegues y te vayas sin prisa.',
    views: [
      { id: 'v-vest1', title: 'Lockers y banca', note: 'Sin llaves: entras con tu número y te arreglas con calma.', tags: ['Lockers con código', 'Banca con luz', 'Secadora profesional'] },
      { id: 'v-vest2', title: 'Tocadores', note: 'Piedra, espejos con luz cálida y amenidades de autor.', tags: ['Tocador de piedra', 'Espejos con luz', 'Amenidades'] },
    ],
  },
  {
    id: 'recovery',
    name: 'Recovery',
    kicker: 'Recovery',
    text: 'Sauna, tina fría y vapor en una suite privada. Treinta minutos para bajar las revoluciones antes de volver al día.',
    views: [
      { id: 'v-regaderas', title: 'Lounge de recovery', note: 'Sillones y luz baja para descansar entre sesiones.', tags: ['Turnos de 30 min', 'Té de hierbas', 'Luz baja'], focus: [50, 55] },
      { id: 'v-spa', title: 'Suite privada', note: 'Sauna a 60 °C, tina a 12 °C y vapor con eucalipto.', tags: ['Sauna', 'Tina fría', 'Vapor'] },
    ],
  },
];
