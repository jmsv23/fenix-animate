// Original flat vector art for the kit: monochrome glyph icons, the "Nodo"
// mascot (the AI) and parametric people. Everything is inline SVG that reads
// colours from CSS variables, so a style swap recolours the art.

// ---------------------------------------------------------------- icons
// 64×64 glyphs drawn in currentColor; `--icon-accent` fills small details.
const G = {
  chat: `<path d="M10 14h44a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H30l-12 10v-10h-8a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" fill="currentColor"/><circle cx="22" cy="30" r="4" fill="var(--icon-accent)"/><circle cx="34" cy="30" r="4" fill="var(--icon-accent)"/><circle cx="46" cy="30" r="4" fill="var(--icon-accent)"/>`,
  doc: `<path d="M16 6h22l14 14v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="currentColor"/><path d="M38 6v14h14" fill="var(--icon-accent)"/><rect x="20" y="30" width="24" height="4" rx="2" fill="var(--icon-accent)"/><rect x="20" y="40" width="24" height="4" rx="2" fill="var(--icon-accent)"/><rect x="20" y="50" width="14" height="4" rx="2" fill="var(--icon-accent)"/>`,
  file: `<path d="M16 6h22l14 14v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="currentColor"/><path d="M38 6v14h14" fill="var(--icon-accent)"/><text x="32" y="48" font-size="15" font-family="JetBrains Mono" font-weight="700" text-anchor="middle" fill="var(--icon-accent)">0101</text>`,
  blocks: `<rect x="6" y="30" width="24" height="18" rx="3" fill="currentColor"/><rect x="34" y="30" width="24" height="18" rx="3" fill="currentColor"/><rect x="20" y="10" width="24" height="18" rx="3" fill="currentColor"/><rect x="11" y="26" width="6" height="5" rx="1" fill="currentColor"/><rect x="39" y="26" width="6" height="5" rx="1" fill="currentColor"/><rect x="25" y="6" width="6" height="5" rx="1" fill="currentColor"/><rect x="34" y="6" width="6" height="5" rx="1" fill="currentColor"/>`,
  window: `<rect x="6" y="10" width="52" height="44" rx="6" fill="currentColor"/><rect x="12" y="20" width="40" height="28" rx="3" fill="var(--icon-accent)"/><circle cx="13" cy="15" r="2" fill="var(--icon-accent)"/><circle cx="20" cy="15" r="2" fill="var(--icon-accent)"/><rect x="18" y="26" width="28" height="5" rx="2" fill="currentColor"/><rect x="18" y="36" width="18" height="5" rx="2" fill="currentColor"/>`,
  thermo: `<rect x="25" y="6" width="14" height="38" rx="7" fill="currentColor"/><circle cx="32" cy="48" r="12" fill="currentColor"/><rect x="29" y="18" width="6" height="28" rx="3" fill="var(--icon-accent)"/><circle cx="32" cy="48" r="7" fill="var(--icon-accent)"/>`,
  ghost: `<path d="M12 56V28a20 20 0 0 1 40 0v28l-7-6-6 6-7-6-7 6-6-6z" fill="currentColor"/><ellipse cx="25" cy="28" rx="4" ry="6" fill="var(--icon-accent)"/><ellipse cx="39" cy="28" rx="4" ry="6" fill="var(--icon-accent)"/>`,
  bolt: `<path d="M36 4L12 36h16l-4 24 26-34H34z" fill="currentColor"/>`,
  star: `<path d="M32 5l8 17 18 2-13 13 4 19-17-9-17 9 4-19L6 24l18-2z" fill="currentColor"/>`,
  book: `<path d="M8 12c8-4 16-4 24 2v42c-8-6-16-6-24-2z" fill="currentColor"/><path d="M56 12c-8-4-16-4-24 2v42c8-6 16-6 24-2z" fill="currentColor" opacity=".75"/>`,
  question: `<path d="M22 22a10 10 0 1 1 15 9c-4 2-5 4-5 9" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><circle cx="32" cy="54" r="5" fill="currentColor"/>`,
  target: `<circle cx="32" cy="32" r="26" fill="currentColor"/><circle cx="32" cy="32" r="18" fill="var(--icon-accent)"/><circle cx="32" cy="32" r="10" fill="currentColor"/><circle cx="32" cy="32" r="4" fill="var(--icon-accent)"/>`,
  user: `<circle cx="32" cy="22" r="12" fill="currentColor"/><path d="M10 58a22 22 0 0 1 44 0z" fill="currentColor"/>`,
  mic: `<rect x="22" y="6" width="20" height="32" rx="10" fill="currentColor"/><path d="M14 30a18 18 0 0 0 36 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><rect x="29" y="48" width="6" height="10" fill="currentColor"/><rect x="20" y="56" width="24" height="5" rx="2" fill="currentColor"/>`,
  list: `<circle cx="12" cy="16" r="5" fill="currentColor"/><circle cx="12" cy="32" r="5" fill="currentColor"/><circle cx="12" cy="48" r="5" fill="currentColor"/><rect x="22" y="12" width="34" height="8" rx="4" fill="currentColor"/><rect x="22" y="28" width="34" height="8" rx="4" fill="currentColor"/><rect x="22" y="44" width="24" height="8" rx="4" fill="currentColor"/>`,
  robot: `<rect x="10" y="18" width="44" height="36" rx="10" fill="currentColor"/><circle cx="24" cy="36" r="6" fill="var(--icon-accent)"/><circle cx="40" cy="36" r="6" fill="var(--icon-accent)"/><rect x="30" y="6" width="4" height="12" fill="currentColor"/><circle cx="32" cy="6" r="4" fill="currentColor"/>`,
  pencil: `<path d="M44 6l14 14-32 32-18 4 4-18z" fill="currentColor"/><path d="M12 38l14 14-14 4z" fill="var(--icon-accent)"/>`,
  warn: `<path d="M32 6l28 50H4z" fill="currentColor"/><rect x="29" y="22" width="6" height="18" rx="3" fill="var(--icon-accent)"/><circle cx="32" cy="47" r="4" fill="var(--icon-accent)"/>`,
  plus: `<rect x="26" y="8" width="12" height="48" rx="5" fill="currentColor"/><rect x="8" y="26" width="48" height="12" rx="5" fill="currentColor"/>`,
  pill: `<rect x="6" y="22" width="52" height="20" rx="10" fill="currentColor" transform="rotate(-35 32 32)"/><rect x="32" y="22" width="26" height="20" rx="10" fill="var(--icon-accent)" transform="rotate(-35 32 32)"/>`,
  cross: `<path d="M14 14l36 36M50 14L14 50" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>`,
  check: `<path d="M10 34l14 14 30-32" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`,
  clock: `<circle cx="32" cy="32" r="26" fill="currentColor"/><path d="M32 16v17l11 8" fill="none" stroke="var(--icon-accent)" stroke-width="6" stroke-linecap="round"/>`,
  mail: `<rect x="6" y="14" width="52" height="38" rx="6" fill="currentColor"/><path d="M8 18l24 18 24-18" fill="none" stroke="var(--icon-accent)" stroke-width="5" stroke-linejoin="round"/>`,
  truck: `<rect x="4" y="16" width="34" height="28" rx="3" fill="currentColor"/><path d="M38 24h12l10 10v10H38z" fill="currentColor"/><circle cx="16" cy="48" r="7" fill="currentColor" stroke="var(--icon-accent)" stroke-width="4"/><circle cx="48" cy="48" r="7" fill="currentColor" stroke="var(--icon-accent)" stroke-width="4"/>`,
  gift: `<rect x="8" y="26" width="48" height="32" rx="4" fill="currentColor"/><rect x="5" y="18" width="54" height="12" rx="3" fill="currentColor"/><rect x="28" y="18" width="8" height="40" fill="var(--icon-accent)"/><path d="M32 18c-6-12-18-10-14-2zM32 18c6-12 18-10 14-2z" fill="currentColor"/>`,
  lock: `<rect x="10" y="28" width="44" height="30" rx="6" fill="currentColor"/><path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke="currentColor" stroke-width="7"/><circle cx="32" cy="42" r="5" fill="var(--icon-accent)"/>`,
  snow: `<g stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M32 6v52M9 19l46 26M9 45l46-26"/></g><circle cx="32" cy="32" r="7" fill="var(--icon-accent)"/>`,
  fire: `<path d="M32 4c4 14 20 18 20 34a20 20 0 0 1-40 0c0-10 6-14 8-22 4 6 4 10 8 12 2-8 0-16 4-24z" fill="currentColor"/><path d="M32 34c2 6 10 8 10 16a10 10 0 0 1-20 0c0-6 6-8 10-16z" fill="var(--icon-accent)"/>`,
  bread: `<path d="M8 30c0-12 12-18 24-18s24 6 24 18c0 4-3 6-6 6v18H14V36c-3 0-6-2-6-6z" fill="currentColor"/><path d="M22 24l4 10M32 22v12M42 24l-4 10" stroke="var(--icon-accent)" stroke-width="4" stroke-linecap="round"/>`,
  bulb: `<path d="M32 4a20 20 0 0 1 12 36v6H20v-6A20 20 0 0 1 32 4z" fill="currentColor"/><rect x="22" y="48" width="20" height="5" rx="2" fill="currentColor"/><rect x="25" y="55" width="14" height="5" rx="2" fill="currentColor"/><path d="M26 30l6 6 6-6" fill="none" stroke="var(--icon-accent)" stroke-width="4" stroke-linecap="round"/>`,
  refresh: `<path d="M50 26A20 20 0 1 0 52 38" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><path d="M40 22h14V8z" fill="currentColor"/>`,
  carrot: `<path d="M44 20L12 56l-2-2L40 16z" fill="currentColor"/><path d="M44 20c-6-6-6-10 0-14M44 20c6 6 10 6 14 0M44 20c2-8 6-10 12-10" stroke="var(--icon-accent)" stroke-width="5" stroke-linecap="round" fill="none"/>`,
  board: `<rect x="6" y="18" width="46" height="34" rx="8" fill="currentColor"/><circle cx="44" cy="26" r="3" fill="var(--icon-accent)"/><rect x="52" y="30" width="8" height="10" rx="3" fill="currentColor"/>`,
  broom: `<rect x="30" y="4" width="6" height="30" rx="3" fill="currentColor" transform="rotate(20 32 32)"/><path d="M18 34h26l6 24H12z" fill="currentColor"/><path d="M20 42v14M28 42v14M36 42v14M44 42v14" stroke="var(--icon-accent)" stroke-width="3"/>`,
  pin: `<path d="M32 60S12 38 12 24a20 20 0 0 1 40 0c0 14-20 36-20 36z" fill="currentColor"/><circle cx="32" cy="24" r="8" fill="var(--icon-accent)"/>`,
  avocado: `<path d="M32 4c10 0 14 10 18 22 4 12 6 32-18 32S10 38 14 26C18 14 22 4 32 4z" fill="currentColor"/><path d="M32 14c7 0 10 8 12 16 2 8 2 20-12 20s-14-12-12-20 5-16 12-16z" fill="var(--icon-accent)"/><circle cx="32" cy="38" r="8" fill="currentColor"/>`,
  search: `<circle cx="26" cy="26" r="17" fill="none" stroke="currentColor" stroke-width="8"/><path d="M39 39l17 17" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>`,
  brain: `<path d="M30 8c-6-4-16 0-16 8-8 2-10 12-4 16-4 6 0 14 8 14 2 8 10 10 12 6zM34 8c6-4 16 0 16 8 8 2 10 12 4 16 4 6 0 14-8 14-2 8-10 10-12 6z" fill="currentColor"/><path d="M32 10v44" stroke="var(--icon-accent)" stroke-width="3"/>`,
  image: `<rect x="6" y="10" width="52" height="44" rx="6" fill="currentColor"/><circle cx="22" cy="24" r="6" fill="var(--icon-accent)"/><path d="M10 50l14-14 10 10 8-8 14 12z" fill="var(--icon-accent)"/>`,
  cat: `<path d="M12 24L10 6l14 10h16l14-10-2 18c4 6 4 14 0 20-6 10-34 10-40 0-4-6-4-14 0-20z" fill="currentColor"/><circle cx="24" cy="34" r="4" fill="var(--icon-accent)"/><circle cx="40" cy="34" r="4" fill="var(--icon-accent)"/><path d="M29 42l3 3 3-3" fill="none" stroke="var(--icon-accent)" stroke-width="3" stroke-linecap="round"/>`,
  phone: `<rect x="16" y="4" width="32" height="56" rx="7" fill="currentColor"/><rect x="20" y="12" width="24" height="38" rx="2" fill="var(--icon-accent)"/><circle cx="32" cy="55" r="2.5" fill="var(--icon-accent)"/>`,
  gear: `<path d="M28 4h8l2 8 7 3 7-5 6 6-5 7 3 7 8 2v8l-8 2-3 7 5 7-6 6-7-5-7 3-2 8h-8l-2-8-7-3-7 5-6-6 5-7-3-7-8-2v-8l8-2 3-7-5-7 6-6 7 5 7-3z" fill="currentColor"/><circle cx="32" cy="32" r="9" fill="var(--icon-accent)"/>`,
  tv: `<rect x="4" y="12" width="56" height="38" rx="6" fill="currentColor"/><path d="M27 23v16l13-8z" fill="var(--icon-accent)"/><rect x="20" y="54" width="24" height="5" rx="2" fill="currentColor"/>`,
  box: `<path d="M32 4l26 12v32L32 60 6 48V16z" fill="currentColor"/><path d="M6 16l26 12 26-12M32 28v32" fill="none" stroke="var(--icon-accent)" stroke-width="4" stroke-linejoin="round"/>`,
  bell: `<path d="M32 6a4 4 0 0 1 4 4v2a16 16 0 0 1 12 16v12l6 8H10l6-8V28a16 16 0 0 1 12-16v-2a4 4 0 0 1 4-4z" fill="currentColor"/><circle cx="32" cy="54" r="6" fill="currentColor"/>`,
  coin: `<circle cx="32" cy="32" r="26" fill="currentColor"/><circle cx="32" cy="32" r="19" fill="none" stroke="var(--icon-accent)" stroke-width="3"/><text x="32" y="42" font-size="26" font-family="Poppins" font-weight="800" text-anchor="middle" fill="var(--icon-accent)">$</text>`,
};

