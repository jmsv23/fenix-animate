#!/usr/bin/env node
// fw — YouTube explainer framework CLI. Deterministic steps only; creative
// steps (script, storyboard, custom scenes) are done by the agent following
// prompts/*.md, then checked here.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, join, relative, resolve, sep } from "node:path";
import { FRAMEWORK, FwError, ffprobeDuration, loadEpisode, loadProject, readApprovals, readJson, sha, writeJson } from "./lib/project.mjs";
import { generateVoice, voiceState } from "./lib/voice.mjs";
import { alignChapters, timingState } from "./lib/align.mjs";
import { buildEpisode, loadStyle, sceneWindows } from "./lib/build.mjs";
import { validateScript, validateTiming } from "./lib/validate.mjs";
import { loadScenes } from "../kit/scenes/index.mjs";
import { ICONS, NODO_MOODS, PEOPLE } from "../kit/art.mjs";

const [cmd = "help", ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith("--")));
const args = rest.filter((a) => !a.startsWith("--"));

const HELP = `fw <comando> [capítulos…] [--force]

  new <nombre>     crea videos/<nombre> desde template/ (o la ruta que pases)
  doctor           revisa los requisitos (node, ffmpeg, whisperx, voz, HyperFrames)
  status          estado de cada etapa y el siguiente paso
  catalog          tipos de escena, iconos, personajes y moods disponibles
  validate         revisa guion/storyboard (y ritmo si ya hay tiempos)
  voice            genera la voz (voicebox | command | existing)
  align            WhisperX → tiempos por palabra alineados al guion
  build            genera compositions/, index.html y STORYBOARD.md
  qa               hyperframes check + capturas por escena en .fw/qa/
  approve <etapa>  registra aprobación humana (script | preview)
  render           render final con HyperFrames
  verify           compara el MP4 con lo esperado (duración, tamaño, fps)`;

function chaptersFrom(episode) {
  return args.length ? episode.chapters.filter((c) => args.some((a) => c.id.startsWith(a))) : episode.chapters;
}

function hf(project, hfArgs, opts = {}) {
  const v = project.hyperframes ? `hyperframes@${project.hyperframes}` : "hyperframes";
  return spawnSync("npx", ["--yes", v, ...hfArgs], { cwd: project.root, stdio: opts.capture ? "pipe" : "inherit", encoding: "utf8" });
}

function scriptHash(episode) {
  return sha(JSON.stringify(episode.chapters.map((c) => c.scenes)));
}

async function storyboardMd(project, episode, SCENES) {
  const style = await loadStyle(project);
  const out = [`# Storyboard — ${episode.title ?? episode.id}`, "", "> Generado por `fw build` desde `chapters/*.json`. No lo edites a mano: edita los capítulos.", ""];
  let cursor = 0;
  for (const ch of episode.chapters) {
    const tf = join(episode.paths.timing, `${ch.id}.json`);
    const timing = existsSync(tf) ? readJson(tf) : null;
    const wins = timing ? sceneWindows(ch, timing, style, episode.gapSeconds ?? 0.35) : null;
    out.push(`## ${ch.title ?? ch.id}${timing ? ` · ${fmt(cursor)}–${fmt(cursor + timing.duration)}` : ""}`, "", "| # | t | dura | tipo | fondo | narración |", "|---|---|---|---|---|---|");
    ch.scenes.forEach((sc, i) => {
      const w = wins?.[i];
      out.push(`| ${i + 1} | ${w ? fmt(cursor + w.s) : "—"} | ${w ? `${(w.next - w.s).toFixed(1)} s` : "—"} | ${sc.type} | ${sc.bg ?? SCENES[sc.type]?.ground ?? "paper"} | ${sc.vo.replace(/\|/g, "/")} |`);
    });
    out.push("");
    if (timing) cursor += timing.duration + (episode.gapSeconds ?? 0.35);
  }
  writeFileSync(episode.paths.storyboardMd, `${out.join("\n")}\n`);
}

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

