import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

import semanticRelease from 'semantic-release';

const require = createRequire(import.meta.url);
const config = require('../release.dry-run.config');
const packageJson = require('../package.json');
const cwd = process.cwd();
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'semantic-release-dry-run-'));
const repositoryPath = join(temporaryDirectory, 'repository.git');

function resolveBranchSha(branch) {
	for (const ref of [`refs/remotes/origin/${branch}`, `refs/heads/${branch}`]) {
		try {
			return execFileSync('git', ['rev-parse', '--verify', ref], {
				cwd,
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
			}).trim();
		} catch {
			// Try the next local ref form.
		}
	}

	return undefined;
}

try {
	// Refresh tags after checkout in case a concurrent publish just created one.
	execFileSync('git', ['fetch', '--tags', '--force', 'origin'], {cwd, stdio: 'inherit'});
	// The push permission probe must stay local; CI only needs read access to GitHub.
	execFileSync('git', ['clone', '--bare', '--no-hardlinks', cwd, repositoryPath], {stdio: 'inherit'});
	for (const configuredBranch of config.branches ?? []) {
		const branch = typeof configuredBranch === 'string' ? configuredBranch : configuredBranch.name;
		const sha = branch && resolveBranchSha(branch);

		if (sha) {
			execFileSync('git', ['--git-dir', repositoryPath, 'update-ref', `refs/heads/${branch}`, sha]);
		}
	}

	const gitConfigIndex = Number(process.env.GIT_CONFIG_COUNT ?? 0);
	const env = {
		...process.env,
		GIT_CONFIG_COUNT: String(gitConfigIndex + 1),
		[`GIT_CONFIG_KEY_${gitConfigIndex}`]: `url.${pathToFileURL(repositoryPath).href}.insteadOf`,
		[`GIT_CONFIG_VALUE_${gitConfigIndex}`]: packageJson.repository.url,
	};
	const result = await semanticRelease(
		{
			...config,
			repositoryUrl: packageJson.repository.url,
			ci: false,
			dryRun: true,
		},
		{
			cwd,
			env,
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
