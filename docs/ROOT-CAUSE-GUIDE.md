# How to Write a Root Cause (Senior Level)

A senior engineer is judged less by how fast they type commands and more by how clearly they explain **what happened, why, and how it will not happen again**. This page is the standard used for every incident in this handbook.

---

## 1. The shape of every good answer

```text
FACTS → EVIDENCE → ROOT CAUSE → FIX → VERIFY → PREVENT
```

Use this shape in tickets, incident reports, handovers **and interviews**.

---

## 2. The one-line root cause formula

> **"<What failed> because <the real cause>, which <how it led to the symptom>."**

| Weak (junior) | Strong (senior) |
|---|---|
| "Config was wrong." | "The live `web.conf` was overwritten by an empty template because it was copied in the wrong direction without `-i`, so the app could not read its port." |
| "Kernel issue." | "The backup agent failed because patching changed GRUB's default kernel to 5.14, which the agent does not support, and the reboot was done without a pre-check." |
| "Folder missing." | "The app could not create its log because the deployment never created `app/logs`, and `touch` cannot create parent directories." |
| "Permission problem." | "`cat` was refused because `/etc/shadow` is readable only by root (`----------`); the program was working correctly." |

**Rules**

- Name the **mechanism**, not a category ("permission problem" is a category; "the directory lacks `x` for the group" is a mechanism).
- Every statement must be backed by **evidence you can show** (a command and its output, a log line, a timestamp).
- **Blameless:** describe what the process allowed, not who is "bad". "The runbook had no pre-reboot kernel check" beats "Ahmed forgot".

---

## 3. Find the real cause: the 5 Whys

Keep asking "why?" until you reach something you can **fix in the process**, not just in the server.

**Example (INC-005, agent down after reboot)**

1. Why did backups stop? → The backup agent stopped.
2. Why did it stop? → Its log says: unsupported kernel.
3. Why was the kernel unsupported? → The server booted 5.14 instead of 6.12.
4. Why did it boot 5.14? → Patching changed GRUB's default kernel.
5. Why wasn't that caught? → **The reboot runbook had no step comparing running vs next-boot kernel.** ← root cause you can fix for good

The fix on the server is `grubby --set-default`. The **prevention** is adding the check to the runbook.

---

## 4. The incident report template

```text
INC-XXX  <short title>
Date / duration:      when it started, when it was resolved
Impact:               who/what was affected and how badly
Detection:            how we found out (alert, user ticket, monitoring)
Symptom:              what was observed (exact error message)
Timeline:             key times with evidence (UTC → KSA)
Evidence:             commands + outputs that prove the cause
Root cause:           one-line formula (section 2)
Contributing factors: what made it worse or possible (tiredness, no -i, no review)
Fix:                  exactly what was changed
Verification:         proof it works (the application's exact command/check)
Prevention:           process change so it cannot recur (runbook, automation, alert)
```

---

## 5. Senior habits during an incident

1. **Confirm facts first**: did it really reboot (`/proc/uptime`)? Is the file really empty (`ls -l` size)?
2. **Keep evidence before fixing**: copy the broken file (`cp file file.broken`), save log lines. A fix that destroys evidence makes the root cause impossible to prove.
3. **Change one thing at a time**, then retest.
4. **Verify with the real check**: the application's exact command, not something similar.
5. **Fix the first error first**: later errors are often side effects.
6. **Ask "what changed?"**: `find /etc -mtime -1`, `dnf.log`, recent commits, timestamps.
7. **Convert time zones** before reading logs (server UTC, you KSA = UTC+3).
8. **Least privilege**: `sudo <command>`, not `sudo su`: keeps an audit trail.
9. **Don't make production changes when exhausted**; copy-paste reviewed commands from a plan.
10. **Always end with prevention.** Fixing the server is half the job; fixing the process is the other half.
