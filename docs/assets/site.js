(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const root = new URL((document.querySelector('link[rel="canonical"]') || {}).href || location.href);
  const dataUrl = (f) => new URL("data/" + f + "?t=" + Date.now(), new URL(document.querySelector('script[src*="site.js"]').src, location.href).href.replace(/assets\/site\.js.*$/, ""));
  const get = (f) => fetch(dataUrl(f)).then((r) => { if (!r.ok) throw new Error(f + " " + r.status); return r.json(); });

  // Troubleshooting index
  if ($("ceh-inc")) {
    get("incidents.json").then((list) => {
      const box = $("ceh-inc-list"), q = $("ceh-inc-q"), count = $("ceh-inc-count");
      const draw = () => {
        const term = q.value.trim().toLowerCase();
        const rows = list.filter((x) => !term || JSON.stringify(x).toLowerCase().includes(term)).slice().reverse();
        box.innerHTML = "";
        count.textContent = list.length ? rows.length + " of " + list.length + " incidents" : "";
        if (!list.length) { box.appendChild(el("p", "ceh-empty", "No incidents yet. Each break/fix exercise from the labs is added here with its symptom, root cause and fix.")); return; }
        if (!rows.length) { box.appendChild(el("p", "ceh-empty", "No match. Try a shorter word, like the error message.")); return; }
        rows.forEach((x) => {
          const card = el("article", "ceh-inc-card");
          const h = el("div", "ceh-inc-head");
          h.appendChild(el("strong", null, x.symptom));
          h.appendChild(el("span", "ceh-muted ceh-small", [x.id, x.date].filter(Boolean).join(", ")));
          card.appendChild(h);
          card.appendChild(el("div", "ceh-small ceh-muted", x.module + " / " + x.topic));
          const dl = el("dl", "ceh-inc-dl");
          [["Root cause", x.root_cause], ["Fix", x.fix]].forEach(([k, v]) => { if (v) { dl.appendChild(el("dt", null, k)); dl.appendChild(el("dd", null, v)); } });
          card.appendChild(dl);
          if (x.page) { const a = el("a", "ceh-link", "Full write-up"); a.href = new URL(x.page.replace(/(README|index)\.md$/, "").replace(/\.md$/, "/"), dataUrl("").href.replace(/data\/.*$/, "")).href; card.appendChild(a); }
          box.appendChild(card);
        });
      };
      q.addEventListener("input", draw); draw();
    }).catch((e) => { $("ceh-inc-count").textContent = "Could not load incidents (" + e.message + ")."; });
  }

  // Home page live strip
  if ($("ceh-home")) {
    Promise.all([get("sessions.json"), get("progress.json"), get("coverage.json").catch(() => null)]).then(([S, p, cov]) => {
      const mins = S.reduce((a, x) => a + (Number(x.minutes) || 0), 0);
      let current = "Linux, topic 1";
      if (cov && cov.modules) for (const [m, rows] of Object.entries(cov.modules)) { const r = rows.find((x) => x.assessment !== "done"); if (r) { current = m + ": " + r.n + ". " + r.topic; break; } }
      const items = [["Hours logged", (Math.round(mins / 6) / 10).toString()], ["Sessions", String(new Set(S.map((x) => x.issue || x.session + "|" + x.date)).size)], ["Now studying", current], ["Month", String((p.current || {}).month || 1) + " of 6"]];
      const box = $("ceh-home");
      items.forEach(([k, v]) => { const d = el("div", "ceh-home-item"); d.appendChild(el("span", "ceh-home-v", v)); d.appendChild(el("span", "ceh-home-k", k)); box.appendChild(d); });
    }).catch(() => {});
  }
})();
