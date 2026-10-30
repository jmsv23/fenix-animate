// Interface & list archetypes: chat, steps, grid, verify, loop, collect,
// versus, stamp.

const VERDICT = {
  meh: { text: "Genérico", tone: "yellow", mood: "neutral" },
  good: { text: "¡Mucho mejor!", tone: "green", mood: "happy" },
  bad: { text: "Incorrecto", tone: "red", mood: "proud" },
};

// The prompt box on its own, huge, with a label pointing at it.
function promptBox(sc, x) {
  const tUser = x.s + 0.4;
  const tLabel = x.cue(sc.cueLabel, 0.55);
  return `
    <div class="card" style="position:absolute;left:210px;top:470px;width:1500px;height:230px;display:flex;align-items:center;gap:40px;padding:0 50px" ${x.a("zoom", x.s + 0.15)}>
      <div style="flex:1;font-size:76px;font-weight:700;color:var(--ink)"><span ${x.a("type", tUser, { dur: 1 })}>${x.typed(sc.user)}</span><span style="display:inline-block;width:8px;height:80px;background:var(--blue);vertical-align:middle;margin-left:10px" ${x.fx([0, 1, 2, 3, 4, 5].map((k) => ({ at: x.s + 0.4 + k * 0.5, dur: 0.01, to: { opacity: k % 2 } })))}></span></div>
      <span class="badge t-blue" style="width:130px;height:130px">${x.icon("bolt", 70)}</span>
    </div>
    <div style="position:absolute;left:210px;top:330px;font-family:var(--display);font-weight:var(--wd);font-size:44px;color:var(--muted)" ${x.a("blur", x.s + 0.3)}>Chat con la IA</div>
    ${sc.label ? `<div style="position:absolute;left:820px;top:760px;display:flex;flex-direction:column;align-items:center;gap:6px" ${x.a("rise", tLabel)}>
      <svg width="90" height="110" viewBox="0 0 90 110"><path d="M45 105V12M12 44l33-34 33 34" fill="none" stroke="var(--fg)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="chip" style="font-size:88px;padding:18px 54px;background:var(--yellow)">${x.esc(sc.label)}</span>
    </div>` : ""}`;
}

