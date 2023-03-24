import { exec } from 'child_process';
import { PluginOption } from 'vite';
import fs from 'fs-extra';
import colorLog from './log';
import { getBrowser } from './util';

/**
 * Vite plugin that compiles the connector .ts files, and moves them to the correct folder
 * for the browser that is currently the build target
 */
export default function compileConnectors(): PluginOption {
	return {
		name: 'compile-connectors',
		generateBundle() {
			return new Promise((resolve, reject) => {
				exec(
					'tsc --project tsconfig.connectors.json',
					(err, stdout, stderr) => {
						if (err) {
							colorLog(err, 'error');
							colorLog(stdout, 'info');
							colorLog(stderr, 'error');
							reject();
							return;
						}
						colorLog(
							'Connector file compilation complete',
							'success'
						);

						try {
							fs.moveSync(
								'build/connectorraw/connectors',
								`build/${getBrowser(
									process.env.BROWSER
								)}/connectors`
							);
							fs.removeSync('build/connectorraw');
							colorLog('Connector files moved', 'success');
							resolve();
						} catch (err) {
							colorLog(err, 'error');
							reject();
							return;
						}
					}
				);
			});
		},
	};
}
