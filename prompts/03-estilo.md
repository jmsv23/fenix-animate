# Etapa opcional — Crear un estilo

Un estilo es un archivo `style.js` con tokens. Las escenas nunca llevan colores
propios: cambian de estilo cuando cambia `project.json → style`.

## Dónde

- Para un solo proyecto: `<proyecto>/styles/<id>/style.js`.
- Para reutilizarlo: `styles/<id>/style.js` en la raíz del framework.

Copia `styles/flat-explainer/style.js` como base y conserva **todas** las claves.

## Qué definir

| Clave | Qué es |
|---|---|
| `colors` | paleta con nombre: `paper`, `ink`, `white`, `red`, `blue`, `yellow`, `green` (+ variantes `*Deep`, `pink`, `purple`, `skin`, `skin2`, `hair`, `hair2`, `screen`). Los nombres son roles; el valor puede ser cualquier color (en un estilo oscuro, `paper` puede ser casi negro). |
| `grounds` | los 6 fondos de escena (`paper`, `ink`, `red`, `blue`, `yellow`, `green`): color de fondo, de texto (`fg`), apagado (`muted`), marcador (`mark`/`markFg`), acento y confeti. **Revisa el contraste** del texto sobre cada fondo (≥ 4.5:1 para texto chico, ≥ 3:1 para títulos grandes). |
| `fonts` | display, body y mono. Solo resuelven por nombre las fuentes que trae HyperFrames (Inter, Montserrat, Poppins, Outfit, Nunito, Oswald, Archivo Black, JetBrains Mono, IBM Plex Mono, Space Mono, …); otra fuente necesita `@font-face` a un archivo en `assets/fonts/`. |
| `shape` | radios y la sombra de las tarjetas. |
| `rhythm` | límites de duración de escena que usa `fw validate`, solape de transiciones, adelanto de la escena respecto a la voz. |

## Desde una descripción

Traduce cada adjetivo a un valor: "cálido" → papel crema, tinta café; "técnico" →
mono más presente, radios chicos, sombras planas. Anota las decisiones en un
`STYLE.md` junto al `style.js`.

## Desde una referencia (imagen o video)

Extrae lo **observable**: paleta (cuenta los colores dominantes), contraste, peso de la
tipografía, radios, tipo de sombra, densidad. No copies ilustraciones, personajes ni
logos: el arte del kit es propio y se recolorea con tus tokens.

## Probar

`npm run fw -- build && npm run fw -- qa` y revisa las capturas de un capítulo
completo: cada fondo y cada tipo de escena con el estilo nuevo.
