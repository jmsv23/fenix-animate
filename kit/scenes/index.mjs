// Scene catalog. Each archetype: { doc, required?, ground?, builds?, sting?, render(scene, ctx) }.
// Projects add their own archetypes in <project>/scenes/*.mjs (same shape);
// a project archetype with the same name overrides the kit's.
// `fw catalog` prints the docs so any agent can pick types without reading code.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import * as text from "./text.mjs";
import * as ui from "./ui.mjs";
import * as people from "./people.mjs";
import * as diagrams from "./diagrams.mjs";

export const KIT_SCENES = { ...text, ...ui, ...people, ...diagrams };

export async function loadScenes(projectRoot) {
  const dir = join(projectRoot, "scenes");
  const local = {};
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((n) => n.endsWith(".mjs")).sort()) {
      const mod = await import(pathToFileURL(join(dir, f)).href);
      for (const [name, arch] of Object.entries(mod)) if (arch && typeof arch.render === "function") local[name] = { ...arch, local: true };
    }
  }
  return { ...KIT_SCENES, ...local };
}
