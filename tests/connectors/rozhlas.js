'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://prehravac.rozhlas.cz/radiowave',
		playButtonSelector: '.is-paused'
	});
};
