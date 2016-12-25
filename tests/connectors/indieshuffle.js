'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.indieshuffle.com/playlists/album-stream-odesza-in-return-1/',
		playButtonSelector: '.feature-commontrack'
	});
};
