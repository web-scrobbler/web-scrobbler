'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://radio.nrk.no/direkte/mp3',
		playButtonSelector: '.ludo-bar__button--playpause '
	});
};
