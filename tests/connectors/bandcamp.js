'use strict';

module.exports = function(driver, connectorSpec) {
	// Bandcamp Weekly
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://bandcamp.com/?show=1',
		playButtonSelector: '.play-btn'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://withinmymind.bandcamp.com/track/within-my-mind',
		playButtonSelector: '.playbutton'
	});
};
