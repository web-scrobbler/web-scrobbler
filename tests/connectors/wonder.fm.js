'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://primary.fm',
		playButtonSelector: '.player-play',
		forceJsClick: true
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://white-label.fm',
		playButtonSelector: '.player-play',
		forceJsClick: true
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://wonder.fm',
		playButtonSelector: '.player-play',
		forceJsClick: true
	});
};