async function status(project, episode, SCENES) {
  const style = await loadStyle(project);
  const approvals = readApprovals(episode);
  console.log(`Proyecto ${project.projectId} · episodio ${episode.id} · estilo ${project.style}\n`);
  let next = null;
  let total = 0;
  let errorsN = 0;
  for (const ch of episode.chapters) {
    const v = validateScript(ch, style, SCENES);
    errorsN += v.errors.length;
    const vs = voiceState(project, episode, ch);
    const ts = timingState(episode, ch);
    if (vs.meta?.duration) total += vs.meta.duration;
    console.log(`  ${ch.id.padEnd(20)} escenas ${String(ch.scenes.length).padStart(2)} · guion ${v.errors.length ? "✗" : "✓"} · voz ${{ ok: "✓", stale: "desactualizada", missing: "—" }[vs.state]} · tiempos ${{ ok: "✓", stale: "desactualizados", missing: "—" }[ts]}`);
    if (!next && v.errors.length) next = `corrige el guion de ${ch.id} (fw validate ${ch.id})`;
    if (!next && vs.state !== "ok") next = "fw voice";
    if (!next && ts !== "ok") next = "fw align";
  }
  const scriptOk = approvals.script?.hash === scriptHash(episode);
  console.log(`\n  narración total: ${fmt(total)} · guion aprobado: ${scriptOk ? "sí" : "no"} · preview aprobado: ${approvals.preview?.hash === scriptHash(episode) ? "sí" : "no"}`);
  const built = existsSync(episode.paths.index) && existsSync(episode.paths.compositions);
  if (!next && !errorsN && !scriptOk) next = "revisa chapters/*.json (lee prompts/02-storyboard.md) y luego: fw approve script";
  if (!next && !built) next = "fw build";
  if (!next) next = approvals.preview?.hash === scriptHash(episode) ? "fw render && fw verify" : "fw build && fw qa, revisa las capturas y el preview; luego: fw approve preview";
  console.log(`\n→ siguiente: ${next}`);
}

// A bare name goes to <framework>/videos/<name>; anything with a slash is a path.
function newProject(name) {
  if (!name) throw new FwError("uso: fw new <nombre>   (crea videos/<nombre>)");
  const cwd = process.env.INIT_CWD ?? process.cwd(); // npm run cambia el cwd a la raíz del paquete
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const dir = /[\\/]/.test(name) ? resolve(cwd, name) : join(FRAMEWORK, "videos", slug(name));
  const id = slug(basename(dir));
  if (existsSync(dir) && readdirSync(dir).length) throw new FwError(`${dir} ya existe y no está vacío`);
  cpSync(join(FRAMEWORK, "template"), dir, { recursive: true });
  const fw = relative(dir, FRAMEWORK).split(sep).join("/") || ".";
  for (const f of ["package.json", "project.json", "meta.json", "AGENTS.md"]) {
    const file = join(dir, f);
    writeFileSync(file, readFileSync(file, "utf8").replaceAll("{{FW}}", fw).replaceAll("mi-serie", id));
  }
  console.log(`✓ proyecto creado en ${dir}
  cd ${relative(cwd, dir) || "."}
  npm run fw -- doctor    revisa que todo esté instalado
  npm run fw -- status    dice el siguiente paso`);
}

function which(bin) {
  return spawnSync("sh", ["-c", `command -v ${JSON.stringify(bin)}`], { encoding: "utf8" }).stdout.trim();
}

