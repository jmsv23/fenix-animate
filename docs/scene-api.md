# API de escenas

Un tipo de escena es un objeto:

```js
export const nombre = {
  doc: "Una línea: qué muestra y cuándo usarlo.",   // lo imprime fw catalog
  required: ["param", …],   // fw validate exige estos parámetros
  ground: "ink",            // fondo por defecto (opcional)
  builds: true,             // se arma por partes con la voz: tolera escenas más largas
  sting: true,              // corta por diseño (no avisa si dura poco)
  render(scene, x) { return "<html de la escena>"; },
};
```

`render` devuelve HTML que va dentro del escenario (1920×1080, `position:absolute`
para todo). El framework añade el fondo, el confeti, la etiqueta del capítulo y la
transición.

## `x` — contexto de la escena

| Miembro | Qué hace |
|---|---|
| `x.s`, `x.next`, `x.dur` | inicio de la escena, inicio de la siguiente, duración (segundos de la composición) |
| `x.ground` | fondo actual (`paper`, `ink`, …) |
| `x.cue(palabra, fracción)` | momento en que la voz dice `palabra` (un poco antes). Si no está, usa `x.at(fracción)` y avisa. `"palabra#2"` = segunda aparición. `x.cue(null, f)` = `x.at(f)` |
| `x.at(f)` | momento a la fracción `f` (0–1) de la escena |
| `x.a(preset, t, extra)` | atributos de entrada: `pop`, `rise`, `drop`, `blur`, `word`, `slam`, `stamp`, `wipe`, `wipeup`, `left`, `right`, `grow`, `growy`, `zoom`, `spin`, `fade`, `draw` (SVG con `pathLength="1" stroke-dasharray="1"`), `type` (hijos `.ch`) |
| `x.out(preset, t)` | salida: `fade`, `blur`, `fall`, `up`, `shrink`, `dim` |
| `x.fx([{ at, dur, to, from?, ease }])` | tweens libres (rotación, x/y, escala, opacidad…) |
| `x.count({ at, dur, from, to, dec, prefix, suffix })` | número que cuenta |
| `x.words(texto, em, { min, step })` | titular que aparece palabra por palabra con la voz; `em` marca palabras |
| `x.typed(texto)` | texto en `.ch` para el preset `type` (tecleo) |
| `x.icon(nombre, tamaño)`, `x.badge(nombre, tono, tamaño)` | iconos del kit (`fw catalog` los lista) |
| `x.nodo(mood, tamaño)` | la mascota, con parpadeo automático |
| `x.person(preset, mood, escala)` | personaje (`you`, `intern`, `doctor`, `uncle`, `vendor`, `friend-m`, `friend-f`) |
| `x.esc(texto)` | escapar HTML |

## Atributos del runtime (HTML a mano)

El runtime (`kit/runtime.js`) lee estos atributos y arma un único timeline de GSAP,
pausado y determinista:

```html
<div data-in="pop" data-at="3.2"></div>
<div data-out="fade" data-out-at="7.9"></div>
<div data-fx='[{"at":4,"dur":0.6,"to":{"rotation":30},"ease":"power2.inOut"}]'></div>
<div data-count='{"at":2,"dur":1.2,"from":0,"to":95,"suffix":"%"}'></div>
```

## Clases y tokens

- Clases: `card`, `chip`, `badge t-<tono>`, `headline m|l|xl`, `kicker`, `sub`, `mono`,
  `center`, `layer`, `t-red|blue|yellow|green|ink` (define `--tone`).
- Variables: `--paper`, `--ink`, `--white`, `--red`, `--blue`, `--yellow`, `--green`,
  `--pink`, `--purple`, … y las del fondo actual: `--bg`, `--fg`, `--muted`, `--mark`,
  `--mark-fg`, `--accent`.