export const chat = {
  doc: "Chat window: the user's prompt types in, the AI answers (verdict meh|good|bad stamps it). Without `ai`, a `label` arrow points at the input box.",
  required: ["user"],
  render(sc, x) {
    if (!sc.ai) return promptBox(sc, x);
    const tUser = x.s + 0.35;
    const tAi = x.cue(sc.cueAi, 0.45);
    const v = VERDICT[sc.verdict];
    const userBubble = sc.ai
      ? `<div style="align-self:flex-end;max-width:760px;padding:26px 34px;border-radius:30px 30px 6px 30px;background:var(--blue);color:var(--white);font-size:44px;line-height:1.25" ${x.a("pop", tUser)}><span ${x.a("type", tUser + 0.15, { dur: 0.9 })}>${x.typed(sc.user)}</span></div>`
      : "";
    const aiBubble = sc.ai
      ? `<div style="display:flex;gap:22px;align-items:flex-end;position:relative">
          <div style="flex:none" ${x.a("pop", tAi - 0.6)}>${x.nodo(v?.mood ?? "neutral", 96)}</div>
          <div style="position:relative;max-width:820px">
            <div style="position:absolute;left:0;bottom:0;padding:22px 30px;border-radius:30px 30px 30px 6px;background:var(--paper-2);display:flex;gap:12px" ${x.a("pop", tAi - 0.55)} ${x.out("fade", tAi)}>${[0, 1, 2].map((i) => `<span style="width:18px;height:18px;border-radius:50%;background:var(--ink);opacity:.5" ${x.fx([{ at: tAi - 0.5 + i * 0.12, dur: 0.18, to: { y: -10 }, ease: "power1.out" }, { at: tAi - 0.32 + i * 0.12, dur: 0.18, to: { y: 0 }, ease: "power1.in" }])}></span>`).join("")}</div>
            <div style="padding:26px 34px;border-radius:30px 30px 30px 6px;background:var(--paper-2);color:var(--ink);font-size:42px;line-height:1.3" ${x.a("fade", tAi)}><span ${x.a("type", tAi, { dur: 1.4 })}>${x.typed(sc.ai)}</span></div>
          </div>
        </div>`
      : "";
    const input = `<div style="margin-top:auto;display:flex;align-items:center;gap:20px;padding:22px 26px;border-radius:24px;border:4px solid ${sc.ai ? "var(--paper-2)" : "var(--blue)"};font-size:40px;color:var(--muted)" id="${x.sid}-input">
        <span style="flex:1;color:${sc.ai ? "#9AA5B5" : "var(--ink)"}">${sc.ai ? "Escribe un mensaje…" : `<span ${x.a("type", tUser, { dur: 1 })}>${x.typed(sc.user)}</span>`}</span>
        <span class="badge t-blue" style="width:64px;height:64px">${x.icon("bolt", 34)}</span>
      </div>`;
    const stamp = v
      ? `<div style="position:absolute;left:640px;top:690px;padding:16px 36px;border:8px solid var(--tone);border-radius:18px;color:var(--tone);font-family:var(--display);font-weight:900;font-size:58px;text-transform:uppercase;background:var(--white)" class="t-${v.tone === "yellow" ? "ink" : v.tone}" ${x.a("stamp", Math.min(tAi + 1.6, x.next - 0.9))}>${v.text}</div>`
      : "";
    return `
    <div class="card" style="position:absolute;left:150px;top:120px;width:${sc.ai ? 1180 : 760}px;height:840px;padding:0;display:flex;flex-direction:column;overflow:hidden" ${x.a("rise", x.s + 0.1)}>
      <div style="display:flex;align-items:center;gap:14px;padding:24px 32px;background:var(--ink);color:var(--white);font-family:var(--display);font-weight:var(--wd);font-size:30px">
        <span style="width:18px;height:18px;border-radius:50%;background:var(--red)"></span><span style="width:18px;height:18px;border-radius:50%;background:var(--yellow)"></span><span style="width:18px;height:18px;border-radius:50%;background:var(--green)"></span>
        <span style="margin-left:18px">Chat con la IA</span>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:30px;padding:40px 40px 34px">${userBubble}${aiBubble}${input}</div>
    </div>
    ${sc.ai ? `<div style="position:absolute;right:150px;top:290px" ${x.a("drop", x.s + 0.5)}>${x.nodo(v?.mood ?? "neutral", 330)}</div>` : ""}
    ${stamp}`;
  },
};

export const steps = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "A titled list that builds one big card per item as the voice names it (2–4 items).",
  required: ["items"],
  render(sc, x) {
    const tones = ["red", "blue", "yellow", "green"];
    const gap = sc.items.length > 3 ? 168 : 205;
    const rows = sc.items.map((it, i) => {
      const t = x.cue(it.cue, 0.2 + (0.6 * i) / sc.items.length);
      return `<div class="card" style="position:absolute;left:0;top:${i * gap}px;width:1300px;height:${gap - 34}px;display:flex;align-items:center;gap:34px;padding:0 40px" ${x.a("left", t)}>
        <div style="width:84px;height:84px;border-radius:50%;background:var(--ink);color:var(--white);font-family:var(--display);font-weight:900;font-size:48px;display:flex;align-items:center;justify-content:center;flex:none">${i + 1}</div>
        <div style="font-family:var(--display);font-weight:var(--wd);font-size:${sc.items.length > 3 ? 58 : 66}px;flex:1;line-height:1.05">${x.esc(it.text)}</div>
        <span ${x.a("spin", t + 0.2)}>${x.badge(it.icon ?? "check", tones[i % 4], 104)}</span>
      </div>`;
    });
    return `
    <div style="position:absolute;left:150px;top:150px"><h1 class="headline m" style="font-size:88px">${x.words(sc.title ?? "", sc.em ?? [], { min: x.s + 0.2, step: 0.09 })}</h1></div>
    <div style="position:absolute;left:310px;top:${sc.items.length > 3 ? 280 : 300}px">${rows.join("")}</div>`;
  },
};

