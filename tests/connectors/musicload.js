'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.musicload.de/web/album?id=15566965',
		playButtonSelector: '.actions'
	});
};
