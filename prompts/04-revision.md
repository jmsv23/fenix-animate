# Etapa 4 — Revisión (antes de mostrar el preview)

`npm run fw -- qa` corre `hyperframes check` y saca una captura por escena al
~72 % de su duración (`.fw/qa/<ep>/<capítulo>/contact-sheet-*.jpg`). Mira **todas**
las hojas. Una revisión que solo lee el resultado de `check` no vale.

## En cada captura

- [ ] **Se lee.** Ningún texto tapado, cortado, encimado con otro o del mismo color que
      su fondo (camisa azul sobre fondo azul, barras del color del fondo).
- [ ] **Está completa.** Al 72 % de la escena ya debería verse lo principal. Si falta,
      la palabra clave (`cue`) llega tarde: usa una palabra anterior de la narración.
- [ ] **Explica.** Sin audio, ¿se entiende de qué trata la escena?
- [ ] **No choca con la etiqueta del capítulo** (arriba a la izquierda) ni con la marca
      de la serie (arriba a la derecha).

## En el capítulo completo

- [ ] Fondos alternados; nunca tres escenas seguidas con el mismo fondo.
- [ ] Tipos variados; nunca el mismo tipo tres veces seguidas.
- [ ] Hay al menos un personaje o una reacción de Nodo por concepto.
- [ ] Cierra con `takeaway`.

## En el render o el preview

- [ ] Transiciones sin flashes ni frames vacíos entre capítulos.
- [ ] Lo que aparece coincide con lo que se dice (ni antes de tiempo ni tarde).
- [ ] Volumen parejo entre capítulos.

Corrige en `chapters/*.json` (o en el tipo de escena si el problema es del kit),
`fw build`, `fw qa` y vuelve a mirar. Cuando un problema venga del kit, arréglalo en
el kit: así lo heredan todos los proyectos.
