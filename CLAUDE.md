# 2-Demos: repositorio único de demos

Todas las demos (marcas ficticias) están en un solo repo: `BrunoDunay/Demos-de-servicios-web`, rama `main`.
La tabla de demos y URLs está en `README.md`; el detalle de cada una, en el `CLAUDE.md` de su carpeta.

- Unificado el 4 nov 2026 conservando el historial de los repos anteriores (Demos-de-gimnasio, Demos-de-fotograf-a,
  Demo-fotograf-a-premium, Demos-cafeter-as-restaurantes, Demos-de-inmoviliaria).
- Cada proyecto de Vercel usa su carpeta como directorio raíz (`Gimnasio/frontend`, `Salud/frontend`, …) e ignora el build
  si su carpeta no cambió desde la última publicación (Ignored Build Step, desde 5 nov 2026):
  `if [ -n "$VERCEL_GIT_PREVIOUS_SHA" ] && git cat-file -e "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null; then git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- .; else exit 1; fi`.
  La versión anterior (`HEAD^ HEAD`) solo veía el último commit y cancelaba builds cuando se subían varios commits juntos.
- Nueva demo: carpeta nueva aquí (`<Giro>/` o `<Giro>/<Marca>-<Nivel>`), con su `frontend/`, `CLAUDE.md` y `README.md`;
  proyecto de Vercel con raíz en esa carpeta. Nada de repos nuevos por demo.
- Push grandes (videos): GitHub corta subidas muy pesadas por HTTPS; si falla, subir por partes (commit por commit).

## Estado (4 nov 2026)

- Marfil y Claro (`Salud/`) ya se publican desde este repo.
- **Pendiente:** los 7 proyectos anteriores (demo-gym-brio, demo-gym-forja, demo-gym-umbral, demo-foto-nido, demo-foto-astor,
  demo-cafe-tilde, demo-inmo-alero) siguen conectados a sus repos viejos. Para pasarlos aquí: desconectar el repo viejo,
  conectar este, poner su raíz (`Gimnasio/frontend`, `Fotografia/Nido-Pro/frontend`, `Fotografia/Astor-Premium/frontend`,
  `Cafeteria-Tilde/frontend`, `Inmobiliaria-Alero/frontend`) y el Ignored Build Step. Después se pueden borrar los 5 repos viejos.
- Mientras tanto, para publicar uno de esos 7 a mano (así se subió el logo nuevo de Brío el 5 nov): compilar, copiar
  `dist/<app>/browser` a una carpeta temporal dentro de una subcarpeta `frontend/` (su raíz vieja), agregar un `vercel.json` con
  `buildCommand: ""`, `installCommand: ""`, `outputDirectory: "."` (más los headers del original) y correr ahí
  `VERCEL_ORG_ID=team_GCtgq9lFKHWF1Y5sPouZyq9H VERCEL_PROJECT_ID=<id> npx vercel@latest deploy --prod --yes`.
  Brío: `prj_AecSoUJrzmjVGUG10frfIlcQph7X`. Al usar la regla nueva, los demás proyectos también deben llevarla.
