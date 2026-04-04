const repoConfig = require('./release.repo.config');

module.exports = {
	...repoConfig,
	plugins: [
		repoConfig.plugins[0],
		'@semantic-release/release-notes-generator',
	],
};
