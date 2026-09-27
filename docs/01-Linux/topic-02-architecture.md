# Topic 2: Linux Architecture

**Status:** complete except the project (Mini Project 1, after Topic 4) · **Levels covered:** basic, intermediate, advanced · **Focus:** Red Hat family

!!! tip "How to use this page"
    Read each part, redo the commands on a Red Hat family server, then do the self-test at the bottom.
    The real outputs shown come from the lab VM (Oracle Linux 9.8, kernel 6.12 UEK, 4 vCPUs).

Topic 2 has three parts: **A** kernel space vs user space, **B** how Linux boots, **C** the live kernel windows `/proc`, `/sys`, `/dev`.
Then the intermediate health snapshot, and the advanced reboot/patching skills.

---

## Part A: Kernel space vs user space

### What is it?
Everything running on a Linux server lives in one of two areas:

- **Kernel space:** only the kernel. The only code allowed to touch hardware (disk, memory, network).
- **User space:** every program: `bash`, `ls`, nginx, databases, even programs run by **root**. They **cannot** touch hardware directly.

### Why does it exist? The bank analogy

```text
Customers  = programs (cat, ls, nginx)     ← USER SPACE
    │  "please give me this"  (a request = SYSTEM CALL)
    ▼
Teller     = the kernel                    ← KERNEL SPACE
    │  checks: does it exist? are you allowed?
    ▼
Vault      = hardware (disk, memory, network)
```

Customers never walk into the vault. If programs could touch hardware directly, one buggy program could crash the
server or read another program's secrets. With the separation, a crashing program dies alone, and every request is checked.

### How it works: system calls
A **system call** is a program asking the kernel for something: open a file, read it, send a packet, start a process.

```text
cat /etc/hostname
   ↓
openat("/etc/hostname")   ← "kernel, open this file"
   ↓
kernel checks: exists? allowed?
   ↓
read()  → kernel reads the disk and hands the bytes back
write() → kernel prints them on your terminal
```

!!! success "The one sentence to remember"
    **Programs ask, the kernel decides.** "Permission denied" and "No such file or directory" are the **kernel's** answers; the program only prints them.

### Commands and real results

```text
cat  /etc/hostname      → test-linux-01                               kernel said yes
cat  /etc/nofile        → No such file or directory                   kernel said "doesn't exist"
ls   /root              → Permission denied                           kernel said "not allowed"
sudo ls /root           → (empty output = success)                    asked as root → yes
```

- `sudo` runs **one** command as root, then you are back to your own user.
- Empty output is still success: `/root` was simply empty.

### Troubleshooting: "cat is broken" (live)
**Ticket:** "`cat` gives Permission denied on `/etc/shadow`, it must be broken."

**Change one thing and compare:** `cat /etc/hostname` works → `cat` is fine. `cat /etc/shadow` is denied → the file's rules refuse you.
Same program, different result, so the program is not the problem. The kernel refused based on the file's permissions (Topic 6).

!!! note "Parked for later"
    `strace` shows every system call a program makes. It is a deep troubleshooting tool and returns in Topic 37.

---

## Part B: How Linux boots

```text
1. Firmware (BIOS/UEFI)   checks hardware, starts the bootloader
        ↓
2. GRUB                   loads the DEFAULT kernel + its initramfs into memory
        ↓
3. Kernel                 starts, detects CPU, memory, devices
        ↓
4. initramfs              small ready-made starter filesystem: gives the kernel the drivers
                          to open the REAL disk, then hands over to it
        ↓
5. systemd (PID 1)        the first program; starts every service
        ↓
6. Services               network, sshd, cron … → you can log in with SSH
```

### Why you care: every stage fails differently

| Stage that breaks | What you see | Typical cause |
|---|---|---|
| Firmware | VM never gets to GRUB | Hardware or hypervisor problem |
| GRUB | GRUB menu or `grub>` prompt, no Linux | Broken bootloader config |
| Kernel / initramfs | Kernel panic, "cannot mount root" | Wrong kernel, missing driver in initramfs, disk renamed |
| systemd / services | Boots, but SSH or the app doesn't work | A failed service, a bad `/etc/fstab` entry |
| Network / SSH | Server "up" in the console but unreachable | Network config, firewall, sshd down |

