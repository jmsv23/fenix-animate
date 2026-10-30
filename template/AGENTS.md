# AGENTS.md — proyecto

Este proyecto usa el framework de `{{FW}}`. Lee `{{FW}}/AGENTS.md` antes de hacer
cualquier cosa y empieza siempre con:

```bash
npm run fw -- status
```

- La intención del video está en `BRIEF.md`; el material de partida, en `sources/`.
- La fuente de verdad son `episodes/<ep>/chapters/*.json`. No edites `compositions/`
  ni `index.html` a mano: los genera `npm run fw -- build`.
- Tipos de escena propios de este proyecto: `scenes/*.mjs` (ver
  `{{FW}}/prompts/05-escena-a-medida.md`).
