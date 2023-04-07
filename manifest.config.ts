import { Manifest } from 'webextension-polyfill';
import pkg from './package.json';

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
};

/**
 * Manifest for chromium browsers
 */
export const chromeManifest: Manifest.WebExtensionManifest = {
	...common,

	action: {
		default_icon: {
			'19': 'icons/page_action_unsupported_19_light.png',
			'38': 'icons/page_action_unsupported_38_light.png',
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	},
};

/**
 * Manifest for safari
 */
export const safariManifest: Manifest.WebExtensionManifest = {
	...common,

	action: {
		default_icon: {
			'19': 'icons/page_action_unsupported_19_safari.png',
			'38': 'icons/page_action_unsupported_38_safari.png',
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	},
};

/**
 * Manifest for firefox
 */
export const firefoxManifest: Manifest.WebExtensionManifest = {
	...common,

	action: {
		default_icon: {
			16: 'icons/page_action_unsupported_16_light.png',
			19: 'icons/page_action_unsupported_19_light.png',
			32: 'icons/page_action_unsupported_32_light.png',
			38: 'icons/page_action_unsupported_38_light.png',
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	},

	background: {
		scripts: ['background/main.js'],
	},

	browser_specific_settings: {
		gecko: {
			id: 'yayuyokitano@web-scrobbler.com',
		},
	},
};
