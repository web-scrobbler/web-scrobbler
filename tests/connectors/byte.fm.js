'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'https://www.byte.fm/',
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.byte.fm/player/live/',
		playButtonSelector: '.player-play'
	});
};