async function doctor() {
  let fails = 0;
  const row = (ok, name, detail, fix) => {
    if (ok === false) fails++;
    console.log(`${ok === true ? "✓" : ok === false ? "✗" : "⚠"} ${name.padEnd(12)} ${detail}${ok !== true && fix ? `\n  ${"".padEnd(12)} → ${fix}` : ""}`);
  };
  const major = Number(process.versions.node.split(".")[0]);
  row(major >= 20, "node", process.versions.node, "instala Node ≥ 20 (https://nodejs.org)");
  for (const bin of ["ffmpeg", "ffprobe"]) row(!!which(bin), bin, which(bin) || "no está en el PATH", "instala ffmpeg (apt install ffmpeg · brew install ffmpeg)");

  const project = existsSync(join(process.cwd(), "project.json")) ? loadProject() : null;
  const whisper = project?.align?.bin ?? "whisperx";
  row(!!which(whisper), "whisperx", which(whisper) || "no está en el PATH", "pipx install whisperx (o uv tool install whisperx); o project.json → align.bin");

  const hf = spawnSync("npx", ["--yes", `hyperframes@${project?.hyperframes ?? "0.8.221"}`, "--version"], { encoding: "utf8" });
  row(hf.status === 0, "hyperframes", hf.status === 0 ? hf.stdout.trim() : "npx no pudo ejecutarlo", "revisa tu conexión y npm; luego: npx hyperframes doctor");

  if (!project) {
    console.log("\n(fuera de un proyecto: la voz se revisa al correr fw doctor dentro de videos/<nombre>)");
  } else {
    const v = project.voice ?? {};
    if (v.provider === "voicebox") {
      const base = (v.url ?? "http://127.0.0.1:17493").replace(/\/$/, "");
      try {
        const profiles = await (await fetch(`${base}/profiles`)).json();
        const p = profiles.find((x) => x.name === v.profile || x.id === v.profile);
        row(!!p, "voz", p ? `Voicebox · perfil "${p.name}" (${p.default_engine ?? p.preset_engine ?? "?"})` : `Voicebox responde, pero no hay perfil "${v.profile ?? ""}"`, `project.json → voice.profile; perfiles: ${profiles.map((x) => `"${x.name}"`).join(", ")}`);
      } catch {
        row(false, "voz", `Voicebox no responde en ${base}`, "abre la app Voicebox, o cambia voice.provider a command | existing");
      }
    } else if (v.provider === "command") {
      const bin = (v.command ?? "").trim().split(/\s+/)[0];
      row(!!bin && !!which(bin), "voz", `comando: ${bin || "(vacío)"}`, "project.json → voice.command con {text} {textFile} {out}");
    } else if (v.provider === "existing") {
      const files = Object.values(v.files ?? {});
      const missing = files.filter((f) => !existsSync(resolve(project.root, f)));
      row(files.length > 0 && !missing.length, "voz", `${files.length} archivo(s) de audio${missing.length ? `, faltan: ${missing.join(", ")}` : ""}`, "project.json → voice.files: { \"<capítulo>\": \"ruta\" }");
    } else row(false, "voz", `provider desconocido: ${v.provider}`, "voicebox | command | existing");
  }

  console.log(`\nPara Chrome y el render: npx hyperframes doctor`);
  if (fails) throw new FwError(`${fails} requisito(s) sin cumplir`);
  console.log("✓ listo para producir");
}

