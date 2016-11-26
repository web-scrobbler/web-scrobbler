'use strict';

module.exports = function(driver, connectorSpec) {
	// Geolocation restriction
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://pandora.com/'
	});
};
