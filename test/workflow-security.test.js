'use strict';

const assert = require('node:assert/strict');
const {readFileSync, readdirSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');

const workflowDirectory = join(__dirname, '..', '.github', 'workflows');
const workflows = readdirSync(workflowDirectory)
	.filter(file => /\.ya?ml$/.test(file))
	.map(file => ({file, source: readFileSync(join(workflowDirectory, file), 'utf8')}));

test('privileged pull_request_target workflows never checkout PR code', () => {
	for (const {file, source} of workflows) {
		if (/^  pull_request_target:/m.test(source)) {
			assert.doesNotMatch(source, /^\s*uses:\s*actions\/checkout@/m, file);
		}
	}
});

test('every workflow grants only read access by default', () => {
	for (const {file, source} of workflows) {
		assert.match(source, /^permissions:\n  contents: read\b/m, file);
	}
});

test('every external GitHub Action is pinned to a commit SHA', () => {
	for (const {file, source} of workflows) {
		for (const match of source.matchAll(/^\s*uses:\s*([^\s#]+)/gm)) {
			assert.match(match[1], /@[0-9a-f]{40}$/, `${file}: ${match[1]}`);
		}
	}
});

test('CI dry-run job cannot write to the repository', () => {
	const source = workflows.find(workflow => workflow.file === 'ci.yml').source;
	assert.match(source, /^  semantic-release-dry-run:[\s\S]*?^    permissions:\n      contents: read\b/m);
});
