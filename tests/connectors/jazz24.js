'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldLoadWebsite(driver, {
		url: 'http://www.jazz24.org/'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://v6.player.abacast.net/854'
	});
};
