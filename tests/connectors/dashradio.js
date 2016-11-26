'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://dashradio.com/',
		playButtonSelector: '#main-player #forward'
	});
};
