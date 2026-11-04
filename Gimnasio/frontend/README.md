# Demos · workspace de Angular

Sitios demo con marcas ficticias para el portafolio de Bruno Dunay. Un solo workspace con una app por demo.

| App | Paquete | URL |
|---|---|---|
| `gym-brio` | Básico | https://demo-gym-brio.vercel.app |
| `gym-forja` | Profesional | https://demo-gym-forja-box.vercel.app |
| `gym-umbral` | Premium | https://demo-gym-umbral.vercel.app |

## Uso

```bash
npm install
npm run start:brio      # http://localhost:4301
npm run start:forja     # http://localhost:4302
npm run start:umbral    # http://localhost:4303
npm run build:gym       # compila las tres en dist/<app>/browser
npm run media:gym       # regenera fotos (WebP) y videos (MP4) en public/media
```

Cada build es estático: todas las rutas se prerenderizan. Para publicar, ver `../CLAUDE.md` (sección Despliegue).

## Créditos de imagen

Fotos de [Pexels](https://www.pexels.com) (licencia libre, sin atribución obligatoria) y material de referencia propio en `../referencias/gym/`. La lista completa está en `scripts/media-gym.mjs`.
