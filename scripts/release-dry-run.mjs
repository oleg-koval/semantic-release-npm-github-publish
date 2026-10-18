import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

import semanticRelease from 'semantic-release';

const require = createRequire(import.meta.url);
const config = require('../release.dry-run.config');
const cwd = process.cwd();
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'semantic-release-dry-run-'));
const repositoryPath = join(temporaryDirectory, 'repository.git');

try {
	// semantic-release probes Git push access even in dry-run mode. Use an
	// ephemeral local mirror so this CI check needs no GitHub write permission.
	execFileSync('git', ['clone', '--bare', '--no-hardlinks', cwd, repositoryPath], {stdio: 'inherit'});

	const result = await semanticRelease(
		{
			...config,
			repositoryUrl: pathToFileURL(repositoryPath).href,
			ci: false,
			dryRun: true,
		},
		{
			cwd,
			env: process.env,
			stderr: process.stderr,
			stdout: process.stdout,
		}
	);

	if (!result) {
		console.log('[semantic-release] no release generated for the current branch');
	}
} finally {
	rmSync(temporaryDirectory, {recursive: true, force: true});
}
