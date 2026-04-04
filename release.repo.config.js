const sharedConfig = require('./release.config');

module.exports = {
	...sharedConfig,
	branches: [
		{name: 'main', channel: 'latest'},
		{name: 'beta', prerelease: 'beta'},
	],
};
