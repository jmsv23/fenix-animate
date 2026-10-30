// Validation gates. `validateScript` needs only the chapter files (run it
// before spending time on voice). `validateTiming` also checks the rhythm
// against the real narration.

import { existsSync } from "node:fs";
import { ICONS, NODO_MOODS, PEOPLE } from "../../kit/art.mjs";
import { norm } from "./align.mjs";
import { readJson, timingFile } from "./project.mjs";
import { sceneWindows } from "./build.mjs";

const TRANSITIONS = ["whip", "cut", "zoom", "rise", "iris", "flood"];

function collectIcons(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => collectIcons(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (/icon$/i.test(k) && typeof v === "string") out.push(v);
      else collectIcons(v, out);
    }
  }
  return out;
}

function collectCues(value, out = []) {
  if (Array.isArray(value)) value.forEach((v) => collectCues(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (/^cue/i.test(k) && typeof v === "string") out.push(v);
      else if (/^cue/i.test(k) && Array.isArray(v)) v.forEach((c) => typeof c === "string" && out.push(c));
      else collectCues(v, out);
    }
  }
  return out;
}

export function validateScript(chapter, style, SCENES) {
  const errors = [];
  const warns = [];
  const where = (i) => `${chapter.id} · escena ${i + 1}`;
  if (!Array.isArray(chapter.scenes) || !chapter.scenes.length) errors.push(`${chapter.id}: no tiene escenas`);
  (chapter.scenes ?? []).forEach((sc, i) => {
    const arch = SCENES[sc.type];
    if (!sc.vo?.trim()) errors.push(`${where(i)}: falta "vo" (narración)`);
    if (!arch) return errors.push(`${where(i)}: tipo "${sc.type}" no existe`);
    for (const r of arch.required ?? []) if (sc[r] == null) errors.push(`${where(i)} (${sc.type}): falta "${r}"`);
    if (sc.bg && !style.grounds[sc.bg]) errors.push(`${where(i)}: bg "${sc.bg}" no existe (${Object.keys(style.grounds).join(", ")})`);
    if (sc.tr && !TRANSITIONS.includes(sc.tr)) errors.push(`${where(i)}: tr "${sc.tr}" no existe (${TRANSITIONS.join(", ")})`);
    for (const ic of collectIcons(sc)) if (!ICONS.includes(ic)) errors.push(`${where(i)}: icono "${ic}" no existe`);
    for (const m of [sc.mood, sc.mascot].filter(Boolean)) {
      if (sc.type === "persona") continue;
      if (!NODO_MOODS.includes(m)) errors.push(`${where(i)}: mood "${m}" no existe (${NODO_MOODS.join(", ")})`);
    }
    if (sc.type === "persona" && !PEOPLE[sc.who]) errors.push(`${where(i)}: personaje "${sc.who}" no existe (${Object.keys(PEOPLE).join(", ")})`);
    const vo = (sc.vo ?? "").split(/\s+/).map(norm);
    for (const c of collectCues(sc)) {
      const n = norm(c.split("#")[0]);
      if (!vo.some((w) => w === n || (n.length >= 3 && w.startsWith(n)))) warns.push(`${where(i)}: la palabra clave "${c}" no aparece en la narración`);
    }
    const voWords = (sc.vo ?? "").split(/\s+/).length;
    if (voWords > 42) warns.push(`${where(i)}: ${voWords} palabras de narración en una escena; divídela (≈ 12 s+)`);
    for (const k of ["text", "title"]) {
      const n = typeof sc[k] === "string" ? sc[k].split(/\s+/).length : 0;
      if (n > 12) warns.push(`${where(i)}: "${k}" tiene ${n} palabras; en pantalla, ≤ 10`);
    }
  });
  return { errors, warns };
}

export function validateTiming(episode, chapter, style, SCENES) {
  const errors = [];
  const warns = [];
  const tf = timingFile(episode, chapter);
  if (!existsSync(tf)) return { errors, warns: [`${chapter.id}: sin tiempos todavía`] };
  const timing = readJson(tf);
  if (timing.matched < 0.85) warns.push(`${chapter.id}: solo ${(timing.matched * 100).toFixed(0)} % de palabras alineadas — revisa la voz`);
  const r = style.rhythm ?? {};
  sceneWindows(chapter, timing, style, episode.gapSeconds ?? 0.35).forEach((w, i) => {
    const d = w.next - w.s;
    const tag = `${chapter.id} · escena ${i + 1} (${chapter.scenes[i].type})`;
    const arch = SCENES[chapter.scenes[i].type] ?? {};
    const extra = arch.builds ? 5 : 0;
    if (d > (r.sceneHardMax ?? 15) + extra) errors.push(`${tag}: dura ${d.toFixed(1)} s (máx ${(r.sceneHardMax ?? 15) + extra}); divídela`);
    else if (d > (r.sceneMax ?? 11) + extra) warns.push(`${tag}: dura ${d.toFixed(1)} s; considera dividirla`);
    if (d < (r.sceneMin ?? 2.5) && !arch.sting && i < chapter.scenes.length - 1) warns.push(`${tag}: dura solo ${d.toFixed(1)} s`);
  });
  return { errors, warns };
}
