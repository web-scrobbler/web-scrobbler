'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.radiobonton.cz/cs/index.shtml',
		playButtonSelector: '#playtoggle'
	});
	// DanceRadio sometimes plays unrecognizable tracks
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://www.danceradio.cz/cs/dance-radio-online.shtml'
	});
};
