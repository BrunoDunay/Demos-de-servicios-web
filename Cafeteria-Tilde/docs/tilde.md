# Tilde · Café de barrio (paquete Básico)

**URL:** https://demo-cafe-tilde.vercel.app · **Código:** `frontend/projects/cafe-tilde`

## Concepto

Café chiquito en una casa de 1940 del barrio de la Purísima: café tostado los martes, pan desde temprano y desayunos. Lema: "Café de barrio, sin prisa".
El sitio es **la fachada del café**: toldo a rayas, letrero colgante, pizarrón, puerta de vidrio con el horario rotulado.

Rediseño del 26 oct 2026 con skills (ui-ux-pro-max: cafetería → bloques de color con energía, café y crema, tipografía retro; frontend-design y emil-design-eng para composición y movimiento; humanizer para los textos).

## Identidad

- **Logo:** "Tilde" en Abril Fatface con la virgulilla (~) como vapor sobre la "i".
- **Paleta (OKLCH, en bloques):** crema, café tostado, jitomate, mantequilla, menta y verde pizarrón. Neutros teñidos hacia el café.
- **Tipografías:** Abril Fatface (títulos) y Karla (texto).
- **Botones:** teclas con borde inferior que se hunden al presionar.
- **Movimiento:** CSS + IntersectionObserver (Básico). Nada de rebotes elásticos.

## Secciones (una sola página)

1. **Toldo:** barra crema con el toldo a rayas y orilla ondulada colgando (máscara CSS); se recoge al bajar. Botón de bolsa con contador.
2. **Portada:** foto en ventana de arco y **letrero colgante "Abierto/Cerrado"** que se voltea según la hora real.
3. **Arma tu taza:** eliges qué le pones al espresso (agua, leche, espuma, cacao, hielo), la taza se llena por capas (clip-path) y te dice cómo se llama la bebida y cuánto cuesta. Combinaciones raras salen como "Invento de la casa". Se agrega a la bolsa.
4. **El pizarrón:** todo el menú escrito en gis, sin pestañas, con + en cada producto.
5. **¿Qué salió del horno?:** horario del pan del día comparado con la hora real ("Son las 10:06. Rol de canela sale en 54 minutos").
6. **El lugar:** tiras de fotos de cabina.
7. **Reseñas en vasos para llevar** con el nombre escrito con plumón.
8. **La puerta:** horario rotulado en el vidrio (el día de hoy resaltado), cómo llegar y datos.
9. **La bolsa:** panel lateral con el pedido; al mandarlo se ve como una bolsa de papel con tu nombre y el botón para abrir WhatsApp. Botón flotante con el total cuando hay algo en la bolsa.

## Fotos

24 fotos de Pexels con un toque cálido (`frontend/scripts/media-demos.mjs`, lista `tilde`).