export const grid = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "Tiles that light up as each is named — overviews, recaps, 'everywhere' lists (3–8 items).",
  required: ["items"],
  render(sc, x) {
    const tones = ["red", "blue", "yellow", "green", "ink", "red", "blue", "yellow"];
    const cols = sc.items.length <= 4 ? sc.items.length : 4;
    const w = cols === 4 ? 380 : 440;
    const h = sc.items.some((i) => i.sub) ? 300 : 270;
    const rowsN = Math.ceil(sc.items.length / cols);
    const top = rowsN > 1 ? 300 : 400;
    const tiles = sc.items.map((it, i) => {
      const r = Math.floor(i / cols);
      const inRow = Math.min(cols, sc.items.length - r * cols);
      const left = (1920 - (inRow * w + (inRow - 1) * 40)) / 2 + (i % cols) * (w + 40);
      const t = x.cue(it.cue, 0.15 + (0.75 * i) / sc.items.length);
      return `<div class="card" style="position:absolute;left:${left}px;top:${top + r * (h + 40)}px;width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center" ${x.a("pop", t)}>
        ${x.badge(it.icon ?? "star", tones[i], 120)}
        <div style="font-family:var(--display);font-weight:var(--wd);font-size:46px;line-height:1">${x.esc(it.text)}</div>
        ${it.sub ? `<div style="font-size:30px;color:#5D6B80;line-height:1.1;padding:0 20px">${x.esc(it.sub)}</div>` : ""}
      </div>`;
    });
    return `
    ${sc.title ? `<div style="position:absolute;left:0;right:0;top:${rowsN > 1 ? 140 : 190}px;text-align:center"><h1 class="headline m" style="font-size:96px">${x.words(sc.title, sc.em ?? [], { min: x.s + 0.15, step: 0.08 })}</h1></div>` : ""}
    ${tiles.join("")}`;
  },
};

export const verify = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "A list checked line by line: each item gets ✓ (ok:true) or ✗ (ok:false, struck through).",
  required: ["items"],
  render(sc, x) {
    const n = sc.items.length;
    const gap = n > 4 ? 128 : 170;
    const tList = x.cue(sc.cueList, 0.15);
    const okList = sc.items.filter((i) => i.ok);
    const badList = sc.items.filter((i) => !i.ok);
    const tOk = x.cue(sc.cueOk, 0.6);
    const tBad = x.cue(sc.cueBad, 0.8);
    const rows = sc.items.map((it, i) => {
      const tIn = it.cue ? x.cue(it.cue, 0.2) : tList + i * 0.12;
      const k = it.ok ? okList.indexOf(it) : badList.indexOf(it);
      const tMark = (it.ok ? tOk : tBad) + k * 0.22;
      return `<div style="position:absolute;left:0;top:${i * gap}px;width:1250px;height:${gap - 26}px" ${x.a("left", tIn)}>
        <div class="card" style="position:absolute;inset:0;display:flex;align-items:center;gap:28px;padding:0 36px" ${it.ok ? "" : x.out("dim", tMark + 0.3)}>
          ${it.icon ? x.badge(it.icon, "blue", gap - 60) : x.badge("book", "ink", gap - 60)}
          <div style="font-family:var(--display);font-weight:var(--wd);font-size:${n > 4 ? 46 : 56}px">${x.esc(it.text)}</div>
        </div>
        ${it.ok ? "" : `<div style="position:absolute;left:20px;right:150px;top:46%;height:12px;border-radius:6px;background:var(--red);transform-origin:left center" ${x.a("grow", tMark + 0.1, { dur: 0.3 })}></div>`}
        <div style="position:absolute;right:-60px;top:${(gap - 26 - 110) / 2}px" ${x.a("stamp", tMark)}>${x.badge(it.ok ? "check" : "cross", it.ok ? "green" : "red", 110)}</div>
      </div>`;
    });
    const top = n > 4 ? 270 : 300;
    return `
    <div style="position:absolute;left:150px;top:150px"><h1 class="headline m" style="font-size:88px">${x.words(sc.title ?? "", sc.em ?? [], { min: x.s + 0.15, step: 0.08 })}</h1></div>
    <div style="position:absolute;left:300px;top:${top}px">${rows.join("")}</div>`;
  },
};

