// Character archetypes: persona (a human with tags / speech bubble) and nodo
// (the AI mascot reacting).

function bubble(x, text, t, { left, top, width = 640, tail = "left", size = 54 }) {
  const tailCss = tail === "left" ? "left:-26px;bottom:40px;border-width:18px 30px 18px 0;border-color:transparent var(--white) transparent transparent" : "left:60px;bottom:-30px;border-width:32px 20px 0 20px;border-color:var(--white) transparent transparent transparent";
  return `<div style="position:absolute;left:${left}px;top:${top}px;width:${width}px;transform-origin:0% 100%" ${x.a("pop", t)}>
    <div class="card" style="position:relative;padding:34px 44px;font-family:var(--display);font-weight:var(--wd);font-size:${size}px;line-height:1.12">
      <span style="position:absolute;width:0;height:0;border-style:solid;${tailCss}"></span>${x.esc(text)}
    </div>
  </div>`;
}

export const persona = {
  doc: "A character (preset: you|intern|doctor|uncle|vendor|friend-m|friend-f) with tags that appear as named, an optional speech bubble and an optional badge.",
  required: ["who"],
  render(sc, x) {
    const mood = sc.mood ?? (sc.says ? "happy" : "neutral");
    const tags = sc.tags ?? [];
    const tones = ["yellow", "red", "green", "blue"];
    const tSays = x.cue(sc.cueSays, 0.3);
    const tagTop = sc.says ? 520 : 300;
    const tagEls = tags.map((tg, i) => {
      const t = x.cue(tg.cue, 0.25 + (0.55 * i) / Math.max(1, tags.length));
      return `<div style="position:absolute;left:880px;top:${tagTop + i * 150}px" ${x.a("right", t)}><div class="chip" style="font-size:52px">${x.badge(tg.icon ?? "star", tones[i % 4], 84)}${x.esc(tg.text)}</div></div>`;
    });
    const qm = mood === "confused"
      ? [0, 1, 2].map((i) => `<div style="position:absolute;left:${300 + i * 130}px;top:${130 - (i % 2) * 50}px;font-family:var(--display);font-weight:900;font-size:${110 - i * 14}px;color:var(--accent)" ${x.a("pop", x.s + 0.6 + i * 0.18)} ${x.fx([{ at: x.s + 1, dur: 2.4, to: { y: -24, rotation: i % 2 ? 12 : -12 }, ease: "sine.inOut" }])}>?</div>`).join("")
      : "";
    const badge = sc.badge
      ? `<div style="position:absolute;left:150px;top:110px" ${x.a("left", x.s + 0.35)}><div class="chip t-${sc.badge.tone ?? "blue"}" style="background:var(--tone);color:var(--white);font-size:52px">${x.badge(sc.badge.icon ?? "star", "white", 80)}${x.esc(sc.badge.text)}</div></div>`
      : "";
    return `
    <div style="position:absolute;left:250px;bottom:0;transform-origin:50% 100%" ${x.a("rise", x.s + 0.12)}>${x.person(sc.who, mood, 1.55)}</div>
    ${qm}${badge}
    ${sc.says ? bubble(x, sc.says, tSays, { left: 880, top: sc.badge ? 250 : 200, width: 780 }) : ""}
    ${tagEls.join("")}`;
  },
};

export const nodo = {
  doc: "The AI mascot reacting (mood: happy|neutral|hurt|blank|proud|dizzy|think|smug|sleep) with a speech bubble; `wrong` stamps a correction.",
  render(sc, x) {
    const tSays = x.cue(sc.cueSays, 0.2);
    const tWrong = x.cue(sc.cueWrong, 0.6);
    const shake = sc.wrong ? [{ at: tWrong, dur: 0.06, to: { x: -22 } }, { at: tWrong + 0.06, dur: 0.06, to: { x: 18 } }, { at: tWrong + 0.12, dur: 0.06, to: { x: -10 } }, { at: tWrong + 0.18, dur: 0.1, to: { x: 0 } }] : [];
    const z = sc.mood === "sleep" ? `<div style="position:absolute;left:640px;top:170px;font-family:var(--display);font-weight:900;font-size:90px;color:var(--fg)" ${x.fx([{ at: x.s + 0.6, dur: 0.01, to: { opacity: 1 } }, { at: x.s + 0.6, dur: Math.max(1, x.dur - 1), from: { y: 40, opacity: 0 }, to: { y: -120, opacity: 1 }, ease: "sine.out" }])}>z z</div>` : "";
    return `
    <div style="position:absolute;left:260px;top:180px" ${x.a("drop", x.s + 0.1)}><div ${x.fx(shake)}>${x.nodo(sc.mood ?? "happy", 560)}</div></div>
    ${z}
    ${sc.says ? bubble(x, sc.says, tSays, { left: 960, top: 260, width: 760, size: 76 }) : ""}
    ${sc.wrong ? `<div class="t-green" style="position:absolute;left:1000px;top:640px;display:flex;align-items:center;gap:24px;padding:22px 44px;border:12px solid var(--white);border-radius:24px;background:var(--green);color:var(--white);font-family:var(--display);font-weight:900;font-size:96px" ${x.a("stamp", tWrong)}>${x.icon("check", 96)}${x.esc(sc.wrong)}</div>` : ""}`;
  },
};