export const ICONS = Object.keys(G);

export function icon(name, { size = 64, cls = "" } = {}) {
  const g = G[name] ?? G.question;
  return `<svg class="ico ${cls}" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${g}</svg>`;
}

// ---------------------------------------------------------------- Nodo
// The recurring AI character: a friendly screen-headed bot. Moods change the
// face only, so every pose shares one silhouette.
const NODO_FACES = {
  happy: { eyes: `<ellipse cx="88" cy="118" rx="11" ry="15"/><ellipse cx="152" cy="118" rx="11" ry="15"/>`, mouth: `<path d="M96 150q24 22 48 0" fill="none" stroke-width="9" stroke-linecap="round"/>` },
  neutral: { eyes: `<ellipse cx="88" cy="118" rx="11" ry="15"/><ellipse cx="152" cy="118" rx="11" ry="15"/>`, mouth: `<path d="M100 156h40" stroke-width="9" stroke-linecap="round"/>` },
  hurt: { eyes: `<ellipse cx="88" cy="122" rx="10" ry="13"/><ellipse cx="152" cy="122" rx="10" ry="13"/><path d="M70 98l30 8M170 98l-30 8" stroke-width="7" stroke-linecap="round"/>`, mouth: `<path d="M98 164q22-18 44 0" fill="none" stroke-width="9" stroke-linecap="round"/>` },
  blank: { eyes: `<circle cx="88" cy="120" r="8"/><circle cx="152" cy="120" r="8"/>`, mouth: `<circle cx="120" cy="158" r="7"/>` },
  proud: { eyes: `<path d="M74 122q14-16 28 0M138 122q14-16 28 0" fill="none" stroke-width="9" stroke-linecap="round"/>`, mouth: `<path d="M90 146q30 30 60 0z" stroke-width="4" stroke-linejoin="round"/>` },
  dizzy: { eyes: `<path d="M80 110q16 0 12 12t-12-4q4-6 10-2M144 110q16 0 12 12t-12-4q4-6 10-2" fill="none" stroke-width="6" stroke-linecap="round"/>`, mouth: `<path d="M98 158q8-8 16 0t16 0t14 0" fill="none" stroke-width="7" stroke-linecap="round"/>` },
  think: { eyes: `<ellipse cx="94" cy="112" rx="10" ry="14"/><ellipse cx="158" cy="112" rx="10" ry="14"/>`, mouth: `<path d="M110 158h24" stroke-width="9" stroke-linecap="round"/>` },
  smug: { eyes: `<path d="M74 118h28M138 118h28" stroke-width="9" stroke-linecap="round"/><path d="M76 112q12-10 24 0M140 112q12-10 24 0" fill="none" stroke-width="5" stroke-linecap="round"/>`, mouth: `<path d="M100 154q24 12 44-6" fill="none" stroke-width="9" stroke-linecap="round"/>` },
  sleep: { eyes: `<path d="M76 122q12 10 24 0M140 122q12 10 24 0" fill="none" stroke-width="8" stroke-linecap="round"/>`, mouth: `<ellipse cx="120" cy="158" rx="8" ry="6"/>` },
};

