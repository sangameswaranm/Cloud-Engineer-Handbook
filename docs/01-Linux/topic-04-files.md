# Topic 4: Files & Directories

**Status:** in progress · Parts A–F done, Part G (vi) and Incidents 3–6 next · **Focus:** Red Hat family

!!! tip "How to use this page"
    Each part: concept → syntax → examples → production use → mistakes. Incidents follow the [root cause guide](../ROOT-CAUSE-GUIDE.md).

---

## Part A: Creating directories and files

**What:** `mkdir` creates folders; `touch` creates an empty file, or updates the timestamp of an existing one.

**How it works:** a folder is a **list of names**; each name points to an inode (Part F). Creating something means **adding a name to a folder**, so you need write permission on that folder.

```text
mkdir  [-p]  <dir>...        -p: create the whole chain; no error if it exists
touch  <file>...             new empty file, or refresh the time of an existing one
```

| Example | Result |
|---|---|
| `mkdir a b c` | three folders at once |
| `mkdir -p /opt/myapp/{config,logs,backups}` style layouts | an app's folder structure in one go |
| `mkdir projects/web/html` (parent missing) | `No such file or directory` |
| `mkdir /etc/myapp` as a normal user | `Permission denied`: `/etc` is owned by root |
| `touch config/app.conf` when `config/` is missing | `No such file or directory`: touch can't create folders |
| `touch` on an existing file | nothing inside changes; the timestamp updates |

**Senior habit:** a deployment must create **every** folder it needs with `mkdir -p`, and verify with the app's exact command.

---

## Part B: Copy, move, rename

```text
cp  FROM  TO       photocopy: original stays, a copy appears (new inode, new time)
mv  FROM  TO       move OR rename: only one exists afterwards (same inode, instant)
   -i   ask before overwriting        -r (cp) copy folders        -p (cp) keep times/permissions
```

**The cupboard exercise (real):**

```text
cp docs/notes.txt docs/notes-copy.txt     PHOTOCOPY   → 2 files
mv docs/notes-copy.txt archive/           MOVE        → left docs, now in archive
mv archive/notes-copy.txt old-notes.txt   MOVE+RENAME → no folder in TO means "right here"
mv old-notes.txt archive/                 MOVE back
```

!!! danger "Silent overwrite"
    `cp` and `mv` overwrite an existing destination **without warning**. In the lab, an empty file copied over `app.conf` erased "version 1" with no undo.

**Production commands**

```text
cp -p /etc/ssh/sshd_config /etc/ssh/sshd_config.bak-20260927    backup with date BEFORE editing
cp -i backup.conf live.conf                                      restore, asking before overwrite
mv app.log app.log.old                                           rotate a log by hand
```

**Common errors**

| Error | Meaning |
|---|---|
| `cannot stat 'x'` | the FROM path doesn't exist where you are standing |
| `Not a directory` | the TO path ends in `/` but that folder doesn't exist (relative to where you are) |
| `too many arguments` (cd) | `cd` takes one path: `cd ../logs`, not `cd .. logs` |

---

## Part C: Deleting safely

```text
rm     -i  ask     -r  folders + contents     -f  force, never ask
rmdir  only EMPTY folders (refuses otherwise: a built-in safety)
```

- No recycle bin. `rm` removes a **name**; data is freed when the link count reaches 0.
- `rm -r` deletes **contents first, then the folder** (deepest first: `z`, `y`, `x`).
- `rm` alone refuses folders: `Is a directory`.

!!! danger "rm -rf with a relative path"
    Standing in `~/linux-lab`, `rm -rf config` deletes `~/linux-lab/config`, not the folder you meant, silently.

**Safe-delete routine**

```text
1. pwd                        where am I?
2. ls <exact path>            is this what I think it is?
3. rm -ri /absolute/path      full address, and ask
4. ls                         confirm
```

---

## Part D: Reading files

