import { PluginOption } from 'vite';
import fs from 'fs-extra';
import {
	chromeManifest,
	firefoxManifest,
	safariManifest,
} from 'manifest.config';
import colorLog from './log';
import { getBrowser } from './util';
import { Manifest } from 'webextension-polyfill';

/**
 * Compile the manifest for the current build target and move it to the correct folder
 */
export default function makeManifest(): PluginOption {
	return {
		name: 'make-manifest',
		generateBundle() {
			return new Promise((resolve, reject) => {
				switch (process.env.BROWSER) {
					case 'chrome':
						writeManifest(resolve, chromeManifest);
						break;
					case 'safari':
						writeManifest(resolve, safariManifest);
						break;
					case 'firefox':
						writeManifest(resolve, firefoxManifest);
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
	manifest: Manifest.WebExtensionManifest
) {
	fs.writeJSON(
		`build/${getBrowser(process.env.BROWSER)}/manifest.json`,
		manifest,
		{ spaces: 2 }
	).then(() => {
		colorLog('Successfully wrote manifest', 'success');
		resolve();
	});
}
