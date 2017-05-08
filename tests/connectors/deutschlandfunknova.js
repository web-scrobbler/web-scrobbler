'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.deutschlandfunknova.de/',
		playButtonSelector: '.jp-play'
	});
};
