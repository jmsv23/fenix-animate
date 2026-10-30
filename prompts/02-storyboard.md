# Etapa 2 — Storyboard (escenas)

Salida: cada escena de `chapters/*.json` con su `type`, sus parámetros y sus `cue`.
Consulta el catálogo con `npm run fw -- catalog` (tipos, iconos, personajes, moods).
Esquema completo: `schemas/chapter.schema.json`.

## Formato del capítulo

```json
{
  "id": "03-tokens",             // igual al nombre del archivo
  "title": "Los tokens",
  "chip": "03 · TOKENS",         // etiqueta fija arriba a la izquierda (null = sin etiqueta)
  "voice": { "instruct": "…" },  // opcional: dirección de voz solo para este capítulo
  "scenes": [ { "vo": "…", "type": "…", …parámetros, "bg": "…", "tr": "…" } ]
}
```

## Elegir el tipo de escena

Primero decide **la forma de la idea** y después el tipo:

| La frase dice… | Tipo |
|---|---|
| una pregunta o un misterio | `question` |
| una afirmación clave, un giro | `say` (con `mascot` o `icon` si ayuda) |
| lo que el usuario escribe / lo que responde la IA | `chat` (`verdict`: meh, good, bad) |
| antes vs. después, A vs. B | `versus` |
| una lista de pasos o consejos | `steps` |
| un ciclo (pides → responde → corriges) | `loop` |
| muchas cosas que se juntan en una | `collect` |
| un resumen de varias ideas | `grid` |
| algo que se verifica (✓/✗) | `verify` |
| una idea falsa corregida | `myth` |
| un documento con una advertencia | `stamp` |
| un número o una proporción | `bignum`, `meter` |
| una persona de la analogía | `persona` (`who`: you, intern, doctor, uncle, vendor, friend-m, friend-f) |
| la IA reaccionando | `nodo` (la mascota; `mood`) |
| el mecanismo mismo | `tokens`, `window`, `predict`, `dial`, `inout`, `network`, `pile`, `haystack` |
| inicio y cierre de concepto | `chapter`, `takeaway` |
| cierre del video | `cta` |

Si ninguno muestra la idea, escribe un tipo nuevo en `<proyecto>/scenes/` (ver
`prompts/05-escena-a-medida.md`). No fuerces una idea en un tipo que no la muestra.

## Ritmo y variedad

- **Un cambio de escena cada 3–10 s.** Los tipos que se arman por partes al ritmo de
  la voz (`steps`, `grid`, `verify`, `collect`, `loop`, `window`, `predict`) aguantan
  hasta ~15 s.
- **No repitas el mismo tipo dos veces seguidas**, salvo una secuencia intencional
  (p. ej. `predict` baja → `predict` alta).
- **Alterna fondos** (`bg`): claro (`paper`) como base, con color (`red`, `blue`,
  `yellow`, `green`) y oscuro (`ink`) para los golpes. Dos escenas seguidas con el
  mismo fondo de color se sienten como una sola.
- **Transiciones** (`tr`): `whip`, `zoom`, `iris`, `rise`, `flood`, `cut`. Si no
  pones ninguna, el framework rota. Usa `cut` en los golpes de humor o de sorpresa,
  `iris` para "entrar" en una idea y `zoom` para un cambio de tono.
- **Personajes y Nodo** dan calidez: úsalos en las analogías y en las reacciones, no
  como decoración.

## Palabras clave (`cue`)

- Cada `cue` es una palabra **de la narración de esa escena**; el elemento aparece
  un instante antes de que la voz la diga. Si se repite, usa `"palabra#2"`.
- Pon `cue` en todo lo que la voz nombra: ítems de listas, lados de un versus,
  sellos, la respuesta del chat (`cueAi`).
- Una palabra clave que llega al final de la escena deja poco tiempo para leer.
  Elige la primera palabra que anuncia la idea.
- `fw validate` avisa cuando una palabra clave no está en la narración.

## Texto en pantalla

- `text`/`title`: máximo unas 10 palabras. Resume; no transcribas.
- `em`: las palabras que se marcan (la idea clave), una o dos por escena.
- El texto aparece palabra por palabra con la voz y se completa a mitad de la
  escena: lo que va en pantalla debe seguir el orden de lo que se dice.

## Antes de pedir aprobación

```bash
npm run fw -- validate
```

Sin errores (✗). Revisa cada aviso (⚠): si lo ignoras, que sea a propósito.
