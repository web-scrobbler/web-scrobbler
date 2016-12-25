'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.trntbl.me/theohpioneer',
		playButtonSelector: '#play-pause'
	});
};
