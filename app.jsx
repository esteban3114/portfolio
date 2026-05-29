/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle, TweakButton */
const { useState, useEffect, useRef, useCallback } = React;

/* ============================================================
   PROFILE DATA  — update github and email as needed
   ============================================================ */
const PROFILE = {
  ticker: "ESTBN",
  name: "Esteban",
  age: "18",
  location: "France",
  status: "Student / Developer",
  focus: "Python · Automation · Trading bots",
  github: "github.com/esteban3114",
  email: "este3112008@gmail.com",
};

/* ---- helpers ---- */
const seg = (t, c = "label") => ({ t, c });
const pad = (s, n) => (s + " ".repeat(Math.max(0, n - s.length)));
function row(num, label, value, vclass = "val") {
  return [seg(num + ") ", "num"), seg(pad(label, 20), "label"), seg(value, vclass)];
}
const head = (txt) => [seg(txt, "section-head")];
const blank = () => [seg("", "label")];
const note = (txt) => [seg(txt, "dim")];

/* ---- section content ---- */
const SECTIONS = {
  WHO: {
    code: "WHO",
    title: "WHO IS ESTEBAN",
    lines: () => [
      head("IDENTITY"),
      row("11", "NAME", PROFILE.name, "val"),
      row("12", "AGE", PROFILE.age, "pos"),
      row("13", "LOCATION", PROFILE.location, "val"),
      row("14", "STATUS", PROFILE.status, "val"),
      blank(),
      head("PROFILE"),
      row("15", "FOCUS", "Python development", "val"),
      row("16", "SPECIALTY", "Automation / trading bots", "val"),
      row("17", "EXPERIENCE", "Self-taught", "val"),
      row("18", "AVAILABILITY", "OPEN", "pos"),
      blank(),
      [seg("> ", "num"), seg("18-year-old Python developer building automated", "label")],
      [seg("  ", "num"), seg("trading systems and Discord tooling. Ships code,", "label")],
      [seg("  ", "num"), seg("writes tests, deploys to the cloud.", "label")],
    ],
  },
  PROJECTS: {
    code: "PROJECTS",
    title: "PROJECTS — 1 ACTIVE",
    lines: () => [
      [seg("   ", "num"), seg(pad("PROJECT", 20), "colhead"), seg(pad("DETAIL", 28), "colhead"), seg("STATE", "colhead")],
      blank(),
      [seg("21) ", "num"), seg(pad("vadtrade-bot-2", 20), "valbold"), seg(pad("Automated trading bot", 28), "label"), seg("LIVE", "pos")],
      blank(),
      head("SPEC SHEET"),
      row("22", "LANGUAGE", "Python 3.12", "val"),
      row("23", "BOT FRAMEWORK", "discord.py", "val"),
      row("24", "DATA / ANALYSIS", "pandas · yfinance", "val"),
      row("25", "MARKET API", "OANDA API", "val"),
      row("26", "DEPLOYMENT", "DigitalOcean", "val"),
      blank(),
      head("RUNTIME"),
      row("27", "UPTIME", "99.9%", "pos"),
      row("28", "STATUS", "RUNNING", "pos"),
      row("29", "LAST DEPLOY", "build OK", "pos"),
    ],
  },
  STACK: {
    code: "STACK",
    title: "TECHNOLOGY STACK",
    lines: () => {
      const bar = (n) => seg("█".repeat(n) + "░".repeat(10 - n), "barfill");
      const r = (num, name, cat, n, lvl) => [
        seg(num + ") ", "num"),
        seg(pad(name, 16), "valbold"),
        seg(pad(cat, 14), "label"),
        bar(n),
        seg("  " + lvl, "pos"),
      ];
      return [
        [seg("    ", "num"), seg(pad("TOOL", 16), "colhead"), seg(pad("CATEGORY", 14), "colhead"), seg(pad("PROFICIENCY", 12), "colhead"), seg("LVL", "colhead")],
        blank(),
        r("31", "Python", "Language", 9, "CORE"),
        r("32", "Discord.py", "Framework", 8, "HIGH"),
        r("33", "Git", "Versioning", 8, "HIGH"),
        r("34", "pytest", "Testing", 7, "SOLID"),
        r("35", "ruff", "Linting", 7, "SOLID"),
        r("36", "mypy", "Type-check", 6, "SOLID"),
        r("37", "DigitalOcean", "Cloud / Ops", 7, "SOLID"),
        blank(),
        note("  ● CORE   ● HIGH   ● SOLID    — quality gates: ruff + mypy + pytest"),
      ];
    },
  },
  CONTACT: {
    code: "CONTACT",
    title: "CONTACT — ESTABLISH CONNECTION",
    lines: () => [
      head("CHANNELS"),
      [seg("41) ", "num"), seg(pad("GITHUB", 20), "label"), { t: PROFILE.github, c: "blueval", href: "https://" + PROFILE.github, target: "_blank" }],
      [seg("42) ", "num"), seg(pad("EMAIL", 20), "label"), { t: PROFILE.email, c: "blueval", href: "mailto:" + PROFILE.email }],
      blank(),
      head("STATUS"),
      row("43", "AVAILABILITY", "Open to collaboration", "pos"),
      row("44", "RESPONSE TIME", "< 24h", "val"),
      blank(),
      [seg("> ", "num"), seg("Type ", "label"), seg("1", "num"), seg("..", "label"), seg("4", "num"), seg(" or click a tab to navigate.", "label")],
      [seg("> ", "num"), seg("Press ", "label"), seg("T", "valbold"), seg(" to open display settings.", "label")],
    ],
  },
};

