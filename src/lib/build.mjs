// Build stage: chapters + timing + style → compositions/<chapter>.html and
// index.html. Deterministic: same inputs, byte-identical output.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { FRAMEWORK, FwError, readJson, timingFile } from "./project.mjs";
import { norm } from "./align.mjs";
import { loadScenes } from "../../kit/scenes/index.mjs";
import { BASE_CSS, tokensCss } from "../../kit/css.mjs";
import { confetti, icon, nodo, person } from "../../kit/art.mjs";

const RUNTIME = readFileSync(join(FRAMEWORK, "kit", "runtime.js"), "utf8");
const DEFAULT_TR = ["whip", "cut", "zoom", "rise", "cut", "iris"];
const SLOTS = [[70, 200], [1820, 210], [60, 930], [1830, 960], [900, 40], [1000, 1000], [1810, 570], [36, 560], [420, 990], [1450, 40], [640, 60], [1480, 1000]];

export const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrJson = (v) => JSON.stringify(v).replace(/&/g, "&amp;").replace(/'/g, "&#39;");
const r3 = (n) => Number(n.toFixed(3));

export async function loadStyle(project) {
  const local = join(project.root, "styles", project.style, "style.js");
  const shared = join(FRAMEWORK, "styles", project.style, "style.js");
  const file = existsSync(local) ? local : shared;
  if (!existsSync(file)) throw new FwError(`no existe el estilo "${project.style}" (busqué ${local} y ${shared})`);
  return (await import(pathToFileURL(file).href)).default;
}

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Scene windows from word timing: a scene starts just before its first word.
export function sceneWindows(chapter, timing, style, gap) {
  const lead = style.rhythm?.lead ?? 0.12;
  const end = timing.duration + gap;
  const starts = chapter.scenes.map((_, i) => (i === 0 ? 0 : Math.max(0, timing.scenes[i].start - lead)));
  return starts.map((s, i) => ({ s: r3(s), next: r3(i + 1 < starts.length ? starts[i + 1] : end), end: r3(end) }));
}

function blinkFx(s, next) {
  const fx = [];
  for (let t = s + 1.3; t < next - 0.4; t += 2.9) fx.push({ at: r3(t), dur: 0.07, to: { scaleY: 0.1, transformOrigin: "50% 50%" }, ease: "power1.in" }, { at: r3(t + 0.07), dur: 0.1, to: { scaleY: 1, transformOrigin: "50% 50%" }, ease: "power1.out" });
  return fx;
}

function makeCtx({ chapter, ci, si, win, timing, ground, warn, style }) {
  const scene = chapter.scenes[si];
  const words = timing.words.filter((w) => w.scene === si);
  const s = win.s;
  const next = win.next;
  const dur = next - s;
  const clamp = (t) => r3(Math.min(Math.max(t, s + 0.2), Math.max(s + 0.2, next - 0.45)));
  const at = (frac) => clamp(s + 0.2 + frac * (dur - 0.2));
  const cue = (word, frac = 0.3) => {
    if (word == null) return at(frac);
    const [w, occ = "1"] = String(word).split("#");
    const n = norm(w);
    const hits = words.filter((x) => x.n === n || (n.length >= 3 && x.n.startsWith(n)));
    const hit = hits[Number(occ) - 1];
    if (!hit) {
      warn(`escena ${si + 1} (${scene.type}): la palabra clave "${word}" no está en la narración`);
      return at(frac);
    }
    return clamp(hit.start - 0.2);
  };
  const a = (preset, t, extra = {}) => `data-in="${preset}" data-at="${r3(t)}"${Object.entries(extra).map(([k, v]) => ` data-${k}="${esc(v)}"`).join("")}`;
  const out = (preset, t) => `data-out="${preset}" data-out-at="${r3(t)}"`;
  const fx = (list) => (list.length ? `data-fx='${attrJson(list.map((k) => ({ ...k, at: r3(k.at) })))}'` : "");
  const count = (c) => `data-count='${attrJson({ ...c, at: r3(c.at) })}'`;

  // Display words revealed when the voice says them.
  const wordsHtml = (text, em = [], { min = s + 0.25, step = 0.1 } = {}) => {
    const tokens = String(text).split(/\s+/).filter(Boolean);
    const emIdx = new Set();
    for (const phrase of em) {
      const p = String(phrase).split(/\s+/).map(norm);
      for (let i = 0; i + p.length <= tokens.length; i++) {
        if (p.every((pw, k) => norm(tokens[i + k]) === pw)) p.forEach((_, k) => emIdx.add(i + k));
      }
    }
    let j = 0;
    let prev = null;
    const times = tokens.map((tok) => {
      const n = norm(tok);
      let t = null;
      for (let k = j; k < Math.min(words.length, j + 8) && n; k++) {
        if (words[k].n === n || (n.length >= 4 && words[k].n.startsWith(n.slice(0, 4)))) {
          t = words[k].start - 0.12;
          j = k + 1;
          break;
        }
      }
      if (t == null) t = prev == null ? min : prev + step;
      t = Math.max(t, min, prev == null ? min : prev + 0.06);
      prev = t;
      return t;
    });
    // Land the whole line early enough to be read: past ~50 % of the scene,
    // compress the reveal toward the start (keeps the spoken order).
    const latest = Math.max(min + 0.1, s + dur * 0.5);
    const first = times[0];
    const last = times[times.length - 1];
    if (last > latest && last > first) {
      const k = (latest - first) / (last - first);
      for (let i = 0; i < times.length; i++) times[i] = first + (times[i] - first) * k;
    }
    return tokens.map((tok, i) => {
      const t = times[i];
      const isEm = emIdx.has(i);
      return `<span class="w${isEm ? " em" : ""}" ${a("word", t)}>${isEm ? `<span class="mk" ${a("grow", t + 0.06, { dur: 0.26 })}></span>` : ""}${esc(tok)}</span>`;
    }).join(" ");
  };

  const blink = (svg, cls) => svg.replace(`class="${cls}"`, `class="${cls}" ${fx(blinkFx(s, next))}`);
  return {
    sid: `ch${String(ci).padStart(2, "0")}-s${String(si + 1).padStart(2, "0")}`,
    s, next, dur, ground, style,
    at, cue, a, out, fx, count, esc,
    words: wordsHtml,
    typed: (text) => [...String(text)].map((c) => (c === " " ? " " : `<span class="ch">${esc(c)}</span>`)).join(""),
    icon: (name, size = 64) => icon(name, { size }),
    badge: (name, tone, size) => `<div class="badge t-${tone}" style="width:${size}px;height:${size}px">${icon(name, { size: Math.round(size * 0.56) })}</div>`,
    nodo: (mood, size = 360) => blink(nodo(mood, { size }), "nodo-eyes"),
    person: (preset, mood = "neutral", scale = 1) => blink(person(preset, { mood }).replace('width="300" height="425"', `width="${Math.round(300 * scale)}" height="${Math.round(425 * scale)}"`), "person-eyes"),
  };
}

function decor(ctx, seed, palette, colors) {
  const rand = rng(seed);
  const slots = SLOTS.map((p, i) => [rand(), p, i]).sort((a, b) => a[0] - b[0]).slice(0, 5);
  const kinds = ["ring", "zig", "tri", "sq", "dot", "arc"];
  const pieces = slots.map(([, [x, y]], k) => {
    const color = colors[palette[k % palette.length]] ?? palette[k % palette.length];
    const dy = (rand() > 0.5 ? 1 : -1) * (12 + rand() * 14);
    const rot = (rand() > 0.5 ? 1 : -1) * (15 + rand() * 25);
    return `<div class="cf" style="left:${x - 28}px;top:${y - 28}px" ${ctx.a("pop", ctx.s + 0.25 + k * 0.06)}><div ${ctx.fx([{ at: ctx.s + 0.6, dur: Math.max(1, ctx.dur), to: { y: dy, rotation: rot }, ease: "sine.inOut" }])}>${confetti(kinds[Math.floor(rand() * kinds.length)], color)}</div></div>`;
  });
  const big = rand() > 0.5 ? `left:-260px;bottom:-320px` : `right:-240px;top:-300px`;
  return `<div class="decor" data-layout-ignore><div class="bgshape" style="${big};width:760px;height:760px"></div>${pieces.join("")}</div>`;
}

export function buildChapter({ project, episode, chapter, ci, style, scenes }) {
  const tf = timingFile(episode, chapter);
  if (!existsSync(tf)) throw new FwError(`${chapter.id}: faltan tiempos. Corre: fw align ${chapter.id}`);
  const timing = readJson(tf);
  const gap = episode.gapSeconds ?? 0.35;
  const wins = sceneWindows(chapter, timing, style, gap);
  const warnings = [];
  const compId = `ch${chapter.id.replace(/[^a-z0-9]+/gi, "-")}`;
  const overlap = style.rhythm?.overlap ?? 0.6;
  const trs = chapter.scenes.map((sc, i) => (i === 0 ? "cut" : sc.tr ?? DEFAULT_TR[(i + ci) % DEFAULT_TR.length]));

  const sections = chapter.scenes.map((sc, si) => {
    const arch = scenes[sc.type];
    if (!arch) throw new FwError(`${chapter.id} escena ${si + 1}: tipo "${sc.type}" no existe. Tipos: ${Object.keys(scenes).join(", ")}`);
    const ground = sc.bg ?? arch.ground ?? "paper";
    const win = wins[si];
    const ctx = makeCtx({ chapter, ci, si, win, timing, ground, style, warn: (m) => warnings.push(m) });
    const body = arch.render(sc, ctx);
    const g = style.grounds[ground] ?? style.grounds.paper;
    const isLast = si === chapter.scenes.length - 1;
    const clipEnd = isLast ? win.end : Math.min(win.end, win.next + overlap);
    const tin = trs[si];
    const tout = isLast ? "" : trs[si + 1];
    const rand = rng(ci * 97 + si * 13 + 5);
    return `<section id="${ctx.sid}" class="clip kit-scene g-${ground}" data-start="${win.s}" data-duration="${r3(clipEnd - win.s)}" data-track-index="1" style="z-index:${si + 1}" data-s="${win.s}" data-next="${win.next}" data-tin="${tin}" data-tout="${tout}" data-iris="${Math.round(30 + rand() * 40)}% ${Math.round(35 + rand() * 30)}%" data-scene-type="${sc.type}">
  <div class="stage">${decor(ctx, ci * 1000 + si, g.confetti, style.colors)}${body}</div>${tin === "flood" ? `<div class="tr-bar" data-layout-ignore></div>` : ""}
</section>`;
  });

  const duration = r3(timing.duration + gap);
  const hudAt = chapter.scenes.length > 1 && chapter.scenes[0].type === "chapter" ? wins[1].s + 0.3 : 0.4;
  const hud = `<div class="hud" data-layout-ignore>
  ${chapter.chip ? `<div class="hud-chip" data-in="left" data-at="${r3(hudAt)}">${esc(chapter.chip)}</div>` : ""}
  ${project.series ? `<div class="hud-mark" data-in="blur" data-at="${r3(hudAt + 0.2)}">${esc(project.series.toUpperCase())}</div>` : ""}
</div>`;

  const html = `<!doctype html>
<html lang="${project.language ?? "es"}"><head><meta charset="UTF-8"><title>${esc(chapter.title ?? chapter.id)}</title></head><body><template>
<style>
${tokensCss(style)}
${BASE_CSS}
</style>
<div id="root" data-composition-id="${compId}" data-width="${project.canvas.width}" data-height="${project.canvas.height}" data-duration="${duration}">
${sections.join("\n")}
${hud}
</div>
<script>
${RUNTIME.replace("__ID__", compId)}
</script>
</template></body></html>
`;
  return { compId, html, duration, voiceDuration: timing.duration, wins, warnings };
}

export async function buildEpisode(project, episode) {
  const style = await loadStyle(project);
  const scenes = await loadScenes(project.root);
  const dir = episode.paths.compositions;
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.startsWith("ch") && f.endsWith(".html")) rmSync(join(dir, f));
  let cursor = 0;
  const hosts = [];
  const audio = [];
  const report = [];
  const skipped = [];
  episode.chapters.forEach((chapter, ci) => {
    // Chapters without timing yet are left out, so one chapter can be built and
    // reviewed (vertical slice) before the rest has voice.
    if (!existsSync(timingFile(episode, chapter))) return skipped.push(chapter.id);
    const b = buildChapter({ project, episode, chapter, ci, style, scenes });
    writeFileSync(join(dir, `${b.compId}.html`), b.html);
    hosts.push(`<div id="${b.compId}" data-composition-id="${b.compId}" data-composition-src="compositions/${b.compId}.html" data-start="${r3(cursor)}" data-duration="${b.duration}" data-track-index="1" data-track-kind="graphics" data-width="${project.canvas.width}" data-height="${project.canvas.height}"></div>`);
    audio.push(`<audio id="vo-${b.compId}" src="assets/voice/${episode.id}/${chapter.id}.wav" data-start="${r3(cursor)}" data-duration="${r3(b.voiceDuration)}" data-track-index="20" data-volume="1"></audio>`);
    report.push({ chapter: chapter.id, start: r3(cursor), duration: b.duration, scenes: b.wins.length, warnings: b.warnings, wins: b.wins });
    cursor += b.duration;
  });
  if (!report.length) throw new FwError("ningún capítulo tiene tiempos todavía. Corre: fw voice <cap> y fw align <cap>");
  const total = r3(cursor);
  const paper = style.colors.paper;
  writeFileSync(episode.paths.index, `<!doctype html>
<html lang="${project.language ?? "es"}" data-resolution="landscape"><head><meta charset="UTF-8"><meta name="viewport" content="width=${project.canvas.width},height=${project.canvas.height}"><title>${esc(episode.title ?? episode.id)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>html,body{margin:0;width:${project.canvas.width}px;height:${project.canvas.height}px;overflow:hidden;background:${paper}}#main{position:relative;width:100%;height:100%;overflow:hidden}#main-bg{position:absolute;inset:0;background:${paper}}</style></head>
<body><div id="main" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${project.canvas.width}" data-height="${project.canvas.height}" data-fps="${project.canvas.fps}">
<div id="main-bg"></div>
${hosts.join("\n")}
${audio.join("\n")}
</div>
<script>window.__timelines = window.__timelines || {}; window.__timelines["main"] = gsap.timeline({ paused: true });</script>
</body></html>
`);
  return { total, report, skipped };
}
