'use strict';

module.exports = function(driver, connectorSpec) {
	// artist player
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://mideastunes.com/',
		playButtonSelector: '.feat-slide-container:nth-child(1) .feat-col:nth-child(1) .feat-play-all'
	});
	// map player
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://map.mideastunes.com/?lang=en',
		playButtonSelector: '.play-button'
	});
};