export const NODO_MOODS = Object.keys(NODO_FACES);

export function nodo(mood = "happy", { id, size = 360 } = {}) {
  const f = NODO_FACES[mood] ?? NODO_FACES.happy;
  const blinks = ["happy", "neutral", "hurt", "blank", "think"].includes(mood);
  return `<svg class="nodo" ${id ? `id="${id}"` : ""} viewBox="0 0 240 280" width="${size}" height="${size * 280 / 240}" aria-hidden="true">
  <ellipse cx="120" cy="268" rx="78" ry="10" fill="var(--shadow)"/>
  <rect x="116" y="18" width="8" height="34" rx="4" fill="var(--ink)"/>
  <circle class="nodo-bulb" cx="120" cy="18" r="13" fill="var(--yellow)" stroke="var(--ink)" stroke-width="5"/>
  <rect x="78" y="216" width="84" height="44" rx="18" fill="var(--blue-deep)"/>
  <rect x="24" y="50" width="192" height="172" rx="48" fill="var(--blue)" stroke="var(--ink)" stroke-width="6"/>
  <rect x="44" y="74" width="152" height="122" rx="32" fill="var(--screen)"/>
  <circle cx="64" cy="168" r="11" fill="var(--pink)" opacity=".8"/><circle cx="176" cy="168" r="11" fill="var(--pink)" opacity=".8"/>
  <g class="${blinks ? "nodo-eyes" : ""}" fill="var(--ink)" stroke="var(--ink)" style="transform-origin:120px 118px">${f.eyes}</g>
  <g fill="var(--ink)" stroke="var(--ink)">${f.mouth}</g>
  ${mood === "sleep" ? `<text class="nodo-z" x="190" y="54" font-family="Poppins" font-weight="800" font-size="38" fill="var(--ink)">z</text><text class="nodo-z" x="214" y="28" font-family="Poppins" font-weight="800" font-size="26" fill="var(--ink)">z</text>` : ""}
</svg>`;
}

