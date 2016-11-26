'use strict';

module.exports = function(driver, connectorSpec) {
	// Check if dummy pattern is useful
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://www.egofm.de/'
	});

	// Contains Anti-adblock script
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://player.addradio.de/player/2366'
	});
};
