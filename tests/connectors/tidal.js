'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://listen.tidal.com/',
		playButtonSelector: '.track-list .icon-play-circle'
	});
};
