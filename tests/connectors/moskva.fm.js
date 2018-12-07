'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://moskva.fm/internet-radio/eurohit',
		playButtonSelector: '.aplayer_button_play'
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://piter.fm/internet-radio/retro_hits',
		playButtonSelector: '.aplayer_button_play'
	});
};
