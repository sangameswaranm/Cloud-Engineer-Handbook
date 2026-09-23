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
