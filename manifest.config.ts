import { Manifest } from 'webextension-polyfill';
import pkg from './package.json';
import { releaseTarget } from './scripts/util';

/**
 * Common properties between all browsers manifests
 */
export const common: Manifest.WebExtensionManifest = {
	manifest_version: 3,
	name: 'Web Scrobbler',
	default_locale: 'en',
	description: '__MSG_extDescription__',
	version: pkg.version,

	permissions: ['storage', 'contextMenus', 'notifications'],
	host_permissions: ['http://*/', 'https://*/'],

	content_scripts: [
		{
			matches: ['<all_urls>'],
			js: ['content/main.js'],
			all_frames: true,
		},
	],

	background: {
		service_worker: 'background/main.js',
	},

	web_accessible_resources: [
		{
			resources: ['connectors/*'],
			matches: ['<all_urls>'],
		},
	],

	options_ui: {
		page: 'src/ui/options/index.html',
		open_in_tab: true,
	},

	icons: {
		16: 'icons/icon_generic_16.png',
		48: 'icons/icon_main_48.png',
		96: 'icons/icon_main_96.png',
		128: 'icons/icon_main_128.png',
		256: 'icons/icon_main_256.png',
		512: 'icons/icon_main_512.png',
	},

	action: getAction(releaseTarget),
};

/**
 * Manifest for chromium browsers
 */
export const chromeManifest: Manifest.WebExtensionManifest = {
	...common,
};

/**
 * Manifest for safari
 */
export const safariManifest: Manifest.WebExtensionManifest = {
	...common,
};

/**
 * Manifest for firefox
 */
export const firefoxManifest: Manifest.WebExtensionManifest = {
	...common,

	background: {
		scripts: ['background/main.js'],
	},

	browser_specific_settings: {
		gecko: {
			id: 'yayuyokitano@web-scrobbler.com',
		},
	},
};

/**
 * Gets action with defaults for a browser
 *
 * @param browser - browser to get action for
 * @returns manifest action object
 */
function getAction(browser?: string) {
	const type = browser === 'safari' ? 'safari' : 'light';
	return {
		default_icon: {
			16: `icons/action_unsupported_16_${type}.png`,
			19: `icons/action_unsupported_19_${type}.png`,
			32: `icons/action_unsupported_32_${type}.png`,
			38: `icons/action_unsupported_38_${type}.png`,
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	};
}
