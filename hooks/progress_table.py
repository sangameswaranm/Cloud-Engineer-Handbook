"""MkDocs hook: builds the Progress page tables from docs/data/*.json,
so PROGRESS.md and the Dashboard can never disagree."""
import json, os

def _load(config, name):
    with open(os.path.join(config["docs_dir"], "data", name), encoding="utf-8") as f:
        return json.load(f)

def on_page_markdown(markdown, page, config, files):
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
