'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://hypem.com/premiere/the+stevens',
		playButtonSelector: '.icon-play'
	});
};
