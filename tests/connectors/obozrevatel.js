'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radio.obozrevatel.com/newplayer/rplaylists/419',
		playButtonSelector: '#file_0 .play-btn'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radio.obozrevatel.com/player/7'
	});
};
