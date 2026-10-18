'use strict';

const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const {join} = require('node:path');
const test = require('node:test');

const repositoryDirectory = join(__dirname, '..');

test('main-branch release dry run probes a disposable local remote', () => {
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
	assert.match(output, /repository file:\/\/.*repository\.git/);
	assert.match(output, /no release generated for the current branch/);
});
