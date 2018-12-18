'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://my.pcloud.com/',
		playButtonSelector: '#audioplayer[style] .playbackcontrol .pauseplay.play'
	});
};