When you can't SSH in, the cloud console's **serial console** lets you watch these stages and see where it stops.

### Commands and real results

```text
ps -p 1 -o comm=      → systemd
```
```text
ps     -p 1          -o comm=
 │       │              └ show only the program name, no header ("comm==" would print "=" as the header)
 │       └ only process ID 1
 └ process status
```

```text
systemd-analyze
Startup finished in 1.151s (kernel) + 4.044s (initrd) + 24.886s (userspace) = 30.081s
multi-user.target reached after 24.529s in userspace.
```

- **userspace** is usually the slowest: that is all the services starting.
- **multi-user.target** is systemd's boot goal for a server: network and logins ready, no desktop.
- On VMs, firmware and loader times are often not shown.

### Installed vs running vs next-boot kernel

Think of a garage: `ls /boot` shows the cars **parked**, `uname -r` shows the car you are **driving**, `grubby` shows the car you will **drive tomorrow**.

| Question | Command | Real answer |
|---|---|---|
| Which kernels are **installed**? | `ls /boot` (count `vmlinuz-*`) | 3: 6.12 UEK, 5.14 RHCK, rescue |
| Which kernel is **running**? | `uname -r` | `6.12.0-206.104.4.4.el9uek.x86_64` |
| Which kernel boots **next**? | `sudo grubby --default-kernel` | `/boot/vmlinuz-6.12.0-206.104.4.4.el9uek.x86_64` |

Files for each kernel in `/boot`:

- `vmlinuz-<ver>` the kernel itself
- `initramfs-<ver>.img` its starter filesystem
- `config-<ver>`, `System.map-<ver>`, `symvers-<ver>` build details and debug maps
- `…kdump.img` used to save a memory dump if the kernel crashes
- `vmlinuz-0-rescue-…` an emergency kernel for when the others won't boot
- `grub2/`, `loader/`, `efi/` the bootloader and its menu entries

---

## Part C: /proc, /sys, /dev

These folders are **not on the disk**. The kernel creates them live, in memory (their size shows as `0`).

| Folder | Window into | Example |
|---|---|---|
| `/proc` | processes and live system information | `/proc/cpuinfo`, `/proc/meminfo`, `/proc/uptime`, one numbered folder per running process |
| `/sys` | hardware and drivers | `/sys/class/net` (network interfaces) |
| `/dev` | devices shown as files | `/dev/sda` (the disk) |

This is the Unix idea "**everything is a file**": monitoring agents read these files over and over.

### Commands and real results

| Command | Real result | Meaning |
|---|---|---|
| `grep "model name" /proc/cpuinfo` | 4 lines, "AMD EPYC … 96-Core" | 4 vCPUs; the 96 cores belong to the physical host |
| `head -3 /proc/meminfo` | MemTotal 7.3 GB, MemAvailable 6.6 GB | judge memory by **MemAvailable** |
| `ls /sys/class/net` | `enp0s5  lo` | network card + loopback |
| `lsblk` | `sda` 46.6G, `/boot` 2G, `/` on LVM | disk layout |

!!! warning "Two traps"
    - `grep` prints **nothing** when nothing matches (a typo like `"'model name"` gives silence, not an error).
    - On **ARM** servers, `/proc/cpuinfo` has no "model name" line at all.

**Why MemAvailable?** Linux uses spare RAM as file cache and releases it instantly. On the lab VM, `Cached` was about 0.7 GB,
which is exactly why Available (6.6 GB) was bigger than Free (6.1 GB). A "memory low" alert based on MemFree is often a false alarm.

---

## Intermediate: server health snapshot

**On-call question:** "Is this server healthy, and is it running the right kernel?"

### `/proc/uptime`
```text
98034.13  391466.06
   │          └ idle time summed across all CPUs (ignore)
   └ seconds since boot → ÷ 3600 = 27.2 HOURS
```

### `/proc/loadavg`
```text
0.00  0.00  0.00   1/298   53999
  │     │     │      │       └ last process ID used
  │     │     │      └ running now / total processes
  │     │     └ 15-minute average
  │     └ 5-minute average
  └ 1-minute average
```

**Judge load against the vCPU count** (4 here), like cashiers in a supermarket:

- below 4 → free cashiers, healthy
- around 4 → everyone busy
- above 4 → queueing, overloaded

