'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.earbits.com/',
		playButtonSelector: '.collection'
	});
};
