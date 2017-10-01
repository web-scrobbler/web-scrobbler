'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.nova.fr/',
		playButtonSelector: '.play-btn'
	});
};
