(function () {
  "use strict";
  const root = document.getElementById("ceh-dash");
  if (!root) return;

  const TZ = "Asia/Kolkata";
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
    $("ceh-date").textContent = fDate.format(n) + " · IST";
  }
  tick();
  setInterval(tick, 1000);

  // ---- date helpers (dates stored as YYYY-MM-DD, IST calendar days) ----
  const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // YYYY-MM-DD
  const toUTC = (ymd) => { const [y, m, d] = ymd.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const mondayOf = (ymd) => { const t = toUTC(ymd); const dow = (new Date(t).getUTCDay() + 6) % 7; return t - dow * 86400000; };
  const fmtShort = (t) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

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
    const sessionIds = new Set(sessions.map((x) => x.session || x.date));
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

    // recent sessions
    const rec = $("ceh-recent");
    const recent = sessions.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 5);
    if (!recent.length) rec.appendChild(el("p", "ceh-empty", "No sessions logged yet."));
    recent.forEach((x) => {
      const it = el("div", "ceh-sess");
      it.appendChild(el("div", "ceh-sess-top", [x.date, x.session, x.domain].filter(Boolean).join(" · ")));
      it.appendChild(el("div", "ceh-sess-topic", (x.topic || "") + " — " + hrs(Number(x.minutes) || 0) + " h " + (x.category || "")));
      if (x.result) it.appendChild(el("div", "ceh-sess-res", x.result));
      rec.appendChild(it);
    });

    // weak areas
    const weak = $("ceh-weak");
    const wa = p.weak_areas || [];
    if (!wa.length) weak.appendChild(el("p", "ceh-empty", "None recorded yet — added only from real lab and assessment results."));
    else { const ul = el("ul"); wa.forEach((w) => ul.appendChild(el("li", null, typeof w === "string" ? w : w.area + (w.note ? " — " + w.note : "")))); weak.appendChild(ul); }

    $("ceh-foot").textContent = "Data last updated: " + (p.updated || "unknown") + " · Statuses change only with evidence.";
  }
})();
