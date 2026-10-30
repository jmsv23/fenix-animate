// Typographic archetypes: chapter, say, question, takeaway, myth, bignum, cta.

export const chapter = {
  sting: true, // short by design
  doc: "Chapter card: giant number, title synced to the voice, icon badge. First scene of a chapter.",
  required: ["n", "title"],
  render(sc, x) {
    const t = x.s;
    return `
    <div class="layer" style="background:var(--bg)"></div>
    <div style="position:absolute;left:-300px;top:-300px;width:2520px;height:1680px;transform:rotate(-8deg);z-index:5" data-layout-ignore>
      <div style="position:absolute;inset:0;background:var(--ink)" ${x.fx([{ at: t + 0.05, dur: 0.6, from: { x: 0 }, to: { x: 2600 }, ease: "power3.in" }])}></div>
      <div style="position:absolute;inset:0;background:var(--yellow)" ${x.fx([{ at: t + 0.18, dur: 0.6, from: { x: 0 }, to: { x: 2600 }, ease: "power3.in" }])}></div>
    </div>
    <div style="position:absolute;left:120px;top:150px;font-family:var(--display);font-weight:900;font-size:560px;line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:10px var(--fg)" ${x.a("slam", t + 0.45)}>${x.esc(sc.n)}</div>
    <div style="position:absolute;left:150px;top:640px;width:1650px">
      <div class="kicker" style="color:var(--fg);opacity:.85;margin-bottom:10px" ${x.a("blur", t + 0.6)}>${x.esc(sc.kicker ?? `Idea ${Number(sc.n)}`)}</div>
      <h1 class="headline l">${x.words(sc.title, sc.em ?? [], { min: t + 0.7 })}</h1>
    </div>
    ${sc.icon ? `<div style="position:absolute;right:170px;top:170px" ${x.a("spin", t + 0.75)}>${x.badge(sc.icon, "white", 320)}</div>` : ""}`;
  },
};

export const say = {
  doc: "One big line synced word-by-word to the voice. Optional kicker, mascot mood or icon at the side. size: m|l|xl.",
  required: ["text"],
  render(sc, x) {
    const side = sc.mascot || sc.icon;
    const n = sc.text.split(/\s+/).length;
    const size0 = sc.size ?? (n <= 3 ? "xl" : n <= 6 ? "l" : "m");
    const size = side && size0 === "xl" ? "l" : size0; // xl needs the full width
    const width = side ? 1120 : 1640;
    const align = side ? "left" : "center";
    const art = sc.mascot
      ? `<div style="position:absolute;right:170px;top:250px" ${x.a("drop", x.s + 0.3)}>${x.nodo(sc.mascot, 420)}</div>`
      : sc.icon
        ? `<div style="position:absolute;right:220px;top:300px" ${x.a("spin", x.s + 0.35)}>${x.badge(sc.icon, x.ground === "yellow" ? "ink" : "yellow", 420)}</div>`
        : "";
    return `
    <div style="position:absolute;left:${side ? 150 : 140}px;top:0;bottom:0;width:${width}px;display:flex;flex-direction:column;justify-content:center;text-align:${align};align-items:${side ? "flex-start" : "center"}">
      ${sc.kicker ? `<div class="kicker" style="margin-bottom:28px" ${x.a("blur", x.s + 0.2)}>${x.esc(sc.kicker)}</div>` : ""}
      <h1 class="headline ${size}">${x.words(sc.text, sc.em ?? [])}</h1>
    </div>${art}`;
  },
};

export const question = {
  doc: "A question set huge with a giant spinning question mark.",
  required: ["text"],
  render(sc, x) {
    return `
    <div style="position:absolute;right:60px;top:-40px;font-family:var(--display);font-weight:900;font-size:1050px;line-height:1;color:var(--accent)" ${x.a("spin", x.s + 0.15)}>?</div>
    <div style="position:absolute;left:150px;top:0;bottom:0;width:1200px;display:flex;flex-direction:column;justify-content:center">
      <h1 class="headline l">${x.words(sc.text, sc.em ?? [])}</h1>
    </div>`;
  },
};

