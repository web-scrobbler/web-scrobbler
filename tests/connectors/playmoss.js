'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://playmoss.com/en/floating-points/playlist/good-fridays-by-floating-points'
	});
};
