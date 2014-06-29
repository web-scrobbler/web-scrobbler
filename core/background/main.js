'use strict';

/**
 * Background script entry point
 */
require([
	'legacy/scrobbler',
	'background-ga',
	'inject'
], function(legacyScrobbler, ga) {

	// track background page loaded - happens once per browser session
	ga.send('pageview');

//	ga.send('event', 'test-category', 'test-action');

});
