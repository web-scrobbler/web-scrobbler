'use strict';

module.exports = function(driver, connectorSpec) {
	// PC
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radiooooo.com'
	});
	// Mobile
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://mobile.radiooooo.com'
	});
};
