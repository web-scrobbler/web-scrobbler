'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://withinmymind.bandcamp.com/track/within-my-mind',
		playButtonSelector: '.playbutton'
	});
};
