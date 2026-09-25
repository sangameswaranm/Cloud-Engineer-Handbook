# Knowledge + Task Map

The complete syllabus (Track A: knowledge) and the practical work that uses it (Track B: experience) for all 18 modules.
This is the plan, not progress. Progress is tracked per concept in each module's coverage table, filled only from real work.

**Levels:** **F** Foundation · **I** Intermediate · **A** Advanced · **E** Expert / production awareness

**Every module follows:** concepts → commands/syntax → basic practice → real tasks → multiple methods → test cases → failure injection → troubleshooting → production scenarios → module project → master project → assessment (knowledge, practical, troubleshooting, architecture, production).

---

## 1. Linux

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Introduction | What Linux is, Unix, GNU, kernel vs distribution, families (Red Hat, Debian, SUSE), releases, LTS, enterprise lifecycle | F |
| 2 | Architecture | Kernel/user space, system calls, libraries, boot flow (firmware → bootloader → kernel → initramfs → systemd), /proc /sys /dev | F–I |
| 3 | Filesystem hierarchy | FHS, / /etc /var /home /tmp /usr /opt /boot /srv /run, absolute/relative paths | F |
| 4 | Files & directories | ls, cd, mkdir, touch, cp, mv, rm, cat, less, head, tail, find, locate, file, stat, inodes, hard/soft links, vi/vim, nano | F |
| 5 | Users & groups | UID/GID, root, system vs regular users, /etc/passwd, shadow, group, gshadow, useradd/adduser, usermod, userdel, passwd, chage, nologin shells, skel | F–I |
| 6 | Permissions | rwx on files vs directories, numeric/symbolic chmod, chown, chgrp, umask, SUID, SGID, sticky bit, namei | F–I |
| 7 | ACL | getfacl, setfacl, masks, default (inherited) ACLs, when ACL vs groups | I |
| 8 | Sudo | sudoers syntax, visudo, sudoers.d, command restriction, NOPASSWD risks, logging, wheel vs sudo group | I |
| 9 | Processes | PID/PPID, states, fork/exec, ps, top, htop, pgrep, pidof, /proc/PID, signals, kill/pkill, nice/renice, jobs/fg/bg/nohup, zombies/orphans | F–I |
| 10 | Services / systemd | Units, targets, systemctl, unit files, dependencies, restart policies, overrides (drop-ins), service vs init scripts, boot analysis | I |
| 11 | Packages | rpm/dnf/yum, deb/apt/dpkg, zypper, repositories, GPG keys, dependencies, version locking, module streams, offline installs, snap/flatpak awareness | F–I |
| 12 | Shell | bash, quoting, globbing, aliases, history, completion, login vs non-login, .bashrc/.bash_profile | F |
| 13 | Environment variables | env, export, PATH, HOME, SHELL, /etc/environment, profile.d, case sensitivity | F |
| 14 | Text processing | grep/egrep, regex, cut, sort, uniq, wc, tr, sed, awk, diff, tee, xargs, jq | I |
| 15 | Pipes & redirection | stdin/stdout/stderr, >, >>, 2>, 2>&1, &>, <, here-docs, pipelines, exit codes | F |
| 16 | Networking | Interfaces, ip addr/route/link, NetworkManager/nmcli, netplan, hostname, ss, ping, traceroute, curl, wget, nc, tcpdump | F–I |
| 17 | DNS (host side) | resolv.conf, systemd-resolved, /etc/hosts, nsswitch, dig, nslookup, host, caching | I |
| 18 | SSH | Client/server flow, keys, authorized_keys permissions, ssh-agent, config file, sshd_config hardening, scp/sftp/rsync, tunnels, jump hosts | F–A |
| 19 | Firewall | netfilter, firewalld (zones, services, rich rules), ufw, nftables/iptables awareness, runtime vs permanent | I |
| 20 | Storage | Block devices, lsblk, blkid, partitions (MBR/GPT), fdisk, parted, cloud block volumes, iSCSI awareness | I |
| 21 | Filesystems | ext4, xfs, mkfs, fsck/xfs_repair, growing filesystems, inode exhaustion, swap | I |
| 22 | LVM | PV, VG, LV, extend/reduce, snapshots, thin provisioning awareness | I–A |
| 23 | Mounts / fstab | mount/umount, UUID vs device names, fstab fields, nofail, bind mounts, NFS/SMB mounts, systemd mount units | I |
| 24 | Logs | /var/log layout, rsyslog, logrotate, log levels | F–I |
| 25 | journalctl | Filters (-u, -p, --since, -b, -f), persistent journal, disk usage | I |
| 26 | Cron | crontab syntax, user vs system cron, cron.d, anacron, systemd timers, environment gotchas | F–I |
| 27 | Security | Patching, least privilege, PAM, password policy, auditd, file integrity awareness, CIS hardening | I–A |
| 28 | SELinux / AppArmor | Modes, contexts, booleans, restorecon, semanage, audit2why; AppArmor profiles | I–A |
| 29 | Performance | Load average, USE method, baseline vs anomaly | I |
| 30 | CPU | top/mpstat/pidstat, run queue, steal time, iowait | I–A |
| 31 | Memory | free, page cache, swap, OOM killer, vmstat, memory leaks | I–A |
| 32 | Disk | df/du, iostat, iotop, IOPS vs throughput, inode usage | I–A |
| 33 | Network troubleshooting | Layered method, ss, tcpdump, MTU, DNS vs routing vs firewall isolation | I–A |
| 34 | Bash scripting | (bridge to module 3) | F–I |
| 35 | Backup | tar, rsync, snapshots, restore testing, retention | I |
| 36 | Automation | Scripts + cron/timers, idempotency, Ansible awareness | I |
| 37 | Troubleshooting | Boot failures, rescue mode, root password reset, full disk, broken fstab, service failures | A |
| 38 | Linux Master Project | See below | A |

