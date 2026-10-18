'use strict';

const assert = require('node:assert/strict');
const {readFileSync, readdirSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');
const YAML = require('yaml');

const workflowsPath = join(__dirname, '..', '.github', 'workflows');
const workflows = readdirSync(workflowsPath)
	.filter(file => /\.ya?ml$/.test(file))
	.map(file => ({file, config: YAML.parse(readFileSync(join(workflowsPath, file), 'utf8'))}));

const safeRefs = new Set([
	undefined,
	'${{github.sha}}',
	'${{github.event.pull_request.base.sha}}',
	'${{github.event.pull_request.base.ref}}',
	'${{github.base_ref}}',
]);
const safeRepositories = new Set([
	undefined,
	'${{github.repository}}',
	'oleg-koval/semantic-release-npm-github-publish',
]);
const normalize = value => typeof value === 'string' ? value.replace(/\s+/g, '') : value;

function assertNoPRHeadCode(config, file) {
	if (!Object.hasOwn(config.on ?? {}, 'pull_request_target')) {
		return;
	}

	const source = JSON.stringify(config);
	assert.doesNotMatch(source, /github\.event\.pull_request\.head\.(?:sha|ref)(?:\b|\})/, `${file}: references untrusted PR-head code`);
	assert.doesNotMatch(source, /refs\/pull\/|pull\/\$\{\{[^}]*pull_request\.number/, `${file}: fetches PR-head refs`);
}

function assertSafeTargetCheckouts(config, file) {
	if (!Object.hasOwn(config.on ?? {}, 'pull_request_target')) {
		return;
	}

	assertNoPRHeadCode(config, file);
	for (const job of Object.values(config.jobs ?? {})) {
		for (const step of job.steps ?? []) {
			if (!step.uses?.startsWith('actions/checkout@')) {
				continue;
			}

			assert.ok(safeRefs.has(normalize(step.with?.ref)), `${file}: checkout of an untrusted ref`);
			assert.ok(safeRepositories.has(normalize(step.with?.repository)), `${file}: checkout of an untrusted repository`);
		}
	}
}

test('privileged pull_request_target workflows cannot checkout PR-head code', () => {
	for (const {file, config} of workflows) {
		assertSafeTargetCheckouts(config, file);
	}
});

test('checkout guard allows trusted base refs but rejects PR-head refs', () => {
	const workflowWithRef = ref => ({
		on: {pull_request_target: null},
		jobs: {check: {steps: [{uses: 'actions/checkout@' + 'a'.repeat(40), with: {ref}}]}},
	});
	assert.doesNotThrow(() => assertSafeTargetCheckouts(workflowWithRef('${{ github.event.pull_request.base.sha }}'), 'fixture'));
	assert.throws(() => assertSafeTargetCheckouts(workflowWithRef('${{ github.event.pull_request.head.ref }}'), 'fixture'), /untrusted PR-head code/);
	assert.throws(() => assertSafeTargetCheckouts({
		on: {pull_request_target: null},
		jobs: {check: {steps: [{run: 'git fetch origin +refs/pull/${{ github.event.pull_request.number }}/head'}]}},
	}, 'fixture'), /fetches PR-head refs/);
});

function assertReadOnlyWorkflowPermissions(config, file) {
	assert.deepEqual(config.permissions, {contents: 'read'}, file);
}

test('every workflow grants only read access by default', () => {
	for (const {file, config} of workflows) {
		assertReadOnlyWorkflowPermissions(config, file);
	}
});

test('read-only permission assertion rejects extra workflow-wide scopes', () => {
	assert.throws(() => assertReadOnlyWorkflowPermissions({permissions: {contents: 'read', 'id-token': 'write'}}, 'fixture'));
});

test('every external GitHub Action is pinned to a commit SHA', () => {
	for (const {file, config} of workflows) {
		for (const job of Object.values(config.jobs ?? {})) {
			for (const {uses} of [job, ...job.steps ?? []]) {
				if (uses && !uses.startsWith('./')) {
					assert.match(uses, /^[^@\s]+@[0-9a-f]{40}$/, file);
				}
			}
		}
	}
});

test('CI dry-run job cannot write to the repository', () => {
	const config = workflows.find(workflow => workflow.file === 'ci.yml').config;
	assert.deepEqual(config.jobs['semantic-release-dry-run'].permissions, {contents: 'read'});
});
