'use strict';

/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		md5: '/vendor/md5.min',
		vendor: '/vendor',
		jquery: '/vendor/jquery.min',
		options: '/ui/options',
		bootstrap: '/vendor/bootstrap/js/bootstrap.bundle.min',
		connectors: '/core/connectors',

		'webextension-polyfill': '/vendor/browser-polyfill.min',
	},
	shim: {
		bootstrap: {
			deps: ['jquery'],
		},
	},
	waitSeconds: 0,
});
