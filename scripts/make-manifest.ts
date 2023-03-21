import { PluginOption } from 'vite';
import fs from 'fs-extra';
import { chromeManifest, firefoxManifest } from 'manifest.config';
import colorLog from './log';
import { getBrowser } from './util';

export default function makeManifest(): PluginOption {
	return {
		name: 'make-manifest',
		generateBundle() {
			return new Promise((resolve, reject) => {
				switch (process.env.BROWSER) {
					case 'chrome':
					case 'safari':
						fs.writeJSON(
							`build/${getBrowser(
								process.env.BROWSER
							)}/manifest.json`,
							chromeManifest,
							{ spaces: 2 }
						).then(() => {
							colorLog('Successfully wrote manifest', 'success');
							resolve();
						});
						break;
					case 'firefox':
						fs.writeJSON(
							`build/${getBrowser(
								process.env.BROWSER
							)}/manifest.json`,
							firefoxManifest,
							{ spaces: 2 }
						).then(() => {
							colorLog('Successfully wrote manifest', 'success');
							resolve();
						});
						break;
				}
			});
		},
	};
}
