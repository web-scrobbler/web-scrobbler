'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://ghostly.com/discovery/play',
		playButtonSelector: '.button'
	});
};
