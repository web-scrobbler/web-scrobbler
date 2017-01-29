'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.accuradio.com/pop_player/accujazz/3064/',
		waitUntil: isAdPlayed
	});

	function isAdPlayed() {
		return driver.findElement('#statusLabel').then((element) => {
			return element.getText();
		}).then((statusLabel) => {
			return statusLabel === 'Playing';
		});
	}
};
