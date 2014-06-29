/**
 * Requirejs configuration for all background scripts
 */
require.config({
	baseUrl: '/core/background',
	paths: {
		legacy: '/core/legacy',
		vendor: '/vendor',
		jquery: '/vendor/jquery-2.1.0.min',
		bootstrap: '/vendor/bootstrap.min',
		connectors: '/core/connectors',
		analytics: 'https://www.google-analytics.com/analytics'
	},
	shim: {
		bootstrap: {
			deps: ['jquery']
		}
	}
});
