# Claro · Psicología (paquete Profesional)

**URL:** https://demo-salud-claro.vercel.app · **Código:** `frontend/projects/salud-claro`

## Concepto (rediseño del 4 nov 2026, con las referencias de Bruno en `referencias/claro`)

"La maraña que se desenreda." Collage editorial: papel crema, fotos en blanco y negro entonadas en azul con
orilla rasgada y cinta, letras condensadas enormes en mayúsculas, notas a mano y dibujos de línea. Consultorio
ficticio de la psicóloga Lucía Arenas (terapia cognitivo-conductual), en Aguascalientes y en línea.

## Identidad

- **Logo:** espiral a mano con punto durazno + "CLARO" condensado y "psicología" a mano.
- **Paleta (OKLCH):** papel `oklch(95.6% 0.016 82)`, tinta azul marino `oklch(27% 0.055 255)`, salvia `oklch(62% 0.045 145)`,
  azul empolvado `oklch(64% 0.065 245)`, durazno `oklch(78% 0.095 52)`.
- **Tipografías:** Bricolage Grotesque condensada al 75 % (títulos), Caveat (notas a mano), Figtree (texto).
- **Dibujos generados con código** (`core/doodles.ts`, semilla fija): maraña, espiral, cabeza de perfil, sillones, hojas y orillas rasgadas.

## Movimiento

- Intro: la maraña se dibuja y se desenreda en espiral (MorphSVG), "respira." a mano y la hoja sube con orilla rasgada.
- Portada: sobre la cabeza de la foto se dibuja la maraña; al bajar se vuelve espiral (scroll). Piezas del collage con paralaje al cursor.
- Encabezado: al pasar el cursor, un óvalo a mano encierra el enlace, cada uno de otro color (la raya de abajo ya la usa Logik). Menú móvil que baja como hoja rasgada.
- Botones: se "colorean a lápiz" con rayas diagonales de izquierda a derecha y se ladean. **Sin botones magnéticos.**
- Lápiz que sigue al cursor (`shared/pencil.ts`, solo con mouse): estela corta de grafito; clic = garabato chico, mantener presionado = rayar.
  Cada rayón sale de un color de la paleta y se borra en ~1 s.
- Microinteracciones: flecha y firma que se redibujan, cintas que se despegan, nota de $600 que levanta la esquina, etiquetas que se
  columpian desde su agujero, números de pasos que giran, pin que brinca y ruta que camina en el mapa, horas con marcatexto.
- Transición entre páginas: la página nueva sube con orilla rasgada (View Transitions).
- transitions.dev: tabs con píldora deslizante (agenda), acordeón (preguntas), checkbox que se palomea (formación),
  toggle con doble rebote y números que entran (tarifas), success check (agenda), texts reveal (temas), learn-more (botones), tilt con brillo (tarjeta).

## Secciones

1. Portada en collage ("HABLAR AYUDA." + "empezar también" con flecha dibujada, nota de $600).
2. ¿Qué te trae?: etiquetas de papel; la hoja de cuaderno cambia con su garabato.
3. Respira: cuadro de la cabeza con espiral que se dibuja al inhalar y se recoge al exhalar.
4. Terapia: tarjetas de collage, "La primera sesión" con sillones dibujados al bajar, mitos en notas que se tachan.
5. Sobre mí (arco salvia, firma a mano), tarifas en recibo e historias en tiras rasgadas.
6. Agenda en hoja de cuaderno: calendario del mes (hasta 3 meses) con círculo a mano en el día, raya bajo la hora, palomitas dibujadas; la carta a Lucía como vista previa.
7. Consultorio: mapa a mano, horario en ficha, preguntas y aviso de crisis (Línea de la Vida, real).
8. Pie con la tarjeta de presentación. Dos propuestas mientras Bruno elige: B (por defecto) tarjeta de cita de papel que se voltea y escribe sola la fecha; A (`?tarjeta=a`) verde con línea dorada.
