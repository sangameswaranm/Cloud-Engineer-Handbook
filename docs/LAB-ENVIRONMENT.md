# Lab Environment

| Item | Value |
|---|---|
| Platform | OCI |
| VM | `test-linux-01` |
| OS | Oracle Linux Server 9.8 (`/etc/os-release`) |
| Kernel | To be recorded (`uname -r`) |
| Login user | `opc` (uid 1000; groups adm, systemd-journal) |
| SELinux | Active (context shown in `id` output) |
| Shape | To be recorded in Session 1 |
| Access | SSH (method to be recorded in Session 1) |

Oracle Linux specifics that affect the labs: `dnf` package manager, `firewalld`, SELinux enabled by default.