**Tasks**

- **Basic:** navigate and build a directory tree; create users with specific home, shell, UID; create groups; set file permissions numerically and symbolically; find files by name, size, age; install and remove packages; start, stop, and enable a service; read a service's logs.
- **Intermediate:** create a service account with no login; primary vs supplementary groups; lock, unlock, and expire accounts; password aging with chage; shared team directory with SGID and default ACLs; sudo rule allowing only one service restart; write a systemd unit for a script; schedule a job with cron and with a timer; add a disk, partition, format, mount by UUID in fstab; extend an LVM volume live.
- **Advanced:** employee onboarding and offboarding (keep home, revoke access, archive); SSH hardening (keys only, no root, allowed users) without locking yourself out; firewall allowing a port only from one subnet; SELinux custom port and context for a web root; log rotation for an app log.
- **Troubleshooting:** "Permission denied" (owner, group, mode, directory x-bit, ACL mask, SELinux); SSH key rejected (authorized_keys permissions); service won't start (unit error, port in use, missing file); disk full vs inodes full; server won't boot after fstab edit; runaway CPU process; OOM kills; DNS resolves but site unreachable.
- **Routing (production paths):** reach a server in the same subnet (direct, ARP), in another subnet (via subnet gateway), and on-prem over VPN (gateway → VCN route table → DRG → tunnel → on-prem firewall → return route); for each path, inject its typical fault (wrong netmask or host firewall; security rule or wrong host route; missing route to DRG or missing return route) and troubleshoot with `ip route get`, `ip neigh`, `ss`, `tcpdump`.
- **Security:** remove unnecessary SUID binaries; audit sudo use; enforce password policy; review listening ports.
- **Automation:** user-management script from a CSV; disk-usage alert script; health-check script run by timer.
- **Design / interview:** explain the boot process end to end; design an access model for dev, ops, auditor roles.

**Test case pattern:** Developer reads config (PASS), developer edits prod config (DENIED), ops restarts app (PASS), developer restarts app (DENIED), auditor reads logs (PASS).

**Master project: Linux Enterprise Server.** Users, groups, roles with sudo; shared directories with ACLs; hardened SSH; separate LVM volumes for app data and logs, mounted via fstab; Nginx serving an app run by systemd as a service account; firewall and SELinux enforcing; log rotation; cron backups with restore test; monitoring script; then at least 10 injected incidents (wrong owner, ACL mask, locked account, broken authorized_keys, bad sudo rule, service stopped, port blocked, DNS broken, disk full, fstab error) that must be diagnosed, fixed, verified, and documented.