// ---------------------------------------------------------------- people
// Parametric flat characters. Presets name the cast used by storyboards.
export const PEOPLE = {
  you: { skin: "var(--skin)", hair: "short", shirt: "var(--blue)", acc: [] },
  intern: { skin: "var(--skin)", hair: "short", shirt: "var(--white)", acc: ["tie", "glasses"] },
  doctor: { skin: "var(--skin-2)", hair: "bun", shirt: "var(--white)", acc: ["coat", "stethoscope"] },
  uncle: { skin: "var(--skin)", hair: "bald", shirt: "var(--blue)", acc: ["mustache"] },
  vendor: { skin: "var(--skin-2)", hair: "cap", shirt: "var(--red)", acc: ["mustache", "apron"] },
  "friend-m": { skin: "var(--skin-2)", hair: "short", shirt: "var(--green)", acc: [] },
  "friend-f": { skin: "var(--skin)", hair: "long", shirt: "var(--red)", acc: [] },
};

const HAIR = {
  short: `<path d="M62 96c-6-44 30-62 58-62s66 16 58 62c-8-18-22-26-58-26s-50 8-58 26z" fill="var(--hair)"/>`,
  long: `<path d="M58 100c-8-48 30-68 62-68s70 20 62 68l8 96h-34l-6-80c-4-24-56-24-60 0l-6 80H44z" fill="var(--hair)"/>`,
  bun: `<circle cx="120" cy="30" r="22" fill="var(--hair)"/><path d="M62 98c-6-44 30-60 58-60s64 16 58 60c-8-16-24-28-58-28s-50 12-58 28z" fill="var(--hair)"/>`,
  bald: `<path d="M62 112c-4-12 0-20 6-24 0 10 2 20 4 28zM178 112c4-12 0-20-6-24 0 10-2 20-4 28z" fill="var(--hair-2)"/>`,
  cap: `<path d="M62 92c0-34 26-52 58-52s58 18 58 52z" fill="var(--green)"/><path d="M150 90h56c0 8-6 12-14 12h-42z" fill="var(--green-deep)"/>`,
};