export const loop = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "A cycle of 3–4 steps around a centre label, each node lighting when named.",
  required: ["steps"],
  render(sc, x) {
    const n = sc.steps.length;
    const cx = 960;
    const cy = 560;
    const R = 330;
    const tones = ["red", "blue", "green", "ink"];
    const pos = sc.steps.map((_, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)];
    });
    const times = sc.steps.map((st, i) => x.cue(st.cue, 0.15 + (0.6 * i) / n));
    const arcs = pos.map((p, i) => {
      const q = pos[(i + 1) % n];
      const a0 = Math.atan2(p[1] - cy, p[0] - cx) + 0.42;
      const a1 = Math.atan2(q[1] - cy, q[0] - cx) - 0.42 + (i === n - 1 ? 2 * Math.PI : 0);
      const big = a1 - a0 > Math.PI ? 1 : 0;
      const p0 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)];
      const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)];
      const t = times[i] + 0.35;
      return `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${R} ${R} 0 ${big} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" pathLength="1" stroke-dasharray="1" fill="none" stroke="var(--fg)" stroke-width="12" stroke-linecap="round" ${x.a("draw", t, { dur: 0.5 })}/>
        <circle cx="${p1[0].toFixed(1)}" cy="${p1[1].toFixed(1)}" r="16" fill="var(--fg)" ${x.a("pop", t + 0.45)}/>`;
    });
    const nodes = sc.steps.map((st, i) => `<div style="position:absolute;left:${pos[i][0] - 150}px;top:${pos[i][1] - 110}px;width:300px;display:flex;flex-direction:column;align-items:center;gap:12px" ${x.a("pop", times[i])}>
        ${x.badge(st.icon ?? "star", tones[i % 4], 150)}
        <div class="chip" style="font-size:44px;padding:12px 30px">${x.esc(st.text)}</div>
      </div>`);
    return `
    <svg style="position:absolute;inset:0" width="1920" height="1080" viewBox="0 0 1920 1080">${arcs.join("")}</svg>
    ${nodes.join("")}
    ${sc.center ? `<div style="position:absolute;left:${cx - 260}px;top:${cy - 50}px;width:520px;text-align:center;font-family:var(--display);font-weight:900;font-size:62px;color:var(--fg)" ${x.a("zoom", times[n - 1] + 0.9)}>${x.esc(sc.center)}</div>` : ""}`;
  },
};

export const collect = {
  builds: true, // reveals part by part as the voice names it: may run longer
  doc: "Items appear one by one and fly into a target card ('everything that goes into the prompt').",
  required: ["items", "into"],
  render(sc, x) {
    const n = sc.items.length;
    const tone = ["yellow", "red", "green", "blue"];
    const gap = n > 3 ? 170 : 210;
    const top0 = (1080 - (n * gap - 40)) / 2;
    const target = { left: 1150, top: 250, w: 620, h: 580 };
    const chips = sc.items.map((it, i) => {
      const t = x.cue(it.cue, 0.15 + (0.6 * i) / n);
      const y = top0 + i * gap;
      const dx = target.left + 60 - 150;
      const dy = target.top + 190 + i * 86 - y;
      return `<div style="position:absolute;left:150px;top:${y}px" ${x.a("left", t)} ${x.fx([{ at: t + 0.85, dur: 0.6, to: { x: dx, y: dy, scale: 0.55, opacity: 0 }, ease: "power3.in" }])}>
        <div class="chip" style="font-size:48px">${x.badge(it.icon ?? "doc", tone[i % 4], 76)}${x.esc(it.text)}</div>
      </div>`;
    });
    const lines = sc.items.map((it, i) => {
      const t = x.cue(it.cue, 0.15 + (0.6 * i) / n) + 1.4;
      return `<div style="display:flex;align-items:center;gap:16px;font-size:36px;font-weight:700;color:var(--ink)" ${x.a("pop", t)}>${x.badge(it.icon ?? "doc", tone[i % 4], 56)}${x.esc(it.text)}</div>`;
    });
    const bumps = sc.items.map((it, i) => {
      const t = x.cue(it.cue, 0.15 + (0.6 * i) / n) + 1.4;
      return [{ at: t, dur: 0.12, to: { scale: 1.06 }, ease: "power2.out" }, { at: t + 0.12, dur: 0.3, to: { scale: 1 }, ease: "power2.out" }];
    }).flat();
    return `
    <div style="position:absolute;left:${target.left}px;top:${target.top}px;width:${target.w}px;height:${target.h}px" ${x.a("zoom", x.s + 0.2)}>
      <div class="card" style="position:absolute;inset:0;padding:40px;display:flex;flex-direction:column;gap:22px" ${x.fx(bumps)}>
        <div style="display:flex;align-items:center;gap:20px;font-family:var(--display);font-weight:var(--wd);font-size:52px">${x.badge(sc.intoIcon ?? "chat", "blue", 92)}${x.esc(sc.into)}</div>
        <div style="height:4px;background:var(--paper-2);border-radius:2px"></div>
        ${lines.join("")}
      </div>
    </div>
    ${chips.join("")}`;
  },
};

