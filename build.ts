import { build } from 'vite';
import * as configs from './vite.configs';
import { mkdir } from 'fs/promises';
import { getBrowser } from 'scripts/util';
import colorLog from 'scripts/log';
import { exec } from 'child_process';

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
	await trymkdir(`build/${getBrowser(process.env.BROWSER)}`);

	await build(configs.buildStart);
	await build(configs.buildBackground);
	await build(configs.buildContent);

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
