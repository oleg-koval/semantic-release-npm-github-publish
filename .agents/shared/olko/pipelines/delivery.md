<!-- Managed by oleg-koval/fleet from oleg-koval/agents@2cef368851d831ebf91f48f7cde853353e6cd256 -->
# Delivery pipeline

1. **Frame.** Product names the actor, observed problem, outcome, evidence, and acceptance checks. A user-approved outcome can proceed with stated uncertainty.
2. **Design when needed.** Architect resolves ownership, boundaries, failure paths, and compatibility before implementation.
3. **Build.** Engineer uses an isolated workspace and changes the smallest complete slice. Preserve unrelated work.
4. **Prove.** Run target-repo checks locally. QA independently checks the behavior and the exact artifact. Add Security when trust, privacy, or supply chain changes materially.
5. **Deliver.** Review the final diff, then create the branch, push, or PR only under the target repo's rules. Use the [review pipeline](review.md) for PR evidence.
6. **Close.** Re-read the authoritative source after each write. Report local correctness, commit, remote SHA, checks, deployment, and human acceptance as separate gates. Name anything incomplete.

If the target has Charter, apply [its pipeline](charter.md) during build and review. External communication, spending, and publication follow the target's approval rules.
