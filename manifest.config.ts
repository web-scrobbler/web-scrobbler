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

	action: {
		default_icon: {
			'19': 'icons/page_action_unsupported_19.png',
			'38': 'icons/page_action_unsupported_38.png',
		},
		default_title: '__MSG_pageActionUnsupported__',
		default_popup: 'src/ui/popup/index.html',
	},

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
};

export const chromeManifest: Manifest.WebExtensionManifest = {
	...common,

	icons: browserIcons('chrome'),
};

export const safariManifest: Manifest.WebExtensionManifest = {
	...common,

	icons: browserIcons('safari'),
};

export const firefoxManifest: Manifest.WebExtensionManifest = {
	...common,

	icons: browserIcons('firefox'),

	background: {
		scripts: ['background/main.js'],
	},

	browser_specific_settings: {
		gecko: {
			id: 'yayuyokitano@web-scrobbler.com',
		},
	},
};

function browserIcons(browser: string) {
	return {
		16: 'icons/icon_generic_16.png',
		48: `icons/icon_${browser}_48.png`,
		128: `icons/icon_${browser}_128.png`,
		256: `icons/icon_${browser}_256.png`,
		512: `icons/icon_${browser}_512.png`,
	};
}
