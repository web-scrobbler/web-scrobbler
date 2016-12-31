'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radio.obozrevatel.com/playlists-music/splin-2016-klyuch-k-shifru-419.html',
		playButtonSelector: '.play-controls .play'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radio.obozrevatel.com/player/7'
	});
};
