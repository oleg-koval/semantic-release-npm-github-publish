<p align="center">
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/ci.yml" target="_blank">
    <img alt="CI" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/ci.yml/badge.svg?branch=main">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/release.yml" target="_blank">
    <img alt="Publish" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/release.yml/badge.svg?branch=main">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/codeql-analysis.yml" target="_blank">
    <img alt="CodeQL" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/codeql-analysis.yml/badge.svg?branch=main">
  </a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/oleg-koval/semantic-release-npm-github-publish" target="_blank">
    <img alt="OpenSSF Scorecard" src="https://api.securityscorecards.dev/projects/github.com/oleg-koval/semantic-release-npm-github-publish/badge">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-npm-github-publish" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/v/semantic-release-npm-github-publish.svg">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-npm-github-publish" target="_blank">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/semantic-release-npm-github-publish.svg">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

<p align="center">
  <img src="./site/assets/icon.svg" width="120" height="120" alt="semantic-release-npm-github-publish icon">
</p>

<h1 align="center">semantic-release-npm-github-publish</h1>

<p align="center">
  Opinionated semantic-release shareable configuration for npm and GitHub publishing.<br>
  <strong>One maintained preset for changelogs, npm releases, GitHub releases, and release commits.</strong>
</p>

---

## Features

- standard `semantic-release` plugin chain for npm and GitHub publishing
- extra patch release rules for `build`, `ci`, `chore`, `docs`, `refactor`, `style`, and `test`
- curated changelog grouping, titles, and emojis via [`commit-transform.js`](./commit-transform.js) and [`types.js`](./types.js)
- repo-local stable and beta release channels without forcing branch policy on consumers
- CI coverage for config loading, release semantics, changelog transforms, docs index integrity, and package contents

## Installation

Install `semantic-release`, this preset, and the peer plugins it expects:

```sh
npm install --save-dev \
  semantic-release \
  semantic-release-npm-github-publish \
  @semantic-release/changelog \
  @semantic-release/commit-analyzer \
  @semantic-release/git \
  @semantic-release/github \
  @semantic-release/npm \
  @semantic-release/release-notes-generator
```

Add a release script:

```json
{
  "scripts": {
    "semantic-release": "semantic-release"
  }
}
```

Run `npx semantic-release` in your release workflow.

## Quick Start

Example `.releaserc.yaml`:

```yaml
branches:
  - main
extends: "semantic-release-npm-github-publish"
ci: false
dryRun: false
debug: false
```

If your repository releases from a different branch, set `branches` explicitly in your repo-local config.

Example migration from `master`:

```yaml
branches:
  - master
extends: "semantic-release-npm-github-publish"
ci: false
dryRun: false
debug: false
```

## Default Behavior

The exported config uses this plugin chain:

1. `@semantic-release/commit-analyzer`
   with custom `releaseRules` for additional patch-triggering commit types
2. `@semantic-release/release-notes-generator`
3. `@semantic-release/changelog`
4. `@semantic-release/npm`
5. `@semantic-release/git`
   commits `package.json`, `package-lock.json`, and `CHANGELOG.md`
   with `release(version): Release ${nextRelease.version} [skip ci]`
6. `@semantic-release/github`

Release semantics match standard Conventional Commits and SemVer:

- `fix` => patch
- `feat` => minor
- `BREAKING CHANGE` footer or `!` => major
- `build`, `ci`, `chore`, `docs`, `refactor`, `style`, and `test` => patch in this preset

## Compatibility

This preset is actively maintained against the current stable `semantic-release` major.

- tested with Node `22` and `24`
- publish workflow runs on Node `24`
- peer dependency ranges are pinned to currently supported plugin majors
- this repository validates a `beta` prerelease branch with a repo-only release config

## When To Use This Preset

Use this package when you want:

- the exact plugin chain documented above
- extra patch releases for maintenance-only commit types
- the opinionated changelog formatting in this repository
- a maintained upgrade path for this preset over time

Use repo-local plugin composition when your team wants different plugins, different release rules, or full control over upgrade timing.

## Repository Maintenance Notes

- Consumer-facing examples use `main`.
- Repository automation publishes stable releases from `main` and prereleases from `beta`.
- The shared preset does not hardcode release branches for consumers.
- Dependabot PRs can auto-refresh `package-lock.json` through the dedicated lockfile-fixer workflow.
- Dependabot npm patch updates can enable GitHub auto-merge after required checks pass.

## System Requirements

- Node `^22.14.0 || >=24.10.0`
- npm
- GitHub Actions or another CI system capable of providing `GITHUB_TOKEN` and `NPM_TOKEN`

## Documentation

- [GitHub Pages site](https://oleg-koval.github.io/semantic-release-npm-github-publish/)
- [Release channel notes](./docs/release-channels.md)
- [Changelog](./CHANGELOG.md)

## Project Status

Maintained. The package is intentionally small and follows the current stable semantic-release/plugin majors declared in `package.json`.

## Security Notes

This package does not handle tokens directly, but release workflows that use it normally require npm and GitHub credentials. Keep release tokens in CI secrets and avoid printing release logs that include credentials.

Report vulnerabilities through the repository security advisory flow documented in [`SECURITY.md`](./SECURITY.md).

## Support

Donations are intentionally not configured for this repository.

## Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT. See [`LICENSE`](./LICENSE).

## Author

[Oleg Koval](https://github.com/oleg-koval)

<p align="center">
  <a href="https://www.npmjs.com/package/semantic-release-npm-github-publish">npm</a>
  ·
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish">GitHub</a>
  ·
  <a href="https://oleg-koval.github.io/semantic-release-npm-github-publish/">Website</a>
</p>
