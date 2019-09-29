# semantic-release-npm-github-publish

<p>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/actions" target="_blank">
    <img alt="Version" src="https://github.com/oleg-koval/semantic-release-npm-github-publish/workflows/Publish/badge.svg?branch=master">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release-npm-github-publish" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/semantic-release-npm-github-publish.svg">
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/oleg-koval/semantic-release-npm-github-publish/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Semantic-release shareable configuration for easy publishing to NPM, Github or Github Package Registry.

## About

- Using [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer) ensures that commits are conformed to the [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0-beta.4/). For any of these keywords: **build, ci, chore, docs, refactor, style, test** - patch version will be created.
- Publishes the new version to [NPM](https://npmjs.org).
- Bumps a version in package.json.
- Creates or updates a changelog file.
- Releases new release for Github.

**This repository can be also used as a [template repository](https://help.github.com/en/articles/creating-a-template-repository) for creation of sharable semantic-release configurations.**

## Install

```sh
npm install --save-dev semantic-release-npm-github-publish
```

## Usage

To use this sharable config, extend your semantic release configuration:

```json
{
  "extends": "semantic-release-npm-github-publish",
  "branch": "master",
  "debug": false
}
```

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/oleg-koval/semantic-release-npm-github-publi/issues).

## Build with

- [Github actions](https://github.com/features/actions)
- [semantic-release](https://github.com/semantic-release/semantic-release)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
