'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.rmfon.pl/play,39',
		waitUntil: isAdVideoPlayed
	});

	function isAdVideoPlayed() {
		return driver.sleep(30000).then(() => {
			return true;
		});
	}
};