| Command | Shows | Use |
|---|---|---|
| `cat f` | everything | short files |
| `head -n 5 f` | first lines (oldest in a log) | how a file starts |
| `tail -n 5 f` | last lines (**newest** in a log) | recent events |
| `less f` | page by page | long files: `G` end, `g` start, `/word` search, `n` next, `q` quit |
| `tail -f f` | new lines **live** | watch a log while reproducing a problem; Ctrl+C stops |

**Real log reading**

```text
2026-09-29T19:03:05+0000 INFO Metadata cache refreshed recently.
          │         └ +0000 = UTC → add 3 hours for KSA
          └ ISO date/time          INFO/DEBUG/ERROR = log level
```

**Audit trail from `sudo tail -f /var/log/secure`:**

```text
Sep 29 19:24:22 test-linux-01 sudo[142443]: opc : TTY=pts/1 ; PWD=/home/opc ; USER=root ; COMMAND=/bin/ls /root
                                            WHO   WHICH WINDOW  FROM WHERE    AS WHO      WHAT
```

With `sudo su`, only `COMMAND=/bin/su` is logged and everything afterwards is invisible: that is why least privilege matters.

---

## Part E: Finding files

```text
find <where> <rules>
   -name "*.conf"   -iname (ignore case)   -type f / -type d
   -size +100k      -mtime -1 (changed in last 24h)   -mtime +7 (older than 7 days)
```

- `*` = any characters; always quote the pattern.
- Silence = nothing matched.
- Every rule starts with a dash (`-mtime`, not `mtime`).

**Production searches**

| Situation | Command |
|---|---|
| Disk full: biggest logs | `sudo find /var/log -type f -size +100k` |
| What changed before the outage? | `sudo find /etc -type f -mtime -1` |
| Where is this app's config? | `sudo find /etc /opt -name "*app*"` |
| Old logs to clean up | `sudo find /var/log/app -type f -mtime +7` (list first, delete after checking) |

!!! warning "Search system folders with sudo"
    As a normal user, `find /etc -name "*.conf"` printed `Permission denied` and **missed** `/etc/ssh/sshd_config.d/50-redhat.conf`, `50-cloud-init.conf`, `firewalld.conf` and `auditd.conf`. An incomplete search leads to wrong conclusions.

---

## Part F: Links and inodes

```text
NAME (in a folder) ──▶ INODE (#33694106: owner, perms, size, times, data location) ──▶ DATA
```

| | Hard link (`ln a b`) | Soft link (`ln -s a b`) |
|---|---|---|
| Points to | the **inode** | a **path** (text) |
| Own inode? | no, same number | yes, different number |
| Target renamed or deleted | still works | **breaks**: No such file or directory |
| `ls -l` shows | link count 2 | `l…  b -> a` |

**Proven in the lab:** changing the file through one hard-link name showed through the other; deleting one name dropped the link count 2 → 1 and the data survived; renaming the target broke the soft link, renaming it back fixed it.

**Production uses of soft links:** `/bin -> usr/bin`, `yum.conf -> dnf/dnf.conf`, `/usr/bin/dnf -> dnf-3`,
`/opt/app/current -> releases/v2` (instant rollback by re-pointing `current`).

---

## Incidents

!!! danger "INC-007 · Search looked complete but missed files (live)"
    **Symptom:** a search for config files showed results and some `Permission denied` lines.
    **Evidence:** the same search with `sudo` listed extra files, including `/etc/ssh/sshd_config.d/*.conf`.
    **Root cause:** `find` ran as a normal user, so protected folders were skipped, which made the result incomplete.
    **Fix / prevention:** search system folders with `sudo`; treat `Permission denied` lines as "results incomplete".

!!! danger "INC-008 · 'No such file' for a file that ls shows (live)"
    **Evidence:** `ls -l` → `shortcut.txt -> readme.txt`; `readme.txt` no longer existed.
    **Root cause:** a broken symbolic link: its target had been renamed.
    **Fix:** restore the target name (or recreate the link). **Prevention:** after moving files, check links with `ls -l`.

