// Diagram archetypes: tokens, meter, window, pile, haystack, predict, dial,
// inout, network. Each is one device whose working *is* the explanation.

const BRICK = ["var(--red)", "var(--blue)", "var(--yellow)", "var(--green)", "var(--purple)"];

function brick(x, text, i, { size = 92, attrs = "" } = {}) {
  const c = BRICK[i % BRICK.length];
  const fg = c.includes("yellow") ? "var(--ink)" : "var(--white)";
  return `<div style="position:relative;display:inline-block;margin-top:26px" ${attrs}>
    <div style="position:absolute;top:-22px;left:22%;width:18%;height:26px;border-radius:8px 8px 0 0;background:${c}"></div>
    <div style="position:absolute;top:-22px;right:22%;width:18%;height:26px;border-radius:8px 8px 0 0;background:${c}"></div>
    <div class="mono" style="position:relative;padding:22px 34px;border-radius:16px;background:${c};color:${fg};font-size:${size}px;line-height:1;box-shadow:inset 0 -12px 0 rgba(0,0,0,.16)">${x.esc(text)}</div>
  </div>`;
}

export const tokens = {
  doc: "Text as lego pieces. mode split (a word breaks into pieces), pieces (groups of words shown as bricks), compare (letters vs pieces).",
  render(sc, x) {
    if (sc.mode === "compare") {
      const letters = [...sc.word];
      const tL = x.cue(sc.cueLetters, 0.12);
      const tP = x.cue(sc.cuePieces, 0.4);
      const tLook = x.cue(sc.cueLook, 0.72);
      const rCount = letters.filter((c) => c.toLowerCase() === "r").length;
      return `
      <div class="card" style="position:absolute;left:110px;top:170px;width:820px;height:740px;padding:44px" ${x.a("left", tL - 0.2)}>
        <div class="kicker" style="color:var(--blue)">Tú ves</div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:60px">${letters.map((c, i) => `<div class="mono" style="width:120px;height:140px;border-radius:16px;border:5px solid var(--ink);display:flex;align-items:center;justify-content:center;font-size:80px;${c.toLowerCase() === "r" ? "background:var(--yellow)" : ""}" ${x.a("pop", tL + i * 0.07)}>${c.toUpperCase()}</div>`).join("")}</div>
        <div class="chip" style="position:absolute;left:44px;bottom:44px;background:var(--yellow)" ${x.a("pop", tL + letters.length * 0.07 + 0.3)}>${rCount} letras R</div>
      </div>
      <div class="card" style="position:absolute;right:110px;top:170px;width:820px;height:740px;padding:44px" ${x.a("right", tP - 0.2)}>
        <div class="kicker" style="color:var(--red)">La IA ve</div>
        <div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:80px">${sc.pieces.map((p, i) => brick(x, p, i, { size: 84, attrs: x.a("drop", tP + i * 0.15) })).join("")}</div>
        <div style="position:absolute;left:120px;top:250px" ${x.a("pop", tLook)} ${x.fx([{ at: tLook + 0.2, dur: 1.6, to: { x: 420 }, ease: "sine.inOut" }])}><span class="badge t-ink" style="width:150px;height:150px">${x.icon("search", 90)}</span></div>
        <div class="chip" style="position:absolute;left:44px;bottom:44px;background:var(--red);color:var(--white)" ${x.a("pop", tLook + 1.2)}>¿R? No ve letras</div>
      </div>`;
    }
    if (sc.mode === "pieces") {
      const groups = sc.groups.map((g, gi) => {
        const t = x.cue(g.cue, 0.15 + gi * 0.3);
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:30px">
          <div class="headline m" style="font-size:96px" ${x.a("blur", t)}>${x.esc(g.word)}</div>
          <div style="display:flex;gap:14px">${g.pieces.map((p, i) => brick(x, p, i + gi * 2, { size: g.pieces.length > 3 ? 72 : 96, attrs: x.a("drop", t + 0.45 + i * 0.16) })).join("")}</div>
        </div>`;
      });
      return `
      <div class="center layer" style="flex-direction:row;gap:150px;padding-bottom:120px">${groups.join("")}</div>
      ${sc.note ? `<div style="position:absolute;left:0;right:0;bottom:150px;text-align:center"><div class="chip" style="display:inline-flex" ${x.a("pop", x.cue(sc.cueNote, 0.7))}>${x.icon("blocks", 54)}${x.esc(sc.note)}</div></div>` : ""}`;
    }
    // split
    const t = x.cue(sc.cue, 0.35);
    const n = sc.pieces.length;
    return `
    <div class="center layer" style="padding-bottom:120px">
      <div class="mono" style="font-size:200px;color:var(--fg);letter-spacing:-.02em" ${x.a("blur", x.s + 0.25)} ${x.out("blur", t)}>${x.esc(sc.word)}</div>
    </div>
    <div class="center layer" style="flex-direction:row;gap:0;padding-bottom:120px">
      ${sc.pieces.map((p, i) => `<div ${x.fx([{ at: t + 0.7, dur: 0.6, to: { x: (i - (n - 1) / 2) * 60 }, ease: "back.out(2)" }])}>${brick(x, p, i, { size: 150, attrs: x.a("pop", t + 0.05 + i * 0.12) })}</div>`).join("")}
    </div>
    ${sc.note ? `<div style="position:absolute;left:0;right:0;bottom:150px;text-align:center"><div class="chip" style="display:inline-flex;font-size:52px" ${x.a("pop", x.cue(sc.cueNote, 0.7))}>${x.icon("blocks", 58)}${x.esc(sc.note)}</div></div>` : ""}`;
  },
};

export const meter = {
  doc: "Horizontal bars filling against a limit (value 1 = the limit) — limits, cost, capacity.",
  required: ["items"],
  render(sc, x) {
    const W = 1150;
    const rows = sc.items.map((it, i) => {
      const t = x.cue(it.cue, 0.2 + i * 0.3);
      const v = Math.min(it.value, 1.18);
      const coins = sc.unit === "coin" ? Math.max(1, Math.round(it.value * 9)) : 0;
      return `<div style="position:absolute;left:0;top:${i * 250}px;width:1650px;height:200px">
        <div style="position:absolute;left:0;top:50px;width:420px;font-family:var(--display);font-weight:var(--wd);font-size:60px" ${x.a("left", t - 0.15)}>${x.esc(it.label)}</div>
        <div style="position:absolute;left:440px;top:40px;width:${W}px;height:100px;border-radius:50px;background:var(--paper-2);overflow:visible">
          <div class="t-${it.tone ?? "blue"}" style="position:absolute;left:0;top:0;height:100px;width:${(v * W).toFixed(0)}px;border-radius:50px;background:${x.ground === "paper" || x.ground === "ink" ? "var(--tone)" : "var(--fg)"};transform-origin:left center" ${x.a("grow", t, { dur: Math.max(0.6, v * 1.3), ease: "power2.inOut" })}></div>
          ${coins ? `<div style="position:absolute;left:24px;top:14px;display:flex;gap:8px">${Array.from({ length: coins }, (_, k) => `<span style="color:var(--yellow);--icon-accent:var(--ink)" ${x.a("pop", t + 0.25 + k * 0.1)}>${x.icon("coin", 72)}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
    });
    const top = sc.items.length > 1 ? 330 : 430;
    const over = sc.items.some((i) => i.value > 1);
    const tAlert = x.cue(sc.cueAlert, 0.7);
    return `
    <div style="position:absolute;left:150px;top:150px"><h1 class="headline m" style="font-size:90px">${x.words(sc.title ?? "", sc.em ?? [], { min: x.s + 0.15, step: 0.08 })}</h1></div>
    <div style="position:absolute;left:150px;top:${top}px" ${over ? x.fx([{ at: tAlert, dur: 0.05, to: { x: -16 } }, { at: tAlert + 0.05, dur: 0.05, to: { x: 14 } }, { at: tAlert + 0.1, dur: 0.08, to: { x: 0 } }]) : ""}>${rows.join("")}</div>
    ${sc.limit ? `<div style="position:absolute;left:${150 + 440 + W}px;top:${top - 50}px;width:10px;height:${sc.items.length * 250}px;background:var(--red);border-radius:5px" ${x.a("growy", x.s + 0.4)}></div>
      <div class="chip" style="position:absolute;left:${150 + 440 + W - 120}px;top:${top - 140}px;background:var(--red);color:var(--white);font-size:40px" ${x.a("pop", x.s + 0.6)}>${x.esc(sc.limit)}</div>` : ""}
    ${sc.alert ? `<div class="t-red" style="position:absolute;left:560px;top:${top + 260}px;padding:18px 44px;border:12px solid var(--red);border-radius:22px;background:var(--white);color:var(--red);font-family:var(--display);font-weight:900;font-size:84px" ${x.a("stamp", tAlert)}>${x.esc(sc.alert)}</div>` : ""}`;
  },
};

export const window = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "The context window. mode chat: messages push older ones out of a fixed frame. mode counter: items fill a kitchen counter; past `capacity` the oldest falls off.",
  required: ["items"],
  render(sc, x) {
    const n = sc.items.length;
    const t0 = x.cue(sc.cueStart, 0.1) + 0.25;
    const tEnd = x.cue(sc.cueEnd, 0.85);
    const times = sc.items.map((it, i) => (it.cue ? x.cue(it.cue, 0.2) : t0 + ((tEnd - t0) * i) / Math.max(1, n - 1)));
    if (sc.mode === "chat") {
      const H = 132;
      const cap = sc.capacity ?? 5;
      const frameH = cap * H + 20;
      const msgs = sc.items.map((it, i) => {
        const mine = i % 2 === 0;
        const tone = it.tone === "yellow" ? "background:var(--yellow);color:var(--ink)" : it.tone === "red" ? "background:var(--red);color:var(--white)" : mine ? "background:var(--blue);color:var(--white)" : "background:var(--paper-2);color:var(--ink)";
        return `<div style="position:absolute;${mine ? "right" : "left"}:30px;top:${i * H + 10}px;max-width:640px;padding:24px 34px;border-radius:28px;font-size:40px;font-weight:700;${tone}" ${x.a("pop", times[i])}>${x.esc(it.label)}</div>`;
      });
      const scroll = sc.items.map((_, i) => (i >= cap ? { at: times[i] - 0.05, dur: 0.4, to: { y: -(i - cap + 1) * H }, ease: "power3.inOut" } : null)).filter(Boolean);
      return `
      <div style="position:absolute;left:150px;top:150px;width:520px"><h1 class="headline m" style="font-size:90px">${x.words(sc.title ?? "", [], { min: x.s + 0.15, step: 0.08 })}</h1>
        <div class="sub" style="margin-top:30px;color:var(--fg);opacity:.85" ${x.a("fade", times[cap] ?? tEnd)}>Lo más viejo se sale de la ventana</div></div>
      <div class="card" style="position:absolute;left:760px;top:${(1080 - frameH) / 2}px;width:1000px;height:${frameH}px;overflow:hidden;padding:0" ${x.a("zoom", x.s + 0.15)}>
        <div style="position:absolute;inset:0" ${x.fx(scroll)}>${msgs.join("")}</div>
      </div>
      <div style="position:absolute;left:730px;top:${(1080 - frameH) / 2 - 30}px;width:1060px;height:${frameH + 60}px;border:8px dashed var(--yellow);border-radius:44px" ${x.a("fade", x.s + 0.5)} data-layout-ignore></div>`;
    }
    // counter
    const cap = sc.capacity ?? 5;
    const slot = 300;
    const left0 = 960 - (cap * slot) / 2;
    const items = sc.items.map((it, i) => {
      const shiftAt = i + cap < n ? times[i + cap] : null;
      const tone = it.tone === "yellow" ? "background:var(--yellow)" : "";
      return `<div style="position:absolute;left:${i * slot + 20}px;bottom:0;width:${slot - 40}px" ${x.a("drop", times[i])} ${shiftAt ? x.out("fall", shiftAt) : ""}>
        <div class="card" style="height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;${tone}">
          ${x.badge(it.icon ?? "doc", ["red", "blue", "green", "ink"][i % 4], 104)}
          <div style="font-family:var(--display);font-weight:var(--wd);font-size:${it.label.length > 12 ? 32 : 38}px;line-height:1.05;padding:0 12px">${x.esc(it.label)}</div>
        </div>
      </div>`;
    });
    const shifts = sc.items.map((_, i) => (i >= cap ? { at: times[i] - 0.05, dur: 0.5, to: { x: -(i - cap + 1) * slot }, ease: "power3.inOut" } : null)).filter(Boolean);
    return `
    <div style="position:absolute;left:150px;top:150px"><h1 class="headline m" style="font-size:96px">${x.words(sc.title ?? "", [], { min: x.s + 0.15, step: 0.08 })}</h1></div>
    <div style="position:absolute;left:${left0}px;top:400px;width:${cap * slot}px;height:340px;overflow:visible">
      <div style="position:absolute;left:0;bottom:0;width:100%;height:340px" ${x.fx(shifts)}>${items.join("")}</div>
    </div>
    <div style="position:absolute;left:${left0 - 40}px;top:740px;width:${cap * slot + 80}px;height:70px;border-radius:20px;background:var(--hair-2);box-shadow:0 18px 0 rgba(21,38,59,.35)" ${x.a("grow", x.s + 0.15, { dur: 0.6 })}></div>
    <div class="chip" style="position:absolute;left:${left0 + cap * slot - 150}px;top:840px;background:var(--red);color:var(--white);font-size:38px" ${x.a("pop", x.s + 0.7)}>Límite: ${cap}</div>`;
  },
};

export const pile = {
  doc: "Many copies of one icon dropping into a heap — 'thousands of examples', 'whole books'.",
  required: ["icon"],
  render(sc, x) {
    const n = sc.count ?? 15;
    const t = x.cue(sc.cue, 0.2);
    const rows = [];
    let left = n;
    for (let w = Math.ceil(Math.sqrt(n * 2)); left > 0 && w > 0; w--) {
      const take = Math.min(w, left);
      rows.push(take);
      left -= take;
    }
    let k = 0;
    const size = 130;
    const els = rows.map((w, r) => Array.from({ length: w }, (_, i) => {
      const idx = k++;
      const xx = 960 - (w * size) / 2 + i * size + (((idx * 37) % 9) - 4) * 3;
      const yy = 820 - r * (size - 18) - size;
      const rot = ((idx * 53) % 30) - 15;
      return `<div style="position:absolute;left:${xx}px;top:${yy}px" ${x.a("drop", t + idx * 0.06)}><div style="color:${["var(--blue)", "var(--red)", "var(--green)", "var(--purple)"][idx % 4]};--icon-accent:var(--white);transform:rotate(${rot}deg)">${x.icon(sc.icon, size - 10)}</div></div>`;
    }).join("")).join("");
    return `
    ${els}
    <div style="position:absolute;left:0;right:0;top:150px;text-align:center"><h1 class="headline m" style="font-size:92px">${x.words(sc.label ?? "", sc.em ?? [], { min: t + 0.4, step: 0.09 })}</h1></div>`;
  },
};

export const haystack = {
  doc: "A crowded board of grey lines hiding one important line that gets lost ('needle in a haystack').",
  render(sc, x) {
    const cols = 6;
    const rowsN = 6;
    const tN = x.cue(sc.cueNeedle, 0.55);
    const needleAt = Math.floor((rowsN * cols) / 2) + 2;
    const cells = Array.from({ length: rowsN * cols }, (_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const isNeedle = i === needleAt;
      const w = 220 + ((i * 41) % 60);
      return `<div style="position:absolute;left:${c * 270}px;top:${r * 92}px;width:${isNeedle ? 520 : w}px;height:62px;border-radius:14px;${isNeedle ? "background:var(--yellow);z-index:2;display:flex;align-items:center;padding:0 22px;font-family:var(--display);font-weight:var(--wd);font-size:30px;color:var(--ink)" : "background:var(--paper-2)"}" ${x.a("pop", x.s + 0.3 + i * 0.025)} ${isNeedle ? x.fx([{ at: tN - 0.1, dur: 0.15, to: { scale: 1.15 } }, { at: tN + 0.05, dur: 0.3, to: { scale: 1 } }, { at: tN + 1.1, dur: 0.6, to: { opacity: 0.12 } }]) : ""}>${isNeedle ? x.esc(sc.needle) : ""}</div>`;
    });
    return `
    <div style="position:absolute;left:0;right:0;top:150px;text-align:center"><h1 class="headline m" style="font-size:88px">${x.words(sc.label ?? "", sc.em ?? [], { min: x.s + 0.15, step: 0.08 })}</h1></div>
    <div class="card" style="position:absolute;left:150px;top:260px;width:1620px;height:640px;padding:40px 30px" ${x.a("zoom", x.s + 0.15)}>
      <div style="position:relative">${cells.join("")}</div>
    </div>
    <div style="position:absolute;left:250px;top:420px" ${x.a("pop", tN + 0.9)} ${x.fx([{ at: tN + 1.1, dur: 1.8, to: { x: 1100, y: 160 }, ease: "sine.inOut" }])}><span class="badge t-ink" style="width:170px;height:170px">${x.icon("search", 100)}</span></div>
    <div style="position:absolute;right:170px;top:200px;font-family:var(--display);font-weight:900;font-size:220px;color:var(--red)" ${x.a("spin", Math.min(tN + 2.4, x.next - 0.6))}>?</div>`;
  },
};

export const predict = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "Next-token prediction: a sentence with a blank, candidate bars with probabilities, the pick flies into the blank. temp low|high styles it; pick2 swaps to a weirder word.",
  required: ["prefix", "candidates"],
  render(sc, x) {
    const t = x.cue(sc.cue, 0.25);
    const pick = sc.pick ?? 0;
    const tPick = t + 0.6 + sc.candidates.length * 0.15 + 0.4;
    const t2 = sc.pick2 != null ? x.cue(sc.cue2, 0.75) : null;
    const tone = sc.temp === "high" ? "red" : sc.temp === "low" ? "blue" : "green";
    const fill = x.ground === "paper" ? "var(--tone)" : "var(--fg)";
    const bars = sc.candidates.map((c, i) => {
      const chosen = i === pick || i === sc.pick2;
      const tc = i === sc.pick2 ? t2 : tPick;
      return `<div style="position:absolute;left:0;top:${i * 128}px;width:1300px;height:100px;display:flex;align-items:center;gap:30px" ${x.a("left", t + i * 0.15)}>
        <div class="mono" style="width:300px;text-align:right;font-size:52px;color:var(--fg)">${x.esc(c.w)}</div>
        <div style="position:relative;width:820px;height:76px;border-radius:38px;background:rgba(127,140,160,.18)">
          <div class="t-${tone}" style="position:absolute;left:0;top:0;bottom:0;width:${Math.max(4, c.p * 100 * 1.55).toFixed(0)}%;max-width:100%;border-radius:38px;background:${fill};transform-origin:left center" ${x.a("grow", t + 0.2 + i * 0.15, { dur: 0.7 })}></div>
        </div>
        <div class="mono" style="font-size:44px;color:var(--fg);width:150px">${Math.round(c.p * 100)}%</div>
        ${chosen ? `<div style="position:absolute;left:-30px;top:-10px;width:1360px;height:120px;border:7px solid var(--fg);border-radius:30px" ${x.a("pop", tc)} data-layout-ignore></div>` : ""}
      </div>`;
    });
    const word = (w, at, attrs = "") => `<span class="mono" style="position:absolute;left:12px;bottom:8px;white-space:nowrap;line-height:1" ${x.a("drop", at)} ${attrs}>${x.esc(w)}</span>`;
    const big = sc.prefix.length > 16 ? 72 : 96;
    const tempChip = sc.temp ? `<div class="chip t-${tone}" style="position:absolute;right:150px;top:120px;background:var(--tone);color:var(--white)" ${x.a("pop", x.s + 0.35)}>${x.icon(sc.temp === "high" ? "fire" : "snow", 54)}Temperatura ${sc.temp === "high" ? "alta" : "baja"}</div>` : "";
    return `
    ${tempChip}
    <div style="position:absolute;left:150px;top:${sc.temp ? 230 : 160}px;display:flex;align-items:flex-end;gap:30px;font-family:var(--display);font-weight:var(--wd);font-size:${big}px;color:var(--fg);white-space:nowrap">
      <span ${x.a("blur", x.s + 0.2)}>${x.esc(sc.prefix)}</span>
      <span style="position:relative;display:inline-block;width:${sc.prefix.length > 16 ? 400 : 460}px;height:${big + 20}px;font-size:${big}px;color:var(--accent)">
        <span style="position:absolute;left:0;right:0;bottom:0;height:10px;border-radius:5px;background:var(--accent);transform-origin:left center" ${x.a("grow", x.s + 0.45)}></span>
        ${word(sc.candidates[pick].w, tPick + 0.15, t2 ? x.out("fall", t2) : "")}${t2 ? word(sc.candidates[sc.pick2].w, t2 + 0.2) : ""}
      </span>
    </div>
    <div style="position:absolute;left:150px;top:${sc.temp ? 450 : 390}px">${bars.join("")}</div>
    ${sc.stamp ? `<div class="t-red" style="position:absolute;left:1080px;top:180px;padding:16px 40px;border:12px solid var(--red);border-radius:22px;background:var(--white);color:var(--red);font-family:var(--display);font-weight:900;font-size:70px" ${x.a("stamp", x.cue(sc.cueStamp, 0.8))}>${x.esc(sc.stamp)}</div>` : ""}
    ${sc.note ? `<div style="position:absolute;right:150px;bottom:70px;font-size:28px;color:var(--fg);opacity:.6" ${x.a("fade", t + 0.8)}>${x.esc(sc.note)}</div>` : ""}`;
  },
};

