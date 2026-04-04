const sharedConfig = require('./release.config');

module.exports = {
	...sharedConfig,
	branches: [
		{name: 'master', channel: 'latest'},
		{name: 'main', channel: 'latest'},
		{name: 'beta', prerelease: 'beta'},
	],
};
