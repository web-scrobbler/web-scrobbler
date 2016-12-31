'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.jamendo.com/ru/track/1258976/liquid-blue',
		playButtonSelector: '.js-play-me i.icon-play'
	});
};
