# Dashboard data (source of truth)

- `progress.json` — status of each domain, current position, weak areas.
- `sessions.json` — one entry per logged block of study time:

```json
{"date": "2026-09-25", "session": "S01", "domain": "Linux", "topic": "Linux Fundamentals",
 "category": "lab", "minutes": 90, "result": "Lab Complete", "notes": "short, sanitized"}
```

`category` is one of `theory`, `lab`, `troubleshooting`, `project`.
The Dashboard and the Progress page are both generated from these files.
Entries are added only for real sessions.

- `coverage.json` — per module, per topic: level (F/I/A/E) and status of each stage
  (theory, basic, intermediate, advanced, troubleshooting, project, assessment).
  Values: `not-started`, `in-progress`, `done`, `reinforce`.
- `incidents.json` — every troubleshooting exercise solved:

```json
{"id": "INC-001", "date": "2026-09-26", "module": "Linux", "topic": "Permissions",
 "symptom": "Permission denied reading app config", "root_cause": "Directory missing x bit for group",
 "fix": "chmod g+x /opt/app", "page": "01-Linux/session-02-permissions.md"}
```