const ORDER = ["WHO", "PROJECTS", "STACK", "CONTACT"];

const NEWS = [
  { n: "451", t: "18:47", tag: "COMMIT", txt: "vadtrade-bot-2: refactor signal engine  +142 -38" },
  { n: "450", t: "18:31", tag: "DEPLOY", txt: "DigitalOcean droplet redeployed — build OK" },
  { n: "449", t: "18:02", tag: "TEST",   txt: "pytest: 48 passed in 2.31s" },
  { n: "448", t: "17:45", tag: "LINT",   txt: "ruff: all checks passed · mypy: no issues found" },
  { n: "447", t: "17:12", tag: "MARKET", txt: "OANDA stream connected — EUR/USD ticks flowing" },
  { n: "446", t: "16:50", tag: "BOT",    txt: "discord.py: 3 slash commands registered" },
];

/* ============================================================
   TYPEWRITER
   ============================================================ */
function useTypewriter(lines, speedMs, deps) {
  const total = lines.reduce((a, l) => a + l.reduce((b, s) => b + s.t.length, 0) + 1, 0);
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(0); }, deps);
  useEffect(() => {
    if (count >= total) return;
    const id = setTimeout(() => setCount((c) => Math.min(total, c + 2)), speedMs);
    return () => clearTimeout(id);
  }, [count, total, speedMs]);
  return { count, done: count >= total };
}

function TypedLines({ lines, count, done }) {
  let remaining = count;
  const out = [];
  let cursorPlaced = false;
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const parts = [];
    let lineHasContent = false;
    for (let si = 0; si < line.length; si++) {
      const s = line[si];
      if (remaining <= 0) { parts.push(<span key={si}></span>); continue; }
      const show = s.t.slice(0, remaining);
      remaining -= s.t.length;
      if (show.length > 0) lineHasContent = true;
      if (s.href) {
        parts.push(
          <a key={si} className={"s-" + s.c} href={s.href}
             target={s.target || "_self"}
             rel={s.target === "_blank" ? "noopener noreferrer" : undefined}
             style={{ textDecoration: "underline", cursor: "pointer" }}>
            {show}
          </a>
        );
      } else {
        parts.push(<span key={si} className={"s-" + s.c}>{show}</span>);
      }
    }
    remaining -= 1;
    let showCursor = false;
    if (!cursorPlaced && remaining < 0) { showCursor = true; cursorPlaced = true; }
    // When animation is done, remaining lands at exactly 0 on the last line — force cursor
    if (done && !cursorPlaced && remaining === 0) { showCursor = true; cursorPlaced = true; }
    out.push(
      <div className="tline" key={li}>
        {parts}
        {showCursor && <span className="cursor blink">█</span>}
        {(!lineHasContent && line.length <= 1) ? " " : null}
      </div>
    );
    if (cursorPlaced && remaining < 0) break;
  }
  return <div className="typed">{out}</div>;
}

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const BOOT_LINES = [
  { t: "ESTBN DEVELOPMENT TERMINAL  v3.12", c: "boot-title" },
  { t: "(C) 2026 ESTEBAN.  ALL RIGHTS RESERVED.", c: "boot-dim" },
  { t: "", c: "" },
  { t: "Initializing system............ OK", c: "boot-ok" },
  { t: "Loading vadim.me............... OK", c: "boot-ok" },
  { t: "Connecting to GitHub........... OK", c: "boot-ok" },
  { t: "Mounting /projects............. OK", c: "boot-ok" },
  { t: "Loading runtime python 3.12.... OK", c: "boot-ok" },
  { t: "Authenticating user............ OK", c: "boot-ok" },
  { t: "", c: "" },
  { t: "All systems nominal.", c: "boot-dim" },
];

