'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://listen.tidal.com/',
		playButtonSelector: '.table__cover-figure'
	});
};
