# Marfil · Odontología (paquete Profesional)

**URL:** https://demo-salud-marfil.vercel.app · **Código:** `frontend/projects/salud-marfil`

## Concepto

"En este sitio, el odontograma se vuelve el menú." Clínica dental ficticia de la Dra. Renata Ibarra en Aguascalientes
(Av. Universidad 1102, Bosques del Prado). Mensaje central: te explicamos todo en la pantalla y el plan con precios va por escrito.

## Identidad

- **Logo:** un diente de un solo trazo con un brillo menta (la luz de la lámpara).
- **Paleta (OKLCH):** marfil `oklch(97.4% 0.011 88)`, tinta azul noche `oklch(24% 0.035 258)`, acento menta `oklch(63% 0.1 172)`.
  El amarillo "diente" solo aparece en el simulador.
- **Tipografías:** Fraunces (títulos, con itálica suave) y Plus Jakarta Sans (texto).

## Intro (~1.8 s)

Sobre azul noche se dibuja el diente del logo, se enciende la luz de la lámpara y la pantalla se abre en arco, como una sonrisa.

## Secciones

1. **Portada:** foto en penumbra que la "lámpara" ilumina donde está el cursor (en celular la luz se pasea sola). Estado "Abierto ahora / Cerrado" con el horario real.
2. **Tratamientos como odontograma:** arcadas de 32 dientes en SVG (numeración FDI). Al elegir un tratamiento se encienden los dientes donde se hace, del centro hacia atrás; tocar un diente dice su nombre y qué se le hace más seguido. Ficha con citas, duración y precio "desde".
3. **Simulador de blanqueamiento:** guía de color tipo VITA (A3.5 → BL); arrastras la línea para comparar tu tono con el resultado (+2/3 tonos). Los dientes se tiñen con una máscara sacada de la foto.
4. **Primera visita:** 4 pasos con una línea que se llena al bajar.
5. **Lo que no se ve:** esterilización, rayos X digitales y años, con contadores.
6. **Equipo:** 3 especialistas.
7. **Precios:** lista con interruptor "a 12 meses" y Plan Familia.
8. **Opiniones** tipo Google (4.9, 312 reseñas).
9. **Agenda:** motivo → día (próximos 12 días hábiles) → hora (algunas "ocupadas", siempre las mismas) → datos; vista previa como burbuja de WhatsApp.
10. **Visítanos:** mapa dibujado, horario con el día de hoy marcado y preguntas frecuentes.
11. Pie y páginas legales (aviso de privacidad con datos sensibles de salud y NOM-004, términos con garantías).

## Fotos

Pexels (IDs en `scripts/media-salud.mjs`).
