'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://play.google.com/music/listen'
	});
};