export const takeaway = {
  doc: "Closing line of a chapter: 'Quédate con esto' + the one idea. Ink ground by default.",
  required: ["text"],
  ground: "ink",
  render(sc, x) {
    return `
    <div style="position:absolute;left:150px;top:0;bottom:0;width:1300px;display:flex;flex-direction:column;justify-content:center">
      <div class="chip" style="align-self:flex-start;margin-bottom:46px;background:var(--yellow)" ${x.a("left", x.s + 0.2)}>${x.icon("pin", 48)}Quédate con esto</div>
      <h1 class="headline m">${x.words(sc.text, sc.em ?? [], { min: x.s + 0.45 })}</h1>
      <div style="height:16px;width:420px;margin-top:48px;border-radius:8px;background:var(--accent);transform-origin:left center" ${x.a("grow", x.cue(null, 0.75), { dur: 0.8 })}></div>
    </div>
    <div style="position:absolute;right:150px;bottom:110px" ${x.a("drop", x.s + 0.6)}>${x.nodo("happy", 340)}</div>`;
  },
};

export const myth = {
  doc: "A wrong phrase struck through, the right phrase written under it.",
  required: ["wrong", "right"],
  render(sc, x) {
    const t = x.cue(sc.cue, 0.45);
    return `
    <div class="center layer">
      <div style="position:relative;display:inline-block" ${x.a("rise", x.s + 0.25)} ${x.out("dim", t + 0.25)}>
        <div class="headline m" style="color:var(--fg)">«${x.esc(sc.wrong)}»</div>
        <div style="position:absolute;left:-30px;right:-30px;top:52%;height:22px;border-radius:11px;background:var(--red);transform-origin:left center" ${x.a("grow", t, { dur: 0.35 })}></div>
      </div>
      <div style="height:70px"></div>
      <div class="headline l" style="display:flex;align-items:center;gap:36px">
        <span ${x.a("pop", t + 0.4)}>${x.badge("check", "green", 150)}</span>
        <span>${x.words(sc.right, sc.right.split(/\s+/), { min: t + 0.55, step: 0.12 })}</span>
      </div>
    </div>`;
  },
};

export const bignum = {
  doc: "One number or symbol landing huge (count-up when `value` is numeric), with a label and optional sub chip.",
  render(sc, x) {
    const t = x.cue(sc.cue, 0.2);
    const numeric = typeof sc.value === "number";
    const count = numeric ? x.count({ at: t, dur: 1.1, from: sc.from ?? 0, to: sc.value, dec: sc.dec ?? 0, prefix: sc.prefix ?? "", suffix: sc.suffix ?? "" }) : "";
    return `
    <div class="center layer" style="padding-bottom:40px">
      <div style="font-family:var(--display);font-weight:900;font-size:430px;line-height:.9;letter-spacing:-.05em;color:var(--fg)" ${x.a("slam", t)} ${count}>${numeric ? "" : x.esc(sc.text)}</div>
      <div class="headline m" style="font-size:76px;max-width:1500px;margin-top:20px">${x.words(sc.label ?? "", [], { min: t + 0.3, step: 0.08 })}</div>
      ${sc.sub ? `<div class="chip" style="margin-top:56px" ${x.a("pop", x.cue(sc.cueSub, 0.7))}>${x.esc(sc.sub)}</div>` : ""}
    </div>`;
  },
};

export const cta = {
  doc: "Subscribe call to action with bell button and the mascot.",
  required: ["text"],
  render(sc, x) {
    const t = x.cue(sc.cue, 0.15);
    return `
    <div style="position:absolute;left:150px;top:0;bottom:0;width:1150px;display:flex;flex-direction:column;justify-content:center;gap:60px">
      <div style="align-self:flex-start;display:flex;align-items:center;gap:30px;padding:34px 70px 34px 40px;border-radius:999px;background:var(--white);color:var(--red);font-family:var(--display);font-weight:900;font-size:120px;box-shadow:14px 14px 0 var(--ink)" ${x.a("slam", t)}>
        <span style="--icon-accent:var(--white);color:var(--red)" ${x.fx([{ at: t + 0.5, dur: 0.12, to: { rotation: 18 } }, { at: t + 0.62, dur: 0.12, to: { rotation: -14 } }, { at: t + 0.74, dur: 0.2, to: { rotation: 0 } }])}>${x.icon("bell", 130)}</span>${x.esc(sc.text)}
      </div>
      ${sc.sub ? `<div class="headline m" style="font-size:66px;line-height:1.15">${x.words(sc.sub, sc.em ?? [], { min: x.cue(sc.cueSub, 0.45) })}</div>` : ""}
    </div>
    <div style="position:absolute;right:170px;bottom:120px" ${x.a("drop", x.s + 0.4)}>${x.nodo("happy", 420)}</div>`;
  },
};
