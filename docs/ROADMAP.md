# Roadmap (recalibrated 30 Sep 2026)

**Goal:** interview-ready **Senior Cloud Engineer** by **end of March 2027**; applications from April, interviews from **May 2027**.
**Needs:** about **18–20 hours/week** (current pace ~10.5). Sessions of 60–75 minutes on weeknights, longer on weekends.

**Depth rule:** full depth on the core (Linux, networking, OCI, Azure, Terraform, Docker, Kubernetes, CI/CD, monitoring, troubleshooting);
solid working knowledge on the rest. Existing strengths (OCI, cloud networking, PAM/WALLIX Bastion, DR architecture) move faster in labs, not in concepts.

| Month | Focus | Project / milestone |
|---|---|---|
| **Oct** | Linux core (full depth on permissions, users/sudo, processes, systemd, networking, SSH, storage/LVM, logs, troubleshooting; fast track for the rest), Bash basics | Linux Enterprise Server project |
| **Nov** | Networking concepts, OCI deep dive, storage, Bash scripting | **P1:** OCI 3-tier network + hardened servers · 🎓 OCI certification |
| **Dec** | Azure (AZ-104 syllabus), **Windows Server admin**, **Active Directory** (+ Entra ID hybrid), PowerShell basics, Terraform basics | Azure version of P1, Windows + AD lab |
| **Jan** | Terraform advanced, Docker, **Git + CI/CD (GitHub Actions, Jenkins awareness)** | **P2:** multi-cloud IaC deployed by a CI/CD pipeline · 🎓 **AZ-104** |
| **Feb** | Kubernetes (OKE/AKS), **GitOps (Argo CD)**, monitoring/logging, **backup admin (Veeam)**, databases basics | **P3:** containerized app on Kubernetes with CI/CD, monitoring and backup · 🎓 Terraform Associate |
| **Mar** | Python automation, **AI agents for ops**, endpoint security (**Defender, Trend Micro**), **Exchange basics**, DR architecture, mock interviews | **P4 capstone:** AI-assisted ops toolkit |
| **Apr** | Resume, LinkedIn, Naukri, Naukri Gulf, blog series, weekly mock interviews, start applying | Portfolio live |
| **May** | Interviews with per-company preparation | 🎯 Offers |

**Every month:** weekly interview drills (concept, command, troubleshooting); one blog post every two weeks from real incidents.
**Later:** AZ-305 after AZ-104.

## CI/CD (where it happens)

- **Jan:** Git fundamentals, branching, pull requests; **GitHub Actions** pipelines (build, test, scan, deploy); Terraform plan/apply in a pipeline; Jenkins concepts for interviews.
- **Feb:** **GitOps with Argo CD** on Kubernetes; blue/green and rollback.
- **P2 and P3** are delivered through pipelines, not by hand.

## New additions (30 Sep)

| Area | Depth | Why |
|---|---|---|
| **Windows Server admin** | Working knowledge: roles, services, Event Viewer, patching, RDP, IIS basics, PowerShell | Common in enterprise and Gulf roles |
| **Active Directory** | Solid: domains, OUs, users/groups, GPO, DNS integration, hybrid with Entra ID | Identity underpins PAM, Azure and Exchange |
| **Exchange basics** | Awareness: mail flow, Exchange Online vs on-prem | Frequently asked in infra roles |
| **Backup admin (Veeam)** | Solid: jobs, repositories, restores, replication, immutability | Widely used; free Community Edition for labs; complements DR architecture |
| **Endpoint security (Defender, Trend Micro)** | Working knowledge: agents, policies, alerts, exclusions, troubleshooting | Frequent in security-aware infra roles |
| **AI for ops** | Solid: LLM APIs, agents, automating daily cloud work | Differentiator in 2027 interviews |
