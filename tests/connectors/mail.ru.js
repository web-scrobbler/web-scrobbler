'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://my.mail.ru/music',
		playButtonSelector: '.l-music__player__controls-player__item.play'
	});
};