function Boot({ onDone, speed }) {
  const [shown, setShown] = useState(0);
  const [chars, setChars] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (shown >= BOOT_LINES.length) { setReady(true); return; }
    const line = BOOT_LINES[shown].t;
    if (chars < line.length) {
      const id = setTimeout(() => setChars((c) => c + 1), speed * 0.6);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => { setShown((s) => s + 1); setChars(0); }, line === "" ? 40 : 90);
    return () => clearTimeout(id);
  }, [shown, chars, speed]);

  useEffect(() => {
    if (!ready) return;
    const onKey = () => onDone();
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onKey);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onKey); };
  }, [ready, onDone]);

  return (
    <div className="boot">
      <pre className="boot-pre">
        {BOOT_LINES.slice(0, shown).map((l, i) => (
          <div key={i} className={"bl " + l.c}>{l.t || " "}</div>
        ))}
        {shown < BOOT_LINES.length && (
          <div className={"bl " + BOOT_LINES[shown].c}>
            {BOOT_LINES[shown].t.slice(0, chars)}<span className="cursor blink">█</span>
          </div>
        )}
      </pre>
      {ready && (
        <div className="boot-go blink-slow" onClick={onDone}>
          &lt;GO&gt; PRESS ANY KEY TO ENTER TERMINAL
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SHELL CHROME
   ============================================================ */
const FKEYS_L = [{ t: "CANCEL", c: "fk-red" }];
const FKEYS_G = ["HELP", "SEAR", "NEWS", "QUOT", "MENU", "PRINT", "WHO", "STACK"];

function clock() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function FunctionBar() {
  return (
    <div className="fbar">
      {FKEYS_L.map((k) => <span key={k.t} className={"fk " + k.c}>{k.t}</span>)}
      {FKEYS_G.map((k) => <span key={k} className="fk fk-green">{k}</span>)}
      <span className="fbar-tabs">ESTBN</span>
      <span className="fbar-opt">Options</span>
    </div>
  );
}

function CommandBar() {
  return (
    <div className="cmdbar">
      <span className="cb-arrow">‹</span>
      <span className="cb-arrow">›</span>
      <span className="cb-sep">|</span>
      <span className="cb-tick">{PROFILE.ticker} DEV</span>
      <span className="cb-eq">‹Dev›</span>
      <span className="cb-cv">▾</span>
      <span className="cb-sep">|</span>
      <span className="cb-fn">OWN</span>
      <span className="cb-cv">▾</span>
      <span className="cb-sep">|</span>
      <span className="cb-rel">Related Functions Menu</span>
      <span className="cb-cv">⌄</span>
      <span className="cb-spacer"></span>
      <span className="cb-msg">✉ Message</span>
      <span className="cb-ico">★</span>
      <span className="cb-cv">▾</span>
    </div>
  );
}

function TickerLines({ now }) {
  return (
    <div className="ticker">
      <div className="tick1">
        <span className="t-tick">{PROFILE.ticker}</span>
        <span className="t-mkt">DEV</span>
        <span className="t-dollar">●</span>
        <span className="t-up">▲ LIVE</span>
        <span className="t-big">PYTHON DEVELOPER</span>
        <span className="t-spark">▁▂▃▅▆▇█</span>
        <span className="t-right">PY 3.12</span>
        <span className="t-right2">1×1</span>
      </div>
      <div className="tick2">
        <span className="t2-clock">At {now}</span>
        <span className="t2-d">d</span>
        <span>Age <b>{PROFILE.age}</b></span>
        <span>Repos <b>7</b></span>
        <span>Projects <b className="g">1</b></span>
        <span>Stack <b>7</b></span>
        <span>Loc <b>{PROFILE.location}</b></span>
        <span>Status <b className="g">OPEN</b></span>
      </div>
    </div>
  );
}

function TitleBand({ title }) {
  return (
    <div className="band">
      <span className="band-title">{title}</span>
      <span className="band-mid">25) Export</span>
      <span className="band-mid">Settings</span>
      <span className="band-right">Developer Profile</span>
    </div>
  );
}

function SubBar() {
  return (
    <div className="subbar">
      <span className="sb-name">{PROFILE.name.toUpperCase()}</span>
      <span className="sb-role">PYTHON DEVELOPER</span>
      <span className="sb-id">ID&nbsp;&nbsp;ESTBN-PY312</span>
    </div>
  );
}

function Tabs({ active, onPick }) {
  return (
    <div className="tabs">
      {ORDER.map((code, i) => (
        <button
          key={code}
          className={"tab " + (active === code ? "tab-active" : "")}
          onClick={() => onPick(code)}
        >
          <span className="tab-num">{i + 1})</span> {code}
        </button>
      ))}
      <span className="tabs-fill"></span>
    </div>
  );
}

function NewsBlock() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset((o) => (o + 1) % NEWS.length), 3800);
    return () => clearInterval(id);
  }, []);
  const view = [0, 1, 2, 3].map((i) => NEWS[(offset + i) % NEWS.length]);
  return (
    <div className="news">
      {view.map((n) => (
        <div className="news-line" key={n.n + n.txt}>
          <span className="nw-n">{n.n}</span>
          <span className="nw-t">{n.t}</span>
          <span className="nw-tag">{n.tag}</span>
          <span className="nw-txt">{n.txt}</span>
        </div>
      ))}
    </div>
  );
}

