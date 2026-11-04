# Claro · Psicología (paquete Profesional)

**URL:** https://demo-salud-claro.vercel.app · **Código:** `frontend/projects/salud-claro`

## Concepto (rediseño del 4 nov 2026, con las referencias de Bruno en `referencias/claro`)

"La maraña que se desenreda." Collage editorial: papel crema, fotos en blanco y negro entonadas en azul con
orilla rasgada y cinta, letras condensadas enormes en mayúsculas, notas a mano y dibujos de línea. Consultorio
ficticio de la psicóloga Valeria Ríos (terapia cognitivo-conductual), en Aguascalientes y en línea.

## Identidad

- **Logo:** espiral a mano con punto durazno + "CLARO" condensado y "psicología" a mano.
- **Paleta (OKLCH):** papel `oklch(95.6% 0.016 82)`, tinta azul marino `oklch(27% 0.055 255)`, salvia `oklch(62% 0.045 145)`,
  azul empolvado `oklch(64% 0.065 245)`, durazno `oklch(78% 0.095 52)`.
- **Tipografías:** Bricolage Grotesque condensada al 75 % (títulos), Caveat (notas a mano), Figtree (texto).
- **Dibujos generados con código** (`core/doodles.ts`, semilla fija): maraña, espiral, cabeza de perfil, sillones, hojas y orillas rasgadas.

## Movimiento

- Intro: la maraña se dibuja y se desenreda en espiral (MorphSVG), "respira." a mano y la hoja sube con orilla rasgada.
- Portada: sobre la cabeza de la foto se dibuja la maraña; al bajar se vuelve espiral (scroll). Piezas del collage con paralaje al cursor.
- Encabezado: raya a mano debajo del enlace al pasar el cursor. Menú móvil que baja como hoja rasgada.
- Transición entre páginas: la página nueva sube con orilla rasgada (View Transitions).
- transitions.dev: tabs con píldora deslizante (agenda), acordeón (preguntas), checkbox que se palomea (formación),
  toggle con doble rebote y números que entran (tarifas), success check (agenda), texts reveal (temas), learn-more (botones), tilt con brillo (tarjeta).

## Secciones

1. Portada en collage ("HABLAR AYUDA." + "empezar también" con flecha dibujada, nota de $600).
2. ¿Qué te trae?: etiquetas de papel; la hoja de cuaderno cambia con su garabato.
3. Respira: cuadro de la cabeza con espiral que se dibuja al inhalar y se recoge al exhalar.
4. Terapia: tarjetas de collage, "La primera sesión" con sillones dibujados al bajar, mitos en notas que se tachan.
5. Sobre mí (arco salvia, firma a mano), tarifas en recibo e historias en tiras rasgadas.
6. Agenda en hoja de cuaderno con la carta a Valeria como vista previa.
7. Consultorio: mapa a mano, horario en ficha, preguntas y aviso de crisis (Línea de la Vida, real).
8. Pie con la tarjeta de presentación verde con línea dorada.
