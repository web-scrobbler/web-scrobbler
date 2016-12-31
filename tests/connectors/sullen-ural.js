'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://sacrificia.sullen-ural.ru/palatium-oblivionis',
		playButtonSelector: '.has-controls .play'
	});
};