const PERSON_FACES = {
  neutral: { brows: "", mouth: `<path d="M106 146q14 12 28 0" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>` },
  happy: { brows: "", mouth: `<path d="M102 142q18 20 36 0z" fill="var(--ink)"/>` },
  confused: { brows: `<path d="M86 92l22 6M134 92l20-8" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>`, mouth: `<path d="M106 148q8-6 14 0t14 0" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/>` },
};

export function person(preset = "you", { mood = "neutral", id } = {}) {
  const p = typeof preset === "string" ? PEOPLE[preset] ?? PEOPLE.you : preset;
  const acc = new Set(p.acc);
  const face = PERSON_FACES[mood] ?? PERSON_FACES.neutral;
  return `<svg class="person" ${id ? `id="${id}"` : ""} viewBox="0 0 240 340" width="300" height="425" aria-hidden="true">
  <ellipse cx="120" cy="330" rx="96" ry="10" fill="var(--shadow)"/>
  ${p.hair === "long" ? HAIR.long : ""}
  <path d="M30 330c0-74 34-112 90-112s90 38 90 112z" fill="${p.shirt}" stroke="var(--line)" stroke-width="6"/>
  ${acc.has("coat") ? `<path d="M30 330c0-74 34-112 90-112s90 38 90 112h-46l-44-90-44 90z" fill="var(--white)" stroke="var(--line)" stroke-width="3"/><path d="M98 230l22 40 22-40" fill="var(--green)"/>` : ""}
  ${acc.has("apron") ? `<path d="M74 250h92v80H74z" fill="var(--white)" stroke="var(--line)" stroke-width="5"/><path d="M74 250l-14-26M166 250l14-26" stroke="var(--line)" stroke-width="6"/>` : ""}
  <rect x="104" y="180" width="32" height="46" rx="12" fill="${p.skin}"/>
  ${acc.has("tie") ? `<path d="M120 228l-12 12 12 70 12-70z" fill="var(--red)"/><path d="M104 222l16 10 16-10" fill="none" stroke="var(--line)" stroke-width="4"/>` : ""}
  ${acc.has("stethoscope") ? `<path d="M94 226c-8 40 0 66 26 66s34-26 26-66" fill="none" stroke="var(--ink)" stroke-width="6"/><circle cx="120" cy="296" r="9" fill="var(--blue)" stroke="var(--ink)" stroke-width="4"/>` : ""}
  <circle cx="60" cy="122" r="14" fill="${p.skin}"/><circle cx="180" cy="122" r="14" fill="${p.skin}"/>
  <ellipse cx="120" cy="118" rx="60" ry="66" fill="${p.skin}"/>
  ${HAIR[p.hair] && p.hair !== "long" ? HAIR[p.hair] : p.hair === "long" ? `<path d="M62 100c-4-40 26-60 58-60s62 20 58 60c-16-22-34-30-58-30s-42 8-58 30z" fill="var(--hair)"/>` : ""}
  <g class="person-eyes" style="transform-origin:120px 116px"><ellipse cx="98" cy="116" rx="7" ry="9" fill="var(--ink)"/><ellipse cx="142" cy="116" rx="7" ry="9" fill="var(--ink)"/></g>
  ${face.brows}
  ${acc.has("glasses") ? `<g fill="none" stroke="var(--ink)" stroke-width="5"><circle cx="98" cy="116" r="17"/><circle cx="142" cy="116" r="17"/><path d="M115 116h10"/></g>` : ""}
  <circle cx="84" cy="138" r="8" fill="var(--pink)" opacity=".7"/><circle cx="156" cy="138" r="8" fill="var(--pink)" opacity=".7"/>
  ${acc.has("mustache") ? `<path d="M94 140q12-12 26-2 14-10 26 2-12 8-26 2-14 6-26-2z" fill="var(--hair)"/>` : face.mouth}
  ${acc.has("mustache") && mood !== "confused" ? `<path d="M108 150q12 8 24 0" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>` : ""}
</svg>`;
}

// ---------------------------------------------------------------- decor
// Small confetti shapes (as in the flat-explainer reference). `kind` picks a
// shape; colour comes from the caller.
export function confetti(kind, color) {
  const shapes = {
    ring: `<circle cx="20" cy="20" r="13" fill="none" stroke="${color}" stroke-width="6"/>`,
    zig: `<path d="M4 28l8-12 8 12 8-12 8 12" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
    tri: `<path d="M20 5l15 28H5z" fill="none" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>`,
    sq: `<rect x="7" y="7" width="26" height="26" rx="4" fill="none" stroke="${color}" stroke-width="5"/>`,
    dot: `<circle cx="20" cy="20" r="9" fill="${color}"/>`,
    arc: `<path d="M6 26a14 14 0 0 1 28 0" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`,
  };
  return `<svg viewBox="0 0 40 40" width="56" height="56">${shapes[kind] ?? shapes.dot}</svg>`;
}
