const sharedConfig = require('./release.config');

const repoPlugins = sharedConfig.plugins.filter(plugin => {
	const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;

	return ![
		'@semantic-release/changelog',
		'@semantic-release/git',
	].includes(pluginName);
});

module.exports = {
	...sharedConfig,
	branches: [
		{name: 'main', channel: 'latest'},
		{name: 'beta', prerelease: 'beta'},
	],
	plugins: repoPlugins,
};
