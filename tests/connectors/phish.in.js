'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://phish.in/1999-09-14',
		playButtonSelector: '#control_playpause'
	});
};
