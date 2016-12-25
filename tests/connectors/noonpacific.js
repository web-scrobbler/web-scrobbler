'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://noonpacific.com/',
		playButtonSelector: '.audio-player__play .fa-play'
	});
};
