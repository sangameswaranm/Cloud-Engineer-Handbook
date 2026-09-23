# Roadmap

Initial plan → Month 1 execution → evidence → recalibration → Months 2–6.
Months 2–6 will be adjusted after the Month 1 checkpoint, based on real results.

| Month | Focus | Project |
|---|---|---|
| 1 — Calibration | Linux fundamentals & administration, networking fundamentals, Bash, OCI networking | Web-01/Web-02 behind a load balancer, app and DB tiers: build, break, recover |
| 2 | Storage, databases (PostgreSQL first), IAM & security | Secure application platform |
| 3 | OCI deep dive, then Azure | OCI enterprise app; recreate it in Azure |
| 4 | Terraform (OCI + Azure), Docker, Kubernetes (OKE + AKS) | Terraform-built container platform |
| 5 | Monitoring, logging, CI/CD, backup & DR | Observability, pipeline, real failover/failback |
| 6 | Integration & architecture | Final enterprise platform + handover package |

## Month 1 detail

| Week | Topics | Output |
|---|---|---|
| 1 | Linux fundamentals: filesystem, users, groups, permissions, processes, packages, SSH | Linux Server Administration Lab |
| 2 | Linux administration: systemd, journalctl, cron, LVM, mount/fstab, firewall, DNS, networking | Nginx server, then break and recover it 6 ways |
| 3 | Networking: OSI, TCP/IP, ARP, CIDR, routing, TCP/UDP, DNS, DHCP, NAT, HTTP/TLS | Explain and troubleshoot Client → DNS → IP → Gateway → Route → Firewall → LB → Server |
| 4 | OCI networking + Bash scripting | server_health.sh, user_creation.sh, disk_check.sh, service_check.sh, backup.sh |

## Out of scope for now
- **AWS** is postponed until after this program.
- **Azure** comes after fundamentals and OCI. Certification path: AZ-104 → AZ-305, after hands-on competence.
