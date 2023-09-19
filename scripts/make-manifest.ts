import { PluginOption } from 'vite';
import fs from 'fs-extra';
import {
	chromeManifest,
	firefoxManifest,
	safariManifest,
} from 'manifest.config';
import colorLog from './log';
import { getBrowser, releaseTarget } from './util';
import { Manifest } from 'webextension-polyfill';

/**
 * Compile the manifest for the current build target and move it to the correct folder
 */
export default function makeManifest(): PluginOption {
	return {
		name: 'make-manifest',
		generateBundle: () => {
			return new Promise((resolve, reject) => {
				switch (releaseTarget) {
					case 'chrome':
						writeManifest(resolve, reject, chromeManifest);
						break;
					case 'safari':
						writeManifest(resolve, reject, safariManifest);
						break;
					case 'firefox':
						writeManifest(resolve, reject, firefoxManifest);
						break;
				}
			});
		},
	};
}

/**
 * Write the manifest to the correct folder
 *
 * @param resolve - promise to resolve when done to tell vite script is done
 * @param manifest - manifest to write
 */
function writeManifest(
	resolve: () => void,
	reject: (reason?: unknown) => void,
	manifest: Manifest.WebExtensionManifest,
) {
	fs.writeJSON(`build/${getBrowser()}/manifest.json`, manifest, { spaces: 2 })
		.then(() => {
			colorLog('Successfully wrote manifest', 'success');
			resolve();
		})
		.catch((err) => {
			colorLog('Failed to write manifest', 'error');
			reject(err);
		});
}
