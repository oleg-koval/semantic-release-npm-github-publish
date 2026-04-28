'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'automerge.yml');
const workflowContent = fs.readFileSync(workflowPath, 'utf8');

// --- check_suite trigger (added in this PR) ---

test('includes check_suite as a workflow trigger', () => {
	assert.match(workflowContent, /^\s*check_suite:/m);
});

test('check_suite trigger fires on completed type', () => {
	// The check_suite block must contain "completed"
	const checkSuiteIndex = workflowContent.indexOf('check_suite:');
	assert.notEqual(checkSuiteIndex, -1, 'check_suite trigger not found');

	// Extract the section from check_suite: to the next top-level key
	const afterCheckSuite = workflowContent.slice(checkSuiteIndex);
	const nextTopLevelKey = afterCheckSuite.slice(1).search(/^\S/m);
	const checkSuiteBlock =
		nextTopLevelKey === -1
			? afterCheckSuite
			: afterCheckSuite.slice(0, nextTopLevelKey + 1);

	assert.match(checkSuiteBlock, /completed/, 'check_suite types must include "completed"');
});

test('check_suite trigger only specifies the completed type', () => {
	const checkSuiteIndex = workflowContent.indexOf('check_suite:');
	const afterCheckSuite = workflowContent.slice(checkSuiteIndex);
	const nextTopLevelKey = afterCheckSuite.slice(1).search(/^\S/m);
	const checkSuiteBlock =
		nextTopLevelKey === -1
			? afterCheckSuite
			: afterCheckSuite.slice(0, nextTopLevelKey + 1);

	// types line should reference [completed] exactly
	assert.match(checkSuiteBlock, /types:\s*\[completed\]/);
});

// --- pull_request_review trigger (added in this PR) ---

test('includes pull_request_review as a workflow trigger', () => {
	assert.match(workflowContent, /^\s*pull_request_review:/m);
});

test('pull_request_review trigger fires on submitted type', () => {
	const reviewIndex = workflowContent.indexOf('pull_request_review:');
	assert.notEqual(reviewIndex, -1, 'pull_request_review trigger not found');

	const afterReview = workflowContent.slice(reviewIndex);
	const nextTopLevelKey = afterReview.slice(1).search(/^\S/m);
	const reviewBlock =
		nextTopLevelKey === -1
			? afterReview
			: afterReview.slice(0, nextTopLevelKey + 1);

	assert.match(reviewBlock, /submitted/, 'pull_request_review types must include "submitted"');
});

test('pull_request_review trigger only specifies the submitted type', () => {
	const reviewIndex = workflowContent.indexOf('pull_request_review:');
	const afterReview = workflowContent.slice(reviewIndex);
	const nextTopLevelKey = afterReview.slice(1).search(/^\S/m);
	const reviewBlock =
		nextTopLevelKey === -1
			? afterReview
			: afterReview.slice(0, nextTopLevelKey + 1);

	assert.match(reviewBlock, /types:\s*\[submitted\]/);
});

// --- All three triggers are present together ---

test('workflow has exactly the three expected top-level event triggers', () => {
	assert.match(workflowContent, /pull_request_target:/);
	assert.match(workflowContent, /check_suite:/);
	assert.match(workflowContent, /pull_request_review:/);
});

// --- Pre-existing pull_request_target trigger is preserved ---

test('preserves pull_request_target trigger with its original activity types', () => {
	const prtIndex = workflowContent.indexOf('pull_request_target:');
	assert.notEqual(prtIndex, -1, 'pull_request_target trigger not found');

	const afterPrt = workflowContent.slice(prtIndex);
	const nextTopLevelKey = afterPrt.slice(1).search(/^\S/m);
	const prtBlock =
		nextTopLevelKey === -1
			? afterPrt
			: afterPrt.slice(0, nextTopLevelKey + 1);

	for (const type of ['opened', 'reopened', 'synchronize', 'ready_for_review', 'edited']) {
		assert.match(prtBlock, new RegExp(type), `pull_request_target types must include "${type}"`);
	}
});

// --- Permissions block is intact ---

test('workflow grants write permission to contents', () => {
	assert.match(workflowContent, /contents:\s*write/);
});

test('workflow grants write permission to pull-requests', () => {
	assert.match(workflowContent, /pull-requests:\s*write/);
});

test('workflow grants read permission to checks', () => {
	assert.match(workflowContent, /checks:\s*read/);
});

// --- Regression: new triggers do not carry unintended event types ---

test('check_suite trigger does not inadvertently include pull_request event types', () => {
	const checkSuiteIndex = workflowContent.indexOf('check_suite:');
	const afterCheckSuite = workflowContent.slice(checkSuiteIndex);
	const nextTopLevelKey = afterCheckSuite.slice(1).search(/^\S/m);
	const checkSuiteBlock =
		nextTopLevelKey === -1
			? afterCheckSuite
			: afterCheckSuite.slice(0, nextTopLevelKey + 1);

	assert.doesNotMatch(checkSuiteBlock, /opened|reopened|synchronize|ready_for_review/);
});

test('pull_request_review trigger does not inadvertently include check_suite types', () => {
	const reviewIndex = workflowContent.indexOf('pull_request_review:');
	const afterReview = workflowContent.slice(reviewIndex);
	const nextTopLevelKey = afterReview.slice(1).search(/^\S/m);
	const reviewBlock =
		nextTopLevelKey === -1
			? afterReview
			: afterReview.slice(0, nextTopLevelKey + 1);

	assert.doesNotMatch(reviewBlock, /\bcompleted\b/);
});
