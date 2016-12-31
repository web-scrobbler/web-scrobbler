'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://reddit.musicplayer.io/',
		playButtonSelector: '.ui.controls .play'
	});
};
