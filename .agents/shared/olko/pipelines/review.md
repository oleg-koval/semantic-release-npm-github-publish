<!-- Managed by oleg-koval/fleet from oleg-koval/agents@0c75ffceb56b46c6cd73aa9c3cd23f22870c9daa -->
# Diff review pipeline

1. Identify the exact base and head. Build a review artifact containing commits, diffstat, and full diff with useful context.
2. Have an independent reviewer inspect that artifact. Open bounded source ranges only to verify a specific claim. Keep findings outside the diff in a separate section.
3. Verify findings against current code and tests. Fix actionable in-scope issues, reject false positives with evidence, and review the final diff again after changes.
4. Run locally available required checks. Distinguish failed, unavailable, queued, and passing checks.
5. Before remote delivery, confirm the branch can merge cleanly under the target repo's procedure. After a push, re-read the PR head, checks, reviews, and inline threads.

Use an existing installed PR-review skill when it provides the target workflow. Do not start an open-ended review loop without a check budget and terminal condition. Do not merge merely because one review passed.
