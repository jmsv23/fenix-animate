// Voice stage. Providers:
//   voicebox  local Voicebox app over HTTP (profile by name or id)
//   command   any CLI: "voice.command" gets {text} {textFile} {out} placeholders
//   existing  pre-recorded audio: "voice.files": { "<chapter-id>": "path/to/file" }
// Each output gets <chapter>.meta.json with a hash of the narration + voice
// settings, so `fw status` can tell when the script changed after recording.

import { copyFileSync, existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { FwError, chapterScript, ffprobeDuration, readJson, sha, voiceFile, writeJson } from "./project.mjs";

export function voiceSignature(project, chapter) {
  const v = project.voice ?? {};
  const instruct = chapter.voice?.instruct ?? v.instruct ?? "";
  return sha(JSON.stringify([chapterScript(chapter), v.provider, v.profile, instruct, v.speed ?? 1]));
}

export function voiceState(project, episode, chapter) {
  const wav = voiceFile(episode, chapter);
  const metaFile = wav.replace(/\.wav$/, ".meta.json");
  if (!existsSync(wav) || !existsSync(metaFile)) return { state: "missing", wav };
  const meta = readJson(metaFile);
  return { state: meta.sha === voiceSignature(project, chapter) ? "ok" : "stale", wav, meta };
}

async function voicebox(project, chapter, out) {
  const v = project.voice;
  const base = (v.url ?? "http://127.0.0.1:17493").replace(/\/$/, "");
  const call = async (method, path, body, raw = false) => {
    let res;
    try {
      res = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    } catch {
      throw new FwError(`Voicebox no responde en ${base}. ¿Está abierta la app?`);
    }
    if (!res.ok) throw new FwError(`Voicebox ${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return raw ? Buffer.from(await res.arrayBuffer()) : res.json();
  };
  const profiles = await call("GET", "/profiles");
  const profile = profiles.find((p) => p.name === v.profile || p.id === v.profile);
  if (!profile) throw new FwError(`perfil "${v.profile}" no existe en Voicebox. Hay: ${profiles.map((p) => p.name).join(", ")}`);
  const engine = profile.default_engine ?? profile.preset_engine ?? "";
  const body = {
    profile_id: profile.id,
    text: chapterScript(chapter),
    language: project.language ?? "es",
    personality: false,
    normalize: v.normalize ?? true,
    max_chunk_chars: v.maxChunkChars ?? 800,
    crossfade_ms: v.crossfadeMs ?? 50,
  };
  const instruct = chapter.voice?.instruct ?? v.instruct;
  if (instruct && engine.startsWith("qwen")) body.instruct = instruct.slice(0, 500);
  const t0 = Date.now();
  let gen = await call("POST", "/generate", body);
  while (!["completed", "failed", "error", "cancelled"].includes(gen.status)) {
    if (Date.now() - t0 > (v.timeoutSeconds ?? 1200) * 1000) throw new FwError(`${chapter.id}: Voicebox tardó demasiado`);
    await new Promise((r) => setTimeout(r, 1000));
    gen = await call("GET", `/history/${gen.id}`);
  }
  if (gen.status !== "completed") throw new FwError(`${chapter.id}: Voicebox falló: ${gen.error ?? gen.status}`);
  writeFileSync(out, await call("GET", `/audio/${gen.id}`, null, true));
  return { profile: profile.name, engine, generationId: gen.id };
}

function command(project, chapter, out) {
  const tmpText = `${out}.txt`;
  writeFileSync(tmpText, chapterScript(chapter));
  const cmd = project.voice.command
    .replaceAll("{textFile}", JSON.stringify(tmpText))
    .replaceAll("{out}", JSON.stringify(out))
    .replaceAll("{text}", JSON.stringify(chapterScript(chapter)));
  const r = spawnSync("sh", ["-c", cmd], { stdio: "inherit" });
  if (r.status !== 0 || !existsSync(out)) throw new FwError(`${chapter.id}: el comando de voz falló`);
  return { command: project.voice.command };
}

function existing(project, chapter, out) {
  const src = project.voice.files?.[chapter.id];
  if (!src) throw new FwError(`voice.files no tiene audio para ${chapter.id}`);
  const abs = resolve(project.root, src);
  if (!existsSync(abs)) throw new FwError(`${chapter.id}: no existe ${abs}`);
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", abs, "-ar", "48000", out]);
  if (r.status !== 0) copyFileSync(abs, out);
  return { source: src };
}

export async function generateVoice(project, episode, chapters, { force = false } = {}) {
  const provider = project.voice?.provider;
  if (!provider) throw new FwError("project.json no tiene bloque voice.provider");
  for (const chapter of chapters) {
    const st = voiceState(project, episode, chapter);
    if (st.state === "ok" && !force) {
      console.log(`= ${chapter.id}: voz al día (${st.meta.duration.toFixed(1)} s)`);
      continue;
    }
    const out = voiceFile(episode, chapter);
    mkdirSync(dirname(out), { recursive: true });
    const tmp = out.replace(/\.wav$/, ".tmp.wav");
    const t0 = Date.now();
    const info = provider === "voicebox" ? await voicebox(project, chapter, tmp) : provider === "command" ? command(project, chapter, tmp) : existing(project, chapter, tmp);
    const speed = project.voice.speed ?? 1;
    if (Math.abs(speed - 1) > 1e-3) {
      spawnSync("ffmpeg", ["-v", "error", "-y", "-i", tmp, "-filter:a", `atempo=${speed}`, out]);
    } else {
      renameSync(tmp, out);
    }
    const duration = ffprobeDuration(out);
    const words = chapterScript(chapter).split(/\s+/).length;
    writeJson(out.replace(/\.wav$/, ".meta.json"), {
      sha: voiceSignature(project, chapter),
      provider,
      ...info,
      duration,
      words,
      wordsPerSecond: Number((words / duration).toFixed(2)),
      seconds: Math.round((Date.now() - t0) / 1000),
    });
    console.log(`✓ ${chapter.id}: ${duration.toFixed(1)} s · ${words} palabras · ${(words / duration).toFixed(2)} pal/s`);
  }
}
