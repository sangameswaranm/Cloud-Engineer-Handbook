# Teaching Method (locked)

Every topic in every module is taught with this lesson format. Agreed on 2026-09-25 from the sample "routing table" lesson.

1. **What is it?** Simple first, then technical.
2. **Why does it exist?** The engineering problem before the solution.
3. **How does it work?** Flow diagram of what happens internally.
4. **Commands and anatomy.** Each field of the command and its output explained.
5. **Multiple methods.** Every valid way, with the differences between Linux families (Red Hat, Debian/Ubuntu, SUSE) and when to use which.
6. **Tasks.** Basic → intermediate → advanced, plus troubleshooting, security, automation and design tasks.
7. **Test cases.** Expected PASS / DENIED results that are actually run.
8. **Failure injection.** A realistic incident ticket, solved with a hint ladder (question → command → what to look at → narrowing → solution). Breaking things is done safely, never in a way that cuts off access.
9. **Cloud connection.** How the concept appears in OCI and Azure, including production paths (same subnet, other subnet, on-prem over VPN).
10. **Production and security.** What changes between "works" and "production-ready".
11. **Assessment.** Explain it back as if teaching a junior engineer.
12. **Documentation.** Real commands, outputs, incident, root cause, fix and proof, written to the topic page; coverage table and dashboard updated only from real work.

Diagrams are used wherever they make the mechanism clearer.

## Rules added from Session 01

- **Only taught commands** in tests and incidents. A new command is explained (anatomy, each part) before it is used.
- **Small steps.** One small idea, one small lab, then check understanding. Deep tools (like `strace`) wait for their topic.
- **Label every incident:** 🧪 SCENARIO (pretend, real server not affected) or 🔧 LIVE LAB (real change, with the undo).
- **A topic is complete only when the learner says it is clear**, not just when the lab ran.

## Lesson order (updated 2026-09-27)

1. What is it? → 2. Why do we use it? → 3. How does it work internally? → 4. Command syntax → 5. Basic examples →
6. Real production example → 7. Hands-on VM task → 8. Failure/break scenario → 9. Troubleshooting →
10. **Interview questions** (explain out loud, model answers in the guide) → 11. Admin task / challenge

## Incidents in every topic

Every topic (this module and all future ones) includes numbered incidents (INC-XXX) written in the [senior root cause format](ROOT-CAUSE-GUIDE.md): symptom, evidence, root cause (one-line formula), fix, verification, prevention.
