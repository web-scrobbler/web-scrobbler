'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://ambientsleepingpill.com/',
		playButtonSelector: '#play'
	});
};
