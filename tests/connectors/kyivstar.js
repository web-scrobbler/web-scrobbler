'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://radio.kyivstar.ua',
		playButtonSelector: '.jp-play'
	});
};
