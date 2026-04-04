'use strict';

const types = require('./types');

const COMMIT_HASH_LENGTH = 7;

/**
 * Transform a parsed commit to render the changelog.
 *
 * @param {Object} commit commit parsed with `conventional-changelog-parser`.
 * @param {Object} context `conventional-changelog` context.
 * @return {Object} the transformed commit.
 */
module.exports = (commit, context) => {
	const commitType = types.types[commit.type];
	const notes = Array.isArray(commit.notes)
		? commit.notes.map(note => ({
				...note,
				title: 'Breaking changes',
			}))
		: [];

	if (!commitType || (!commitType.changelog && notes.length === 0)) {
		return null;
	}

	const groupType = `${commitType.emoji ? `${commitType.emoji} ` : ''}${commitType.title}`;

	const references = [];
	let subject = commit.subject;

	if (typeof subject === 'string') {
		let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

		if (url) {
			url += '/issues/';
			// Issue URLs.
			subject = subject.replace(/#(\d+)/g, (_, issue) => {
				references.push(issue);
				return `[#${issue}](${url}${issue})`;
			});
		}

		if (context.host) {
			// User URLs.
			subject = subject.replace(/\B@([a-z0-9](?:-?[a-z0-9]){0,38})/g, `[@$1](${context.host}/$1)`);
		}
	}

	return {
		...commit,
		groupType,
		type: groupType,
		scope: commit.scope === '*' ? '' : commit.scope,
		shortHash: typeof commit.hash === 'string' ? commit.hash.slice(0, COMMIT_HASH_LENGTH) : commit.shortHash,
		subject,
		notes,
		references: Array.isArray(commit.references)
			? commit.references.filter(reference => !references.includes(reference.issue))
			: commit.references,
	};
};
