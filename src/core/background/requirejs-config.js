'use strict';

/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		md5: '/vendor/md5.min',
		vendor: '/vendor',
		popups: '/ui/popups',
		options: '/ui/options',
		bootstrap: '/vendor/bootstrap/js/bootstrap.bundle.min',
		connectors: '/core/connectors',

		'webextension-polyfill': '/vendor/browser-polyfill.min',
	},
	waitSeconds: 0,
});
