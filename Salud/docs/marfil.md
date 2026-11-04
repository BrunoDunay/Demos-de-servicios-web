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
curvas), con esmalte brillante y luz azul de contorno. `shared/tooth-stage.ts` la dibuja en un lienzo fijo y la lleva
de un "lugar" a otro (`toothSlot`): intro → portada → centro del arco de tratamientos, mezclando según el scroll.
Three.js se carga aparte (import dinámico, ~115 kB comprimido).

## Movimiento

- Intro: el diente gira y frena al centro, "marfil" letra por letra, contador a 100 y cortina en curva; el diente vuela a la portada.
- Encabezado de vidrio con píldora que sigue al enlace (transitions.dev "Tabs sliding"). Botones magnéticos con gota de color.
- Transición entre páginas: círculo azul desde donde se hizo clic (View Transitions).
- transitions.dev: tilt con brillo (tarjetas de vidrio, equipo, plan, tarjeta de presentación), avatar group hover, texts reveal,
  number pop-in, toggle con doble rebote, acordeón, success check y learn-more.

## Secciones

1. Portada: título fino/negritas, avatares de pacientes, panel con arcos y foto en arco, tarjetas de vidrio y el diente 3D.
2. Tratamientos en arco alrededor del diente (8 nodos); tarjeta de vidrio con mapa dental (FDI) desplegable.
3. Simulador "Ajusta el brillo de tu sonrisa": control con sol chico y grande, guía de color en dientes.
4. Primera visita en flechas de pasos azules + "Lo que no se ve" en tarjetas de vidrio.
5. Equipo como tarjetas de app de citas + opiniones en dos filas que se deslizan.
6. Precios con interruptor a 12 meses y Plan Familia.
7. Agenda tipo app con vista previa en un teléfono.
8. Visítanos: consultorio dentro de un espejo con forma de diente, horario y preguntas.
9. Pie con tarjeta de presentación azul y "marfil" gigante.
