# Contributing

Issues and pull requests are welcome.

## Development

Use the Node versions supported by `package.json`: Node 22.14 or newer compatible releases, or Node 24.10 or newer.

```sh
npm ci
npm test
npm run test:config
npm run docs:index:check
npm run pack:check
```

## Release Behavior

This repository publishes stable releases from `main` and beta prereleases from `beta`.

The exported shareable config does not hardcode consumer release branches. If a consuming repository releases from a branch other than `main`, set `branches` in that repository's local semantic-release config.

## Pull Requests

- Keep changes focused.
- Update tests and documentation when behavior changes.
- Do not commit npm tokens or generated release artifacts.
- Prefer Conventional Commits for PR titles and commit messages.

