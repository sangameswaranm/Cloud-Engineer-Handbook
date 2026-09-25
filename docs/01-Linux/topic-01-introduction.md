# Topic 1: Linux Introduction

**Status:** complete except the project (Mini Project 1, after Topic 4) · **Levels covered:** basic, intermediate, advanced · **Focus:** Red Hat family (RHEL, Oracle Linux, Rocky, Alma)

!!! tip "How to use this page"
    Read the concepts first, then redo the commands on any Red Hat family server and compare with the real outputs shown here.
    Finish with the self-test at the bottom; the answers are hidden until you open them.

---

## 1. What is Linux?

**Linux is a kernel**: the core program that controls the CPU, memory, disks and network, and decides which program gets what.

When people say "a Linux server", they mean the kernel **plus** everything packaged around it. That full package is a **distribution**.

```text
┌──────────────────────────────────────────┐
│ Applications   nginx, postgres, agents   │
├──────────────────────────────────────────┤
│ Shell + tools  bash, ls, grep  (GNU)     │ ← USER SPACE
│ Libraries      glibc                     │   (the distribution
│ Services       systemd                   │    decides all of this)
│ Packages       dnf / rpm                 │
├──────────── system calls ────────────────┤
│ Linux KERNEL                             │ ← KERNEL SPACE
├──────────────────────────────────────────┤
│ Hardware / virtual machine               │
└──────────────────────────────────────────┘
```

## 2. Why does Linux exist? (history with a purpose)

```text
Unix (1969)        good design: everything is a file, small tools, pipes, multi-user
   ↓
Commercial Unix    expensive, locked to one vendor's hardware   ← the problem
   ↓
GNU (1983)         free tools: bash, ls, cp, grep, gcc … but no kernel
   ↓
Linux (1991)       Linus Torvalds writes a free kernel → GNU + Linux = a complete free OS
   ↓
Distributions      someone packages, tests and updates it for you
   ↓
Enterprise Linux   long support, security patches, certification ← what companies pay for
```

**Why an engineer cares**

- Most commands you type are **GNU tools**, which is why they work the same on every Linux.
- Companies choose a distribution for its **support lifecycle**, not its features.
- In 2020 CentOS changed direction; **Rocky** and **Alma** appeared as free RHEL-compatible replacements. Distribution choice is a business decision too.

## 3. The Red Hat family

```text
Fedora  →  CentOS Stream  →  RHEL  →  rebuilt as Rocky, AlmaLinux, Oracle Linux
(newest)                    (paid,     (compatible, free or differently supported)
                             supported)
```

All of them use `.rpm` packages, `dnf`, `firewalld`, SELinux and `grubby`. That is why a RHEL 9 guide works on Oracle Linux 9 or Rocky 9.

## 4. Three numbers that are often confused

| Number | Example | Tells you | Where to look |
|---|---|---|---|
| **Distribution release** | 9.8 | Which package versions you get | `cat /etc/os-release` |
| **Kernel version** | 6.12.0 or 5.14.0 | Kernel features, driver support | `uname -r` |
| **Lifecycle** | ~10 years per enterprise major version | How long you get security patches | Vendor website |

**Key lesson from the real server:** it runs release **9.8** but kernel **6.12**, while standard RHEL 9 ships kernel **5.14**.
Two servers both called "EL 9.8" can run different kernels. That is why vendor support matrices list **both** the OS release and the kernel.

### Oracle Linux has two kernels

- **RHCK** (Red Hat Compatible Kernel): same version as RHEL's kernel, e.g. `5.14.0-…el9_8`
- **UEK** (Unbreakable Enterprise Kernel): Oracle's newer kernel, e.g. `6.12.0-…el9uek`. Default on OCI images.

### Reading a kernel name

```text
5.15.0  -  209.161.7.2  .  el8  uek  .  x86_64
  │            │            │    │       └ architecture: 64-bit Intel/AMD
  │            │            │    └ uek = Oracle's Unbreakable Enterprise Kernel
  │            │            └ built for Enterprise Linux 8
  │            └ the vendor's build / patch number
  └ the base Linux kernel version
```

---

## 5. Commands

### `cat /etc/os-release`: which distribution?

```text
cat  /etc/os-release
 │        └ the file the distribution writes about itself
 └ print a file's contents
```

Real output:

```text
NAME="Oracle Linux Server"
VERSION="9.8"
ID="ol"                          ← WHO I am: Oracle Linux
ID_LIKE="fedora"                 ← WHO I'm similar to: Red Hat family
VERSION_ID="9.8"
PLATFORM_ID="platform:el9"       ← compatible with Enterprise Linux 9
PRETTY_NAME="Oracle Linux Server 9.8"
```

!!! note "ID vs ID_LIKE"
    `ID` is the exact name (`ol`, `rhel`, `rocky`). `ID_LIKE` and `PLATFORM_ID` show compatibility.
    An installer that only accepts `ID="rhel"` will wrongly reject Oracle Linux and Rocky.

