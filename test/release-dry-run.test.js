'use strict';

const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const {join} = require('node:path');
const test = require('node:test');

const repositoryDirectory = join(__dirname, '..');
const packageJson = require('../package.json');

test('main-branch release dry run uses a disposable remote with read-only GitHub access', () => {
	const result = spawnSync(process.execPath, ['scripts/release-dry-run.mjs'], {
		cwd: repositoryDirectory,
		encoding: 'utf8',
		env: {
			...process.env,
			GITHUB_ACTIONS: 'true',
			GITHUB_EVENT_NAME: 'push',
			GITHUB_REF: 'refs/heads/main',
		},
	});
	const output = `${result.stdout}${result.stderr}`;

	assert.equal(result.status, 0, output);
	assert.match(output, /Allowed to push to the Git repository/);
	assert.match(output, /repository https:\/\/github\.com\/oleg-koval\/semantic-release-npm-github-publish\.git in dry-run mode/);
});

test('release notes keep GitHub links when the push probe uses a local remote', async () => {
	const {generateNotes} = await import('@semantic-release/release-notes-generator');
	const notes = await generateNotes({}, {
		commits: [{
			hash: '0123456789abcdef0123456789abcdef01234567',
			message: 'feat: keep canonical repository links',
			committerDate: '2026-10-18T00:00:00.000Z',
		}],
		lastRelease: {gitTag: 'v1.8.1', gitHead: 'abcdef0123456789abcdef0123456789abcdef01'},
		nextRelease: {version: '1.8.2', gitTag: 'v1.8.2'},
		options: {repositoryUrl: packageJson.repository.url},
		cwd: repositoryDirectory,
	});

	assert.match(notes, /https:\/\/github\.com\/oleg-koval\/semantic-release-npm-github-publish\/compare\/v1\.8\.1\.\.\.v1\.8\.2/);
	assert.match(notes, /https:\/\/github\.com\/oleg-koval\/semantic-release-npm-github-publish\/commit\/0123456/);
});
