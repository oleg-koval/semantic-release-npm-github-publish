import {createRequire} from 'node:module';

import semanticRelease from 'semantic-release';

const require = createRequire(import.meta.url);
const config = require('../release.dry-run.config');

const result = await semanticRelease(
	{
		...config,
		ci: false,
		dryRun: true,
	},
	{
		cwd: process.cwd(),
		env: process.env,
		stderr: process.stderr,
		stdout: process.stdout,
	}
);

if (!result) {
	console.log('[semantic-release] no release generated for the current branch');
}
