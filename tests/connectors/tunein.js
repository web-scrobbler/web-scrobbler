'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://tunein.com/radio/70s-Hits-s249944/'
	});
};