### `uname -r` and `uname -m`: kernel and architecture

```text
uname  -r          uname  -m
  │     └ kernel     │     └ machine (CPU architecture)
  └ print system information
```

Real output: `6.12.0-206.104.4.4.el9uek.x86_64` and `x86_64`

- `x86_64` = 64-bit Intel/AMD
- `aarch64` = 64-bit ARM (the same thing `hostnamectl` calls `arm64`)

### `hostnamectl`: the summary

Real output (relevant lines):

```text
 Static hostname: test-linux-01
         Chassis: vm              ← it is a virtual machine
  Virtualization: kvm             ← the hypervisor (strongest proof)
Operating System: Oracle Linux Server 9.8
          Kernel: Linux 6.12.0-206.104.4.4.el9uek.x86_64
    Architecture: x86-64
 Hardware Vendor: QEMU
```

### `cat /proc/version`: the kernel describing itself

`/proc` is not a folder on disk; the kernel creates it live. Real output shows the kernel version and the compiler it was built with (GCC 14.2.1).

### `grep "model name" /proc/cpuinfo`: how many vCPUs

```text
grep  "model name"  /proc/cpuinfo
 │        │              └ the kernel's CPU information
 │        └ text to find (quotes because it has a space)
 └ print only lines containing that text
```

Real output: **4 lines** → **4 vCPUs**. The line says "AMD EPYC … 96-Core Processor": that is the **physical host's** chip; the VM gets a slice.

!!! warning "ARM servers"
    On ARM, `/proc/cpuinfo` has no "model name" line, so this grep prints **nothing**. Silence means "no match", not "zero CPUs".

### `head -3 /proc/meminfo`: memory

```text
head  -3  /proc/meminfo
 │     │        └ the kernel's memory information
 │     └ only the first 3 lines
 └ show the top of a file
```

Real output:

```text
MemTotal:        7655068 kB    → ÷ 1,048,576 ≈ 7.3 GB
MemFree:         6434264 kB    → completely unused
MemAvailable:    6950652 kB    → ≈ 6.6 GB  ← what applications can really use
```

**Available is bigger than Free** because Linux uses spare RAM as cache and releases it instantly when needed. Always judge memory by **MemAvailable**. A "32 GB" VM shows about 31 GB total because firmware and kernel reserve some.

### `lsblk`: disks

Read the line whose TYPE is **`disk`** for the whole disk; `part` and `lvm` lines are pieces of it.

```text
sda                 46.6G  disk
├─sda1               100M  part  /boot/efi
├─sda2                 2G  part  /boot
└─sda3              44.5G  part
  ├─ocivolume-root  29.5G  lvm   /
  └─ocivolume-oled    15G  lvm   /var/oled
```

### `ls /sys/class/net`: network interfaces

Real output: `enp0s5  lo` → `enp0s5` is the network card (en = Ethernet, p0 = PCI bus 0, s5 = slot 5), `lo` is loopback (the server talking to itself).

### `ls /boot`, `sudo grubby --default-kernel`, `systemd-analyze`

Covered fully in Topic 2. For the identity card: installed kernels are the `vmlinuz-*` files in `/boot`; `grubby --default-kernel` shows the next-boot kernel; `systemd-analyze` shows boot time (baseline **30.081 s**).

---

## 6. Intermediate: the server identity card

A **server baseline**: needed for vendor support cases, incident tickets, before/after-change comparisons and capacity planning.

| # | Question | Command | Real answer |
|---|---|---|---|
| 1 | Hostname | `hostnamectl` | `test-linux-01` |
| 2 | Distribution + release | `cat /etc/os-release` | Oracle Linux Server 9.8 |
| 3 | Family + proof | `cat /etc/os-release` | Red Hat: `ID_LIKE="fedora"`, `platform:el9` |
| 4 | Running kernel | `uname -r` | `6.12.0-206.104.4.4.el9uek` |
| 5 | Next-boot kernel | `sudo grubby --default-kernel` | same 6.12 UEK |
| 6 | Architecture | `uname -m` | `x86_64` |
| 7 | VM + hypervisor | `hostnamectl` | VM, KVM (QEMU) |
| 8 | vCPUs | `grep "model name" /proc/cpuinfo` | 4 |
| 9 | Memory | `head -3 /proc/meminfo` | 7.3 GB total, 6.6 GB available |
| 10 | Disk + `/` | `lsblk` | 46.6 GB disk, `/` on LVM 29.5 GB |
| 11 | Interfaces | `ls /sys/class/net` | `enp0s5`, `lo` |
| 12 | Boot baseline | `systemd-analyze` | 30.081 s |

---

## 7. Advanced: vendor support decisions (scenario)

**The skill:** given a vendor support matrix and several servers, decide where each agent can be installed, **with evidence**. A wrong decision means an unsupported production install or a failed change night.

