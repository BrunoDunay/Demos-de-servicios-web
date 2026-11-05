# Marfil · Odontología (paquete Profesional)

**URL:** https://demo-salud-marfil.vercel.app · **Código:** `frontend/projects/salud-marfil`

## Concepto (rediseño del 4 nov 2026, con las referencias de Bruno en `referencias/marfil`)

Clínica dental moderna como la publicidad dental de referencia: azul rey, azul noche y azul hielo; objetos 3D
brillantes, vidrio esmerilado, títulos en fino con la palabra clave en negritas y palabras gigantes recortadas al
fondo. Clínica ficticia de la Dra. Renata Ibarra en Aguascalientes.

## Identidad

- **Logo:** diente de un trazo en un cuadro azul con destello; "marfil" en Outfit.
- **Paleta (OKLCH):** hielo `oklch(96.6% 0.016 245)`, azul rey `oklch(50% 0.2 263)`, azul noche `oklch(25% 0.08 264)`, cielo `oklch(80% 0.09 238)`.
- **Tipografías:** Outfit (títulos, fino + negritas) y Plus Jakarta Sans (texto).

## Diente 3D

`shared/tooth-model.ts` arma una muela con Three.js sin archivos (corona girada con cuatro cúspides y dos raíces
curvas), con esmalte brillante y luz azul de contorno. `shared/tooth-stage.ts` la dibuja en un lienzo fijo, solo en el
centro del arco de tratamientos (`toothSlot="treat"`). Ya no aparece en la portada ni viaja por la página (Bruno, 4 nov).
Los íconos de "Lo que no se ve" también son 3D (`shared/icon3d.ts`): flama, escudo y corazón extruidos con bisel y esmalte.
Three.js se carga aparte (import dinámico, ~115 kB comprimido).

## Movimiento

- Intro: el diente del logo se dibuja de un trazo y su destello gira, "marfil" letra por letra, contador a 100 y cortina en curva.
- Encabezado de vidrio con píldora que sigue al enlace (transitions.dev "Tabs sliding"). "Agendar cita" se oscurece y le
  crece un círculo con el calendario. Logo: el diente se redibuja, un brillo cruza el cuadro y el destello parpadea.
- Botones: el color sube desde abajo con orilla curva y cruza un destello. **Nada de botones magnéticos** (a Bruno no le gustan).
- Transición entre páginas: círculo azul desde donde se hizo clic (View Transitions).
- transitions.dev: tilt con brillo (tarjetas de vidrio, equipo, plan, tarjeta de presentación), avatar group hover, texts reveal,
  number pop-in, toggle con doble rebote, acordeón, success check y learn-more.

## Secciones

1. Portada: título fino/negritas, avatares de pacientes, panel con arcos y la doctora en el arco (Pexels 15641079), tarjetas de vidrio.
2. Tratamientos en arco alrededor del diente (8 nodos); tarjeta de vidrio con mapa dental (FDI) desplegable.
3. Simulador "Ajusta el brillo de tu sonrisa": control con sol chico y grande, guía de color en dientes.
4. Primera visita en flechas de pasos azules + "Lo que no se ve" en tarjetas de vidrio con íconos 3D.
5. Equipo como tarjetas de app de citas + opiniones en un mazo: al tocar la de arriba sale volando y da la vuelta al final.
6. Precios en una sola columna ("desde" arriba de la cifra) con interruptor a 12 meses y Plan Familia.
7. Agenda tipo app: calendario del mes (hasta 3 meses adelante) y vista previa en un teléfono.
8. Visítanos: consultorio dentro de un espejo con forma de diente, horario y preguntas.
9. Pie con tarjeta de presentación azul (sin palabra gigante).
