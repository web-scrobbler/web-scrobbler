'use strict';

module.exports = function(driver, connectorSpec) {
	// Geolocation restriction
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.thisismyjam.com/song/the-smiths/this-charming-man',
		playButtonSelector: '#foundAudioPlay'
	});
};
