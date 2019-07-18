'use strict';

/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		vendor: '/vendor',
		jquery: '/vendor/jquery.min',
		options: '/options',
		bootstrap: '/vendor/bootstrap/bootstrap.min',
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
