(function () {
  "use strict";
  if (!document.getElementById("ceh-dash")) return;

  const TZ = "Asia/Riyadh";
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const svg = (tag, attrs) => { const e = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const hrs = (m) => { const h = m / 60; return h >= 10 ? Math.round(h).toString() : (Math.round(h * 10) / 10).toString(); };
  const pad = (n) => String(n).padStart(2, "0");
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z]+/g, "-");

  // Status scale (evidence ladder)
  const LADDER = { "Not Started": 0, "In Progress": 30, "Needs Reinforcement": 45, "Lab Complete": 60, "Troubleshooting Complete": 75, "Project Complete": 90, "Assessed": 100 };
  const CATS = [
    { k: "theory", label: "Theory" }, { k: "lab", label: "Lab" },
    { k: "troubleshooting", label: "Troubleshooting" }, { k: "project", label: "Project" },
  ];

  // ---- clock (KSA) ----
  const fTime = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const fDate = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
  const tick = () => { const n = new Date(); $("ceh-time").textContent = fTime.format(n); $("ceh-date").textContent = fDate.format(n) + " KSA"; };
  tick(); setInterval(tick, 1000);

  const ymd = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
  const hm = (d) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  const today = () => ymd(new Date());
  const toUTC = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const DAY = 86400000;
  const mondayOf = (s) => { const t = toUTC(s); return t - ((new Date(t).getUTCDay() + 6) % 7) * DAY; };
  const daysSince = (s) => Math.round((toUTC(today()) - toUTC(s)) / DAY);
  const niceDate = (s) => new Date(toUTC(s)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  // ---- stopwatch (kept in this browser only) ----
  const KEY = "ceh-watch-v2";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  const save = (v) => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) {} };
  let st = load();
  const ms = () => (!st ? 0 : st.acc + (st.run ? Date.now() - st.run : 0));
  const dur = (x) => { const s = Math.floor(x / 1000); return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60); };
  const baseTitle = document.title;
  function paint() {
    const running = st && st.run && !st.done, paused = st && !st.run && !st.done, done = st && st.done;
    $("ceh-telapsed").textContent = dur(ms());
    $("ceh-tstate").textContent = !st ? "Not running" : done ? "Finished at " + hm(new Date(st.done)) + " KSA"
      : (running ? "Running since " : "Paused, started ") + hm(new Date(st.start)) + " KSA";
    $("ceh-start").hidden = !!st;
    $("ceh-pause").hidden = !st || !!done;
    $("ceh-pause").textContent = paused ? "Resume" : "Pause";
    $("ceh-end").hidden = !st || !!done;
    $("ceh-reset").hidden = !st;
    $("ceh-timer").classList.toggle("is-running", !!running);
    const tell = $("ceh-tell");
    tell.hidden = !done;
    if (done) { const m = Math.max(1, Math.round(ms() / 60000)); tell.textContent = "Session time: " + (m >= 60 ? Math.floor(m / 60) + " h " : "") + (m % 60) + " min. Tell Claude in chat and it gets logged."; }
    document.title = running ? dur(ms()) + " | " + baseTitle : baseTitle;
  }
  $("ceh-start").onclick = () => { const n = Date.now(); st = { start: n, acc: 0, run: n, done: null }; save(st); paint(); };
  $("ceh-pause").onclick = () => { if (st.run) { st.acc += Date.now() - st.run; st.run = null; } else st.run = Date.now(); save(st); paint(); };
  $("ceh-end").onclick = () => { if (st.run) { st.acc += Date.now() - st.run; st.run = null; } st.done = Date.now(); save(st); paint(); };
  $("ceh-reset").onclick = () => { if (confirm("Reset the stopwatch?")) { st = null; save(st); paint(); } };
  paint(); setInterval(paint, 1000);

  // ---- data ----
  const base = new URL("../data/", location.href);
  const get = (f) => fetch(new URL(f + "?t=" + Date.now(), base)).then((r) => { if (!r.ok) throw new Error(f + " returned " + r.status); return r.json(); });
  Promise.all([get("progress.json"), get("sessions.json"), get("coverage.json").catch(() => null), get("incidents.json").catch(() => [])])
    .then(([p, s, cov, inc]) => { render(p, Array.isArray(s) ? s : [], cov, Array.isArray(inc) ? inc : []); })
    .catch((e) => { $("ceh-foot").textContent = "Dashboard data did not load (" + e.message + "). Refresh the page to retry."; });

  function covPct(COV) {
    if (!COV || !COV.modules) return 0;
    let d = 0, t = 0;
    Object.values(COV.modules).forEach((rows) => rows.forEach((r) => (COV.stages || []).forEach((st) => { t++; if (r[st] === "done") d++; })));
    return t ? Math.round((d / t) * 100) : 0;
  }

  function render(p, S, COV, INC) {
    const domains = p.domains || [];
    const cur = p.current || {};
    const sum = (arr) => arr.reduce((a, x) => a + (Number(x.minutes) || 0), 0);
    const key = (x) => x.issue || x.session + "|" + x.date;

    // Route
    $("ceh-pos").textContent = "Month " + (cur.month || 1) + ", week " + (cur.week || 1) + (p.program_start ? ", day " + (daysSince(p.program_start) + 1) : "");
    const route = $("ceh-route");
    (p.months || []).forEach((m) => {
      const inMonth = domains.filter((d) => d.month === m.n);
      const pct = inMonth.length ? Math.round(inMonth.reduce((a, d) => a + (LADDER[d.status] || 0), 0) / inMonth.length) : 0;
      const li = el("li", "ceh-hop" + (m.n < cur.month ? " is-done" : m.n === cur.month ? " is-now" : ""));
      const dot = el("span", "ceh-hop-dot", String(m.n));
      const txt = el("div", "ceh-hop-txt");
      txt.appendChild(el("strong", null, m.title));
      txt.appendChild(el("span", null, m.focus));
      const bar = el("span", "ceh-hop-bar"); const fill = el("i"); fill.style.width = pct + "%"; bar.appendChild(fill);
      txt.appendChild(bar);
      li.appendChild(dot); li.appendChild(txt);
      route.appendChild(li);
    });
    $("ceh-next").textContent = "Up next: " + (cur.next_session || "not set");

    // KPIs
    const total = sum(S);
    const thisMon = mondayOf(today());
    const wk = (off) => sum(S.filter((x) => x.date && mondayOf(x.date) === thisMon - off * 7 * DAY));
    const thisW = wk(0), lastW = wk(1);
    const days = [...new Set(S.map((x) => x.date))].sort().reverse();
    let streak = 0;
    if (days.length && daysSince(days[0]) <= 1) { streak = 1; for (let i = 1; i < days.length; i++) { if (toUTC(days[i - 1]) - toUTC(days[i]) === DAY) streak++; else break; } }
    const started = domains.filter((d) => d.status !== "Not Started").length;
    const weeks = []; for (let i = 7; i >= 0; i--) weeks.push(wk(i));
    const kpis = [
      { label: "Hours logged", value: hrs(total), sub: new Set(S.map(key)).size + " sessions", spark: weeks },
      { label: "This week", value: hrs(thisW) + " h", sub: lastW || thisW ? (thisW >= lastW ? "Up " : "Down ") + hrs(Math.abs(thisW - lastW)) + " h on last week" : "No sessions yet", trend: thisW - lastW },
      { label: "Streak", value: streak + (streak === 1 ? " day" : " days"), sub: days.length ? "Last session " + niceDate(days[0]) : "Starts with Session 1" },
      { label: "Domains started", value: started + "/" + domains.length, sub: domains.filter((d) => (LADDER[d.status] || 0) >= 90).length + " at project level or above" },
      { label: "Coverage", value: covPct(COV) + "%", sub: "Topic stages done, all modules" },
      { label: "Incidents solved", value: String(INC.length), sub: INC.length ? "Latest: " + INC[INC.length - 1].topic : "Break/fix exercises" },
    ];
    const box = $("ceh-kpis");
    kpis.forEach((k) => {
      const c = el("div", "ceh-kpi");
      c.appendChild(el("span", "ceh-kpi-label", k.label));
      c.appendChild(el("span", "ceh-kpi-value", k.value));
      const sub = el("span", "ceh-kpi-sub" + (k.trend > 0 ? " is-up" : k.trend < 0 ? " is-down" : ""), k.sub);
      c.appendChild(sub);
      if (k.spark) {
        const mx = Math.max(60, ...k.spark), sp = svg("svg", { viewBox: "0 0 80 24", class: "ceh-spark", "aria-hidden": "true" });
        k.spark.forEach((v, i) => { const h = Math.max(1.5, (v / mx) * 22); sp.appendChild(svg("rect", { x: i * 10 + 1, y: 24 - h, width: 7, height: h, rx: 1.5, class: i === 7 ? "now" : "" })); });
        c.appendChild(sp);
      }
      box.appendChild(c);
    });

    // Study calendar (last 20 weeks, KSA days)
    const perDay = {};
    S.forEach((x) => { if (x.date) perDay[x.date] = (perDay[x.date] || 0) + (Number(x.minutes) || 0); });
    const heat = $("ceh-heat");
    const WEEKS = 20, start = thisMon - (WEEKS - 1) * 7 * DAY, todayT = toUTC(today());
    let activeDays = 0;
    for (let w = 0; w < WEEKS; w++) {
      const col = el("div", "ceh-heat-col");
      for (let d = 0; d < 7; d++) {
        const t = start + (w * 7 + d) * DAY;
        const key = new Date(t).toISOString().slice(0, 10);
        const m = perDay[key] || 0;
        if (m) activeDays++;
        const lvl = m === 0 ? 0 : m <= 30 ? 1 : m <= 60 ? 2 : m <= 120 ? 3 : 4;
        const c = el("i", "h" + lvl + (t > todayT ? " future" : "") + (t === todayT ? " today" : ""));
        c.title = niceDate(key) + ": " + (m ? hrs(m) + " h" : "no study");
        col.appendChild(c);
      }
      heat.appendChild(col);
    }
    $("ceh-heat-sum").textContent = activeDays + " study day" + (activeDays === 1 ? "" : "s") + " in 20 weeks";

    // Topic coverage matrix
    if (COV && COV.modules) {
      const mods = Object.keys(COV.modules), STG = COV.stages || [];
      const ABBR = { theory: "Th", basic: "Ba", intermediate: "In", advanced: "Ad", troubleshooting: "Tr", project: "Pr", assessment: "As" };
      const mbox = $("ceh-covmods"), table = $("ceh-cov");
      let mod = mods[0], showAll = false;
      const more = el("button", "ceh-btn ceh-btn-quiet ceh-more");
      more.onclick = () => { showAll = !showAll; drawCov(); };
      table.parentNode.after(more);
      const drawCov = () => {
        table.innerHTML = "";
        const rows = COV.modules[mod] || [];
        const head = table.createTHead().insertRow();
        head.appendChild(el("th", "ceh-cov-topic", "Topic"));
        STG.forEach((st) => { const th = el("th", null, ABBR[st] || st); th.title = st; head.appendChild(th); });
        const body = table.createTBody();
        let done = 0, total = 0, next = null;
        const curIdx = Math.max(0, rows.findIndex((r) => r.assessment !== "done"));
        const lo = Math.max(0, curIdx - 1), hi = lo + 8;
        rows.forEach((r, idx) => {
          const visible = showAll || (idx >= lo && idx < hi);
          const tr = body.insertRow();
          if (!visible) tr.hidden = true;
          if (idx === curIdx) tr.className = "is-current";
          const td = el("td", "ceh-cov-topic");
          td.appendChild(el("span", "ceh-cov-n", String(r.n)));
          td.appendChild(document.createTextNode(r.topic));
          td.appendChild(el("span", "ceh-lvl ceh-lvl-" + r.level, r.level));
          tr.appendChild(td);
          STG.forEach((st) => {
            const v = r[st] || "not-started";
            total++; if (v === "done") done++;
            const c = el("td"); const dot = el("i", "cv cv-" + v); dot.title = r.topic + ", " + st + ": " + ((COV.values || {})[v] || v); c.appendChild(dot); tr.appendChild(c);
          });
          if (!next && r.assessment !== "done") next = r;
        });
        $("ceh-covsum").textContent = mod + ": " + Math.round((done / Math.max(1, total)) * 100) + "% of " + total + " stages done" + (next ? ". Current topic: " + next.n + ". " + next.topic : ". Module complete.");
        more.textContent = showAll ? "Show fewer" : "Show all " + rows.length + " topics";
        more.hidden = rows.length <= 8;
        [...mbox.children].forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === mod));
      };
      mods.forEach((m) => { const b = el("button", "ceh-chip", m); b.dataset.m = m; b.onclick = () => { mod = m; drawCov(); }; mbox.appendChild(b); });
      drawCov();
      const ck = $("ceh-covkey");
      Object.entries(COV.values || {}).forEach(([k, v]) => { const sp = el("span"); sp.appendChild(el("i", "cv cv-" + k)); sp.appendChild(document.createTextNode(v)); ck.appendChild(sp); });
      const lk = el("span", "ceh-muted", "Th Ba In Ad Tr Pr As: theory, basic, intermediate, advanced, troubleshooting, project, assessment. F/I/A/E: level.");
      ck.appendChild(lk);
    }

    // Rings
    const rings = $("ceh-rings"), legend = $("ceh-legend");
    const cMins = CATS.map((c) => sum(S.filter((x) => x.category === c.k)));
    const cmax = Math.max(1, ...cMins);
    CATS.forEach((c, i) => {
      const r = 84 - i * 16, len = 2 * Math.PI * r, frac = total ? cMins[i] / cmax : 0;
      rings.appendChild(svg("circle", { cx: 100, cy: 100, r, class: "ceh-ring-track" }));
      if (frac > 0) rings.appendChild(svg("circle", { cx: 100, cy: 100, r, class: "ceh-ring ceh-c-" + c.k, "stroke-dasharray": (len * 0.75 * frac) + " " + len, transform: "rotate(-90 100 100)" }));
      const li = el("li"); li.appendChild(el("i", "ceh-c-" + c.k)); li.appendChild(el("span", null, c.label)); li.appendChild(el("b", null, hrs(cMins[i]) + " h")); legend.appendChild(li);
    });
    const t1 = svg("text", { x: 100, y: 104, class: "ceh-ring-num" }); t1.textContent = hrs(total);
    const t2 = svg("text", { x: 100, y: 122, class: "ceh-ring-lbl" }); t2.textContent = "hours";
    rings.appendChild(t1); rings.appendChild(t2);

    // Revision due: studied domains not touched for 7+ days
    const last = {};
    S.forEach((x) => { if (x.domain && x.date && (!last[x.domain] || x.date > last[x.domain])) last[x.domain] = x.date; });
    const due = Object.entries(last).map(([d, dt]) => ({ d, n: daysSince(dt) })).filter((x) => x.n >= 7).sort((a, b) => b.n - a.n);
    const rv = $("ceh-revise");
    if (!due.length) rv.appendChild(el("p", "ceh-empty", Object.keys(last).length ? "Everything studied in the last 7 days. Nothing to revise yet." : "Topics you studied 7 or more days ago will show here, so they get revised before they fade."));
    else { const ul = el("ul", "ceh-list"); due.forEach((x) => { const li = el("li"); li.appendChild(el("span", null, x.d)); li.appendChild(el("b", "ceh-warn", x.n + " days ago")); ul.appendChild(li); }); rv.appendChild(ul); }
    const wa = p.weak_areas || [], wb = $("ceh-weak");
    if (!wa.length) wb.appendChild(el("p", "ceh-empty", "None recorded. They are added from real lab and assessment results."));
    else { const ul = el("ul", "ceh-list"); wa.forEach((w) => ul.appendChild(el("li", null, typeof w === "string" ? w : w.area + (w.note ? ": " + w.note : "")))); wb.appendChild(ul); }

    // Domain health with filters
    const filters = [
      { id: "now", label: "This month", f: (d) => d.month === (cur.month || 1) || d.status !== "Not Started" },
      { id: "started", label: "Started", f: (d) => d.status !== "Not Started" },
      { id: "all", label: "All 18", f: () => true },
    ];
    const fbox = $("ceh-filters"), grid = $("ceh-domains");
    let active = "now";
    const draw = () => {
      grid.innerHTML = "";
      const list = domains.filter(filters.find((f) => f.id === active).f);
      if (!list.length) grid.appendChild(el("p", "ceh-empty", "No domain has started yet. Session 1 starts Linux."));
      list.forEach((d) => {
        const c = el("article", "ceh-dom");
        const h = el("div", "ceh-dom-head");
        h.appendChild(el("h3", null, d.name));
        h.appendChild(el("span", "ceh-status ceh-s-" + slug(d.status), d.status));
        c.appendChild(h);
        c.appendChild(el("span", "ceh-dom-month", "Month " + d.month + (last[d.name] ? ", last studied " + niceDate(last[d.name]) : "")));
        [["Theory", d.theory], ["Labs", d.labs], ["Troubleshooting", d.troubleshooting], ["Project", d.project]].forEach(([lbl, v]) => {
          const row = el("div", "ceh-meter");
          row.appendChild(el("span", null, lbl));
          const tr = el("span", "ceh-meter-track"); const fi = el("i", "ceh-s-" + slug(v)); fi.style.width = (LADDER[v] || 0) + "%"; tr.appendChild(fi);
          row.appendChild(tr); row.title = lbl + ": " + v;
          c.appendChild(row);
        });
        grid.appendChild(c);
      });
      [...fbox.children].forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === active));
    };
    filters.forEach((f) => { const b = el("button", "ceh-chip", f.label); b.dataset.id = f.id; b.onclick = () => { active = f.id; draw(); }; fbox.appendChild(b); });
    draw();
    const keyBox = $("ceh-key");
    Object.keys(LADDER).forEach((s) => { const k = el("span"); k.appendChild(el("i", "ceh-s-" + slug(s))); k.appendChild(document.createTextNode(s)); keyBox.appendChild(k); });

    // Feed
    const groups = new Map();
    S.forEach((x) => { const k = key(x); if (!groups.has(k)) groups.set(k, { ...x, parts: [] }); groups.get(k).parts.push(x); });
    const feed = $("ceh-feed");
    const recent = [...groups.values()].sort((a, b) => (b.date + (b.start || "")).localeCompare(a.date + (a.start || ""))).slice(0, 6);
    if (!recent.length) feed.appendChild(el("li", "ceh-empty", "No sessions yet. The first one appears here after Session 1."));
    recent.forEach((g) => {
      const li = el("li", "ceh-feed-item");
      const head = el("div", "ceh-feed-head");
      head.appendChild(el("strong", null, (g.session ? g.session + ": " : "") + (g.topic || g.domain)));
      head.appendChild(el("span", "ceh-muted", niceDate(g.date)));
      li.appendChild(head);
      li.appendChild(el("div", "ceh-feed-meta", g.domain + ", " + hrs(sum(g.parts)) + " h (" + g.parts.map((x) => x.category + " " + x.minutes + " min").join(", ") + ")"));
      if (g.result) li.appendChild(el("div", "ceh-feed-res", g.result));
      feed.appendChild(li);
    });

    $("ceh-foot").textContent = "Data updated " + (p.updated || "unknown") + ". Hours come from logged sessions; statuses change only with evidence.";
  }
})();
