'use strict';

module.exports = function(driver, connectorSpec) {
	// Auth is required + geolocation restriction
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://play.spotify.com/'
	});
};
