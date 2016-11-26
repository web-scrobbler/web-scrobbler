'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://dreamfm.biz',
		waitUntil: isPlayerLoaded
	});

	function isPlayerLoaded() {
		return driver.findElement('#nextbtn').then((button) => {
			return button.isDisplayed();
		});
	}
};
