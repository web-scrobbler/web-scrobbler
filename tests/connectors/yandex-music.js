'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://music.yandex.ru/album/2236111',
		playButtonSelector: '.button2__label'
	});
};
