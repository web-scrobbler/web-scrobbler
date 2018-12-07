'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://radio.yandex.ru/',
		playButtonSelector: '.station-icon__img'
	});
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://radio.yandex.ru/genre/rock'
	});
};