---

## 2. Networking

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Models | OSI vs TCP/IP, encapsulation, PDUs | F |
| 2 | Layer 2 | Ethernet, MAC, switching, ARP, VLAN, trunk, STP awareness | F |
| 3 | IPv4 | Addressing, private ranges, subnetting, CIDR, VLSM, supernetting | F |
| 4 | IPv6 | Addressing, SLAAC, dual stack | I |
| 5 | Routing | Routing table, longest prefix match, default route, static routes, ECMP | F–I |
| 6 | Dynamic routing | OSPF concepts, BGP (AS, path attributes, route propagation) | A |
| 7 | Transport | TCP handshake, windows, retransmission, UDP, ports, connection states | F–I |
| 8 | NAT | SNAT, DNAT, PAT, NAT gateways, asymmetric routing | I |
| 9 | DHCP | DORA, leases, relays | F |
| 10 | DNS | Resolution flow, record types, TTL, zones, split-horizon, private DNS, DNSSEC awareness | I |
| 11 | HTTP/HTTPS/TLS | Methods, status codes, headers, TLS handshake, certificates, chains, SNI, mTLS | I–A |
| 12 | Load balancing | L4 vs L7, health checks, algorithms, session persistence, SSL offload | I |
| 13 | Proxies | Forward/reverse proxy, WAF | I |
| 14 | Firewalls | Stateful vs stateless, zones, policies, NGFW, security lists vs NSGs | I |
| 15 | VPN | IPSec (IKE phase 1/2, SAs, proxy IDs), route-based vs policy-based, SSL VPN | A |
| 16 | MTU | Fragmentation, PMTUD, MSS clamping | A |
| 17 | Packet analysis | tcpdump, Wireshark, reading captures | I–A |
| 18 | Cloud networking | VCN/VNet, subnets, route tables, gateways, peering, hub-and-spoke, DRG, private endpoints | I–A |
| 19 | Troubleshooting method | Layer-by-layer isolation, smallest useful test | A |

**Tasks:** subnet a /16 for 6 environments; trace a packet client → DNS → gateway → route → firewall → LB → server; capture and read a TCP handshake; reproduce and fix a routing black hole; reproduce MTU issues across a tunnel; configure and debug a site-to-site IPSec (phase 1 vs phase 2 failures); break DNS, identify, fix; diagnose asymmetric routing through a firewall; LB backend unhealthy investigation; certificate chain error investigation.

**Master project: Enterprise network design.** Hub-and-spoke with segmented subnets, routing, NAT, firewall policies, VPN to on-prem, internal and public DNS, load balancer with TLS; then injected failures (wrong route, missing SNAT, blocked port, DNS override, expired cert, MTU black hole).

---

## 3. Bash

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Script basics | Shebang, execution, permissions, set -euo pipefail | F |
| 2 | Variables | Quoting, expansion, arrays, associative arrays, defaults | F–I |
| 3 | Input | Arguments, $@, $#, getopts, read | F–I |
| 4 | Conditions | test, [[ ]], string/number/file tests, case | F |
| 5 | Loops | for, while, until, reading files line by line | F |
| 6 | Functions | Arguments, return codes, local variables | I |
| 7 | Exit codes & errors | $?, trap, cleanup, error handling | I |
| 8 | Text in scripts | grep/sed/awk/jq inside scripts | I |
| 9 | Logging | Timestamps, log files, syslog via logger | I |
| 10 | Scheduling | cron/timers, locking (flock) | I |
| 11 | Safety | Idempotency, dry-run mode, input validation, shellcheck | A |
| 12 | Remote | ssh loops, parallel execution | A |

**Tasks:** server_health.sh, user_creation.sh, disk_check.sh, service_check.sh, backup.sh (with retention and restore test); log parser that reports top errors; idempotent config deployer; script that fails safely on bad input.