async function main() {
  if (cmd === "help" || cmd === "--help") return console.log(HELP);
  if (cmd === "catalog") {
    const SCENES = await loadScenes(existsSync(join(process.cwd(), "project.json")) ? process.cwd() : FRAMEWORK);
    for (const [name, a] of Object.entries(SCENES)) console.log(`${name.padEnd(10)} ${a.local ? "[proyecto] " : ""}${a.doc}${a.required ? `\n${"".padEnd(11)}requiere: ${a.required.join(", ")}` : ""}`);
    console.log(`\niconos: ${ICONS.join(", ")}\npersonajes: ${Object.keys(PEOPLE).join(", ")}\nmoods de Nodo: ${NODO_MOODS.join(", ")}\ntransiciones: whip, cut, zoom, rise, iris, flood`);
    return;
  }
  if (cmd === "new") return newProject(args[0]);
  if (cmd === "doctor") return doctor();

  const project = loadProject();
  const episode = loadEpisode(project);
  const style = await loadStyle(project);
  const SCENES = await loadScenes(project.root);

  if (cmd === "status") return status(project, episode, SCENES);
  if (cmd === "voice") return generateVoice(project, episode, chaptersFrom(episode), { force: flags.has("--force") });
  if (cmd === "align") return alignChapters(project, episode, chaptersFrom(episode), { force: flags.has("--force") });
  if (cmd === "validate") {
    let errors = 0;
    for (const ch of chaptersFrom(episode)) {
      const a = validateScript(ch, style, SCENES);
      const b = validateTiming(episode, ch, style, SCENES);
      [...a.errors, ...b.errors].forEach((e) => console.log(`✗ ${e}`));
      [...a.warns, ...b.warns].forEach((w) => console.log(`⚠ ${w}`));
      errors += a.errors.length + b.errors.length;
    }
    if (errors) throw new FwError(`${errors} error(es)`);
    return console.log("✓ validación sin errores");
  }
  if (cmd === "build") {
    for (const ch of episode.chapters) {
      const v = validateScript(ch, style, SCENES);
      if (v.errors.length) throw new FwError(`${ch.id} tiene errores; corre fw validate`);
    }
    await storyboardMd(project, episode, SCENES);
    const { total, report, skipped } = await buildEpisode(project, episode);
    writeJson(join(project.root, ".fw", "build.json"), { episode: episode.id, total, chapters: report, skipped });
    for (const r of report) {
      console.log(`✓ ${r.chapter.padEnd(20)} ${fmt(r.start)} · ${r.duration.toFixed(1)} s · ${r.scenes} escenas`);
      r.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    }
    if (skipped.length) console.log(`\n⚠ sin voz todavía (fuera del build): ${skipped.join(", ")}`);
    return console.log(`\nindex.html: ${fmt(total)} (${total.toFixed(1)} s) · STORYBOARD.md actualizado`);
  }
  if (cmd === "qa") {
    const build = readJson(join(project.root, ".fw", "build.json"));
    const r = hf(project, ["check"]);
    const out = episode.paths.qa;
    mkdirSync(out, { recursive: true });
    const chapters = args.length ? build.chapters.filter((c) => args.some((a) => c.chapter.startsWith(a))) : build.chapters;
    for (const c of chapters) {
      const times = c.wins.map((w) => (c.start + w.s + Math.min(w.next - w.s - 0.3, (w.next - w.s) * 0.72)).toFixed(2));
      hf(project, ["snapshot", "--at", times.join(","), "--output", join(out, c.chapter)]);
    }
    console.log(`\ncapturas: ${out} (una por escena, al ~72 % de su duración)`);
    if (r.status !== 0) throw new FwError("hyperframes check reportó errores");
    return;
  }
  if (cmd === "approve") {
    const stage = args[0];
    if (!["script", "preview"].includes(stage)) throw new FwError("uso: fw approve script|preview");
    const approvals = readApprovals(episode);
    approvals[stage] = { hash: scriptHash(episode), at: new Date().toISOString() };
    writeJson(episode.paths.approvals, approvals);
    return console.log(`✓ ${stage} aprobado (si cambias los capítulos, la aprobación se invalida)`);
  }
  if (cmd === "render") {
    const approvals = readApprovals(episode);
    if (approvals.preview?.hash !== scriptHash(episode) && !flags.has("--force")) throw new FwError("el preview no está aprobado para esta versión (fw approve preview, o --force)");
    const built = join(project.root, ".fw", "build.json");
    const skipped = existsSync(built) ? readJson(built).skipped ?? [] : [];
    if (skipped.length && !flags.has("--force")) throw new FwError(`el build no incluye ${skipped.join(", ")} (sin voz). Corre fw voice, fw align y fw build, o usa --force`);
    mkdirSync(join(project.root, "renders"), { recursive: true });
    const r = hf(project, ["render", "--output", join("renders", `${episode.id}.mp4`)]);
    if (r.status !== 0) throw new FwError("render falló");
    return;
  }
  if (cmd === "verify") {
    const file = join(project.root, "renders", `${episode.id}.mp4`);
    if (!existsSync(file)) throw new FwError(`no existe ${file}`);
    const build = readJson(join(project.root, ".fw", "build.json"));
    const p = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", file], { encoding: "utf8" });
    const s = JSON.parse(p.stdout).streams[0];
    const d = ffprobeDuration(file);
    const [num, den] = s.r_frame_rate.split("/").map(Number);
    const ok = Math.abs(d - build.total) < 0.5 && s.width === project.canvas.width && s.height === project.canvas.height && Math.round(num / den) === project.canvas.fps;
    console.log(`${ok ? "✓" : "✗"} ${file}: ${d.toFixed(2)} s (esperado ${build.total}) · ${s.width}×${s.height} · ${(num / den).toFixed(2)} fps · ${(statSync(file).size / 1e6).toFixed(1)} MB`);
    if (!ok) throw new FwError("el render no coincide con lo esperado");
    return;
  }
  console.log(HELP);
}

main().catch((e) => {
  console.error(e instanceof FwError ? `fw: ${e.message}` : e);
  process.exit(1);
});
