# Forja · Box funcional (paquete Profesional)

**URL:** https://demo-gym-forja-box.vercel.app · **Código:** `frontend/projects/gym-forja`

## Concepto

Box de entrenamiento funcional (crosstraining, halterofilia, gimnástica) con grupos de máximo 14 y coach en cada clase. Lema: "Uno de los nuestros".
Personalidad: cruda, intensa y de comunidad. Se evita la palabra "CrossFit" (marca registrada).

## Identidad

- **Logo:** hexágono (como la cabeza de una mancuerna) con una F naranja. Funciona en gorra y playera.
- **Paleta:** negro `#0B0B0C`, hueso `#F2EFE8`, naranja ascua `#FF5B14`, chispa `#FFC24B`. Fotos en blanco y negro con contraste.
- **Tipografías:** Anton (titulares), Archivo (texto) y JetBrains Mono (etiquetas, cronómetros).
- **Movimiento:** enérgico (cortes rápidos, curvas expo, sacudidas). Grano de película sobre todo el sitio.
- **Cursor:** tipo visor: punto naranja de 6 px y cuatro esquinas que se ajustan al contorno del botón o enlace bajo el cursor, con etiqueta en mono.

## Intro (motion graphics, ~3.5 s)

Termómetro de 0 a 1350 °C mientras el hexágono se dibuja al rojo vivo → la F se martilla con destello, sacudida y chispas → el metal se enfría a acero → aparece FORJA letra por letra → la pantalla se abre en diagonal y entra la portada.

## Secciones

1. Portada interactiva: "UNO / DE LOS / NUESTROS." (las líneas reaccionan al cursor con distinta profundidad; "nuestros" se rellena de naranja), video vertical que se inclina en 3D con HUD de "WOD en vivo" y reloj.
2. Franjas cruzadas tipo cinta de obra que se aceleran con la velocidad del scroll.
3. Manifiesto estilo póster "One of us": el texto se enciende palabra por palabra al hacer scroll.
4. Disciplinas como señalética del box (letreros-flecha de la referencia): cambian el panel con barrido de imagen; se rotan solas.
5. Cifras grandes que asoman tras una repisa (referencia de infografía).
6. Agenda semanal (referencia de post de agenda) con fechas de la semana en curso + WOD del día con cronómetro AMRAP que funciona.
7. "El idioma del box": 8 movimientos (sentadilla, peso muerto, press, dominada, swing, salto al cajón, cuerdas y remo) con figuras articuladas del sistema de Fitness by Evidence (`shared/figures/figure-rig.ts`). Hacen una repetición al entrar en pantalla y repiten mientras el cursor está encima.
8. Coaches en carrusel arrastrable con duotono naranja.
9. Membresías y clase suelta.
10. Galería en dos tiras que se mueven en sentidos opuestos con el scroll.
11. Testimonios con barras de progreso.
12. Cierre con video de fondo y formulario a WhatsApp con vista previa. El nombre gigante del pie se quitó.
13. Páginas legales: `/aviso-de-privacidad` y `/terminos`.

## Fotos y video

29 fotos (Pexels + `referencias/gym/referencia 2.jpg` y `referencia 3.jpg`) y 2 videos de `referencias/gym/` (`video 4.mp4`, `video suelo de gym.mp4`) en blanco y negro.