**Master project: Operations automation toolkit** with logging, error handling, dry-run, scheduling, and a README, run against several servers.

---

## 4. Python

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Basics | Types, control flow, functions, modules, virtual environments, pip | F |
| 2 | Data | Lists, dicts, comprehensions, JSON, YAML, CSV | F |
| 3 | Files & OS | pathlib, subprocess, os, shutil | F–I |
| 4 | Errors & logging | Exceptions, logging module | I |
| 5 | CLI tools | argparse, click | I |
| 6 | HTTP & APIs | requests, REST, auth, pagination, retries | I |
| 7 | Cloud SDKs | OCI SDK, Azure SDK | I–A |
| 8 | Testing | pytest basics | I |
| 9 | Packaging & style | Structure, linting, type hints | A |

**Tasks:** parse logs into a report; call a REST API with retries; inventory all compute instances via SDK; tag audit script; cost report script; CLI tool with arguments and tests.

**Master project: Cloud inventory and compliance tool** (SDK-based, multi-compartment/subscription, outputs a report, tested).

---

## 5. Storage

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Storage types | Block, file, object; latency, IOPS, throughput | F |
| 2 | Disks & RAID | RAID levels, trade-offs | F–I |
| 3 | Linux storage | Partitions, filesystems, LVM (from Linux module) | I |
| 4 | Network storage | NFS, SMB, iSCSI | I |
| 5 | Object storage | Buckets, tiers, lifecycle, pre-authenticated/SAS access, versioning | I |
| 6 | Cloud block storage | Volumes, performance tiers, attach modes, resizing | I |
| 7 | Snapshots & clones | Consistency (crash vs app-consistent) | I–A |
| 8 | Replication | Sync vs async, cross-region | A |
| 9 | Capacity & performance | Planning, monitoring, benchmarking (fio) | A |
| 10 | Encryption | At rest, customer-managed keys | I–A |

**Tasks:** attach and grow a cloud volume online; NFS share with correct permissions; object storage lifecycle policy; benchmark IOPS; snapshot and restore; recover from a full volume.

**Master project: Tiered storage platform** with block, file, and object, backups, replication, encryption, and a restore drill.

---

## 6. Database

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Fundamentals | Relational model, SQL basics, keys, joins | F |
| 2 | PostgreSQL architecture | Processes, WAL, shared buffers, connections | I |
| 3 | Install & config | postgresql.conf, pg_hba.conf, roles | I |
| 4 | Security | Roles, privileges, SSL, network access | I |
| 5 | Backup & restore | pg_dump/pg_restore, version compatibility, pg_basebackup, PITR | I–A |
| 6 | Replication & HA | Streaming replication, failover, replication lag | A |
| 7 | Performance | Indexes, EXPLAIN, vacuum, connection pooling | A |
| 8 | Managed databases | Cloud managed PostgreSQL, trade-offs | I |
| 9 | Awareness | Oracle, MySQL, SQL Server, Redis | E |

**Tasks:** install, secure, and create app roles; fix "connection refused" vs "authentication failed"; backup and restore across versions; PITR recovery; set up a replica and measure lag; find and fix a slow query.

**Master project: HA PostgreSQL** with replication, backups, PITR, monitoring, and failover drill.

---

## 7. IAM & Security

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Identity basics | AuthN vs AuthZ, principals, groups, roles | F |
| 2 | Access models | RBAC, ABAC, least privilege, separation of duties | I |
| 3 | Directory & federation | AD, LDAP, SAML, OIDC, SSO, UPN | I–A |
| 4 | MFA & PAM | MFA types, privileged access management, break-glass | I–A |
| 5 | Secrets | Vaults, rotation, no secrets in code | I |
| 6 | Crypto & PKI | Symmetric/asymmetric, certificates, CAs, key management | I–A |
| 7 | Network security | Segmentation, zero trust, WAF, DDoS awareness | I–A |
| 8 | Cloud IAM | OCI policies/compartments, Azure Entra ID/RBAC/scopes | I–A |
| 9 | Monitoring & audit | Audit logs, SIEM awareness, alerting | I |
| 10 | Compliance | CIS benchmarks, controls, evidence | E |

