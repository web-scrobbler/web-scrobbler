'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.rawfm.com.au/stream/playernc/',
		waitUntil: isPlayerLoaded
	});

	function isPlayerLoaded() {
		return driver.findElement('#song_info h2').then((artistElement) => {
			return artistElement.getText((artist) => {
				return artist !== 'rawPlayer';
			});
		});
	}
};
