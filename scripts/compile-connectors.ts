import { exec } from 'child_process';
import { PluginOption } from 'vite';
import fs from 'fs-extra';
import colorLog from './log';
import { getBrowser } from './util';
import chokidar from 'chokidar';

/**
 * Sends the actual command to typescript to compile connectors, and places them where they should be.
 *
 * @returns A promise that resolves when the conenctors are compiled
 */
function generateConnectors() {
	return new Promise<void>((resolve, reject) => {
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
				colorLog('Connector file compilation complete', 'success');

				try {
					fs.removeSync(`build/${getBrowser()}/connectors`);
					fs.moveSync(
						'build/connectorraw/connectors',
						`build/${getBrowser()}/connectors`
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
}

/**
 * chokidar watcher used for HMR purposes
 */
let watcher: chokidar.FSWatcher;

/**
 * Vite plugin that compiles the connector .ts files, and moves them to the correct folder
 * for the browser that is currently the build target
 */
export default function compileConnectors(options: {
	watchDirectory: string;
	isDev: boolean;
}): PluginOption {
	return {
		name: 'compile-connectors',
		async buildStart() {
			await generateConnectors();
			if (!options.isDev) {
				return;
			}

			/**
			 * HMR if dev
			 */
			const watcher = chokidar.watch(options.watchDirectory, {
				ignoreInitial: true,
			});

			watcher.on('add', () => {
				colorLog('Connector addition detected, rebuilding...', 'info');
				generateConnectors();
			});
			watcher.on('change', () => {
				colorLog('Connector change detected, rebuilding...', 'info');
				generateConnectors();
			});
			watcher.on('unlink', () => {
				colorLog('Connector deletion detected, rebuilding...', 'info');
				generateConnectors();
			});
			watcher.on('error', (err) => {
				colorLog(err, 'error');
			});
		},
		buildEnd(err?: Error) {
			watcher?.close();
			if (err) {
				colorLog(err, 'error');
			}
		},
	};
}
