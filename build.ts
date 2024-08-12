// must be imported first to set env variables
import './scripts/set-env';

import { build } from 'vite';
import * as configs from './vite.configs';
import { mkdir } from 'fs/promises';
import { getBrowser, isDev, releaseTarget, releaseType } from './scripts/util';
import colorLog from 'scripts/log';
import { exec } from 'child_process';
import { emptydirSync } from 'fs-extra';
import createDistributable from 'scripts/create-distributable';

/**
 * Try to make a directory, dont error if the directory exists
 *
 * @param str - path to directory to try to make
 */
async function trymkdir(str: string) {
	try {
		await mkdir(str);
	} catch (err) {
		if (
			!err ||
			typeof err !== 'object' ||
			!('code' in err) ||
			err.code !== 'EEXIST'
		) {
			throw new Error('Something went wrong making build folder');
		}
	}
}

async function main() {
	await trymkdir('build');
	const folder = `build/${getBrowser()}`;
	await trymkdir(folder);
	emptydirSync(folder);

	const scripts = [
		build(configs.buildStart),
		build(configs.buildBackground),
		build(configs.buildContent),
	];
	await Promise.all(scripts);

	if (isDev() && releaseTarget === 'safari') {
		await new Promise((resolve) => {
			setTimeout(resolve, 10000);
		});
	}

	if (releaseTarget === 'safari' && !isDev()) {
		colorLog('Compiling safari extension', 'info');
		await new Promise<void>((resolve, reject) => {
			exec('bash safari.sh', (err, stdout, stderr) => {
				if (err) {
					colorLog(err, 'error');
					colorLog(stdout, 'info');
					colorLog(stderr, 'error');
					reject(new Error());
					return;
				}
				colorLog('Successfully compiled safari extension', 'success');
				resolve();
			});
		});
	}

	if (releaseType === 'dist') {
		await createDistributable();
	}
}

main();
