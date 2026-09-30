# Linux: Learning Resources per Topic

For every topic: the relevant **Red Hat Enterprise Linux 9 guide**, the **man pages** to read, and a **video search** for that exact subject.

- **Red Hat docs:** open the [RHEL 9 documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9) and choose the guide named in the table.
- **Man pages:** on the server, `man <name>`; online at [man7.org](https://man7.org/linux/man-pages/).
- **Practice:** [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) · [Linux Journey](https://linuxjourney.com/)

| # | Topic | RHEL 9 guide | Man pages | Video |
|---|---|---|---|---|
| 1 | Introduction | Red Hat: 'What is Linux?' and the RHEL 9 release notes | `uname`, `os-release` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+kernel+vs+distribution+explained) |
| 2 | Linux Architecture | Managing, monitoring, and updating the kernel | `proc`, `systemd`, `bootup` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+boot+process+explained+GRUB+systemd) |
| 3 | Filesystem | Configuring basic system settings | `hier`, `pwd` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+filesystem+hierarchy+explained) |
| 4 | Files & Directories | Configuring basic system settings | `mkdir`, `cp`, `mv`, `rm`, `find`, `ln`, `less`, `tail` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+file+management+commands+cp+mv+rm+find) |
| 5 | Users & Groups | Configuring basic system settings (users and groups) | `useradd`, `usermod`, `passwd`, `chage`, `id` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+users+and+groups+tutorial+RHCSA) |
| 6 | Permissions | Configuring basic system settings (permissions) | `chmod`, `chown`, `umask` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+file+permissions+explained+chmod) |
| 7 | ACL | Managing file systems (ACLs) | `setfacl`, `getfacl` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+ACL+setfacl+getfacl+tutorial) |
| 8 | Sudo | Configuring basic system settings (sudo) | `sudo`, `sudoers`, `visudo` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+sudo+sudoers+tutorial) |
| 9 | Processes | Monitoring and managing system status and performance | `ps`, `top`, `kill`, `nice` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+processes+ps+top+kill+tutorial) |
| 10 | Services / systemd | Configuring basic system settings (systemd) | `systemctl`, `systemd.unit`, `systemd.service` | [:material-youtube: watch](https://www.youtube.com/results?search_query=systemd+systemctl+tutorial) |
| 11 | Packages | Managing software with the DNF tool | `dnf`, `rpm` | [:material-youtube: watch](https://www.youtube.com/results?search_query=dnf+rpm+package+management+RHEL+tutorial) |
| 12 | Shell | Configuring basic system settings | `bash` | [:material-youtube: watch](https://www.youtube.com/results?search_query=bash+shell+basics+tutorial) |
| 13 | Environment Variables | Configuring basic system settings | `environ`, `bash` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+environment+variables+PATH+tutorial) |
| 14 | Text Processing | — | `grep`, `sed`, `awk`, `cut`, `sort` | [:material-youtube: watch](https://www.youtube.com/results?search_query=grep+sed+awk+tutorial) |
| 15 | Pipes & Redirection | — | `bash` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+pipes+and+redirection+stdin+stdout+stderr) |
| 16 | Networking | Configuring and managing networking | `ip`, `nmcli`, `ss` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+networking+commands+ip+nmcli+ss) |
| 17 | DNS | Managing networking infrastructure services | `dig`, `resolv.conf` | [:material-youtube: watch](https://www.youtube.com/results?search_query=DNS+explained+dig+tutorial) |
| 18 | SSH | Securing networks (OpenSSH) | `ssh`, `sshd_config`, `ssh-keygen` | [:material-youtube: watch](https://www.youtube.com/results?search_query=SSH+keys+explained+tutorial) |
| 19 | Firewall | Configuring firewalls and packet filters | `firewall-cmd`, `firewalld` | [:material-youtube: watch](https://www.youtube.com/results?search_query=firewalld+firewall-cmd+tutorial) |
| 20 | Storage | Managing storage devices | `lsblk`, `fdisk`, `parted` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+disk+partitioning+lsblk+fdisk+parted) |
| 21 | Filesystems | Managing file systems | `mkfs.xfs`, `xfs_repair` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+xfs+ext4+mkfs+tutorial) |
| 22 | LVM | Configuring and managing logical volumes | `lvm`, `lvextend`, `vgcreate` | [:material-youtube: watch](https://www.youtube.com/results?search_query=LVM+tutorial+pvcreate+vgcreate+lvcreate+lvextend) |
| 23 | Mounts / fstab | Managing file systems (mounting) | `mount`, `fstab` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+mount+fstab+tutorial) |
| 24 | Logs | Configuring basic system settings (logging) | `rsyslogd`, `logrotate` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+logs+var+log+rsyslog+logrotate) |
| 25 | journalctl | Configuring basic system settings (logging) | `journalctl` | [:material-youtube: watch](https://www.youtube.com/results?search_query=journalctl+tutorial) |
| 26 | Cron | Automating system tasks | `crontab`, `systemd.timer` | [:material-youtube: watch](https://www.youtube.com/results?search_query=cron+crontab+tutorial+systemd+timers) |
| 27 | Security | Security hardening | `login.defs`, `faillock` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+server+hardening+tutorial) |
| 28 | SELinux / AppArmor | Using SELinux | `selinux`, `semanage`, `restorecon` | [:material-youtube: watch](https://www.youtube.com/results?search_query=SELinux+explained+tutorial) |
| 29 | Performance | Monitoring and managing system status and performance | `vmstat`, `sar`, `iostat` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+performance+troubleshooting) |
| 30 | CPU | Monitoring and managing system status and performance | `top`, `mpstat` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+load+average+CPU+explained) |
| 31 | Memory | Monitoring and managing system status and performance | `free`, `vmstat` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+memory+free+available+cache+explained) |
| 32 | Disk | Monitoring and managing system status and performance | `df`, `du`, `iostat` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+disk+usage+df+du+tutorial) |
| 33 | Network troubleshooting | Configuring and managing networking | `ping`, `traceroute`, `tcpdump` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+network+troubleshooting+tcpdump) |
| 34 | Bash scripting | — | `bash` | [:material-youtube: watch](https://www.youtube.com/results?search_query=bash+scripting+tutorial) |
| 35 | Backup | Managing file systems | `tar`, `rsync` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+backup+tar+rsync+tutorial) |
| 36 | Automation | Automating system administration by using RHEL system roles | `ansible` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Ansible+for+beginners) |
| 37 | Troubleshooting | — | `journalctl`, `systemctl` | [:material-youtube: watch](https://www.youtube.com/results?search_query=Linux+troubleshooting+boot+rescue+mode+RHEL) |
| 38 | Linux Master Project | — | — | [:material-youtube: watch](https://www.youtube.com/results?search_query=RHCSA+practice+exam+lab) |

## Full courses

- [:material-youtube: freeCodeCamp — Introduction to Linux, full course](https://www.youtube.com/results?search_query=freeCodeCamp+Introduction+to+Linux+Full+Course+for+Beginners)
- [:material-youtube: freeCodeCamp — Linux crash course for beginners](https://www.youtube.com/results?search_query=freeCodeCamp+Linux+Operating+System+Crash+Course+for+Beginners)
- [:material-youtube: Learn Linux TV](https://www.youtube.com/results?search_query=Learn+Linux+TV)
- [:material-youtube: Sander van Vugt — RHCSA](https://www.youtube.com/results?search_query=Sander+van+Vugt+RHCSA)