**Trend:** `3.9 1.2 0.4` is rising (a problem is starting); `0.4 1.2 3.9` is falling (a problem is ending); equal numbers are flat.

### Real snapshot

| Check | Result |
|---|---|
| Uptime | 27.2 hours (last boot: 26 Sep, 14:59) |
| Load | 0.00 0.00 0.00, idle and flat: healthy for 4 vCPUs |
| Running kernel | 6.12 UEK |
| Next-boot kernel | 6.12 UEK: **matches**, no surprise at next reboot |
| Boot time | 11.492 s (new boot; the 30.081 s baseline was from the previous boot) |

!!! note "Reading uptime correctly"
    Uptime tells you **when** the last boot was. `systemd-analyze` shows the time of **that** boot.
    Compare with **when** your baseline was taken: here the VM had been stopped and started after the baseline, so the number changed.

---

## Advanced: kernels, patching and reboots

### Real use cases

| Situation | Evidence to collect | What it means / what to do |
|---|---|---|
| "The server was rebooted last night" | `cat /proc/uptime`, `systemd-analyze` | Small uptime = it rebooted; large = it did **not** |
| Patching finished, reboot planned | `uname -r` vs `sudo grubby --default-kernel` | If they differ, the kernel **will change** at reboot. Check vendor support first |
| Agent stopped working after reboot | `uname -r`, the agent's log in `/var/log` | Kernel changed underneath the agent → set the supported kernel as default, reboot, verify |
| Need to go back to the previous kernel | `ls /boot`, then `sudo grubby --set-default /boot/vmlinuz-<old>` | Roll back by booting the older installed kernel |
| Server came back but something is odd | `systemd-analyze` vs your baseline | A much longer boot points at a slow or failing service |
| Kernel security patch without reboot | Oracle Linux Ksplice (`/var/log/ksplice.log`, `uptrack-*` tools on the lab VM) | Some patches can be applied live; a full kernel update still needs a reboot |

### New commands

```text
sudo  grubby  --set-default  /boot/vmlinuz-6.12.0-206.104.4.4.el9uek.x86_64
                  │                    └ the kernel FILE (full path from ls /boot, not just the version)
                  └ SET the default   (--default-kernel only SHOWS it)

sudo  reboot      restart now: every session and application disconnects
```

### The change-window runbook

```text
PRE-CHECK
1. uname -r                          what's running now
2. sudo grubby --default-kernel      what will boot next
3. cat <agent/app log>               healthy BEFORE the change (baseline)
4. DECIDE: do 1 and 2 match the supported kernel? If yes → go to step 7

FIX (only if needed)
5. sudo grubby --set-default /boot/vmlinuz-<supported kernel>
6. sudo grubby --default-kernel      VERIFY the fix BEFORE rebooting

CHANGE
7. sudo reboot

POST-CHECK (evidence)
8. cat /proc/uptime                  small number = the reboot really happened
9. uname -r                          the supported kernel is running
10. cat <agent/app log>              healthy AFTER the change
```

### Simulator incident: what happens if you skip the pre-check

1. Rebooted **without** checking `grubby --default-kernel` → server booted **5.14**.
2. Backup agent log: `ERROR kernel module not available … agent stopped: unsupported kernel` → **outage**.
3. Diagnosed with `uname -r`, fixed with `grubby --set-default`, rebooted **again** (without verifying first).
4. Post-check: uptime 41 s, kernel 6.12, agent OK → recovered.

**Root cause:** patching changed the next-boot kernel, and nobody checked before rebooting.
**Impact:** two reboots instead of one; backups down in between.
**Lesson:** the runbook's steps 2 and 6 would have meant one reboot and no outage.

### Tabletop incident: agent broke after monthly patching
Evidence: `uname -r` → `5.14.0…el9_8`; `grubby --default-kernel` → `/boot/vmlinuz-5.14.0…`.
**Answer:** the running kernel changed 6.12 → 5.14 because patching changed GRUB's default; the agent was built for 6.12.
**Fix:** set 6.12 as default, reboot, verify. **Prevention:** check the default kernel before every reboot.

### Tabletop incident: 96 workers
`/proc/cpuinfo` says "96-Core Processor" but shows 4 `model name` lines. The VM has **4 vCPUs**.
96 CPU-heavy workers would queue on 4 CPUs and make the server extremely slow (even SSH feels frozen).
Size CPU-heavy workers to the vCPU count.

