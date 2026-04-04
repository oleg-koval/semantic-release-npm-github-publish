# Release Channels

This repository uses a repo-only semantic-release config to keep package consumers on the shared preset while giving the repository two release channels:

- `master` and `main` publish stable releases on the default `latest` channel during the branch migration window
- `beta` publishes prereleases with the `beta` dist-tag and `-beta.N` versions

The repo automation uses `release.repo.config.js` so the published shareable config in `release.config.js` does not force prerelease branches on downstream consumers.
