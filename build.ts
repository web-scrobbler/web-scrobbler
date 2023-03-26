import { build } from 'vite';
import * as configs from './vite.configs';
import { mkdir } from 'fs/promises';
import { getBrowser } from 'scripts/util';
import colorLog from 'scripts/log';
import { exec } from 'child_process';
import { emptydirSync } from 'fs-extra';

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
	const folder = `build/${getBrowser(process.env.BROWSER)}`;
	await trymkdir(folder);
	emptydirSync(folder);

	const scripts = [
		build(configs.buildStart),
		build(configs.buildBackground),
		build(configs.buildContent),
	];
	await Promise.all(scripts);

	if (process.env.BROWSER === 'safari') {
		colorLog('Compiling safari extension', 'info');
		exec('bash safari.sh', (err, stdout, stderr) => {
			if (err) {
				colorLog(err, 'error');
				colorLog(stdout, 'info');
				colorLog(stderr, 'error');
				return;
			}
			colorLog('Successfully compiled safari extension', 'success');
		});
	}
}

main();