**Tasks:** design least-privilege roles for dev/ops/audit; write cloud IAM policies and test allowed/denied; federate SSO; rotate a secret with zero downtime; issue and renew a certificate; investigate an access-denied incident; UPN/MFA login failure investigation.

**Master project: Secure access platform** (federated identity, RBAC, PAM, secrets, certificates, audit trail, tested deny cases).

---

## 8. OCI

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Foundations | Regions, ADs, fault domains, tenancy, compartments, limits/quotas | F |
| 2 | IAM | Users, groups, dynamic groups, policies, instance principals | I |
| 3 | Networking | VCN, subnets, route tables, security lists, NSGs, IGW, NAT, service gateway, DRG, peering, FastConnect/IPSec | I–A |
| 4 | Compute | Shapes, images, boot volumes, instance pools, autoscaling, agents | I |
| 5 | Storage | Block, file, object, archive | I |
| 6 | Load balancing | LB vs NLB, backend sets, health checks, certificates | I |
| 7 | Databases | Managed PostgreSQL/Autonomous awareness | I |
| 8 | OKE | Clusters, node pools, VCN-native pod networking, IP planning | A |
| 9 | Security | Vault, Cloud Guard, WAF, bastion | I–A |
| 10 | Observability | Monitoring, alarms, logging, events | I |
| 11 | CLI & automation | OCI CLI, CloudShell, SDK, Resource Manager | I |
| 12 | DR & cost | Cross-region replication, cost analysis, budgets | A |

**Tasks:** build a 3-tier VCN with public/private subnets; private subnet reaching Object Storage via service gateway; DRG + IPSec to a peer; LB with unhealthy-backend investigation; OKE cluster with pod IP planning (and reproduce IP exhaustion); quota and limit troubleshooting; CloudShell automation; budget alerts.

**Master project: OCI enterprise application** (network, IAM, compute/OKE, LB, database, storage, monitoring, DR), built then broken and recovered.

---

## 9. Azure

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Foundations | Tenants, subscriptions, management groups, resource groups, regions, AZs | F |
| 2 | Identity | Entra ID users/groups, RBAC, scopes, managed identities, PIM | I–A |
| 3 | Networking | VNet, subnets, NSG, ASG, UDR, peering, VPN Gateway, private endpoints, Azure DNS | I–A |
| 4 | Compute | VMs, availability sets/zones, VMSS, extensions | I |
| 5 | Storage | Accounts, blob tiers, files, managed disks, redundancy (LRS/ZRS/GRS) | I |
| 6 | Load balancing | Load Balancer, Application Gateway, Front Door | I |
| 7 | Databases | Azure Database for PostgreSQL | I |
| 8 | AKS | Clusters, node pools, networking models | A |
| 9 | Security | Key Vault, Defender awareness, policies | I–A |
| 10 | Monitoring | Azure Monitor, Log Analytics, alerts | I |
| 11 | Governance & cost | Policy, tags, budgets, locks | I |
| 12 | Backup & DR | Azure Backup, Site Recovery | A |

**Tasks:** recreate the OCI 3-tier design in Azure; RBAC at different scopes; private endpoint to storage; NSG troubleshooting; App Gateway backend health issue; AKS deploy; Backup restore drill; cost budget alerts. Aligns with AZ-104, then AZ-305.

**Master project: Azure enterprise application** mirroring the OCI project, with a written OCI vs Azure comparison.

---

## 10. Terraform

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Why IaC | Manual drift, repeatability | F |
| 2 | Core workflow | init, plan, apply, destroy | F |
| 3 | Language | Providers, resources, data sources, variables, outputs, locals, expressions, count, for_each | F–I |
| 4 | State | Local vs remote, locking, state commands | I |
| 5 | Modules | Writing and consuming modules, versioning | I–A |
| 6 | Environments | Workspaces vs directories, tfvars | I |
| 7 | Lifecycle | Replace vs update, lifecycle rules, import, moved blocks | A |
| 8 | Drift | Detection and reconciliation | A |
| 9 | Security | Secrets, least-privilege credentials, policy checks | A |
| 10 | CI integration | Plan in PR, apply on merge | A |

