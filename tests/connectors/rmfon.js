'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.rmfon.pl/play,39',
		waitUntil: isAdVideoPlayed,
		waitUntilTimeout: 40000
	});

	function isAdVideoPlayed() {
		return driver.findElement('#atds-player')
			.then(() => false).catch(() => true);
	}
};
