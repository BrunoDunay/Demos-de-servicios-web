# Demos de salud

Sitios demo con marcas ficticias para el portafolio de Bruno Dunay (paquete Profesional).

| Demo | Giro | Sitio |
|---|---|---|
| Marfil · Odontología | Dentista | https://demo-salud-marfil.vercel.app |
| Claro · Psicología | Psicóloga | https://demo-salud-claro.vercel.app |

Las marcas, los datos de contacto, las cédulas y los precios son inventados. Las fotos son de Pexels (licencia libre).
La Línea de la Vida que aparece en Claro (800 911 2000) es real.

## Código

Workspace de Angular 22 en `frontend/` con las apps `projects/salud-marfil` y `projects/salud-claro`. Salida estática
prerenderizada, componentes standalone con signals, GSAP y Lenis para el movimiento. Fichas de diseño en `docs/`.

```bash
cd frontend
npm install
npm run start:marfil   # o start:claro
npm run build          # compila las dos en dist/
npm run media          # regenera fotos y la máscara del simulador
```

## Despliegue

Dos proyectos de Vercel conectados al repositorio, con directorio raíz `Salud/frontend`, instalación `npm ci`,
compilación `npx ng build salud-<demo>` y salida `dist/salud-<demo>/browser`. Cada push a `main` que cambie esta carpeta los vuelve a publicar.
