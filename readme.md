# semantic-release-npm-github-publish

<p>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/ci.yml" target="_blank">
    <img alt="CI" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/ci.yml/badge.svg?branch=main">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/release.yml" target="_blank">
    <img alt="Publish" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions/workflows/release.yml/badge.svg?branch=main">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-npm-github-publish" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/v/semantic-release-npm-github-publish.svg">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Opinionated `semantic-release` shareable configuration for npm + GitHub publishing with changelog generation and release commits.

## About

This package is useful if you want one maintained preset instead of repeating the same `semantic-release` plugin composition in every repository.

It adds value beyond native plugin composition by shipping:

- extra patch release rules for `build`, `ci`, `chore`, `docs`, `refactor`, `style`, and `test`
- curated changelog grouping, titles, and emojis via [`commit-transform.js`](./commit-transform.js) and [`types.js`](./types.js)
- a fixed publish chain for npm + GitHub, including changelog updates and a release commit

## Default Behavior

The exported config uses this exact plugin chain:

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
- peer dependency ranges are pinned to the currently supported plugin majors
- this repository also validates a `beta` prerelease branch with a repo-only release config

## Install

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

For this repository itself, stable releases come from `main` and prereleases come from `beta` via `release.repo.config.js`. The exported shareable config remains branch-agnostic for consumers.

## Usage

<p>
  <strong style="color:#b91c1c;">Migration notice:</strong>
  this preset does not hardcode consumer release branches. `main` is the documented default, but if your repository still releases from `master` or another branch, set `branches` explicitly in your repo-local semantic-release config.
</p>

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

## When To Use This Preset

Use this package when you want:

- the exact plugin chain documented above
- extra patch releases for maintenance-only commit types
- the opinionated changelog formatting in this repository
- a maintained upgrade path for this preset over time

Use repo-local plugin composition instead when your team wants different plugins, different release rules, or full control over upgrade timing.

## Repository Maintenance Notes

- Consumer-facing examples now use `main`.
- Repository automation publishes stable releases from `main` and prereleases from `beta`.
- The shared preset does not hardcode release branches for consumers; set `branches` in your repo-local config when you do not release from `main`.
- Dependabot PRs can auto-refresh `package-lock.json` through the dedicated lockfile-fixer workflow.
- Dependabot npm patch updates can enable GitHub auto-merge after required checks pass.
- The old README wording that inverted `fix` and `feat` was documentation drift. The actual release behavior has been corrected and is now covered by tests.

## Contributing

Issues and pull requests are welcome.

## Built With

- [GitHub Actions](https://github.com/features/actions)
- [semantic-release](https://github.com/semantic-release/semantic-release)
