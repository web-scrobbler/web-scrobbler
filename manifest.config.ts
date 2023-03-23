import { Manifest } from 'webextension-polyfill';
import pkg from './package.json';

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

	web_accessible_resources: [
		{
			resources: ['connectors/*'],
			matches: ['<all_urls>'],
		},
	],

	action: {
		default_icon: {
			'19': 'icons/page_action_unsupported_19.png',
			'38': 'icons/page_action_unsupported_38.png',
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	},

	options_ui: {
		page: 'src/ui/options/index.html',
		open_in_tab: true,
	},
};

export const chromeSafariCommon: Manifest.WebExtensionManifest = {
	...common,

	background: {
		service_worker: 'background/main.js',
	},
};

export const chromeManifest: Manifest.WebExtensionManifest = {
	...chromeSafariCommon,

	icons: {
		16: 'icons/icon_generic_16.png',
		48: 'icons/icon_chrome_48.png',
		128: 'icons/icon_chrome_128.png',
		256: 'icons/icon_chrome_256.png',
		512: 'icons/icon_chrome_512.png',
	},
};

export const safariManifest: Manifest.WebExtensionManifest = {
	...chromeSafariCommon,

	background: {
		service_worker: 'background/main.js',
	},

	icons: {
		16: 'icons/icon_generic_16.png',
		48: 'icons/icon_safari_48.png',
		128: 'icons/icon_safari_128.png',
		256: 'icons/icon_safari_256.png',
		512: 'icons/icon_safari_512.png',
	},
};

export const firefoxManifest: Manifest.WebExtensionManifest = {
	...common,

	background: {
		scripts: ['background/main.js'],
	},

	icons: {
		16: 'icons/icon_generic_16.png',
		48: 'icons/icon_firefox_48.png',
		128: 'icons/icon_firefox_128.png',
		256: 'icons/icon_firefox_256.png',
		512: 'icons/icon_firefox_512.png',
	},

	browser_specific_settings: {
		gecko: {
			id: 'yayuyokitano@web-scrobbler.com',
		},
	},
};
