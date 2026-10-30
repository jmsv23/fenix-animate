# AGENTS.md — framework de videos explicativos

Instrucciones para cualquier agente (Claude Code, Codex, opencode, Gemini CLI, …).
No dependen de skills ni de herramientas de un proveedor: todo lo que necesitas está
en este repositorio y en el CLI `fw`. `CLAUDE.md` y `GEMINI.md` apuntan aquí.

## Qué produce

Videos explicativos animados (motion graphics + voz), 1920×1080 a 30 fps,
renderizados con HyperFrames. Cada idea se ve suceder en pantalla, sincronizada
palabra por palabra con la narración. La meta: que cualquier persona entienda el
tema y se lleve una idea por concepto.

## Cuando el usuario te pide un video

El usuario normalmente solo te da **un tema o material de partida** ("haz un video
sobre X", "convierte este artículo en video", "usa estas notas"). Tú haces el resto:

```bash
npm run new -- <nombre-corto>     # desde la raíz del repo → videos/<nombre-corto>
cd videos/<nombre-corto>
npm run fw -- doctor              # requisitos; si falla algo, díselo al usuario con el arreglo
npm run fw -- status              # en cualquier momento: dónde estamos y qué sigue
```

Si el usuario ya tiene un proyecto en `videos/`, trabaja ahí y empieza por `status`.
Todos los comandos `npm run fw -- …` se corren **dentro** de la carpeta del proyecto.

## Reparto del trabajo

| Tú (agente) haces | El CLI `fw` hace |
|---|---|
| Investigar o leer el material y escribir `BRIEF.md` | Revisar requisitos (`doctor`) |
| Escribir el guion y el storyboard en `chapters/*.json` | Validar guion, ritmo, iconos, palabras clave |
| Elegir tipos de escena, fondos y transiciones | Generar la voz (Voicebox, comando o audio existente) |
| Escribir escenas a medida si el catálogo no alcanza | Alinear la voz con el guion (WhisperX) |
| Revisar las capturas y corregir | Compilar composiciones HyperFrames deterministas |
| Pedir aprobación humana en los gates | Capturas por escena, render y verificación |

Nunca escribas a mano `compositions/` ni `index.html`: los genera `fw build`.

## Ciclo de trabajo

0. **Brief** — `prompts/00-brief.md`. Guarda el material en `sources/`, llena
   `BRIEF.md` y `project.json` (serie, idioma, voz). Reemplaza el capítulo de ejemplo
   `episodes/01-ejemplo/chapters/00-intro.json` por los tuyos (o renombra el
   episodio y actualiza `activeEpisode`).
1. **Guion + storyboard** — `prompts/01-guion.md` y `prompts/02-storyboard.md`.
   Escribe `episodes/<ep>/chapters/NN-slug.json` y lístalos en `episode.json`.
   `npm run fw -- catalog` muestra los tipos de escena, iconos, personajes y moods.
   `examples/que-saber-de-la-ia/` es un video completo (9 capítulos, 93 escenas) que
   sirve de referencia de nivel.
2. `npm run fw -- validate`: corrige todos los errores (✗) y revisa los avisos (⚠).
3. **Gate humano — guion.** Muestra al usuario el guion por capítulo (o
   `STORYBOARD.md`, que genera `fw build`). Con su visto bueno:
   `npm run fw -- approve script`.
4. **Vertical slice.** Termina primero **un** capítulo: `fw voice <cap>`,
   `fw align <cap>`, `fw build`, `fw qa`. Enséñalo antes de producir el resto: así se
   corrigen voz, ritmo y estilo una sola vez.
5. `npm run fw -- voice`, luego `npm run fw -- align`. Si la alineación baja del 85 %,
   la voz no dijo lo que dice el guion: revisa antes de seguir.
6. `npm run fw -- validate` otra vez: ahora también revisa el ritmo con la duración
   real de cada escena.
7. `npm run fw -- build`, luego `npm run fw -- qa`. **Mira las capturas**
   (`.fw/qa/<ep>/<capítulo>/contact-sheet-*.jpg`, una por escena) y corrige los
   capítulos. Repite build y qa. Lee `prompts/04-revision.md`.
8. **Gate humano — preview.** Abre `npm run dev` (Studio de HyperFrames en el
   navegador) y pide al usuario que lo vea. Con su visto bueno:
   `npm run fw -- approve preview`.
9. `npm run fw -- render` y `npm run fw -- verify`. El MP4 queda en `renders/`.

Cambiar la narración (`vo`) de una escena invalida la voz de ese capítulo y la
aprobación del guion: `fw status` lo indica. Nunca corras `fw approve` sin el visto
bueno explícito del usuario.

## Reglas que no se negocian

- **La voz manda el tiempo.** Una escena empieza cuando la voz dice su primera
  palabra; los elementos aparecen cuando la voz los nombra (`cue`). Nunca estires
  ni recortes la voz.
- **Una idea por escena, de 3 a 10 segundos.** Si una escena dura más de unos 11 s
  y no es de tipo "se construye por partes" (`builds`), divídela.
- **El texto en pantalla no es subtítulo.** Como máximo unas 10 palabras: la idea
  clave, no la transcripción.
- **Nada de datos inventados.** Lo que no salga de `sources/` o de una fuente que
  verificaste no se afirma.
- **Nada de colores sueltos.** Las escenas usan los tokens del estilo
  (`var(--red)`, fondos `bg: paper|ink|red|blue|yellow|green`). Cambiar de estilo
  no debe tocar ningún capítulo.
- **Determinismo.** En escenas a medida: nada de `Math.random()`, `Date.now()`,
  red ni timers. Toda animación se declara con los atributos del runtime
  (`docs/scene-api.md`).
- **Los arreglos del kit van al kit.** Si un problema viene de un tipo de escena,
  corrígelo en `kit/` para que lo hereden todos los videos.

## Mapa

```text
AGENTS.md            este archivo (CLAUDE.md y GEMINI.md apuntan aquí)
README.md            instructivo para personas: requisitos, instalación, uso
package.json         npm run new | doctor | catalog
prompts/             una guía por etapa: 00-brief, 01-guion, 02-storyboard,
                     03-estilo, 04-revision, 05-escena-a-medida
docs/scene-api.md    API de escenas: ctx, atributos de animación, cómo crear un tipo nuevo
schemas/             contratos JSON de project.json y de los capítulos
src/cli.mjs          CLI fw (sin dependencias, Node ≥ 20)
src/lib/             project, voice, align, build, validate
kit/                 runtime de animación, CSS base, arte (iconos, Nodo, personajes), catálogo de escenas
styles/<id>/style.js tokens de cada estilo
template/            esqueleto de proyecto nuevo (fw new)
examples/            un video completo de referencia (guion + storyboard, sin audio)
videos/              tus proyectos (fuera de git)
```
