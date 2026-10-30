# Etapa 0 — Del tema al brief

Entrada: lo que el usuario te dio. Puede ser solo un tema ("explica qué es la
inflación"), un texto, notas, un PDF, un enlace, un guion de otro formato o un audio
en `sources/`.
Salida: `BRIEF.md` lleno y un proyecto listo en `videos/<nombre>/`.

## 1. Crea el proyecto

```bash
npm run new -- <nombre-corto>      # desde la raíz del framework → videos/<nombre-corto>
cd videos/<nombre-corto>
npm run fw -- doctor
```

Guarda el material que te pasaron en `sources/`: textos en `.md`, transcripción de
audios o videos (`whisperx` sirve), y anota los enlaces en `sources/LINKS.md`.

## 2. Entiende antes de escribir

- **Solo un tema:** investiga con lo que tengas (búsqueda web, documentación). Anota en
  `sources/NOTES.md` cada dato que vayas a usar con su fuente. Si no puedes
  verificar algo, no lo afirmes.
- **Material de partida:** léelo completo. Extrae las ideas que de verdad explica, en
  el orden en que se entienden mejor, no en el orden del material.
- En los dos casos, busca las **dudas reales** de la audiencia: qué confunde, qué sale
  mal en la práctica. De ahí salen los ganchos y los "tropiezos" de cada concepto.

## 3. Llena BRIEF.md

| Campo | Cómo |
|---|---|
| Tema | Una línea. |
| Audiencia | Quién es, qué sabe ya y qué le preocupa. Si no lo dijeron, supón "cualquier persona curiosa, sin conocimientos técnicos". |
| Promesa | Qué se lleva quien lo vea, en una frase concreta ("vas a saber pedirle a la IA lo que quieres"). |
| Conceptos | De 3 a 8 ideas, en orden. Cada una debe caber en una línea de "Quédate con esto". |
| Duración | Si no la dijeron: 1–2 min para un short, 6–10 min para YouTube. Calcula ≈ 70 s por concepto más 40 s de gancho y cierre. |
| Tono | El de la voz (`project.json → voice.instruct`). |
| Fuentes | Qué dato sale de qué archivo o enlace. |
| Restricciones | Lo que no se dice o no se muestra (marcas, cifras sin fuente, temas sensibles). |

Completa también `project.json`: `series` (la marca que se ve arriba a la derecha),
`language`, y en `voice` el proveedor y el perfil (pregunta cuál, si `fw doctor` dice
que el perfil no existe).

Si es vertical (TikTok, Reels, Shorts), pon `"canvas": { "width": 1080, "height": 1920, "fps": 30 }`
y avisa al usuario: el catálogo está diseñado para 16:9 y conviene revisar cada escena.

## 4. Pregunta solo lo que cambia el video

Si falta algo que no puedes deducir (audiencia muy distinta, duración, tono, idioma),
haz **una** ronda de preguntas cortas. Si no, propón el brief y sigue: el gate del
guion es donde el usuario corrige.

Siguiente: `prompts/01-guion.md`.
