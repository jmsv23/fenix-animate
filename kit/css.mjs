// Base CSS for kit compositions, generated from a style's tokens. Scenes only
// reference var(--…) names and the classes below.

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([a-z])([0-9])/g, "$1-$2").toLowerCase();

export function tokensCss(style) {
  const c = style.colors;
  const vars = Object.entries(c).map(([k, v]) => `--${kebab(k)}:${v};`).join("");
  const ground = (g) => `--bg:${c[g.bg] ?? g.bg};--fg:${c[g.fg] ?? g.fg};--muted:${g.muted};--mark:${c[g.mark] ?? g.mark};--mark-fg:${c[g.markFg] ?? g.markFg};--accent:${c[g.accent] ?? g.accent};`;
  const grounds = Object.entries(style.grounds).map(([name, g]) => `.g-${name}{${ground(g)}}`).join("\n");
  const f = style.fonts;
  return `#root{${vars}--shadow:rgba(21,38,59,.14);--line:${c.ink};--display:"${f.display.family}",sans-serif;--body:"${f.body.family}",sans-serif;--mono:"${f.mono.family}",monospace;--wd:${f.display.weight};--wb:${f.body.weight};--r:${style.shape.radius}px;--r-s:${style.shape.radiusSmall}px;--sh:${style.shape.shadow};}
${grounds}`;
}

export const BASE_CSS = `
#root{position:absolute;inset:0;overflow:hidden;background:var(--paper);font-family:var(--body);font-weight:var(--wb);color:var(--ink)}
#root *{box-sizing:border-box}
.kit-scene{position:absolute;inset:0}
.stage{position:absolute;inset:0;background:var(--bg);color:var(--fg);overflow:hidden}
.tr-bar{position:absolute;inset:0;background:var(--yellow);z-index:50}
.decor{position:absolute;inset:0;pointer-events:none}
.decor .cf{position:absolute;width:56px;height:56px}
.bgshape{position:absolute;border-radius:50%;background:var(--fg);opacity:.06}
.layer{position:absolute;inset:0}
.center{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}

/* type */
.kicker{font-family:var(--display);font-weight:var(--wd);font-size:40px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.headline{font-family:var(--display);font-weight:var(--wd);line-height:1.02;letter-spacing:-.025em;color:var(--fg);margin:0}
.headline.m{font-size:104px}.headline.l{font-size:132px}.headline.xl{font-size:210px;letter-spacing:-.04em}
.headline .w{display:inline-block;position:relative;white-space:nowrap}
.w.em{color:var(--mark-fg);z-index:1}
.w.em .mk{position:absolute;left:-.12em;right:-.12em;top:.1em;bottom:.02em;background:var(--mark);border-radius:.12em;z-index:-1;transform-origin:left center}
.sub{font-size:44px;line-height:1.25;color:var(--muted);font-weight:600}
.mono{font-family:var(--mono);font-weight:700}

/* cards & chips */
.card{background:var(--white);color:var(--ink);border-radius:var(--r);box-shadow:var(--sh) var(--line)}
.g-ink .card,.g-blue .card,.g-red .card{box-shadow:var(--sh) rgba(0,0,0,.28)}
.chip{display:inline-flex;align-items:center;gap:18px;padding:20px 34px 20px 22px;border-radius:999px;background:var(--white);color:var(--ink);font-family:var(--display);font-weight:var(--wd);font-size:42px;box-shadow:8px 8px 0 var(--line);white-space:nowrap}
.g-ink .chip,.g-blue .chip,.g-red .chip{box-shadow:8px 8px 0 rgba(0,0,0,.28)}
.badge{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;color:var(--white);--icon-accent:var(--ink);flex:none}
.badge.t-red{background:var(--red)}.badge.t-blue{background:var(--blue)}.badge.t-yellow{background:var(--yellow);color:var(--ink);--icon-accent:var(--yellow)}
.badge.t-green{background:var(--green)}.badge.t-ink{background:var(--ink);--icon-accent:var(--yellow)}.badge.t-white{background:var(--white);color:var(--ink);--icon-accent:var(--white)}
.badge.t-yellow .ico{color:var(--ink)}
.t-red{--tone:var(--red)}.t-blue{--tone:var(--blue)}.t-yellow{--tone:var(--yellow)}.t-green{--tone:var(--green)}.t-ink{--tone:var(--ink)}
.ico{display:block}

/* hud */
.hud{position:absolute;inset:0;z-index:90;pointer-events:none}
.hud-chip{position:absolute;left:72px;top:56px;padding:12px 26px;border-radius:999px;background:var(--white);color:var(--ink);font-family:var(--display);font-weight:var(--wd);font-size:28px;letter-spacing:.08em;box-shadow:6px 6px 0 rgba(21,38,59,.85)}
.hud-mark{position:absolute;right:72px;top:62px;font-family:var(--display);font-weight:var(--wd);font-size:24px;letter-spacing:.16em;color:var(--white);background:var(--ink);padding:10px 20px;border-radius:12px;opacity:.92}
`;
