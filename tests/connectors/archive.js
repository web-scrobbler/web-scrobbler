'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://archive.org/details/tsp2007-06-06.mbho.flac16',
		playButtonSelector: '.jwplay'
	});
};
