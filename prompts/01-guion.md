# Etapa 1 — Guion para video

Entrada: un tema, un texto, notas o un guion de otro formato (podcast, artículo).
Salida: la narración de cada escena (`vo`) dentro de `chapters/*.json`. Esta
etapa y la siguiente se escriben juntas: la narración ya va partida en escenas.

## Un guion para video no es un guion de podcast

Un guion de audio se sostiene solo con la voz; uno de video se apoya en lo que se
ve. Reescribe, no recortes:

- **Frases cortas.** Una idea por frase, de 6 a 14 palabras. La pantalla carga el detalle.
- **Gancho en los primeros 5 segundos.** Abre con una situación que el espectador
  ya vivió o una pregunta que se haría ("¿Alguna vez…?"). Nada de "Hola, bienvenidos".
- **Una promesa clara** antes del segundo 30: qué se va a llevar.
- **Cada concepto con el mismo arco**, para que el espectador aprenda el patrón:
  1. tropiezo cotidiano (lo que sale mal);
  2. la idea que lo explica, con **una** analogía de la vida diaria;
  3. qué hacer distinto (consejo práctico);
  4. "Quédate con esto": la idea en una línea.
- **Un puente al siguiente concepto** en lugar de cerrar en seco.
- **Lenguaje de cualquier persona.** Si un término técnico es inevitable, se dice y
  se traduce en la misma frase ("prompt, que significa instrucción").
- **Nada de datos inventados.** Si una cifra no viene de la fuente, márcala en
  pantalla como ilustrativa o no la uses.
- **Escrito para leerse en voz alta**: números en palabras ("cinco años"), siglas
  que el TTS pronuncia bien (prueba una frase antes), sin paréntesis largos.

## Medidas

- La voz de este proyecto corre a ≈ 2,9 palabras por segundo (mídelo con
  `fw voice` en un capítulo y ajusta).
- Escena: de 8 a 30 palabras de narración (3–10 s).
- Concepto: de 150 a 230 palabras (≈ 60–80 s). Episodio: lo que pida el brief; para
  YouTube, de 8 a 12 minutos funciona bien con 6–8 conceptos.

## Lista antes de pasar al storyboard

- [ ] ¿El gancho funciona sin contexto previo?
- [ ] ¿Cada concepto tiene tropiezo, analogía, consejo y "quédate con esto"?
- [ ] ¿Alguien de 14 años o de 70 entiende cada frase sin pausar?
- [ ] ¿Se puede quitar alguna frase sin perder nada? Quítala.
