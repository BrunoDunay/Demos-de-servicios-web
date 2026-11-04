# Demos de servicios web · Bruno Dunay

Sitios demo con marcas ficticias para el portafolio y para vender los paquetes Básico, Profesional y Premium.
Todas las demos viven en este repositorio; cada una se publica en su propio proyecto de Vercel.

| Demo | Carpeta | Paquete | Sitio |
|---|---|---|---|
| Brío · gimnasio de barrio | `Gimnasio` | Básico | https://demo-gym-brio.vercel.app |
| Forja · box funcional | `Gimnasio` | Profesional | https://demo-gym-forja-box.vercel.app |
| Umbral · boutique fitness | `Gimnasio` | Premium | https://demo-gym-umbral.vercel.app |
| Nido · fotografía newborn y familia | `Fotografia/Nido-Pro` | Profesional | https://demo-foto-nido.vercel.app |
| Astor · fotografía de bodas | `Fotografia/Astor-Premium` | Premium | https://demo-foto-astor.vercel.app |
| Tilde · cafetería de especialidad | `Cafeteria-Tilde` | Básico | https://demo-cafe-tilde.vercel.app |
| Alero · inmobiliaria | `Inmobiliaria-Alero` | Básico | https://demo-inmo-alero.vercel.app |
| Marfil · dentista | `Salud` | Profesional | https://demo-salud-marfil.vercel.app |
| Claro · psicóloga | `Salud` | Profesional | https://demo-salud-claro.vercel.app |

Cada carpeta trae su propio `README.md`, su `CLAUDE.md` y su workspace de Angular en `frontend/`.

## Cómo se publica

- Cada proyecto de Vercel apunta a este repo con su **directorio raíz** (por ejemplo `Salud/frontend`).
- Paso "Ignored Build Step": `git diff --quiet HEAD^ HEAD -- .`. Así, un push solo vuelve a compilar las demos cuya carpeta cambió.
- El historial de los repositorios anteriores de cada demo se conservó al unirlos aquí (4 nov 2026).
