'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.wwoz.org/listen/player/',
		playButtonSelector: '.jp-pause' // Force DOM change
	});
};
