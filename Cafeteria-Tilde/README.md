# Demos de cafeterías y restaurantes

Sitio demo con marca ficticia para el portafolio de Bruno Dunay.

| Demo | Paquete | Sitio |
|---|---|---|
| Tilde · cafetería de especialidad | Básico | https://demo-cafe-tilde.vercel.app |

La marca, los datos de contacto y los precios son inventados. Las fotos son de Pexels (licencia libre).

## Código

Workspace de Angular 22 en `frontend/` con la app `projects/cafe-tilde`. Salida estática prerenderizada (buen SEO y despliegue simple), componentes standalone con signals y CSS e IntersectionObserver para las animaciones. La ficha de diseño (concepto, paleta, tipografías y secciones) está en `docs/tilde.md`.

```bash
cd frontend
npm install
npm start        # servidor local
npm run build    # compila en dist/cafe-tilde/browser
```

## Despliegue

Proyecto de Vercel conectado a este repositorio (directorio raíz `frontend/`, compilación `npx ng build cafe-tilde`, salida `dist/cafe-tilde/browser`). Cada push a `main` vuelve a publicar el sitio.
