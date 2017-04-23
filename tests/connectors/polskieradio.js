'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://moje.polskieradio.pl/station/44/Led-Zeppelin'
	});
};
