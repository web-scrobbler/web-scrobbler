'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://dewtone.com/',
		playButtonSelector: '#footer-player-play',
	});
};