!!! danger "INC-009 · App can't create its log at startup (live)"
    **Symptom:** `touch app/logs/app.log` → No such file or directory.
    **Root cause:** the deployment never created `app/logs`, and `touch` cannot create parent directories. Typos in the deployment (`confg`, `app.cong`) would also have broken config loading.
    **Fix:** `mkdir -p app/logs`; renamed the typo'd folder/files with `mv`. **Verified** with the app's exact command.
    **Prevention:** create every required folder with `mkdir -p` in the deployment; copy-paste reviewed commands; don't change systems when exhausted.

!!! danger "INC-010 · Web app won't start: 'port not set' (live)"
    **Evidence:** `ls -l` → `web.conf` 0 bytes (21:04), `web.conf.new` 0 bytes (21:03), `web.conf.bak-…` 10 bytes. `cat` → only the backup has `port=8080`.
    **Root cause:** an empty template was copied **over** the live config (wrong direction, no `-i`), leaving it empty.
    **Fix:** kept `web.conf.broken` as evidence, restored from the dated backup, verified `port=8080`.
    **Prevention:** `cp -i` for configs, check FROM/TO before Enter, always make a dated backup before changes.

!!! note "INC-011 · Disk filling with old logs (in progress)"
    Ticket: delete shop logs older than 7 days, keep recent ones. Next step: list with `find … -mtime +7` before deleting.

---

## Mistakes made while learning

| Mistake | Lesson |
|---|---|
| `mdkir` → then every `touch` failed | Fix the **first** error; later ones are side effects |
| `cp`/`mv` from the wrong folder (`cannot stat`, `Not a directory`) | FROM and TO both count from where you stand; use absolute paths when unsure |
| `echo "text" file` without `>` | `echo` only prints; `>` saves |
| `echo ""version 2"` | Quotes come in pairs; a bare `>` prompt means one is open, so press Ctrl+C |
| `-name d` instead of `-type d` | `-name` matches names, `-type` matches kinds |
| `rm -rf config` scenario: "nothing is deleted" | A wrong relative path deletes something **else** |
| Verified with `app.cong` instead of `app.log` | Verify with the app's **exact** command |

---

## Interview questions

??? example "What happens when you delete a file that has two hard links?"
    Only that name is removed; the link count drops by one. The data is freed only when the count reaches zero, so the other name still works.

??? example "Hard link vs soft link?"
    A hard link is another name for the same inode. A soft link is a separate file containing a path; it breaks if the target path disappears. Soft links can cross filesystems and point to folders; hard links can't.

??? example "Why is mv instant for a 50 GB file but cp is slow?"
    Within one filesystem, `mv` only changes the name in the directory; the inode and data don't move. `cp` reads and writes all 50 GB into a new inode.

??? example "How do you safely remove log files older than 7 days?"
    List first with `find <dir> -type f -mtime +7`, review the list, then delete with full paths (or `-delete` once the list is verified). Never run a delete you haven't listed.

### Command questions

??? example "Show the newest 20 lines of the system log and keep watching it."
    `sudo tail -n 20 -f /var/log/messages`

??? example "Find files in /etc changed in the last day."
    `sudo find /etc -type f -mtime -1`

??? example "Back up sshd_config with a date, keeping its original timestamp."
    `sudo cp -p /etc/ssh/sshd_config /etc/ssh/sshd_config.bak-20260929`

??? example "Show inode numbers and link counts in a folder."
    `ls -li`

### Troubleshooting scenarios

??? example "An app says 'No such file or directory' for a file you can see in ls."
    `ls -l` the path: if it's a symbolic link, check where it points and whether that target exists. Restore the target or re-point the link; verify with the app.

??? example "The disk is full on a server. First steps?"
    Check which folder grows automatically (`/var/log`), find big files with `sudo find /var/log -type f -size +100M`, review them, and remove or rotate old ones safely. Keep evidence and fix the cause of growth (Topic 24: log rotation).

??? example "A config 'suddenly' broke. How do you find out what changed?"
    `ls -l` for size and time, `sudo find /etc -mtime -1` for recently changed files, compare with backups (`*.bak-DATE`), check `/var/log/secure` for who used sudo and when.
