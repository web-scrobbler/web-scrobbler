'use strict';

/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		vendor: '/vendor',
		jquery: '/vendor/jquery-2.1.0.min',
		canjs: '/vendor/can.custom',
		bootstrap: '/vendor/bootstrap.min',
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
