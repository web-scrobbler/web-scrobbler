'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required + geolocation restriction
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://open.spotify.com/'
	});
};
