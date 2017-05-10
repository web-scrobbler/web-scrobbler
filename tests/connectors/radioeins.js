'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.fluxfm.de/stream/#fluxfm/play'
	});
};
