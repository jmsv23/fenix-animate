// Align stage: transcribe each chapter's voice with WhisperX, then align the
// recognised words to the *script* words (LCS over normalised tokens). The
// script stays the source of truth for spelling; WhisperX only lends timing.
// Output: episodes/<ep>/timing/<chapter>.json
//   { duration, words: [{ w, n, scene, start, end, matched }], scenes: [{ start, end }] }

import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FwError, ffprobeDuration, readJson, timingFile, voiceFile, writeJson } from "./project.mjs";

export function norm(word) {
  return String(word)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ%]/g, "");
}

function similar(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4)))) return true;
  return false;
}

function transcribe(project, wav) {
  const out = mkdtempSync(join(tmpdir(), "fw-align-"));
  const a = project.align ?? {};
  const args = [wav, "--model", a.model ?? "small", "--language", project.language ?? "es", "--output_format", "json", "--output_dir", out];
  if (a.device) args.push("--device", a.device);
  if (a.computeType) args.push("--compute_type", a.computeType);
  const r = spawnSync(a.bin ?? "whisperx", args, { encoding: "utf8" });
  const file = join(out, wav.split("/").pop().replace(/\.[^.]+$/, ".json"));
  if (r.status !== 0 || !existsSync(file)) throw new FwError(`whisperx falló con ${wav}:\n${(r.stderr ?? "").slice(-800)}`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  rmSync(out, { recursive: true, force: true });
  const words = [];
  for (const seg of json.segments ?? []) {
    for (const w of seg.words ?? []) {
      if (Number.isFinite(w.start)) words.push({ n: norm(w.word), start: w.start, end: w.end ?? w.start + 0.2 });
    }
  }
  return words.filter((w) => w.n);
}

function lcsAlign(script, heard) {
  const n = script.length;
  const m = heard.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = similar(script[i].n, heard[j].n) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (similar(script[i].n, heard[j].n) && dp[i][j] === dp[i + 1][j + 1] + 1) {
      script[i].start = heard[j].start;
      script[i].end = heard[j].end;
      script[i].matched = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
}

function interpolate(words, duration) {
  for (let i = 0; i < words.length; i++) {
    if (words[i].matched) continue;
    let a = i - 1;
    while (a >= 0 && !words[a].matched) a--;
    let b = i + 1;
    while (b < words.length && !words[b].matched) b++;
    const t0 = a >= 0 ? words[a].end : 0;
    const t1 = b < words.length ? words[b].start : duration;
    const span = b - a;
    words[i].start = t0 + ((t1 - t0) * (i - a - 0.5)) / span;
    words[i].end = Math.min(t1, words[i].start + 0.25);
  }
}

export function alignChapter(project, episode, chapter) {
  const wav = voiceFile(episode, chapter);
  if (!existsSync(wav)) throw new FwError(`${chapter.id}: falta la voz (${wav}). Corre: fw voice ${chapter.id}`);
  const duration = ffprobeDuration(wav);
  const words = [];
  chapter.scenes.forEach((scene, si) => {
    for (const w of scene.vo.trim().split(/\s+/)) {
      const n = norm(w);
      if (n) words.push({ w, n, scene: si, start: null, end: null, matched: false });
    }
  });
  lcsAlign(words, transcribe(project, wav));
  interpolate(words, duration);
  const scenes = chapter.scenes.map((_, si) => {
    const own = words.filter((w) => w.scene === si);
    return { start: own[0].start, end: own[own.length - 1].end };
  });
  const matched = words.filter((w) => w.matched).length / words.length;
  const out = timingFile(episode, chapter);
  writeJson(out, { chapter: chapter.id, duration, matched: Number(matched.toFixed(3)), words: words.map((w) => ({ ...w, start: +w.start.toFixed(3), end: +w.end.toFixed(3) })), scenes });
  return { out, matched, duration };
}

export function timingState(episode, chapter) {
  const file = timingFile(episode, chapter);
  const wav = voiceFile(episode, chapter);
  if (!existsSync(file)) return "missing";
  if (existsSync(wav) && statSync(wav).mtimeMs > statSync(file).mtimeMs) return "stale";
  const t = readJson(file);
  const count = chapter.scenes.reduce((n, s) => n + s.vo.trim().split(/\s+/).filter((w) => norm(w)).length, 0);
  return t.words.length === count ? "ok" : "stale";
}

export function alignChapters(project, episode, chapters, { force = false } = {}) {
  for (const chapter of chapters) {
    if (!force && timingState(episode, chapter) === "ok") {
      console.log(`= ${chapter.id}: tiempos al día`);
      continue;
    }
    const { matched, duration } = alignChapter(project, episode, chapter);
    const flag = matched < 0.85 ? "  ⚠ revisa la voz: muchas palabras no coinciden con el guion" : "";
    console.log(`✓ ${chapter.id}: ${duration.toFixed(1)} s · ${(matched * 100).toFixed(0)} % palabras alineadas${flag}`);
  }
}
