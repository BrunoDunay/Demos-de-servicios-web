# Demos de gimnasio

Tres sitios demo con marcas ficticias para el portafolio de Bruno Dunay, uno por paquete:

| Demo | Paquete | Sitio |
|---|---|---|
| Brío · gimnasio de barrio | Básico | https://demo-gym-brio.vercel.app |
| Forja · box funcional | Profesional | https://demo-gym-forja-box.vercel.app |
| Umbral · boutique fitness club | Premium | https://demo-gym-umbral.vercel.app |

Las marcas, los datos de contacto y los precios son inventados.

## Código

Un solo workspace de Angular 22 en `frontend/` con una app por demo (`projects/gym-brio`, `gym-forja`, `gym-umbral`). Salida estática prerenderizada, GSAP y Lenis para el movimiento y Three.js en el recorrido del club de Umbral. Las fichas de cada marca están en `docs/gym/`.

```bash
cd frontend
npm install
npm run start:umbral   # o start:brio / start:forja
npm run build:gym      # compila las tres
```

## Despliegue

Cada demo es un proyecto de Vercel conectado a este repositorio (directorio raíz `frontend/`). Al subir cambios a `main` se vuelven a publicar solas.
