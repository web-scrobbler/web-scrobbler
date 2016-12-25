'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://zenplayer.audio/?v=03O2yKUgrKw'
	});
};
