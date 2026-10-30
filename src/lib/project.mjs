// Project / episode / chapter loading. Every path the framework touches is
// resolved from the project root (the directory holding project.json).

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const FRAMEWORK = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export class FwError extends Error {}

export function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new FwError(`no se pudo leer ${file}: ${error.message}`);
  }
}

export function writeJson(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function sha(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export function ffprobeDuration(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  const v = Number.parseFloat(r.stdout);
  return Number.isFinite(v) ? v : null;
}

export function loadProject(root = process.cwd()) {
  const file = join(root, "project.json");
  if (!existsSync(file)) throw new FwError(`no hay project.json en ${root}. Crea uno con: fw new <dir>`);
  const project = readJson(file);
  if (project.schemaVersion !== "2.0") throw new FwError(`project.json schemaVersion debe ser "2.0" (es ${project.schemaVersion})`);
  const canvas = { width: 1920, height: 1080, fps: 30, ...project.canvas };
  return { ...project, canvas, root };
}

// An episode is a directory with episode.json and chapters/*.json.
export function loadEpisode(project, episodeDir = project.activeEpisode) {
  if (!episodeDir) throw new FwError("project.json no declara activeEpisode");
  const dir = resolve(project.root, episodeDir);
  const meta = readJson(join(dir, "episode.json"));
  const chapterDir = join(dir, "chapters");
  const ids = meta.chapters ?? readdirSync(chapterDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const chapters = ids.map((id) => {
    const file = join(chapterDir, `${id}.json`);
    if (!existsSync(file)) throw new FwError(`episode.json lista el capítulo ${id} pero falta ${file}`);
    const chapter = readJson(file);
    if (chapter.id !== id) throw new FwError(`${file}: id "${chapter.id}" no coincide con el nombre del archivo`);
    return { ...chapter, file };
  });
  const id = meta.id ?? dir.split("/").pop();
  return {
    ...meta,
    id,
    dir,
    chapters,
    paths: {
      voice: join(project.root, "assets", "voice", id),
      timing: join(dir, "timing"),
      approvals: join(dir, "approvals.json"),
      storyboardMd: join(dir, "STORYBOARD.md"),
      compositions: join(project.root, "compositions"),
      index: join(project.root, "index.html"),
      qa: join(project.root, ".fw", "qa", id),
    },
  };
}

// The text sent to TTS: scene narration joined in order.
export function chapterScript(chapter) {
  return chapter.scenes.map((s) => s.vo.trim()).join(" ");
}

export function voiceFile(episode, chapter) {
  return join(episode.paths.voice, `${chapter.id}.wav`);
}

export function timingFile(episode, chapter) {
  return join(episode.paths.timing, `${chapter.id}.json`);
}

export function readApprovals(episode) {
  return existsSync(episode.paths.approvals) ? readJson(episode.paths.approvals) : {};
}
