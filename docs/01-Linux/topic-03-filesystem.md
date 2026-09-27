# Topic 3: Filesystem

**Status:** complete except the project (Mini Project 1, after Topic 4) · **Levels covered:** basic, intermediate, advanced · **Focus:** Red Hat family

!!! tip "How to use this page"
    Read the concepts, redo the commands on any Red Hat family server, then try the self-test.

---

## Part A: The directory tree

### What is it?
Linux has **one single tree** starting at **`/`** ("root"). There is no `C:` or `D:`.
Extra disks are attached **into** the tree as folders: on the lab VM, `/boot` and `/var/oled` are separate storage but appear as folders.

### Why does it exist?
The **Filesystem Hierarchy Standard (FHS)**: the same folder has the same purpose on every distribution.
Learn it once and you can find your way on any Linux server, including servers you have never seen.

### The main folders

```text
/                  the top of everything
├── etc     ⭐     CONFIGURATION files (ssh, network, users, sudo, cron…)
├── var     ⭐     data that CHANGES: logs (/var/log), caches, spools, databases
├── home           normal users' home folders (/home/opc)
├── root           the root user's home
├── tmp            temporary files (every user can write; protected by the sticky bit)
├── usr            installed programs and libraries (/usr/bin, /usr/sbin)
├── bin, sbin, lib old names kept as LINKS → usr/bin, usr/sbin, usr/lib
├── opt     ⭐     third-party software (vendor agents, backup tools)
├── boot           kernels + GRUB (Topic 2)
├── dev, proc, sys live kernel windows (Topic 2)
├── run            runtime data, gone at reboot
└── mnt, media     places to attach disks and USBs temporarily
```

### Reading `ls -l /` (first character only, for now)

```text
dr-xr-xr-x.   5 root root 4096 Sep 25 10:28 boot       ← d = directory
lrwxrwxrwx.   1 root root    7 Oct 26  2024 bin -> usr/bin   ← l = link (shortcut)
dr-xr-x---.   3 root root  124 Sep 25 18:40 root       ← "---" at the end: others get NOTHING
drwxrwxrwt.  10 root root 4096 Sep 25 20:35 tmp        ← t = sticky bit
dr-xr-xr-x. 252 root root    0 Sep 25 10:27 proc       ← size 0: live kernel window
```

The `---` on `/root` is exactly why `ls /root` gave "Permission denied" in Topic 2. Full permission reading is Topic 6.

### Real finds on the lab VM

- `/etc`: `ssh/`, `sudoers`, `passwd`, `shadow`, `fstab`, `hosts`, `resolv.conf`, `yum.repos.d/`, `oracle-cloud-agent/`
- `/etc/ssh`: `sshd_config` is `-rw-------` (root only); host **private** keys are `-rw-------`, their **`.pub`** public keys are readable by everyone
- `/var/log`: `messages` (general system log), `secure` (logins, SSH, sudo), `cron`, `dnf.log`, `cloud-init.log` (what the cloud did at first boot)
- `/var/log` group `adm`: files like `cloud-init-output.log` belong to group `adm`, and `opc` is in `adm`, so `opc` can read them without sudo
- `/opt`: `rh`

---

## Part B: Paths

- **Current directory:** the folder you are standing in; every command runs from there. Your prompt shows it: `[opc@test-linux-01 ssh]$`.
- **Absolute path:** starts with `/`, a full address from the top. Works from **anywhere**: `/etc/ssh/sshd_config`
- **Relative path:** no leading `/`, directions from where you stand: `ssh/sshd_config` works only if you are in `/etc`

| Name | Means |
|---|---|
| `.` | this folder |
| `..` | one level up |
| `~` | **my** home (`/home/opc` for opc, **`/root` for root**) |
| `-` | with `cd` only: the previous folder |

### Commands

```text
pwd              where am I?
cd /etc          move (absolute)
cd ssh           move (relative, into ssh inside where I am)
cd ..            up one level
cd  or  cd ~     home
cd -             back to the previous folder (and prints it)
```

