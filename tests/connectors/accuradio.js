'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.accuradio.com/',
		playButtonSelector: '.channel.featured',
		waitUntil: isPlayerLoaded
	});

	function isPlayerLoaded() {
		return driver.findElement('#albumArtImg').then((albumArt) => {
			return albumArt.isDisplayed();
		});
	}
};
