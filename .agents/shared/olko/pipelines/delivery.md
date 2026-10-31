<!-- Managed by oleg-koval/fleet from oleg-koval/agents@7015886a52fa170e85a5dd85c959d8435953b34d -->
# Delivery pipeline

1. **Frame.** Product names the actor, observed problem, outcome, evidence, and acceptance checks. A user-approved outcome can proceed with stated uncertainty.
2. **Design when needed.** Architect resolves ownership, boundaries, failure paths, and compatibility before implementation.
3. **Build.** Engineer uses an isolated workspace and changes the smallest complete slice. Preserve unrelated work.
4. **Prove.** Run target-repo checks locally. QA independently checks the behavior and the exact artifact. Add Security when trust, privacy, or supply chain changes materially.
5. **Deliver.** Review the final diff, then create the branch, push, or PR only under the target repo's rules. Use the [review pipeline](review.md) for PR evidence.
6. **Close.** Re-read the authoritative source after each write. Report local correctness, commit, remote SHA, checks, deployment, and human acceptance as separate gates. Name anything incomplete.

For implementation work delivered through a PR, any completion claim (`DONE`, `DONE_WITH_CONCERNS`, `DELIVERED`, or equivalent) requires passing required local tests and CI on the current head, with no applicable CI failing or in progress. Fix every review finding or rebut it with evidence; reply and verify resolved thread state. Obtain positive completion or satisfaction evidence for each configured required reviewer and each active reviewing bot on that head, including delayed reviews. Inspect each reviewer's actual surface, including PR conversation comments where applicable. Confirm the PR actually merged from its authoritative state. A prior-head review, self-resolved thread, missing or pending review, quota limit, timeout, or unavailable evidence is not satisfaction. Use the target's review workflow with a bounded wait; if a gate remains unknown or incomplete, report `BLOCKED` and the concrete next action. An explicit request to leave a PR open is an exception to the merge gate, not evidence of a merge.

If the target has Charter, apply [its pipeline](charter.md) during build and review. External communication, spending, and publication follow the target's approval rules.

For Apple app work, all leads (including project-specific CSO and CTO agents) must consult [Apple Review](../roles/olko-apple-review.md) before allocating feature tasks and after completion. Require PLAN_APPROVED before allocation and FEATURE_APPROVED before feature closure; require SUBMISSION_READY for the complete candidate before submission handoff. CHANGES_REQUIRED or BLOCKED requires an owned cleanup round and independent re-review; never substitute green tests or a lead self-approval. See the role for evidence and approval invalidation rules.
