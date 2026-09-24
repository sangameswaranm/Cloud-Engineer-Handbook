"""Parse a 'Log study session' issue form and append entries to docs/data/sessions.json.
Input comes from environment variables (never interpolated into shell)."""
import json, os, re, sys

body = re.sub(r"<!--.*?-->", "", os.environ.get("ISSUE_BODY", "") or "", flags=re.S)
issue = int(os.environ["ISSUE_NUMBER"])
path = "docs/data/sessions.json"

fields, cur = {}, None
for line in body.splitlines():
    m = re.match(r"^###\s+(.*)$", line)
    if m:
        cur = m.group(1).strip(); fields[cur] = []
    elif cur:
        fields[cur].append(line)
val = {k: "\n".join(v).strip() for k, v in fields.items()}
val = {k: ("" if v == "_No response_" else v) for k, v in val.items()}
alias = {"start": "Start (KSA)", "end": "End (KSA)"}
val = {alias.get(k.lower(), k): v for k, v in val.items()}

def fail(msg):
    with open(os.environ["GITHUB_OUTPUT"], "a") as o:
        o.write("ok=false\n")
        o.write("message<<EOM\n" + msg + "\nEOM\n")
    print("REJECTED:", msg); sys.exit(0)

if not body.strip():
    fail("The issue has no text, so there is no session data. This usually means the link opened in the GitHub mobile app, which drops the prefilled text. Open the dashboard link in the browser instead.")
date = val.get("Date", "")
if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date): fail(f"Date must be YYYY-MM-DD, got `{date}`.")
for k in ("Start (KSA)", "End (KSA)"):
    if val.get(k) and not re.fullmatch(r"\d{2}:\d{2}", val[k]): fail(f"{k} must be HH:MM.")
session = val.get("Session", "")[:20]
if not re.fullmatch(r"[A-Za-z0-9._-]{1,20}", session): fail("Session must be a short id like S01.")

progress = json.load(open("docs/data/progress.json"))
domains = {d["name"].lower(): d["name"] for d in progress["domains"]}
domain = domains.get(val.get("Domain", "").strip().lower())
if not domain: fail(f"Unknown domain `{val.get('Domain','')}`. Use one of: " + ", ".join(domains.values()))
topic = val.get("Topic", "")[:120]
if not topic: fail("Topic is required.")

cats = {"theory": "Theory minutes", "lab": "Lab minutes", "troubleshooting": "Troubleshooting minutes", "project": "Project minutes"}
mins = {}
for c, label in cats.items():
    raw = val.get(label, "").strip() or "0"
    if not raw.isdigit() or int(raw) > 600: fail(f"{label} must be a whole number 0–600, got `{raw}`.")
    if int(raw): mins[c] = int(raw)
if not mins: fail("At least one category needs minutes above 0.")

data = json.load(open(path))
if any(x.get("issue") == issue for x in data): fail(f"Issue #{issue} is already logged.")
for c, m in mins.items():
    e = {"date": date, "session": session, "domain": domain, "topic": topic, "category": c, "minutes": m,
         "result": val.get("Result", "")[:200], "issue": issue}
    if val.get("Start (KSA)"): e["start"] = val["Start (KSA)"]
    if val.get("End (KSA)"): e["end"] = val["End (KSA)"]
    if val.get("Notes"): e["notes"] = val["Notes"][:1000]
    data.append(e)
data.sort(key=lambda x: (x["date"], x.get("start", ""), x.get("issue", 0)))
with open(path, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False); f.write("\n")

total = sum(mins.values())
summary = f"Logged **{total} min** ({', '.join(f'{c} {m}' for c, m in mins.items())}) for {session} · {domain} · {topic} on {date}."
with open(os.environ["GITHUB_OUTPUT"], "a") as o:
    o.write("ok=true\n")
    o.write("message<<EOM\n" + summary + "\nEOM\n")
print(summary)
