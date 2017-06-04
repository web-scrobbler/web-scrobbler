'use strict';

/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		vendor: '/vendor',
		jquery: '/vendor/jquery.min',
		canjs: '/vendor/can.jquery.min',
		bootstrap: '/vendor/bootstrap/bootstrap.min',
		connectors: '/core/connectors'
	},
	shim: {
		bootstrap: {
			deps: ['jquery']
		},
		canjs: {
			deps: ['jquery']
		},
	},
	waitSeconds: 0
});
