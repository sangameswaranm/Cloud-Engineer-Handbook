(function () {
  "use strict";
  const root = document.getElementById("ceh-dash");
  if (!root) return;

  const TZ = "Asia/Riyadh";
  const REPO = "https://github.com/sangameswaranm/Cloud-Engineer-Handbook";
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const hrs = (min) => (Math.round((min / 60) * 10) / 10).toString();
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z]+/g, "-");

  // ---- live clock (IST) ----
  const fTime = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const fDate = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
  function tick() {
    const n = new Date();
    $("ceh-time").textContent = fTime.format(n);
    $("ceh-date").textContent = fDate.format(n) + " · KSA (UTC+3)";
  }
  tick();
  setInterval(tick, 1000);

  // ---- date helpers (dates stored as YYYY-MM-DD, IST calendar days) ----
  const ymdKSA = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD
  const hmKSA = (d) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  const todayIST = () => ymdKSA(new Date());
  const toUTC = (ymd) => { const [y, m, d] = ymd.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const mondayOf = (ymd) => { const t = toUTC(ymd); const dow = (new Date(t).getUTCDay() + 6) % 7; return t - dow * 86400000; };
  const fmtShort = (t) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });


  // ---- session timer (state kept in this browser; nothing is saved to GitHub until you submit the form) ----
  const KEY = "ceh-timer-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } };
  const save = (st) => { try { st ? localStorage.setItem(KEY, JSON.stringify(st)) : localStorage.removeItem(KEY); } catch (e) {} };
  let st = load(); // {startedAt, accMs, runSince, endedAt}
  const elapsedMs = () => !st ? 0 : st.accMs + (st.runSince ? Date.now() - st.runSince : 0);
  const pad = (n) => String(n).padStart(2, "0");
  const fmtDur = (ms) => { const s = Math.floor(ms / 1000); return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60); };
  const baseTitle = document.title;

  function paintTimer() {
    const ms = elapsedMs();
    $("ceh-telapsed").textContent = fmtDur(ms);
    const running = st && st.runSince && !st.endedAt, paused = st && !st.runSince && !st.endedAt, ended = st && st.endedAt;
    $("ceh-tstate").textContent = !st ? "No session running" : ended ? "Session ended — log it below"
      : (running ? "Running since " : "Paused · started ") + hmKSA(new Date(st.startedAt)) + " KSA";
    $("ceh-start").hidden = !!st;
    $("ceh-pause").hidden = !st || !!ended;
    $("ceh-pause").textContent = paused ? "Resume" : "Pause";
    $("ceh-end").hidden = !st || !!ended;
    $("ceh-discard").hidden = !st;
    $("ceh-logform").hidden = !ended;
    $("ceh-timer").classList.toggle("ceh-running", !!running);
    document.title = running ? "⏱ " + fmtDur(ms) + " · " + baseTitle : baseTitle;
  }
  $("ceh-start").onclick = () => { const n = Date.now(); st = { startedAt: n, accMs: 0, runSince: n, endedAt: null }; save(st); paintTimer(); };
  $("ceh-pause").onclick = () => {
    if (st.runSince) { st.accMs += Date.now() - st.runSince; st.runSince = null; } else { st.runSince = Date.now(); }
    save(st); paintTimer();
  };
  $("ceh-end").onclick = () => {
    if (st.runSince) { st.accMs += Date.now() - st.runSince; st.runSince = null; }
    st.endedAt = Date.now(); save(st); fillForm(); paintTimer();
  };
  $("ceh-discard").onclick = () => { if (confirm("Discard this session? Its time will not be logged.")) { st = null; save(st); paintTimer(); } };
  $("ceh-clear").onclick = () => { if (confirm("Clear the timer? Only do this after the GitHub form was submitted.")) { st = null; save(st); paintTimer(); } };
  setInterval(paintTimer, 1000);
  paintTimer();

  let formCtx = null;
  const CATS = ["theory", "lab", "troubleshooting", "project"];
  function totalMin() { return st ? Math.max(1, Math.round(elapsedMs() / 60000)) : 0; }
  function updSum() {
    const sum = CATS.reduce((a, c) => a + (Number($("ceh-fm-" + c).value) || 0), 0);
    $("ceh-fsum").textContent = "Split total: " + sum + " of " + totalMin() + " min" + (sum !== totalMin() ? " — check the split" : " ✓");
  }
  function fillForm() {
    if (!formCtx || !st || !st.endedAt) return;
    const { p, sessions } = formCtx;
    $("ceh-ftotal").textContent = totalMin();
    const saved = st.form || {};
    const n = new Set(sessions.map((x) => x.issue || (x.session + "|" + x.date))).size + 1;
    $("ceh-fsession").value = saved.session || "S" + pad(n);
    const sel = $("ceh-fdomain"); sel.innerHTML = "";
    (p.domains || []).forEach((d) => { const o = el("option", null, d.name); o.value = d.name; sel.appendChild(o); });
    const next = (p.current && p.current.next_session) || "";
    sel.value = saved.domain || ((p.domains || []).find((d) => next.toLowerCase().includes(d.name.toLowerCase())) || (p.domains || [])[0] || {}).name || "";
    $("ceh-ftopic").value = saved.topic || next.replace(/^Session\s*\d+\s*[—-]\s*/i, "");
    CATS.forEach((c) => { $("ceh-fm-" + c).value = saved[c] != null ? saved[c] : (c === "lab" ? totalMin() : 0); });
    $("ceh-fresult").value = saved.result || "";
    updSum();
  }
  function setupLogForm(p, sessions) {
    formCtx = { p, sessions };
    CATS.forEach((c) => $("ceh-fm-" + c).addEventListener("input", updSum));
    fillForm();
  }
  $("ceh-submit").onclick = () => {
    const f = { session: $("ceh-fsession").value.trim(), domain: $("ceh-fdomain").value, topic: $("ceh-ftopic").value.trim(), result: $("ceh-fresult").value.trim() };
    CATS.forEach((c) => { f[c] = Number($("ceh-fm-" + c).value) || 0; });
    if (!f.topic) { alert("Add a topic first."); return; }
    if (!CATS.some((c) => f[c] > 0)) { alert("Put the minutes into at least one category."); return; }
    st.form = f; save(st);
    const start = new Date(st.startedAt), end = new Date(st.endedAt);
    const q = new URLSearchParams({
      template: "log-session.yml", title: "Session log: " + f.session + " · " + f.domain + " · " + ymdKSA(start),
      date: ymdKSA(start), start: hmKSA(start), end: hmKSA(end), session: f.session, domain: f.domain, topic: f.topic,
      theory: f.theory, lab: f.lab, troubleshooting: f.troubleshooting, project: f.project, result: f.result,
    });
    window.open(REPO + "/issues/new?" + q.toString(), "_blank", "noopener");
  };

  // ---- load data ----
  const base = new URL("../data/", location.href);
  const get = (f) => fetch(new URL(f + "?t=" + Date.now(), base)).then((r) => { if (!r.ok) throw new Error(f + " HTTP " + r.status); return r.json(); });

  Promise.all([get("progress.json"), get("sessions.json")])
    .then(([p, s]) => render(p, Array.isArray(s) ? s : []))
    .catch((e) => { $("ceh-foot").textContent = "Could not load dashboard data: " + e.message; });

  function render(p, sessions) {
    // current position
    const now = $("ceh-now");
    const c = p.current || {};
    now.appendChild(el("span", "ceh-pill", "Month " + (c.month ?? "–") + " · Week " + (c.week ?? "–")));
    now.appendChild(el("span", "ceh-next", "Next: " + (c.next_session || "—")));
    if (p.program_start) {
      const day = Math.floor((toUTC(todayIST()) - toUTC(p.program_start)) / 86400000) + 1;
      now.appendChild(el("span", "ceh-pill", "Day " + day));
    } else {
      now.appendChild(el("span", "ceh-pill ceh-muted", "Program not started"));
    }

    // cards
    const total = sessions.reduce((a, x) => a + (Number(x.minutes) || 0), 0);
    const thisMon = mondayOf(todayIST());
    const weekMin = sessions.filter((x) => x.date && mondayOf(x.date) === thisMon).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
    const sKey = (x) => x.issue || (x.session + "|" + x.date);
    const sessionIds = new Set(sessions.map(sKey));
    const started = (p.domains || []).filter((d) => d.status && d.status !== "Not Started").length;
    $("ceh-total").textContent = hrs(total);
    $("ceh-week").textContent = hrs(weekMin);
    $("ceh-sessions").textContent = sessionIds.size;
    $("ceh-started").textContent = started + " / " + (p.domains || []).length;

    // weekly bars: last 8 weeks
    const weeks = $("ceh-weeks");
    const buckets = [];
    for (let i = 7; i >= 0; i--) buckets.push({ start: thisMon - i * 7 * 86400000, min: 0 });
    sessions.forEach((x) => { if (!x.date) return; const b = buckets.find((k) => k.start === mondayOf(x.date)); if (b) b.min += Number(x.minutes) || 0; });
    const max = Math.max(60, ...buckets.map((b) => b.min));
    buckets.forEach((b) => {
      const col = el("div", "ceh-wcol");
      const bar = el("div", "ceh-wbar");
      bar.style.height = Math.round((b.min / max) * 100) + "%";
      bar.title = hrs(b.min) + " h";
      const barWrap = el("div", "ceh-wbarwrap");
      barWrap.appendChild(bar);
      col.appendChild(el("div", "ceh-wval", b.min ? hrs(b.min) : ""));
      col.appendChild(barWrap);
      col.appendChild(el("div", "ceh-wlbl", fmtShort(b.start)));
      weeks.appendChild(col);
    });
    if (!total) weeks.appendChild(el("p", "ceh-empty", "No sessions logged yet."));

    // categories
    const cats = ["theory", "lab", "troubleshooting", "project"];
    const catBox = $("ceh-cats");
    cats.forEach((k) => {
      const m = sessions.filter((x) => x.category === k).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
      const row = el("div", "ceh-crow");
      row.appendChild(el("span", "ceh-cname", k[0].toUpperCase() + k.slice(1)));
      const track = el("div", "ceh-ctrack");
      const fill = el("div", "ceh-cfill ceh-c-" + k);
      fill.style.width = (total ? (m / total) * 100 : 0) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("span", "ceh-cval", hrs(m) + " h"));
      catBox.appendChild(row);
    });

    // domain table
    const t = $("ceh-domains");
    const head = t.createTHead().insertRow();
    ["Domain", "Theory", "Labs", "Troubleshooting", "Project", "Status"].forEach((h) => head.appendChild(el("th", null, h)));
    const body = t.createTBody();
    (p.domains || []).forEach((d) => {
      const r = body.insertRow();
      r.appendChild(el("td", "ceh-dname", d.name));
      ["theory", "labs", "troubleshooting", "project", "status"].forEach((k) => {
        const td = el("td");
        td.appendChild(el("span", "ceh-chip ceh-s-" + slug(d[k] || "Not Started"), d[k] || "Not Started"));
        r.appendChild(td);
      });
    });

    // recent sessions (entries grouped per logged session)
    const rec = $("ceh-recent");
    const groups = new Map();
    sessions.forEach((x) => { const k = sKey(x); if (!groups.has(k)) groups.set(k, { ...x, parts: [] }); groups.get(k).parts.push(x); });
    const recent = [...groups.values()].sort((a, b) => (String(b.date) + (b.start || "")).localeCompare(String(a.date) + (a.start || ""))).slice(0, 5);
    if (!recent.length) rec.appendChild(el("p", "ceh-empty", "No sessions logged yet."));
    recent.forEach((g) => {
      const tot = g.parts.reduce((a, x) => a + (Number(x.minutes) || 0), 0);
      const it = el("div", "ceh-sess");
      it.appendChild(el("div", "ceh-sess-top", [g.date, g.start && g.end ? g.start + "–" + g.end : "", g.session, g.domain].filter(Boolean).join(" · ")));
      it.appendChild(el("div", "ceh-sess-topic", (g.topic || "") + " — " + hrs(tot) + " h"));
      it.appendChild(el("div", "ceh-sess-res", g.parts.map((x) => x.category + " " + x.minutes + "m").join(" · ") + (g.result ? " — " + g.result : "")));
      rec.appendChild(it);
    });

    // weak areas
    const weak = $("ceh-weak");
    const wa = p.weak_areas || [];
    if (!wa.length) weak.appendChild(el("p", "ceh-empty", "None recorded yet — added only from real lab and assessment results."));
    else { const ul = el("ul"); wa.forEach((w) => ul.appendChild(el("li", null, typeof w === "string" ? w : w.area + (w.note ? " — " + w.note : "")))); weak.appendChild(ul); }

    setupLogForm(p, sessions);
    $("ceh-foot").textContent = "Data last updated: " + (p.updated || "unknown") + " · Statuses change only with evidence.";
  }
})();