function HintBar() {
  return (
    <div className="hint">
      <span className="hint-sug">Suggested Functions</span>
      <span className="hint-fn"><b>GIT</b> View repositories</span>
      <span className="hint-fn"><b>MAIL</b> Send a message</span>
      <span className="hint-right">1 WHO · 2 PROJECTS · 3 STACK · 4 CONTACT</span>
    </div>
  );
}

function Screen({ code, speed }) {
  const sec = SECTIONS[code];
  const lines = sec.lines();
  const { count, done } = useTypewriter(lines, speed, [code, speed]);
  return (
    <div className="screen">
      <div className="screen-head">{sec.title}</div>
      <TypedLines lines={lines} count={count} done={done} />
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
const TWEAK_DEFAULTS = { accent: "#e8a838", scanlines: true, typeSpeed: 14 };
const ACCENTS = ["#e8a838", "#ff9b21", "#33ff66", "#41c9ff"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [booted, setBooted] = useState(() => sessionStorage.getItem("estbn_booted") === "1");
  const [active, setActive] = useState(() => localStorage.getItem("estbn_section") || "WHO");
  const [now, setNow] = useState(clock());
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { localStorage.setItem("estbn_section", active); }, [active]);

  const pick = useCallback((code) => setActive(code), []);

  useEffect(() => {
    if (!booted) return;
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      const i = parseInt(e.key, 10);
      if (i >= 1 && i <= ORDER.length) { setActive(ORDER[i - 1]); return; }
      if (e.key === "ArrowRight") { setActive((c) => ORDER[(ORDER.indexOf(c) + 1) % ORDER.length]); return; }
      if (e.key === "ArrowLeft") { setActive((c) => ORDER[(ORDER.indexOf(c) - 1 + ORDER.length) % ORDER.length]); return; }
      if (e.key === "t" || e.key === "T") { setTweaksOpen((o) => !o); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted]);

  const finishBoot = useCallback(() => {
    sessionStorage.setItem("estbn_booted", "1");
    setBooted(true);
  }, []);

  const rootStyle = { "--accent": t.accent };

  return (
    <div className={"app " + (t.scanlines ? "scanlines" : "")} style={rootStyle}>
      {!booted ? (
        <Boot onDone={finishBoot} speed={t.typeSpeed} />
      ) : (
        <div className="terminal">
          <FunctionBar />
          <CommandBar />
          <TickerLines now={now} />
          <TitleBand title={SECTIONS[active].title} />
          <SubBar />
          <Tabs active={active} onPick={pick} />
          <Screen code={active} speed={t.typeSpeed} key={active} />
          <NewsBlock />
          <HintBar />
        </div>
      )}

      <TweaksPanel title="Display Settings" open={tweaksOpen} onClose={() => setTweaksOpen(false)}>
        <TweakSection label="Display" />
        <div className="tw-accent-row">
          <span className="tw-accent-label">Accent</span>
          <div className="tw-accent-swatches">
            {ACCENTS.map((c) => (
              <button
                key={c}
                className={"tw-sw " + (t.accent === c ? "tw-sw-on" : "")}
                style={{ background: c }}
                onClick={() => setTweak("accent", c)}
              />
            ))}
          </div>
        </div>
        <TweakToggle label="CRT scanlines" value={t.scanlines} onChange={(v) => setTweak("scanlines", v)} />
        <TweakSlider label="Type speed" value={t.typeSpeed} min={2} max={40} step={2} unit="ms"
                     onChange={(v) => setTweak("typeSpeed", v)} />
        <TweakSection label="System" />
        <TweakButton label="Replay boot sequence" onClick={() => { sessionStorage.removeItem("estbn_booted"); setBooted(false); setTweaksOpen(false); }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