### The lesson you discovered yourself

```text
From /home/opc:  cd ssh         → No such file   (home has no "ssh" folder)
From /etc:       cd ssh         → works

From /etc/ssh:   cd ../var/log  → No such file   (.. goes to /etc → looks for /etc/var/log)
From /etc:       cd ../var/log  → works          (.. goes to / → /var/log)
```

**Same command, different result, depending only on where you stand.**

!!! warning "First word is always the command"
    Typing just `/etc` or `~` gives "Is a directory": the shell tried to **run** a folder. Put a command in front: `ls /etc`.

---

## Intermediate: multi-level paths

Linux resolves a relative path **one step at a time**:

```text
You're in: /var/log        Command: cd ../../etc/ssh
start  /var/log
  ..   /var
  ..   /
  etc  /etc
  ssh  /etc/ssh      ← result
```

- **You can't go above `/`.** `..` of `/` is `/` itself: from `/tmp`, `cd ../../../..` safely lands at `/`.
- **Paths work with every command, not just `cd`:** `ls ../../etc/ssh` lists that folder **without moving you**.
- **`..` never means "home".** It only goes up toward `/`.

### Practice results (real)

| Start | Command | Landed |
|---|---|---|
| `/var/log` | `cd ../..` | `/` |
| `/etc/ssh` | `cd ../../var/log` | `/var/log` |
| `/usr/share/doc` | `cd ../../bin` | `/usr/bin` |
| `/home/opc` | `cd ../..` | `/` |
| `/var/log` | `ls ../../etc/ssh` | lists `/etc/ssh`, still in `/var/log` |
| `/etc` | `cd ./ssh` | `/etc/ssh` |
| `/tmp` | `cd ../../../..` | `/` (no error) |

---

## Advanced: find it fast on call

At 2 AM you need a service's **config**, **logs** and **program** in seconds. Predict with the pattern, then prove with one `ls -l <path>`.

```text
Config   →  /etc/<name>   or  /etc/<name>.conf
Logs     →  /var/log/<name>   or a shared log named by PURPOSE
Program  →  /usr/sbin/<name>  (services, admin tools)
            /usr/bin/<name>   (normal user commands)
```

| Service | Config | Log | Program |
|---|---|---|---|
| sshd (SSH server) | `/etc/ssh/sshd_config` | `/var/log/secure` | `/usr/sbin/sshd` |
| crond (scheduled jobs) | `/etc/crontab`, `/etc/cron.d/` | `/var/log/cron` | `/usr/sbin/crond` |
| chronyd (time sync) | `/etc/chrony.conf` | `/var/log/chrony/` | `/usr/sbin/chronyd` |
| dnf (software installs) | `/etc/dnf/dnf.conf` | `/var/log/dnf.log` | `/usr/bin/dnf` → link to `dnf-3` |
| rsyslogd (system logger) | `/etc/rsyslog.conf` | `/var/log/messages` (+ `secure`, `cron`) | `/usr/sbin/rsyslogd` |
| Oracle Cloud Agent | `/etc/oracle-cloud-agent/` | `/var/log/oracle-cloud-agent/` | (vendor) |

**Exceptions matter:** rsyslogd is the **writer** of several logs, so no log is named after it; each is named by purpose.

**Links you discovered:** `yum.conf -> dnf/dnf.conf` (old name kept for compatibility), `/usr/bin/dnf -> dnf-3`,
`/usr/sbin/reboot -> ../bin/systemctl` (even reboot is systemd underneath).

**Rotated logs:** `messages-20260927`, `cron-20260927` are yesterday's logs renamed so files don't grow forever (Topic 24).

**Tips:** name the exact file (`ls -l /usr/sbin/sshd`) instead of listing a huge folder; press **Tab** to complete names
(`/etc/rsys` + Tab → `rsyslog.conf rsyslog.d/`).

---

## Real use cases

