<!-- Managed by oleg-koval/fleet from oleg-koval/agents@d8b091230dda1fa9d9be858a237f59cde48222ac -->
# Diff review pipeline

1. Identify the exact base and head SHAs and record both in the review artifact. Include commits, diffstat, and full diff with useful context.
2. Have an independent reviewer inspect that artifact. Open bounded source ranges only to verify a specific claim. Keep findings outside the diff in a separate section.
3. Verify findings against current code and tests. Fix actionable in-scope issues, reject false positives with evidence, and review the final diff again after changes.
4. Inspect required check commands and the repository-controlled scripts, setup steps, and hooks they invoke before execution. Run untrusted checks only in a disposable environment without credentials, host mounts or sockets, SSH agents, or sensitive filesystem and network access; do not forward host secrets or environment. If isolation is unavailable, report the check as blocked. Distinguish failed, unavailable, queued, and passing checks.
5. Before remote delivery, confirm the branch can merge cleanly under the target repo's procedure. At review completion and after every push, read the authoritative remote PR head and compare it with the artifact's recorded head SHA. If they differ, including after a concurrent contributor push, invalidate the earlier review, rebuild the artifact for the new base and head, and repeat independent review before claiming completion or merging. Read checks, reviews, and inline threads for that exact head; a prior-head review is not current evidence.

Use an existing installed PR-review skill when it provides the target workflow. Do not start an open-ended review loop without a check budget and terminal condition. Do not merge merely because one review passed.
