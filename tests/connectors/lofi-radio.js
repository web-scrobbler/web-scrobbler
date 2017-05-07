'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://lofi-radio.co/',
		playButtonSelector: '#play'
	});
};
