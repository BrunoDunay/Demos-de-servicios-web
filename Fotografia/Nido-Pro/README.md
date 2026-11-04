# Demos de fotografía

Sitio demo con marca ficticia para el portafolio de Bruno Dunay.

| Demo | Paquete | Sitio |
|---|---|---|
| Nido · estudio de fotografía newborn y familia | Profesional | https://demo-foto-nido.vercel.app |

La marca, los datos de contacto y los precios son inventados. Las fotos son de Pexels (licencia libre).

## Código

Workspace de Angular 22 en `frontend/` con la app `projects/foto-nido`. Salida estática prerenderizada (buen SEO y despliegue simple), componentes standalone con signals y GSAP (ScrollTrigger y SplitText) y Lenis para el scroll suave. La ficha de diseño (concepto, paleta, tipografías y secciones) está en `docs/nido.md`.

```bash
cd frontend
npm install
npm start        # servidor local
npm run build    # compila en dist/foto-nido/browser
```

## Despliegue

Proyecto de Vercel conectado a este repositorio (directorio raíz `frontend/`, compilación `npx ng build foto-nido`, salida `dist/foto-nido/browser`). Cada push a `main` vuelve a publicar el sitio.
