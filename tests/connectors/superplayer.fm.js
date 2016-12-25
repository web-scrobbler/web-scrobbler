'use strict';

module.exports = function(driver, connectorSpec) {
	// Geolocation restriction
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://www.superplayer.fm/player'
	});
};
