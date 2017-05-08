'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.byte.fm/player/live/',
		playButtonSelector: '.player-play'
	});
};
