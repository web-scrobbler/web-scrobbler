'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.reverbnation.com/collection/397-reverbnation-explores-alternative',
		playButtonSelector: '.wrap .button--play'
	});
};
