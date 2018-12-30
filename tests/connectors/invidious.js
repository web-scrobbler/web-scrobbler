'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://invidio.us/watch?v=LbQSzs11euk',
		playButtonSelector: '.vjs-poster'
	});
};
