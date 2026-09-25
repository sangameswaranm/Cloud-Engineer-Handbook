# Session 01: Introduction & Architecture

**Date:** 2026-09-25 · **Time:** 1:29:05 (stopwatch) · **Topics:** 1 Introduction, 2 Linux Architecture (A, B, C) · **Result:** both assessed, pass

**Machine used:** a KVM virtual machine, Red Hat family (EL9 compatible), kernel 6.12, 4 vCPUs, ~7.3 GB RAM.

## Key ideas to remember

- **Linux is the kernel.** A distribution = kernel + GNU tools + systemd + package manager + support.
- **Three different numbers:** distribution release (`/etc/os-release`), kernel (`uname -r`), lifecycle (vendor). The same EL 9.8 system can run kernel 5.14 (RHCK) or 6.12 (UEK).
- **Programs ask, the kernel decides.** "Permission denied" and "No such file or directory" are the kernel's answers.
- **Boot:** firmware → GRUB (loads default kernel + initramfs) → kernel → initramfs opens the real disk → systemd (PID 1) → services → SSH.
- **Installed vs running kernel:** `ls /boot` shows installed; `uname -r` shows running; `grubby --default-kernel` shows next boot.
- **/proc, /sys, /dev** are live windows created by the kernel, not files on disk.
- **MemAvailable, not MemFree,** is the real usable memory.
- **A VM's CPUs are a slice** of the host: count `model name` lines, don't trust the chip's core count.

## Commands learned

| Command | Purpose | Anatomy |
|---|---|---|
| `cat /etc/os-release` | Distribution and release | command + file |
| `uname -r` / `uname -m` | Running kernel / CPU architecture | command + option |
| `hostnamectl` | Summary incl. virtualization | command |
| `cat /proc/version` | Kernel describing itself | command + file |
| `ls /root`, `sudo ls /root` | Test permission (denied vs allowed) | sudo runs the next command as root |
| `ps -p 1 -o comm=` | Which program is PID 1 | `-p 1` = process 1; `-o comm=` = name column, no header |
| `systemd-analyze` | Boot time per stage | command |
| `ls /boot` | Installed kernels (`vmlinuz-*`) | command + folder |
| `sudo grubby --default-kernel` | Kernel for next boot (Red Hat family) | needs root |
| `grep "text" file` | Lines containing text (silent if no match) | command + pattern + file |
| `head -3 file` | First 3 lines | command + count + file |
| `ls /sys/class/net` | Network interfaces | |
| `lsblk` | Disks, partitions, LVM, mount points | |

## Real results (this session)

- Distribution: `ID="ol"`, `ID_LIKE="fedora"`, `PLATFORM_ID="platform:el9"`, VERSION 9.8
- Kernel running: `6.12.0-206.104.4.4.el9uek.x86_64`; installed: 6.12 UEK, 5.14 RHCK, rescue
- Virtualization: `kvm`, hardware vendor QEMU, `x86_64`
- Boot: 1.151s kernel + 4.044s initrd + 24.886s userspace = **30.081s** (baseline)
- CPU: 4 vCPUs (AMD EPYC host chip); memory ~7.3 GB total, ~6.6 GB available
- Disk: `sda` 46.6G → `/boot/efi` 100M, `/boot` 2G, LVM → `/` 29.5G and `/var/oled` 15G
- Interfaces: `lo`, `enp0s5`

## Tests

| Test | Result |
|---|---|
| TC1-01..04 identify family, kernel, arch, VM | PASS |
| TC2A-01 read /etc/hostname | PASS |
| TC2A-02 ls /root as normal user | DENIED (expected) |
| TC2A-03 sudo ls /root | PASS |
| TC2A-04 cat /etc/shadow as normal user | DENIED (expected) |
| TC2B-01..05 PID 1, boot baseline, running kernel file, 3 kernels, default kernel | PASS |
| TC2C-01..04 CPU count, memory, interfaces, root volume | PASS |

## Incidents

- **INC-001 (live):** installer "Unsupported OS" → it checks `ID`, server is `ol`; compatibility is in `ID_LIKE`/`PLATFORM_ID`. Never edit `/etc/os-release`.
- **INC-002 (live):** "cat is broken" → the kernel refused; proof: same program works on another file.
- **INC-003 (tabletop):** agent broke after patching → default kernel changed 6.12 → 5.14; fix with `grubby --set-default`, verify `uname -r`.
- **INC-004 (tabletop):** 96 workers on 4 vCPUs → queueing, extreme slowness; size to vCPUs.

## Mistakes and lessons

- Typos (`os-realese`, `systemd-analyse`, `gubby`, `sustemd`, `ls/root`) → use **Tab** completion; the space separates command and argument.
- `ssh` typed twice → the first plain word after options is the hostname ("could not resolve hostname ssh").
- `grep "'model name"` → extra quote, no match, **no output**: silence can mean "not found".
- `sudo su` just to read files → use least privilege; `sudo <command>` is audited per command.

## Parked for later

- Reading `strace` output in depth → Topic 37 (Troubleshooting).
- SSH idle disconnects: shell `TMOUT` and sshd ClientAlive ruled out; client keepalive applied, 20-minute test pending.

## Self-test (answer without looking)

1. Which two commands check "RHEL 9 compatible, kernel 5.14+"?
2. Who says "Permission denied": the program or the kernel? How do you prove it?
3. Name the six boot steps in order.
4. Installed vs running vs next-boot kernel: one command each.
5. An alert says MemFree is low. Which line do you check first, and why?