**Method:** read every condition in the rule → collect evidence for each condition → all must pass.

| Agent | Supported when |
|---|---|
| V1 Backup | RHEL 9 compatible **and** `x86_64` |
| V2 Monitoring | Red Hat family, `x86_64` **or** ARM |
| V3 Security | RHEL 8 or 9 compatible, `x86_64`, **Red Hat kernel only (no UEK)** |

| Server | Evidence | V1 | V2 | V3 |
|---|---|---|---|---|
| app-rocky-01 | Rocky 9.4, `platform:el9`, kernel `5.14.0-427…el9_4`, `x86_64` | ✅ | ✅ | ✅ |
| db-ol8-03 | Oracle Linux 8.10, `platform:el8`, kernel `…el8uek`, `x86_64` | ❌ el8, not el9 | ✅ | ❌ UEK kernel |
| api-rhel-04 | RHEL 9.4, `platform:el9`, `aarch64` | ❌ ARM | ✅ | ❌ ARM |

**Lessons**

- The **major version** matters, not only the family: EL8 ≠ EL9.
- Check **every** condition: rocky passed V3 only after checking its kernel had no `uek`.
- `aarch64` **is** ARM.
- Production nuance: some vendors support RHCK but not UEK. Confirm with the vendor before installing on Oracle Linux.

---

## 8. Troubleshooting: "Unsupported OS" (live)

**Symptom:** a vendor installer refuses to run: *Unsupported OS*. The server is RHEL 9 compatible.

**Evidence:** `cat /etc/os-release` → `ID="ol"`. The installer checks `ID="rhel"` only.

**Root cause:** the installer checks the exact name (`ID`) instead of compatibility (`ID_LIKE` / `PLATFORM_ID`).

**Fix:** confirm the vendor supports the distribution and use their supported installer or official override.
**Never** edit `/etc/os-release` to say `rhel`: other software reads it too.

---

## 9. Mistakes made while learning (and the lesson)

| Mistake | What happened | Lesson |
|---|---|---|
| `cat /etc/os-realese` | No such file or directory | Linux doesn't guess names. Use **Tab** completion. |
| `sudo su` to read files | Became root for read-only work | Least privilege: `sudo <command>` is audited per command |
| Answered `ID_LIKE` when asked `ID` | Two different lines | `ID` = who I am, `ID_LIKE` = who I'm similar to |
| Thought `aarch64` was not ARM | Marked ARM server unsupported | `aarch64` = 64-bit ARM |
| `sudo /proc/meminfo` | command not found | A file needs a command in front: `cat /proc/meminfo` |
| `head -5` with no file | Waited for keyboard input | Ctrl+C cancels; give the file name |
| Forgot to convert kB | Answer not readable | Always finish with the value a person needs (GB) |

---

## 10. Cloud connection

- **OCI shapes:** on AMD shapes 1 OCPU = 2 vCPUs, so 4 vCPUs ≈ 2 OCPUs. Azure bills vCPUs directly.
- **Images:** OCI's Oracle Linux images default to the UEK kernel; the RHCK kernel is also installed.
- **Agents:** OCI's own agent keeps config in `/etc/oracle-cloud-agent` and logs in `/var/log/oracle-cloud-agent`.

---

## 11. Self-test

Answer without looking, then open each answer.

??? question "1. A vendor says: RHEL 9 compatible, kernel 5.14 or later. Which two commands do you run?"
    `cat /etc/os-release` (look for `PLATFORM_ID="platform:el9"`) and `uname -r` (compare the kernel version).
    Two separate conditions need two separate pieces of evidence.

??? question "2. What is the difference between `ID` and `ID_LIKE`?"
    `ID` is the exact distribution (`ol`, `rocky`, `rhel`). `ID_LIKE` says which family it is compatible with (`fedora` = Red Hat family).

??? question "3. How do you prove a server is a VM, and name the hypervisor?"
    `hostnamectl` → `Chassis: vm` and `Virtualization: kvm` (the hypervisor).

??? question "4. The CPU line says 96-Core Processor but there are 4 model name lines. How many CPUs can your app use?"
    4. The 96 cores belong to the physical host; the VM gets 4 vCPUs.

??? question "5. An alert says MemFree is 300 MB on an 8 GB server. What do you check first?"
    `MemAvailable`. Free is low because Linux uses spare RAM as cache, which it releases instantly.

??? question "6. What does `uek` in a kernel name mean, and why does it matter?"
    Oracle's Unbreakable Enterprise Kernel. Some vendors only support the Red Hat compatible kernel (RHCK), so a UEK server may be unsupported.

??? question "7. Is `aarch64` x86 or ARM?"
    ARM (64-bit). `hostnamectl` calls it `arm64`.

??? question "8. Why must you never edit /etc/os-release to make an installer work?"
    Other software reads it too; you'd give every program false information. Fix it with the vendor instead.