**Tasks:** build the OCI VCN in Terraform; same for Azure; convert to modules; import a manually made resource; create drift and fix it; investigate "plan wants to replace production resource"; remote state with locking.

**Master project: Multi-environment IaC** for OCI and Azure with modules, remote state, and pipeline-driven plans.

---

## 11. Docker

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Why containers | Packaging problem, containers vs VMs, namespaces, cgroups | F |
| 2 | Images | Layers, Dockerfile, multi-stage builds, tags | F–I |
| 3 | Containers | Run, exec, logs, inspect, lifecycle | F |
| 4 | Networking | Bridge, host, port mapping, DNS between containers | I |
| 5 | Storage | Volumes, bind mounts | I |
| 6 | Compose | Multi-container apps | I |
| 7 | Registries | Push/pull, private registries (OCIR/ACR) | I |
| 8 | Health & limits | Health checks, CPU/memory limits | I |
| 9 | Security | Non-root, minimal images, scanning, secrets | A |

**Tasks:** containerize an app; shrink an image with multi-stage builds; Compose app + DB; push to a registry; "works on VM, fails in container" investigation; memory-limit OOM investigation.

**Master project: Containerized 3-tier app** with Compose, health checks, limits, scanning, and registry.

---

## 12. Kubernetes

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Why orchestration | Scheduling, scaling, self-healing | F |
| 2 | Architecture | API server, etcd, scheduler, controllers, kubelet, runtime | I |
| 3 | Workloads | Pods, ReplicaSets, Deployments, StatefulSets, DaemonSets, Jobs | I |
| 4 | Networking | Services, Ingress, DNS, CNI, NetworkPolicy | I–A |
| 5 | Config | ConfigMaps, Secrets | I |
| 6 | Storage | PV, PVC, StorageClasses, CSI | I–A |
| 7 | Scaling & availability | HPA, PDB, probes, resource requests/limits | A |
| 8 | Security | RBAC, service accounts, pod security | A |
| 9 | Packaging | Helm | I |
| 10 | Managed K8s | OKE, AKS, node pools, upgrades | A |
| 11 | Troubleshooting | CrashLoopBackOff, Pending, ImagePullBackOff, node NotReady, CNI/IP issues | A |

**Tasks:** deploy an app with Service and Ingress; rolling update and rollback; probes; HPA under load; RBAC for a team; NetworkPolicy isolation; "Pod Running but unreachable"; node registration failure; pod IP exhaustion.

**Master project: Production-style cluster** on OKE and AKS with ingress, TLS, RBAC, policies, autoscaling, storage, and an incident drill.

---

## 13. Monitoring

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Observability | Metrics, logs, traces; why each | F |
| 2 | Metrics | Types, labels, cardinality, the four golden signals, USE/RED | I |
| 3 | Prometheus | Scraping, exporters, PromQL | I–A |
| 4 | Grafana | Dashboards, variables | I |
| 5 | Alerting | Thresholds, alert fatigue, routing | I–A |
| 6 | SLI/SLO/SLA | Error budgets | A |
| 7 | Cloud monitoring | OCI Monitoring, Azure Monitor | I |
| 8 | Tracing | OpenTelemetry awareness | E |

**Tasks:** node exporter + dashboard; alert on disk and CPU; investigate "CPU alarm firing but CPU looks normal"; define SLOs for an app; high-CPU web worker investigation.

**Master project: Monitoring stack** for the platform with dashboards, alerts, and SLOs.

---

## 14. Logging

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Logging basics | Structured vs unstructured, levels, retention | F |
| 2 | Collection | Agents, shipping, parsing | I |
| 3 | Stacks | Elasticsearch/OpenSearch + Kibana, Loki awareness | I–A |
| 4 | Cloud logging | OCI Logging, Log Analytics (OCI and Azure) | I |
| 5 | Investigation | Queries, correlation, timelines | A |
| 6 | Audit & security logs | Retention, integrity | I |

**Tasks:** centralize logs from several servers; build queries for an incident timeline; parse app logs into fields; retention policy.

