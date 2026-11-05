# Demos de salud: Marfil (dentista) y Claro (psicóloga)

Dos demos del paquete **Profesional** con marcas ficticias, para salir a prospectar en el giro de salud (el más grande
de Aguascalientes en el CRM: unos 2,100 negocios, casi 9 de cada 10 sin web). Fichas de diseño: `docs/marfil.md` y `docs/claro.md`.

- Marfil: https://demo-salud-marfil.vercel.app (Vercel `demo-salud-marfil`). Clínica dental de la Dra. Renata Ibarra.
- Claro: https://demo-salud-claro.vercel.app (Vercel `demo-salud-claro`). Consultorio de la psicóloga Valeria Ríos.
- Repo: `BrunoDunay/Demos-de-servicios-web` (todas las demos), carpeta `Salud/`. Push a `main` publica; cada proyecto
  de Vercel solo se vuelve a compilar si cambió su carpeta.
- Vercel: `prj_jRbyjQ5aNorG0KxcoNB8DDtOPUpY` (Marfil) y `prj_0MOWmxcBjiGk6KSceBneLvfL8fzR` (Claro). Raíz `Salud/frontend`,
  `npm ci`, `npx ng build salud-<demo>`, salida `dist/salud-<demo>/browser`, Node 24. Protección solo en vistas previas.

## Estructura

- `frontend/`: un solo workspace de Angular 22 con `projects/salud-marfil` y `projects/salud-claro` (comparten `node_modules`).
  Estático prerenderizado, GSAP + Lenis, fuentes con `@fontsource`. Base copiada de Nido (`motion.ts`, `reveal.ts`, `icon.ts`, `motion-toggle.ts`).
- Todo el texto de cada sitio vive en `src/app/core/content.ts`; el estado compartido (motivo de la cita, navegación) en `core/clinic.ts` / `core/practice.ts`.
- `scripts/media-salud.mjs` (`npm run media`): baja las fotos de Pexels por ID, genera WebP normal y `-sm`, y la
  **máscara de los dientes** del simulador de blanqueamiento (`sonrisa-mascara.png`: lo claro y poco saturado dentro
  del recuadro de la boca). Si se cambia la foto de la sonrisa, hay que ajustar el recuadro `BOCA`.

```bash
cd frontend
npm run start:marfil   # puerto 4310
npm run start:claro    # puerto 4311
npm run build          # compila las dos
```

## Reglas

- Paletas propias: Marfil azul rey/azul noche/hielo; Claro papel crema/marino/salvia/durazno. No repetirlas en otras demos.
- Las referencias de Bruno van en `Salud/referencias/` (fuera del repo), nunca en `public/`.
- Datos de contacto ficticios, como texto (sin `tel:`); cédulas y COFEPRIS dicen "(demo)". WhatsApp sin número (`wa.me/?text=`).
- Claro muestra la **Línea de la Vida (800 911 2000)**, que es real: no quitarla, es lo responsable en un sitio de psicología.
- Convenciones de tacto (hover solo con mouse, `:active`, interruptor "Reducir movimiento"): igual que en `../Gimnasio/CLAUDE.md`.

## Estado (4 nov 2026)

- Publicadas. Rediseño el mismo día con las referencias de Bruno (`referencias/marfil` y `referencias/claro`, solo locales):
  Marfil pasó a azul clínico con diente 3D (Three.js) y Claro a collage editorial con dibujos a mano. Ver `docs/`.
- Transiciones y hovers tomados de transitions.dev (las recetas CSS se adaptaron: el freno de movimiento usa el interruptor
  "Reducir movimiento", no `prefers-reduced-motion`).
- Ya están en el portafolio y en el video de LinkedIn del portafolio. Pendiente del giro: la nutrióloga (Básico).
- 4 nov 2026, ronda de cambios de Marfil (Bruno): doctora nueva en la portada, el diente 3D solo en tratamientos, sin
  palabras gigantes en portada y pie, sin botones magnéticos, íconos 3D, mazo de reseñas, precios alineados y calendario
  de mes. Detalle en `docs/marfil.md`.
