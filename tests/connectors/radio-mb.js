'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://beta.radio-mb.com/',
		playButtonSelector: '.fa-play-circle'
	});
};