**Master project: Central logging** feeding incident investigations for the platform.

---

## 15. CI/CD

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Git | Commits, branches, merges, rebase, PRs, tags | F–I |
| 2 | CI concepts | Build, test, artifacts, caching | I |
| 3 | GitHub Actions | Workflows, jobs, secrets, environments | I |
| 4 | Jenkins | Pipelines, agents (awareness) | I |
| 5 | CD strategies | Rolling, blue/green, canary, rollback | A |
| 6 | GitOps | Argo CD | A |
| 7 | Security | Secret handling, scanning, signing | A |

**Tasks:** pipeline that builds, tests, scans, and pushes an image; Terraform plan/apply pipeline; GitOps deploy to Kubernetes; "deployment succeeded but app unavailable" investigation; rollback drill.

**Master project: End-to-end delivery pipeline** from commit to production with gates and rollback.

---

## 16. Backup & DR

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Concepts | Backup vs replication, RPO, RTO | F |
| 2 | Backup types | Full, incremental, differential, snapshots | F |
| 3 | Enterprise backup | Commvault-style architecture, media agents, auxiliary copy vs native replication | I–A |
| 4 | Application-consistent backups | Databases, quiescing | A |
| 5 | DR patterns | Backup/restore, pilot light, warm standby, active-active | A |
| 6 | Failover & failback | DNS, data sync, runbooks | A |
| 7 | Testing | DR drills, validation | A |

**Tasks:** define RPO/RTO for an app; restore a file, a volume, and a database; cross-region copy; write a failover runbook; run a failover and failback drill; "primary region unavailable" scenario.

**Master project: DR for the platform** with a real failover and failback, measured against RPO/RTO.

---

## 17. Automation

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Principles | Idempotency, desired state, dry runs | F |
| 2 | Scripting | Bash and Python (modules 3–4) | I |
| 3 | Configuration management | Ansible: inventory, playbooks, roles | I–A |
| 4 | Cloud CLIs & SDKs | OCI CLI, Azure CLI | I |
| 5 | Event-driven | Functions, events, scheduled jobs | A |
| 6 | ChatOps & runbooks | Automated remediation awareness | E |

**Tasks:** Ansible playbook to build the Linux master server; scheduled compliance scan; auto-remediation for a full disk; inventory and cost reports via CLI.

**Master project: Automated platform operations** (provision, configure, patch, report, remediate).

---

## 18. Architecture

| # | Topic | Concepts | Level |
|---|---|---|---|
| 1 | Requirements | Functional vs non-functional, constraints | F |
| 2 | Design documents | HLD, LLD, diagrams, decision records | I |
| 3 | Availability | HA, fault domains, redundancy, SPOFs | I–A |
| 4 | Scalability & performance | Horizontal vs vertical, caching | A |
| 5 | Security architecture | Zero trust, segmentation, identity-first | A |
| 6 | Network architecture | Hub-and-spoke, hybrid connectivity | A |
| 7 | Resilience & DR | Patterns and trade-offs | A |
| 8 | Cost & capacity | Estimation, right-sizing | A |
| 9 | Well-architected | OCI and Azure frameworks | E |

**Tasks:** HLD and LLD for a 3-tier app; review a flawed design and list risks; cost estimate; capacity plan; decision records for key choices.

**Master project: Architecture package** for the final enterprise platform (HLD, LLD, decisions, cost, DR, operations handover).

---

## Final Enterprise Project

```text
Internet → DNS → WAF → Load Balancer → Firewall → Kubernetes (frontend, backend, API)
        → PostgreSQL + Redis → Object Storage → Backup → DR region
```

Supported by Terraform, Docker, Kubernetes, CI/CD, IAM/RBAC, secrets, monitoring (Prometheus/Grafana), logging, security, backup/DR, and automation. It must reuse every module's master project and pass a full incident drill.

## Coverage tracking

Each module page gets a coverage table (Concept · Theory · Basic · Intermediate · Advanced · Troubleshooting · Project · Assessment), filled only from real work. A module is complete only after the knowledge, practical, troubleshooting, architecture, and production assessments and its master project.
