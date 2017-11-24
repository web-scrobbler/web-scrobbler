'use strict';

module.exports = function(driver, connectorSpec) {
	// center player
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://soundsession.center/station/?station=indie'
	});
	// station player
	connectorSpec.shouldContainPlayerElement(driver, {
		url: 'http://litesoundsession.com/'
	});
};
