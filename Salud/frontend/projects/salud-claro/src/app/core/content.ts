// Contenido de Claro (marca ficticia). Todo lo que se muestra en el sitio sale de aquí.

export const PRACTICE = {
  name: 'Claro',
  full: 'Claro · Psicología',
  therapist: 'Valeria Ríos',
  phone: '(449) 207 64 19',
  email: 'hola@claropsicologia.mx',
  address: 'Av. Héroe de Nacozari Sur 1520, int. 3, Las Américas',
  city: 'Aguascalientes, Ags.',
};

/** Horario por día de la semana (0 = domingo). null = sin sesiones. */
export const HOURS: (readonly [number, number] | null)[] = [null, [10, 20], [10, 20], [10, 20], [10, 20], [10, 18], [9, 13]];
export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export interface Topic {
  id: string;
  label: string;
  feels: string;
  work: string;
  mode: string;
  length: string;
}

/** "¿Qué te trae por aquí?": cada tema dice cómo se siente, cómo se trabaja y cuánto suele durar. */
export const TOPICS: Topic[] = [
  {
    id: 'ansiedad',
    label: 'Ansiedad',
    feels: 'El pecho apretado, la cabeza que no se apaga en la noche, la sensación de que algo malo va a pasar aunque no sepas qué.',
    work: 'Aprendemos a reconocer lo que la dispara y practicamos herramientas para bajarle el volumen al cuerpo y a los pensamientos. Con terapia cognitivo-conductual, la mayoría nota cambios en pocas semanas.',
    mode: 'Individual, presencial o en línea',
    length: 'Entre 10 y 16 sesiones',
  },
  {
    id: 'tristeza',
    label: 'Tristeza o apatía',
    feels: 'Nada te emociona como antes, te cuesta levantarte y todo parece pesar el doble. A veces ni siquiera hay un motivo claro.',
    work: 'Primero entendemos desde cuándo y cómo se ve tu día. Vamos recuperando actividades que te daban sentido y trabajamos los pensamientos que te jalan hacia abajo. Si hace falta, te canalizo con psiquiatría.',
    mode: 'Individual',
    length: 'Entre 12 y 20 sesiones',
  },
  {
    id: 'duelo',
    label: 'Duelo',
    feels: 'Perdiste a alguien, una relación o una etapa, y el mundo siguió como si nada. Duele, y a veces también enoja.',
    work: 'No hay una forma correcta de vivir un duelo. Te acompaño a ponerle palabras, a encontrar dónde poner lo que extrañas y a seguir sin sentir que traicionas el recuerdo.',
    mode: 'Individual',
    length: 'A tu ritmo, sin prisa',
  },
  {
    id: 'pareja',
    label: 'Problemas de pareja',
    feels: 'Las mismas discusiones una y otra vez, la distancia, o la duda de si todavía vale la pena seguir.',
    work: 'Sesiones con los dos para entender el patrón que se repite y aprender a hablar sin herirse. No decido por ustedes si se quedan juntos: les ayudo a decidirlo con claridad.',
    mode: 'Pareja, presencial o en línea',
    length: 'Entre 8 y 14 sesiones',
  },
  {
    id: 'estres',
    label: 'Estrés y trabajo',
    feels: 'Vives en piloto automático, no logras desconectarte y el cansancio ya no se quita con un fin de semana.',
    work: 'Revisamos tus cargas, tus límites y lo que te exiges. Practicamos técnicas de regulación y armamos un plan realista para recuperar tiempo y descanso.',
    mode: 'Individual, ideal en línea',
    length: 'Entre 6 y 10 sesiones',
  },
  {
    id: 'autoestima',
    label: 'Autoestima',
    feels: 'Una voz interna que te critica todo, te comparas con los demás y te cuesta poner límites o pedir lo que necesitas.',
    work: 'Identificamos de dónde viene esa voz y aprendemos a responderle. Trabajamos en reconocer tus logros y en decir que no sin culpa.',
    mode: 'Individual',
    length: 'Entre 10 y 16 sesiones',
  },
  {
    id: 'adolescentes',
    label: 'Mi hijo adolescente',
    feels: 'Lo ves encerrado, irritable o triste, y cada intento de hablar termina en pleito o en silencio.',
    work: 'Sesiones con tu hijo o hija (mayores de 13), en un espacio confidencial para él o ella, y algunas sesiones con madre, padre o tutores para acompañar desde casa.',
    mode: 'Adolescentes y familia',
    length: 'Entre 10 y 16 sesiones',
  },
  {
    id: 'nose',
    label: 'No sé bien qué me pasa',
    feels: 'Algo no está bien, pero no sabes ponerle nombre. Eso también es un buen motivo para venir.',
    work: 'La primera sesión sirve justo para eso: platicamos, ordenamos lo que sientes y al final te digo con honestidad si te puedo ayudar o con quién te conviene ir.',
    mode: 'Primera sesión de valoración',
    length: '1 sesión para empezar',
  },
];

