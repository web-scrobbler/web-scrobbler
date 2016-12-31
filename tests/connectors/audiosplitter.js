'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://audiosplitter.fm/tracks/10062553',
		playButtonSelector: '.track-banner-tile .as-icon-play'
	});
};