| Situation | Filesystem knowledge that solves it |
|---|---|
| Nightly script fails with "No such file or directory" but works by hand | It uses a **relative** path (`cd backups`); automatic jobs start in another folder. Use `/opt/app/backups` |
| "Where is the SSH config? Who can read it?" | `/etc/ssh/sshd_config`, root only (`-rw-------`) |
| Login or sudo problem | `/var/log/secure` |
| Package install problem | `/var/log/dnf.log` |
| OCI agent misbehaving | `/etc/oracle-cloud-agent/` and `/var/log/oracle-cloud-agent/` |
| What did the cloud do when the VM was created? | `/var/log/cloud-init.log` |
| A dangerous command like `rm` with a relative path | Predict where the path resolves **before** pressing Enter, or use an absolute path |

### Tabletop incident: backup script fails at night
**Symptom:** `cd backups` works by hand from `/opt/app`, fails at night with "No such file or directory".
**Root cause:** relative path; the automatic run starts in a different folder.
**Fix:** `cd /opt/app/backups`. The leading `/` makes it absolute. (`opt/app/backups` without `/` is still relative.)

---

## Mistakes made while learning

| Mistake | Lesson |
|---|---|
| `cd /rtc/ssh`, `/sys/clss/net` | Use Tab completion |
| `/etc` or `~` typed alone | A folder needs a command in front |
| `cd ssh` from home | Relative paths depend on where you stand |
| Predicted "home" for `cd ../..` | `..` goes up toward `/`, never to home |
| `cd opt/app/backkup` | Absolute paths start with `/`; check spelling |
| `ls -l /etc/rsyslog.` | Incomplete name; Tab would finish it |
| Working as root | `~` changes meaning (`/root`), and root isn't needed to look around |

---

## Self-test

??? question "1. Where do you look first for a service's config and its logs?"
    Config in `/etc`, logs in `/var/log`.

??? question "2. What makes a path absolute?"
    It starts with `/`. It works from anywhere.

??? question "3. You're in /etc/ssh. Where does cd ../../var/log take you?"
    Nowhere: `..` goes to `/etc`, then looks for `/etc/var/log`, which doesn't exist → No such file or directory.

??? question "4. As root, where does cd ~ go? As opc?"
    `/root` for root, `/home/opc` for opc: `~` means "my home".

??? question "5. Why is there no /var/log/rsyslogd?"
    rsyslogd writes several logs named by purpose: `messages`, `secure`, `cron`.

??? question "6. What does 'bin -> usr/bin' in ls -l / mean?"
    `/bin` is a link (shortcut) to `/usr/bin`, kept for compatibility.

??? question "7. A script works by hand but fails from an automatic job. First suspect?"
    A relative path. Replace it with an absolute path.

---

## Interview questions

Answer out loud first, as if in an interview, then open the model answer.

??? example "What is the FHS and why does it matter operationally?"
    The Filesystem Hierarchy Standard defines where things live: config in /etc, variable data and logs in /var, programs in /usr/bin and /usr/sbin, third-party software in /opt. It lets you find config and logs on any Linux server quickly, which matters most during incidents.

??? example "Absolute vs relative paths: why does it matter in scripts?"
    An absolute path starts at / and works from anywhere. A relative path depends on the current directory. Scheduled jobs and services often start in a different directory, so relative paths that work by hand fail in automation. Scripts should use absolute paths.

??? example "An application can't read its config. Where do you start looking?"
    Confirm the config path (usually under /etc or the app's /opt directory), check the file exists with ls -l, check who runs the process and whether that user can read the file and every parent directory, and check the application's logs under /var/log.

??? example "Where would you look for SSH login failures and sudo usage on RHEL?"
    /var/log/secure, written by rsyslog. General system messages are in /var/log/messages. The SSH server config is /etc/ssh/sshd_config.

??? example "What are /bin -> usr/bin style links and why do they exist?"
    Modern RHEL merged /bin, /sbin and /lib into /usr; the old paths are kept as symbolic links so older scripts and tools keep working.

??? example "Why is there no log file named after rsyslogd?"
    rsyslogd is the logging daemon: it writes other logs, named by purpose, such as messages, secure and cron, according to /etc/rsyslog.conf.