export const versus = {
  doc: "Two cards side by side with a VS badge: before/after, A/B, two ideas.",
  required: ["left", "right"],
  render(sc, x) {
    const card = (side, d, from) => {
      const t = x.cue(d.cue, from === "left" ? 0.15 : 0.5);
      const tone = d.tone ?? (from === "left" ? "red" : "blue");
      return `<div style="position:absolute;${side}:150px;top:200px;width:740px;height:700px" ${x.a(from, t)}>
        <div class="card t-${tone}" style="position:absolute;inset:0;overflow:hidden;display:flex;flex-direction:column">
          <div style="background:var(--tone);color:${tone === "yellow" ? "var(--ink)" : "var(--white)"};padding:36px 44px;display:flex;align-items:center;gap:26px;font-family:var(--display);font-weight:var(--wd);font-size:62px">
            ${x.badge(d.icon ?? "star", "white", 100)}${x.esc(d.title)}
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 50px;text-align:center;gap:30px">
            ${sc.faces ? `<div style="height:260px;overflow:hidden">${x.person(sc.faces, from === "left" ? "happy" : "happy", 0.62)}</div>` : ""}
            <div style="font-family:var(--display);font-weight:var(--wd);font-size:${d.text.length > 22 ? 54 : 70}px;line-height:1.12">${x.esc(d.text)}</div>
          </div>
        </div>
      </div>`;
    };
    const tR = x.cue(sc.right.cue, 0.5);
    return `${card("left", sc.left, "left")}${card("right", sc.right, "right")}
    <div style="position:absolute;left:880px;top:470px;width:160px;height:160px;border-radius:50%;background:var(--ink);color:var(--yellow);border:8px solid var(--white);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:900;font-size:62px;z-index:3" ${x.a("slam", tR + 0.3)}>VS</div>`;
  },
};

export const stamp = {
  doc: "A document whose lines appear, then a big stamp slams on it (FALSO, ¡OJO!, etc.).",
  required: ["lines", "stamp"],
  render(sc, x) {
    const t = x.cue(sc.cue, 0.7);
    const lines = sc.lines.map((l, i) => {
      const tl = sc.cueLines?.[i] ? x.cue(sc.cueLines[i], 0.2 + i * 0.15) : x.s + 0.5 + i * 0.35;
      return `<div style="display:flex;align-items:center;gap:22px;font-size:46px;font-weight:700;color:var(--ink);padding:22px 0;border-bottom:4px solid var(--paper-2)" ${x.a("wipe", tl)}><span style="width:20px;height:20px;border-radius:50%;background:var(--blue);flex:none"></span>${x.esc(l)}</div>`;
    });
    return `
    <div class="card" style="position:absolute;left:360px;top:150px;width:1200px;height:780px;padding:56px 70px" ${x.a("rise", x.s + 0.15)}>
      <div style="display:flex;align-items:center;gap:26px;font-family:var(--display);font-weight:var(--wd);font-size:60px;margin-bottom:24px">${x.badge(sc.icon ?? "doc", "ink", 100)}${x.esc(sc.title ?? "")}</div>
      ${lines.join("")}
    </div>
    <div class="t-${sc.tone ?? "red"}" style="position:absolute;left:1040px;top:560px;padding:20px 54px;border:14px solid var(--tone);border-radius:26px;color:var(--tone);background:rgba(255,255,255,.92);font-family:var(--display);font-weight:900;font-size:130px;letter-spacing:.04em" ${x.a("stamp", t)}>${x.esc(sc.stamp)}</div>
    <div class="layer t-${sc.tone ?? "red"}" style="background:var(--tone);opacity:0" data-layout-ignore${x.fx([{ at: t + 0.05, dur: 0.06, to: { opacity: 0.18 } }, { at: t + 0.11, dur: 0.3, to: { opacity: 0 } }])}></div>`;
  },
};
