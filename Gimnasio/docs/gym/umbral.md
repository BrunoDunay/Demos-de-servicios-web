# Umbral · Boutique fitness club (paquete Premium)

**URL:** https://demo-gym-umbral.vercel.app · **Código:** `frontend/projects/gym-umbral`

## Concepto

Club boutique con tres estudios (Reformer, Ride y Fuerza), sauna infrarrojo, vestidores de autor y lounge. Grupos de 12. Lema: "Cruza el umbral".
Personalidad: refinada, calmada, sensorial. Luz cálida en la oscuridad, como las tiras LED de las referencias.

## Identidad

- **Logo:** un arco de puerta dorado con una línea de luz al centro (el umbral) y una base. El arco se repite en toda la web: fotos, videos, telón, cierre.
- **Paleta:** negro cálido `#0D0C0A`, hueso `#EFE8DC`, champaña `#D8B98A`, luz `#F3D5A1`. Fotos y videos con filtro cálido.
- **Tipografías:** Instrument Serif (títulos, con cursiva para el énfasis) y Manrope (texto y etiquetas espaciadas).
- **Movimiento:** premium (0.8–1.6 s, sin rebotes), scroll suave con Lenis.
- **Botones:** marco fino dorado o relleno champaña, letra pequeña espaciada, esquinas casi rectas y un destello que cruza al pasar el cursor (sin efecto magnético).
- **Cursor:** punto de 6 px con un halo muy tenue; sobre enlaces aparece un aro fino y una etiqueta pequeña que entra deslizándose.

## Intro (estilo Audi, no depende de la portada)

Negro total → una tira LED se enciende y crece de lado a lado → la luz dibuja el arco desde la base y parpadea como neón → UMBRAL aparece desenfocado y se enfoca → destello y polvo de luz → el velo se abre en horizontal desde la tira y el logo vuela a su lugar en el menú.

## Transición entre páginas

Telón negro con el arco de la marca: el arco se dibuja y el hueco del arco crece hasta revelar la página nueva.

## Páginas

- **Inicio**
  - Portada limpia: título, una línea y un botón, sobre video con luz que sigue al cursor.
  - Manifiesto que se enciende palabra por palabra y queda nítido.
  - Escena fija con las siete disciplinas: Reformer, Ride, Fuerza, Sala de pesas, Movilidad, Uno a uno y Recovery.
  - "Un día en Umbral": 11 momentos de 6:00 a 21:15 con línea del tiempo. Detrás, la fachada del club (foto de referencia con el letrero cambiado a UMBRAL) en capas: el cielo se anima con la hora y de noche se encienden letrero, lámparas y ventanas; de día quedan apagadas. Cada foto es una puerta en arco con profundidad.
  - Acordeón del club (incluye sala de pesas), cifras sobre video, coaches con reflector, membresías, reseñas y cierre "Cruza el umbral": la puerta empieza velada por humo animado y desenfoque, y al abrirse el video se aclara.
- **Disciplinas:** portada con tres puertas en arco con video; la que está bajo el cursor se ensancha y muestra sus datos, y al hacer clic baja a su sección. Cada disciplina tiene un arco con video y un contorno dorado que se dibuja con el scroll. Horario semanal filtrable que prellena el formulario.
- **El club:** recorrido en escenas por 14 fotos del espacio en 5 zonas (entrada, sala de pesas, estudio de fuerza, vestidores y recovery). La sección se fija y el scroll avanza escena por escena: la foto ocupa la mitad derecha y se funde con el fondo; al entrar a una zona se abre en arco, dentro de la zona entra con una barrida de luz cálida, y mientras se queda se acerca despacio y sigue un poco al cursor. A la izquierda, la zona y la escena (número, título, nota y tres detalles). Letreros de otras marcas (EVARA, MACÉ, NODO, BLACK BULL, REST 24, BLK BOX) cambiados por UMBRAL con `scripts/club3d/letrero.mjs`.
- **Membresías:** tarjeta de socio en 3D (gira al hacer clic y cambia de acabado por plan). Planes **Gold, Platinum y Diamond**, los mismos acabados de la tarjeta. Platinum y Diamond muestran "Todo lo de ..." con ícono de capas y "y además"; al pasar el cursor se ilumina el plan incluido. Comparativa, paquetes y preguntas frecuentes.
- **Atelier Umbral (inicio):** composición de póster con una socia caminando con la playera del club, tres valores con íconos y las prendas (chamarra, playera técnica, gorra, línea Active) con el logo del arco en lugar de los logos originales, más el video del piso de la sala.
- **Contacto:** puerta en arco entreabierta que deja ver la recepción con el letrero de UMBRAL encendido; luz que se derrama al piso y polvo en el haz que se aparta con el cursor.
- **Legales:** aviso de privacidad y términos.
- En el inicio el pie no repite la invitación (ya está en el cierre en arco).

## SEO completo

Título, descripción, Open Graph y canonical por página (prerenderizados), JSON-LD `HealthClub`, `sitemap.xml` y `robots.txt`.

## Fotos y video

- Fotos de Pexels y de `referencias/gym/`, más retratos de socios y fotos de vestidores.
- Videos (cortados de Pexels con ffmpeg y color cálido): verticales `v-reformer`, `v-pilates`, `v-fuerza`, `v-fuerza-2`, `v-pila`, `v-piedras`, `v-sauna`; horizontales `hero`, `fuerza`, `pesas`, `h-reformer`, `h-vapor`.
- Se descartaron videos de Ride porque mostraban logos de marcas reales.
- La escena 3D se carga aparte (unos 118 KB comprimidos) solo en /club.
