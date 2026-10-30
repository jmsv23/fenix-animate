# Escena a medida

Cuando ningún tipo del catálogo muestra la idea, escribe uno nuevo. Vive en
`<proyecto>/scenes/<nombre>.mjs` y aparece en `fw catalog` como `[proyecto]`. Si
sirve para otros videos, muévelo después a `kit/scenes/` del framework y expórtalo en `kit/scenes/index.mjs`.

```js
// <proyecto>/scenes/balanza.mjs
export const balanza = {
  doc: "Una balanza que se inclina hacia el lado que la voz nombra.",
  required: ["left", "right"],
  render(sc, x) {
    const tL = x.cue(sc.left.cue, 0.2);
    const tR = x.cue(sc.right.cue, 0.5);
    return `
      <div style="position:absolute;left:660px;top:300px;width:600px;height:20px;border-radius:10px;background:var(--fg);transform-origin:50% 50%"
           ${x.fx([{ at: tL + 0.3, dur: 0.8, to: { rotation: -12 }, ease: "back.out(2)" },
                   { at: tR + 0.3, dur: 0.8, to: { rotation: 12 }, ease: "back.out(2)" }])}></div>
      <div class="chip" style="position:absolute;left:560px;top:380px" ${x.a("pop", tL)}>${x.esc(sc.left.text)}</div>
      <div class="chip" style="position:absolute;left:1180px;top:380px" ${x.a("pop", tR)}>${x.esc(sc.right.text)}</div>`;
  },
};
```

Reglas:

- Coordenadas absolutas en un lienzo de 1920×1080. El contenido va dentro de 150 px
  de margen lateral; arriba deja libres los primeros 130 px (etiqueta y marca).
- Colores y fuentes solo con `var(--…)` y las clases del kit (`card`, `chip`,
  `headline`, `kicker`, `badge`, `mono`).
- Animación solo con `x.a`, `x.out`, `x.fx` y `x.count`: el runtime arma un
  timeline determinista. No uses `transform` en CSS sobre un elemento que también
  animas con `x.fx`/`x.a`: envuélvelo.
- Todos los tiempos salen de `x.cue(...)` o de `x.at(fracción)`; no hay segundos
  escritos a mano salvo pequeños desfases (`t + 0.3`).

API completa: `docs/scene-api.md`.
