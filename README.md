# video-generation-framework

Genera videos explicativos animados (motion graphics + voz) a partir de **un tema o
material de partida**. Tú le dices a tu agente de IA qué video quieres; el agente
investiga, escribe el guion, diseña cada escena, genera la voz, la sincroniza
palabra por palabra con la animación y renderiza un MP4 1920×1080 con
[HyperFrames](https://hyperframes.heygen.com).

Funciona con cualquier agente que pueda leer archivos y correr comandos: Claude
Code, Codex, opencode, Gemini CLI, Cursor… Las instrucciones para el agente están en
[`AGENTS.md`](./AGENTS.md) (`CLAUDE.md` y `GEMINI.md` apuntan ahí) y el trabajo
mecánico lo hace un CLI sin dependencias (`fw`).

> Ejemplo de lo que produce: `examples/que-saber-de-la-ia/` — un video de 9 minutos,
> 9 capítulos y 93 escenas sobre conceptos básicos de IA.

---

## 1. Requisitos

| Qué | Para qué | Cómo instalarlo |
|---|---|---|
| **Node.js ≥ 20** | el CLI `fw` y HyperFrames | <https://nodejs.org> o `nvm install 22` |
| **ffmpeg + ffprobe** | medir y procesar audio, verificar el MP4 | `sudo apt install ffmpeg` · `brew install ffmpeg` |
| **WhisperX** (Python 3.10–3.12) | saber en qué segundo se dice cada palabra | `pipx install whisperx` o `uv tool install whisperx` |
| **Google Chrome** | HyperFrames renderiza en Chrome headless | lo instala/encuentra HyperFrames; revisa con `npx hyperframes doctor` |
| **Una voz** (elige una) | la narración | ver abajo |
| **Un agente de IA** | escribir guion, storyboard y revisar | Claude Code, Codex, opencode, … |

HyperFrames no se instala: se ejecuta con `npx` en la versión fija del proyecto
(se descarga la primera vez).

### Voz: tres opciones

1. **Voicebox** (recomendado) — app local de clonación de voz
   ([github.com/jamiepine/voicebox](https://github.com/jamiepine/voicebox)). Ábrela,
   crea un perfil con tu voz y deja la app abierta mientras generas. El framework
   le habla por HTTP en `http://127.0.0.1:17493`.
2. **Cualquier TTS por línea de comandos** (Piper, ElevenLabs con un script, Gemini
   TTS, …): `"provider": "command"` con una plantilla.
3. **Audio que ya grabaste**: `"provider": "existing"`. El guion debe coincidir con lo
   que dice la grabación.

Detalle en [Configurar la voz](#5-configurar-la-voz).

### Verifica todo con un comando

```bash
npm run doctor
```

Dentro de un proyecto (`videos/<nombre>`), `npm run fw -- doctor` revisa además la
voz configurada (por ejemplo, que Voicebox esté abierto y el perfil exista).

---

## 2. Instalación

```bash
git clone <url-de-este-repo> video-generation-framework
cd video-generation-framework
npm run doctor
```

No hay `npm install`: el CLI no tiene dependencias.

---

## 3. Crear un video desde cero (con tu agente)

Abre tu agente **en la carpeta del repositorio** y pídele el video. Basta con el
tema; mientras más contexto des, mejor.

**Solo un tema:**

```text
Lee AGENTS.md y crea un video sobre cómo funciona el interés compuesto.
Audiencia: jóvenes que empiezan a ahorrar. Unos 5 minutos. Voz de Voicebox, perfil "mi voz 1".
```

**Con material de partida:**

```text
Lee AGENTS.md y convierte este artículo en un video explicativo: ./notas/articulo.md
Que lo entienda cualquier persona. Voz: perfil "mi voz 1" de Voicebox.
```

**Con un audio ya grabado:**

```text
Lee AGENTS.md. Tengo la narración grabada en ./audio/episodio1.wav.
Transcríbela, arma el guion con ese texto exacto y anima el video encima.
```

### Qué hace el agente y qué haces tú

| Etapa | El agente | Tú |
|---|---|---|
| 0. Brief | crea `videos/<nombre>`, guarda el material en `sources/`, investiga y llena `BRIEF.md` | responde si pregunta algo (audiencia, duración, voz) |
| 1. Guion + storyboard | escribe los capítulos: narración + escena de cada frase | — |
| 2. **Gate: guion** | te muestra el guion por capítulo | léelo; pide cambios o aprueba |
| 3. Vertical slice | genera voz y animación de **un** capítulo | míralo: ¿la voz, el ritmo y el estilo van bien? |
| 4. Producción | voz, alineación, build y revisión de capturas de todo el video | — |
| 5. **Gate: preview** | abre el preview en el navegador | míralo completo; pide cambios o aprueba |
| 6. Render | renderiza y verifica el MP4 | recoge `videos/<nombre>/renders/<episodio>.mp4` |

Para aprobar, dile al agente "aprobado" (él corre `npm run fw -- approve script` o
`approve preview`) o córrelo tú dentro del proyecto. El agente no debe aprobar por ti.

Si cambias una frase de la narración después de aprobar, la aprobación y la voz de
ese capítulo quedan invalidadas y `fw status` lo dice.

---

## 4. Comandos

Desde la raíz del repo:

```bash
npm run new -- <nombre>      # crea videos/<nombre> desde template/
npm run doctor               # requisitos
npm run catalog              # tipos de escena, iconos, personajes, transiciones
```

Dentro de `videos/<nombre>/`:

```bash
npm run fw -- status         # estado de cada etapa y el siguiente paso
npm run fw -- doctor         # requisitos + voz del proyecto
npm run fw -- validate       # guion y storyboard (y ritmo, si ya hay tiempos)
npm run fw -- voice [cap]    # genera la voz (todos o los capítulos que nombres)
npm run fw -- align [cap]    # WhisperX → tiempos por palabra alineados al guion
npm run fw -- build          # compositions/, index.html y STORYBOARD.md
npm run fw -- qa             # hyperframes check + una captura por escena en .fw/qa/
npm run dev                  # preview en el navegador (Studio de HyperFrames)
npm run fw -- approve script|preview
npm run fw -- render         # MP4 en renders/
npm run fw -- verify         # comprueba duración, resolución y fps del MP4
```

`[cap]` acepta el prefijo del capítulo: `npm run fw -- voice 01` genera solo
`01-…`. Agrega `--force` para regenerar aunque nada haya cambiado.

---

## 5. Configurar la voz

En `videos/<nombre>/project.json → voice`:

**Voicebox**

```json
"voice": {
  "provider": "voicebox",
  "url": "http://127.0.0.1:17493",
  "profile": "mi voz 1",
  "instruct": "Tono cercano, enérgico y curioso. Ritmo ágil."
}
```

`profile` acepta el nombre o el id. `instruct` (dirección de voz) solo se usa con
perfiles de motor qwen. `npm run fw -- doctor` lista los perfiles que existen.

**Cualquier TTS por comando**

```json
"voice": {
  "provider": "command",
  "command": "piper --model es_MX-claude-high.onnx --output_file {out} < {textFile}"
}
```

Marcadores: `{text}` (texto), `{textFile}` (archivo con el texto), `{out}` (WAV de
salida).

**Audio existente**

```json
"voice": {
  "provider": "existing",
  "files": { "01-intro": "sources/intro.wav", "02-tema": "sources/tema.mp3" }
}
```

---

## 6. Cómo funciona

Cada capítulo es un JSON con escenas. Una escena junta **lo que se dice** y **lo que
se ve**:

```json
{
  "vo": "Un buen prompt responde cuatro preguntas: qué quieres, para quién es, qué tono buscas y en qué formato.",
  "type": "steps",
  "title": "Un buen prompt dice…",
  "items": [
    { "text": "Qué quieres", "icon": "target", "cue": "quieres" },
    { "text": "Para quién", "icon": "user", "cue": "quién" },
    { "text": "Qué tono", "icon": "mic", "cue": "tono" },
    { "text": "Qué formato", "icon": "list", "cue": "formato" }
  ],
  "bg": "paper",
  "tr": "rise"
}
```

- `vo` — la narración; va a la voz tal cual.
- `type` — uno de los 26 tipos de escena del catálogo (chat, versus, pasos, tokens,
  ventana, perilla, predicción, red, personajes, la mascota Nodo, …).
- `cue` — la palabra de la narración en la que aparece cada elemento.
- `bg` / `tr` — fondo y transición de entrada (opcionales).

Luego:

1. `fw voice` genera el audio de cada capítulo.
2. `fw align` transcribe el audio con WhisperX y lo alinea con **tu** guion: una
   palabra mal reconocida no cambia el texto, solo el momento en que aparece.
3. `fw build` coloca cada escena donde la voz empieza a decirla y cada elemento
   donde la voz lo nombra, y escribe composiciones HyperFrames deterministas.
4. `fw render` produce el MP4 (≈ 2 minutos para un video de 9 minutos en un equipo
   de escritorio).

Si ningún tipo de escena del catálogo sirve, el agente escribe uno propio en
`videos/<nombre>/scenes/*.mjs` (`prompts/05-escena-a-medida.md`, `docs/scene-api.md`).

### Estilos

`project.json → style` elige el estilo (`styles/<id>/style.js`): colores, seis fondos,
tipografía, forma y ritmo. El incluido es `flat-explainer`. Para crear otro, pídeselo
al agente con una descripción o una imagen de referencia (`prompts/03-estilo.md`).

---

## 7. Estructura

```text
video-generation-framework/
  AGENTS.md            instrucciones para el agente (CLAUDE.md, GEMINI.md → aquí)
  README.md            este instructivo
  prompts/             guía por etapa: 00-brief, 01-guion, 02-storyboard, 03-estilo,
                       04-revision, 05-escena-a-medida
  docs/scene-api.md    API para escribir tipos de escena
  schemas/             contratos JSON de project.json y de los capítulos
  src/                 CLI fw
  kit/                 runtime de animación, CSS, arte e iconos, catálogo de escenas
  styles/              estilos visuales
  template/            esqueleto de un proyecto nuevo
  examples/            video de referencia (guion + storyboard, sin audio)
  videos/              tus proyectos (ignorados por git)

videos/<nombre>/
  project.json         voz, estilo, serie, episodio activo
  BRIEF.md             tema, audiencia, promesa, conceptos
  sources/             material de partida y notas de investigación
  episodes/<ep>/
    episode.json       título y orden de capítulos
    chapters/*.json    guion + storyboard (la fuente de verdad)
    timing/            tiempos por palabra (generado)
    STORYBOARD.md      tabla para revisar (generado)
    approvals.json     aprobaciones (generado)
  scenes/*.mjs         tipos de escena propios (opcional)
  assets/voice/        voz generada
  compositions/, index.html   generados por fw build
  renders/             MP4 final
```

---

## 8. Problemas comunes

| Síntoma | Arreglo |
|---|---|
| `Voicebox no responde` | abre la app Voicebox; revisa `voice.url` |
| `perfil "…" no existe` | `npm run fw -- doctor` lista los perfiles; corrige `voice.profile` |
| `whisperx falló` | prueba `whisperx --help`; si no está en el PATH, pon la ruta en `project.json → align.bin`. En CPU agrega `"align": { "device": "cpu", "computeType": "int8" }` |
| alineación < 85 % | la voz no dijo lo que dice el guion (palabra inventada, número leído distinto): escribe números en palabras y regenera ese capítulo |
| `faltan tiempos` | corre `fw voice <cap>` y `fw align <cap>` |
| escena muy larga / muy corta | `fw validate` la señala: divide la escena o junta frases |
| texto que aparece tarde | el `cue` está al final de la frase: usa una palabra anterior |
| el render falla por Chrome | `npx hyperframes doctor` |

---

## 9. Probar con el ejemplo

```bash
cp -r examples/que-saber-de-la-ia videos/
cd videos/que-saber-de-la-ia
# en project.json → voice.profile pon tu perfil de Voicebox
npm run fw -- doctor
npm run fw -- voice && npm run fw -- align && npm run fw -- build
npm run dev
```
