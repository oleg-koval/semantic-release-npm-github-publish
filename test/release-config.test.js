'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {analyzeCommits} = require('@semantic-release/commit-analyzer');

const transformCommit = require('../commit-transform');
const releaseConfig = require('../release.config');
const repoReleaseConfig = require('../release.repo.config');

const logger = {
	error() {},
	log() {},
	success() {},
	warn() {},
};

async function analyzeReleaseType(messages) {
	return analyzeCommits(
		{releaseRules: releaseConfig.releaseRules},
		{
			cwd: process.cwd(),
			env: process.env,
			logger,
			commits: messages.map(message => ({message})),
			options: {},
		}
	);
}

test('exports the documented plugin chain', () => {
	assert.deepEqual(
		releaseConfig.plugins.map(plugin => Array.isArray(plugin) ? plugin[0] : plugin),
		[
			'@semantic-release/commit-analyzer',
			'@semantic-release/release-notes-generator',
			'@semantic-release/changelog',
			'@semantic-release/npm',
			'@semantic-release/git',
			'@semantic-release/github',
		]
	);
});

test('keeps beta prereleases as a repo-only branch policy', () => {
	assert.equal(releaseConfig.branches, undefined);
	assert.deepEqual(repoReleaseConfig.branches, [
		{name: 'master', channel: 'latest'},
		{name: 'main', channel: 'latest'},
		{name: 'beta', prerelease: 'beta'},
	]);
});

test('keeps standard feat/fix and breaking-change semantics', async () => {
	assert.equal(await analyzeReleaseType(['fix: correct output']), 'patch');
	assert.equal(await analyzeReleaseType(['feat: add publish summary']), 'minor');
	assert.equal(
		await analyzeReleaseType(['feat!: remove legacy option\n\nBREAKING CHANGE: legacy option no longer exists']),
		'major'
	);
});

test('promotes maintenance commit types to patch releases', async () => {
	for (const type of ['build', 'ci', 'chore', 'docs', 'refactor', 'style', 'test']) {
		assert.equal(await analyzeReleaseType([`${type}: internal maintenance`]), 'patch');
	}
});

test('formats changelog commit groups with curated titles', () => {
	const transformed = transformCommit(
		{
			hash: '1234567890abcdef',
			notes: [],
			scope: 'core',
			subject: 'add summary for #42',
			type: 'feat',
		},
		{
			host: 'https://github.com',
			owner: 'oleg-koval',
			repository: 'semantic-release-npm-github-publish',
		}
	);

	assert.equal(transformed.type, '✨ Features');
	assert.equal(transformed.shortHash, '1234567');
	assert.match(
		transformed.subject,
		/\[#42\]\(https:\/\/github\.com\/oleg-koval\/semantic-release-npm-github-publish\/issues\/42\)/
	);
});

test('drops unknown commit types from the changelog', () => {
	assert.equal(
		transformCommit(
			{
				hash: '1234567890abcdef',
				notes: [],
				scope: 'core',
				subject: 'misc internal task',
				type: 'unknown',
			},
			{}
		),
		null
	);
});
