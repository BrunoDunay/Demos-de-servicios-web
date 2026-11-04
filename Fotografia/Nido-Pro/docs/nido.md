# Nido · Fotografía newborn y familia (paquete Profesional)

**URL:** https://demo-foto-nido.vercel.app · **Código:** `frontend/projects/foto-nido`

## Concepto

Estudio de Inés Calvo (fotógrafa ficticia): recién nacidos, maternidad, familia y primer año. Lema: "Lo pequeño dura poco".
El sitio es un **álbum de fotos**: cabezales de página con número de página, capítulos con números romanos, colofón al final.

Rediseño del 26 oct 2026 con skills (ui-ux-pro-max: estudio de fotografía → narrativa e imagen a sangre con un solo acento; tipografía editorial; frontend-design y emil-design-eng para composición y movimiento; humanizer para los textos).

## Identidad

- **Logo:** "Nido" en itálica con una puntada de hilo rojo debajo (el lomo cosido de un álbum). Al pasar el cursor la puntada avanza.
- **Paleta (OKLCH):** papel `oklch(96.5% 0.012 75)`, tinta `oklch(23% 0.018 50)` y un solo acento, el hilo rojo `oklch(53% 0.15 30)`. La hoja de contactos usa negro de película y números naranja.
- **Tipografías:** Cormorant Garamond (títulos, itálicas, cifras) y Public Sans (texto y etiquetas en versalitas).
- **Cursor:** cruz fina de enfoque (modo diferencia); sobre enlaces se encoge y gira; sobre las fotos de la hoja de contactos se pone roja y dice "Lupa".

## Intro: revelado (~3 s)

Cuarto oscuro con luz roja. La copia de la portada aparece como negativo borroso y se revela a positivo nítido mientras corre el reloj del revelador ("Revelando 00:45" → "Fijado"). Luego se prende la luz y queda exactamente la misma copia que muestra la portada (mismo recorte con `clip-path`, sin salto).

## Secciones

1. **Portada fija:** una copia chica entre "Lo pequeño" y "dura poco.". Al bajar, la sección se queda fija y la copia crece hasta llenar la pantalla (clip-path animado con ScrollTrigger), las palabras se apartan y aparece el texto sobre la foto.
2. **Cabezal:** el encabezado muestra el capítulo que estás viendo, como el cabezal de página de un libro. Botón **Índice** abre la tabla de contenido a pantalla completa con números de página y vista previa de foto.
3. **Capítulos I–IV** (Newborn, Maternidad, Familia, Primer año): cada uno con su propia composición de revista (foto alta + cita, foto a sangre, escalera de tres fotos, foto que invade el margen), capitular, datos de la sesión y botón para reservar ese tipo de sesión.
4. **Hoja de contactos** (portafolio): tiras de película con perforaciones y número de cuadro, filtro por rollo; las elegidas por Inés llevan un círculo de lápiz rojo y al pasar el cursor se dibuja en las demás. Al tocar, visor con **lupa** que amplía 2.4× la zona bajo el cursor.
5. **Inés, en sus palabras:** entrevista con retrato en blanco y negro.
6. **Un día de sesión:** horario de 9:30 a la entrega, con un hilo rojo que se "cose" al bajar.
7. **Tarifas** como lista de precios impresa; cada fila se abre para ver qué incluye.
8. **Cartas:** testimonios uno a la vez con su foto como estampa.
9. **Reserva:** una frase para completar ("Me llamo ___ y quiero una sesión de ___…") con notas al margen (preguntas frecuentes). Al enviar aparece como tarjeta escrita a mano con el botón para abrir WhatsApp.
10. **Colofón** y páginas legales `/aviso-de-privacidad` y `/terminos`.

## Fotos

37 fotos de Pexels con tono cálido tipo película (`scripts/media-demos.mjs`, lista `nido`).