export const SERVICES = [
  { id: 'individual', title: 'Terapia individual', text: 'Para adultos. Un espacio semanal de 50 minutos para entender lo que te pasa y cambiar lo que quieras cambiar.', photo: 'individual', price: 750 },
  { id: 'pareja', title: 'Terapia de pareja', text: 'Para parejas que quieren dejar de repetir la misma discusión. Sesiones de 75 minutos con los dos.', photo: 'pareja', price: 1000 },
  { id: 'adolescentes', title: 'Adolescentes', text: 'De 13 a 18 años, con espacio confidencial para ellos y acompañamiento a madres, padres o tutores.', photo: 'jovenes', price: 750 },
  { id: 'linea', title: 'En línea', text: 'Por videollamada, desde donde estés en México. Misma calidad, misma confidencialidad, sin tráfico.', photo: 'en-linea', price: 700 },
];

export const FIRST_SESSION = [
  { t: 'Llegas', d: 'Te recibo yo, no hay sala de espera llena. Hay agua, té y unos minutos para que te acomodes.' },
  { t: 'Platicamos', d: 'Me cuentas qué te trajo, a tu ritmo. Puedes no saber por dónde empezar: para eso estoy.' },
  { t: 'Ordenamos', d: 'Al final te digo qué veo, cómo trabajaríamos y cuántas sesiones calculo. Tú decides si seguimos.' },
];

export const MYTHS = [
  { myth: 'Ir a terapia es para locos.', truth: 'Es para cualquier persona que quiera sentirse mejor. Igual que vas al médico sin estar grave.' },
  { myth: 'Solo te escuchan y ya.', truth: 'Escuchar es el inicio. Luego trabajamos con objetivos, herramientas y tareas entre sesiones.' },
  { myth: 'Es para toda la vida.', truth: 'La mayoría de los procesos duran de 3 a 6 meses. Medimos avances y cerramos cuando estás bien.' },
  { myth: 'Me van a juzgar.', truth: 'Nada de lo que digas me va a escandalizar. Mi trabajo es entender, no juzgar.' },
];

export const CREDENTIALS = [
  'Licenciatura en Psicología, Universidad Autónoma de Aguascalientes',
  'Maestría en Terapia Cognitivo-Conductual',
  'Diplomado en Terapia de Pareja',
  'Cédula profesional 0000000 (demo)',
];

export const PROMISES = [
  { t: 'Confidencialidad', d: 'Lo que dices en sesión se queda en sesión. Las únicas excepciones son las que marca la ley para proteger tu vida o la de alguien más, y te las explico desde el inicio.' },
  { t: 'Honestidad', d: 'Si creo que otro especialista te puede ayudar mejor, te lo digo y te recomiendo a alguien.' },
  { t: 'Objetivos claros', d: 'Acordamos qué quieres lograr y revisamos juntos si vamos avanzando.' },
];

export const STORIES = [
  { who: 'A., 34 años', text: 'Llegué con ataques de pánico que no me dejaban manejar. Hoy voy a la carretera sola y, cuando la ansiedad aparece, sé qué hacer con ella.' },
  { who: 'J. y M.', text: 'Pensábamos que ya no había nada que hacer. Aprendimos a discutir sin destruirnos. Seguimos juntos y con más ganas.' },
  { who: 'Mamá de L., 15 años', text: 'Mi hija encontró un lugar donde hablar sin sentirse juzgada, y yo aprendí a acompañarla sin invadirla.' },
  { who: 'R., 41 años', text: 'Después de perder a mi papá no podía ni hablar de él. Ahora lo recuerdo con cariño y no solo con dolor.' },
];

export const FAQ = [
  { q: '¿Cuánto dura cada sesión?', a: 'Las sesiones individuales y de adolescentes duran 50 minutos; las de pareja, 75. Normalmente nos vemos una vez por semana al inicio y luego cada dos.' },
  { q: '¿La terapia en línea funciona igual?', a: 'Sí. Los estudios muestran resultados muy parecidos a la presencial. Solo necesitas un lugar privado, buena conexión y audífonos.' },
  { q: '¿Y si no me siento cómodo contigo?', a: 'Es importante que lo digas. La relación con tu terapeuta influye mucho, y si no es la adecuada te ayudo a encontrar a alguien más.' },
  { q: '¿Das factura?', a: 'Sí, emito factura por cada sesión. Algunas aseguradoras reembolsan terapia psicológica: pregunta en tu póliza.' },
  { q: '¿Recetas medicamentos?', a: 'No. Los psicólogos no recetamos. Si considero que te ayudaría una valoración psiquiátrica, te recomiendo a especialistas de confianza y trabajamos en conjunto.' },
];

export const RATES = [
  { name: 'Primera sesión de valoración', note: '50 min · individual o pareja', price: 600 },
  { name: 'Terapia individual', note: '50 min · presencial', price: 750 },
  { name: 'Terapia en línea', note: '50 min · videollamada', price: 700 },
  { name: 'Terapia de pareja', note: '75 min · presencial o en línea', price: 1000 },
  { name: 'Adolescentes', note: '50 min · incluye orientación a padres', price: 750 },
];
