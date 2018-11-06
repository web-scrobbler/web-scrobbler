'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://music.youtube.com/watch?v=MyZ4nrqYYDE',
		playButtonSelector: '.ytmusic-player-bar.play-pause-button'
	});
};
