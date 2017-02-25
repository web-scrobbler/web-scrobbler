'use strict';

module.exports = function (driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.fairpricemusic.com',
		playButtonSelector: '#hpPlayer-play'
	});
};
