"""MkDocs hook: builds the Progress page tables from docs/data/*.json,
so PROGRESS.md and the Dashboard can never disagree."""
import json, os

def _load(config, name):
    with open(os.path.join(config["docs_dir"], "data", name), encoding="utf-8") as f:
        return json.load(f)

def on_page_markdown(markdown, page, config, files):
    if "<!--COVERAGE:" in markdown:
        cov = _load(config, "coverage.json")
        import re
        def table(m):
            rows = cov["modules"].get(m.group(1), [])
            st = cov["stages"]; names = cov["values"]
            out = ["| # | Topic | Level | " + " | ".join(x.capitalize() for x in st) + " |", "|---|---|---|" + "---|" * len(st)]
            for r in rows:
                out.append(f"| {r['n']} | {r['topic']} | {r['level']} | " + " | ".join(names.get(r[x], r[x]) for x in st) + " |")
            return "\n".join(out)
        markdown = re.sub(r"<!--COVERAGE:([^>]+)-->", table, markdown)
    if page.file.src_uri != "PROGRESS.md":
        return markdown
    p = _load(config, "progress.json")
    s = _load(config, "sessions.json")
    rows = ["| Domain | Theory | Labs | Troubleshooting | Project | Status |", "|---|---|---|---|---|---|"]
    for d in p["domains"]:
        rows.append(f"| {d['name']} | {d['theory']} | {d['labs']} | {d['troubleshooting']} | {d['project']} | {d['status']} |")
    cats = ["theory", "lab", "troubleshooting", "project"]
    mins = {c: sum(x.get("minutes", 0) for x in s if x.get("category") == c) for c in cats}
    total = sum(x.get("minutes", 0) for x in s)
    h = lambda m: f"{m/60:.1f}"
    hours = ["| Theory | Lab | Troubleshooting | Project | Total |", "|---|---|---|---|---|",
             "| " + " | ".join(h(mins[c]) for c in cats) + f" | {h(total)} |"]
    weak = "\n".join(f"- {w if isinstance(w, str) else w.get('area','')}" for w in p.get("weak_areas", [])) \
        or "None recorded yet; they get added from real lab and assessment results."
    return (markdown.replace("<!--DOMAINS-->", "\n".join(rows))
                    .replace("<!--HOURS-->", "\n".join(hours))
                    .replace("<!--WEAK-->", weak))


def on_config(config):
    """Cache-busting: add a build version to the dashboard files, so phones never
    combine a new page with an old cached script (GitHub Pages caches ~10 min)."""
    import time
    v = os.environ.get("GITHUB_SHA", str(int(time.time())))[:10]
    config["extra_javascript"] = [f"{x}?v={v}" if ("dashboard" in str(x) or "site.js" in str(x) or "gate.js" in str(x)) else x for x in config["extra_javascript"]]
    config["extra_css"] = [f"{x}?v={v}" if ("dashboard" in x or "theme" in x) else x for x in config["extra_css"]]
    return config
