'use strict';

module.exports = function(driver, connectorSpec) {
	let playButtonSelector = '.track-play-btn';

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://primary.fm',
		playButtonSelector
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://white-label.fm',
		playButtonSelector
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://wonder.fm',
		playButtonSelector
	});
};
