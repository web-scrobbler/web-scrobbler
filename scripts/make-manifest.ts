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