---

## Mistakes made while learning

| Mistake | Lesson |
|---|---|
| `systemd-analyse`, `sustemd-analyze` | Linux uses American spelling; use **Tab** |
| `sudo gubby`, `sudo grub` | The tool is `grubby`; Tab completes it |
| `ls/root` | The space separates the command from its argument |
| Reading Incident 2B backwards | Line up BEFORE and AFTER explicitly before answering |
| "27.26 sec" for uptime | seconds ÷ 3600 = **hours**; always check the unit |
| `--set-default 6.12.0…` | It needs the full file path `/boot/vmlinuz-…` |
| Rebooting without the pre-check | Always compare running vs next-boot kernel first |
| Working as root (`sudo su`) for read-only checks | Least privilege: `sudo` only on the command that needs it |

---

## Self-test

??? question "1. A program gets 'Permission denied'. Who refused, and how do you prove it isn't the program?"
    The kernel. Run the same program on a file you're allowed to read: if it works there, the program is fine.

??? question "2. Name the six boot stages in order."
    Firmware → GRUB → kernel → initramfs (opens the real disk) → systemd (PID 1) → services, then SSH login.

??? question "3. Installed, running and next-boot kernel: one command each."
    `ls /boot` · `uname -r` · `sudo grubby --default-kernel`

??? question "4. uname -r shows 6.12 but grubby --default-kernel shows 5.14. What happens at the next reboot, and what do you do first?"
    The server boots 5.14. Before rebooting, check that 5.14 is supported by every agent/app; if not, set the right default with `grubby --set-default` and verify it.

??? question "5. How do you prove a reboot really happened?"
    `cat /proc/uptime`: a small number of seconds means it just booted.

??? question "6. Load average is 6.2 5.1 3.0 on a 4 vCPU server. Healthy? Rising or falling?"
    Overloaded (above 4) and rising (the 1-minute number is the highest).

??? question "7. Why is initramfs needed?"
    It gives the kernel the drivers it needs to open the real disk; then the system hands over to the real disk.

??? question "8. Why can SSH feel frozen when an app runs 96 CPU-heavy workers on 4 vCPUs?"
    Every process, including sshd, waits in the same CPU queue.

---

## Interview questions

Answer out loud first, as if in an interview, then open the model answer.

??? example "Explain kernel space and user space."
    The kernel runs privileged and is the only code that touches hardware. All programs, even root's, run in user space and ask the kernel for resources through system calls. The kernel checks and decides, which isolates failures and enforces security. 'Permission denied' is the kernel's answer to a system call.

??? example "Walk me through the Linux boot process."
    Firmware checks hardware and starts GRUB; GRUB loads the default kernel and its initramfs; the kernel initialises hardware; initramfs provides drivers to mount the real root filesystem and hands over; systemd starts as PID 1 and brings up services until the target (multi-user) is reached; then sshd accepts logins.

??? example "A server won't come back after a reboot. How do you narrow it down?"
    Use the cloud serial console to see which stage stops: GRUB prompt, kernel panic or 'cannot mount root' (kernel/initramfs/disk), boot completes but services fail (systemd, fstab), or it's up but unreachable (network, firewall, sshd). Each stage points to a different fix.

??? example "Patching is done and a reboot is planned. What do you check first?"
    Compare `uname -r` with `grubby --default-kernel`. If the next-boot kernel differs, confirm it's supported by every agent and application. Take a baseline of application/agent health, fix the default if needed and verify it, reboot, then prove with uptime, uname -r and the application logs.

??? example "How do you prove a server really rebooted, or that it didn't?"
    /proc/uptime gives seconds since boot; a small value means it just booted. systemd-analyze shows that boot's duration. Comparing the boot time with a known change time gives evidence either way.

??? example "Why do alerts on MemFree cause false alarms?"
    Linux uses free RAM as page cache and releases it instantly. MemAvailable estimates what applications can actually use, so it's the right signal for memory alerts.

??? example "How do you interpret a load average?"
    It's the average number of runnable tasks over 1, 5 and 15 minutes. Compare it to the vCPU count: below is fine, above means queueing. The three numbers show the trend: 1-minute highest means rising.

