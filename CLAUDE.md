# 2-Demos: repositorio único de demos

Todas las demos (marcas ficticias) están en un solo repo: `BrunoDunay/Demos-de-servicios-web`, rama `main`.
La tabla de demos y URLs está en `README.md`; el detalle de cada una, en el `CLAUDE.md` de su carpeta.

- Unificado el 4 nov 2026 conservando el historial de los repos anteriores (Demos-de-gimnasio, Demos-de-fotograf-a,
  Demo-fotograf-a-premium, Demos-cafeter-as-restaurantes, Demos-de-inmoviliaria).
- Cada proyecto de Vercel usa su carpeta como directorio raíz (`Gimnasio/frontend`, `Salud/frontend`, …) e ignora el build
  si su carpeta no cambió (`git diff --quiet HEAD^ HEAD -- .`).
- Nueva demo: carpeta nueva aquí (`<Giro>/` o `<Giro>/<Marca>-<Nivel>`), con su `frontend/`, `CLAUDE.md` y `README.md`;
  proyecto de Vercel con raíz en esa carpeta. Nada de repos nuevos por demo.
- Push grandes (videos): GitHub corta subidas muy pesadas por HTTPS; si falla, subir por partes (commit por commit).

## Estado (4 nov 2026)

- Marfil y Claro (`Salud/`) ya se publican desde este repo.
- **Pendiente:** los 7 proyectos anteriores (demo-gym-brio, demo-gym-forja, demo-gym-umbral, demo-foto-nido, demo-foto-astor,
  demo-cafe-tilde, demo-inmo-alero) siguen conectados a sus repos viejos. Para pasarlos aquí: desconectar el repo viejo,
  conectar este, poner su raíz (`Gimnasio/frontend`, `Fotografia/Nido-Pro/frontend`, `Fotografia/Astor-Premium/frontend`,
  `Cafeteria-Tilde/frontend`, `Inmobiliaria-Alero/frontend`) y el Ignored Build Step. Después se pueden borrar los 5 repos viejos.
