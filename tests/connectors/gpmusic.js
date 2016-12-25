'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://player.gpmusic.co/playlists/87809',
		playButtonSelector: '.ui-draggable-handle'
	});
};