export const dial = {
  doc: "A big gauge whose needle sweeps (from→to, 0..1) — temperature, risk, any setting.",
  render(sc, x) {
    const t = x.cue(sc.cue, 0.35);
    const ang = (v) => -90 + v * 180;
    const seg = (a0, a1, color) => {
      const r = 400;
      const p = (a) => [960 + r * Math.cos(((a - 90) * Math.PI) / 180), 820 + r * Math.sin(((a - 90) * Math.PI) / 180)];
      const [x0, y0] = p(a0);
      const [x1, y1] = p(a1);
      return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="110"/>`;
    };
    return `
    <svg style="position:absolute;inset:0" width="1920" height="1080" viewBox="0 0 1920 1080" ${x.a("zoom", x.s + 0.15)}>
      ${seg(-90, -31, "var(--blue)")}${seg(-29, 29, "var(--yellow)")}${seg(31, 90, "var(--red)")}
    </svg>
    <div style="position:absolute;left:950px;top:400px;width:20px;height:430px;transform-origin:50% 420px" ${x.fx([{ at: x.s + 0.2, dur: 0.6, from: { rotation: -90 }, to: { rotation: ang(sc.from ?? 0.2) }, ease: "power3.out" }, { at: t, dur: 1.1, to: { rotation: ang(sc.to ?? 0.8) }, ease: "back.out(1.6)" }])}>
      <div style="position:absolute;left:0;top:0;width:20px;height:430px;border-radius:10px;background:var(--fg)"></div>
    </div>
    <div style="position:absolute;left:910px;top:770px;width:100px;height:100px;border-radius:50%;background:var(--fg)"></div>
    <div style="position:absolute;left:470px;top:880px" ${x.a("pop", x.s + 0.5)}><div class="chip t-blue">${x.badge("snow", "blue", 70)}Precisa</div></div>
    <div style="position:absolute;right:470px;top:880px" ${x.a("pop", x.s + 0.65)}><div class="chip">${x.badge("fire", "red", 70)}Arriesgada</div></div>
    <div style="position:absolute;left:0;right:0;top:150px;text-align:center"><h1 class="headline m" style="font-size:110px">${x.words(sc.label ?? "", sc.em ?? [], { min: x.s + 0.2 })}</h1></div>`;
  },
};

export const inout = {
  doc: "Something enters a box, the box computes, something comes out — one pair per cue.",
  required: ["pairs"],
  render(sc, x) {
    const box = { left: 760, top: 330, w: 400, h: 400 };
    const pairs = sc.pairs.map((p, i) => {
      const t = x.cue(p.cue, 0.15 + i * 0.4);
      const tNext = sc.pairs[i + 1] ? x.cue(sc.pairs[i + 1].cue, 0.55 + i * 0.4) - 0.3 : null;
      return `
      <div style="position:absolute;left:150px;top:440px" ${x.a("left", t)} ${x.fx([{ at: t + 0.6, dur: 0.5, to: { x: 520, scale: 0.4, opacity: 0 }, ease: "power3.in" }])}>
        <div class="chip" style="font-size:52px">${x.badge(p.inIcon ?? "doc", "blue", 96)}${x.esc(p.in)}</div>
      </div>
      <div style="position:absolute;left:1250px;top:440px" ${x.a("left", t + 1.3)} ${tNext ? x.out("up", tNext) : ""}>
        <div class="chip" style="font-size:56px;background:var(--yellow)">${x.badge(p.outIcon ?? "doc", "red", 100)}${x.esc(p.out)}</div>
      </div>`;
    });
    const pulses = sc.pairs.flatMap((p, i) => {
      const t = x.cue(p.cue, 0.15 + i * 0.4) + 1.05;
      return [{ at: t, dur: 0.12, to: { scale: 1.1 }, ease: "power2.out" }, { at: t + 0.12, dur: 0.35, to: { scale: 1 }, ease: "power2.out" }];
    });
    const digits = Array.from({ length: 16 }, (_, i) => `<span class="mono" style="font-size:40px;color:var(--yellow);opacity:.9">${(i * 7 + 3) % 10}</span>`).join("");
    return `
    <div style="position:absolute;left:${box.left}px;top:${box.top}px;width:${box.w}px;height:${box.h}px" ${x.a("zoom", x.s + 0.15)}>
      <div style="position:absolute;inset:0;border-radius:48px;background:var(--ink);box-shadow:var(--sh) rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px" ${x.fx(pulses)}>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px 22px">${digits}</div>
        <div style="font-family:var(--display);font-weight:900;font-size:64px;color:var(--white)">${x.esc(sc.box ?? "Modelo")}</div>
      </div>
    </div>
    <svg style="position:absolute;inset:0" width="1920" height="1080" viewBox="0 0 1920 1080">
      <path d="M640 530H740" pathLength="1" stroke-dasharray="1" stroke="var(--fg)" stroke-width="12" stroke-linecap="round" ${x.a("draw", x.s + 0.4)}/>
      <path d="M1180 530H1230" pathLength="1" stroke-dasharray="1" stroke="var(--fg)" stroke-width="12" stroke-linecap="round" ${x.a("draw", x.s + 0.55)}/>
    </svg>
    <div class="kicker" style="position:absolute;left:150px;top:300px;color:var(--fg)" ${x.a("blur", x.s + 0.2)}>Entra</div>
    <div class="kicker" style="position:absolute;left:1250px;top:300px;color:var(--fg)" ${x.a("blur", x.s + 0.3)}>Sale</div>
    ${pairs.join("")}`;
  },
};

export const network = {
  doc: "Dots and links densify into a pattern, turn into numbers, then collapse into a file.",
  render(sc, x) {
    const t = x.cue(sc.cue, 0.12);
    const tNum = x.cue(sc.cueNumbers, 0.5);
    const tFile = x.cue(sc.cueFile, 0.78);
    const pts = Array.from({ length: 22 }, (_, i) => [560 + ((i * 263) % 800), 230 + ((i * 167) % 560)]);
    const links = [];
    pts.forEach((p, i) => {
      [(i * 5 + 3) % pts.length, (i * 7 + 1) % pts.length].forEach((j) => {
        if (j !== i) links.push([p, pts[j], i]);
      });
    });
    const lines = links.map(([a, b, i], k) => `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" pathLength="1" stroke-dasharray="1" stroke="var(--blue)" stroke-width="5" opacity=".7" ${x.a("draw", t + 0.3 + (k % 22) * 0.05, { dur: 0.5 })}/>`).join("");
    const dots = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="18" fill="${["var(--yellow)", "var(--red)", "var(--green)", "var(--white)"][i % 4]}" ${x.a("pop", t + i * 0.04)}/>`).join("");
    const nums = pts.map((p, i) => `<div class="mono" style="position:absolute;left:${p[0] + 18}px;top:${p[1] - 52}px;font-size:30px;color:var(--white)" ${x.a("pop", tNum + i * 0.03)}>${(((i * 37) % 99) / 100).toFixed(2)}</div>`).join("");
    return `
    <div style="position:absolute;inset:0;transform-origin:960px 520px" ${x.fx([{ at: tFile, dur: 0.6, to: { scale: 0.08, opacity: 0, x: 0 }, ease: "power3.in" }])}>
      <svg style="position:absolute;inset:0" width="1920" height="1080" viewBox="0 0 1920 1080">${lines}${dots}</svg>
      ${nums}
    </div>
    <div style="position:absolute;left:810px;top:330px;color:var(--white);--icon-accent:var(--ink)" ${x.a("spin", tFile + 0.5)}>${x.icon("file", 300)}</div>
    <div style="position:absolute;left:0;right:0;bottom:90px;text-align:center"><div class="chip" style="display:inline-flex;font-size:52px" ${x.a("rise", x.s + 0.4)}>${x.esc(sc.label ?? "")}</div></div>`;
  },
};
