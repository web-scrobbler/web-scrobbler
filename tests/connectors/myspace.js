'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://myspace.com/conniedover/music/songs',
		playButtonSelector: '#artistsongs .playBtn'
	});
};
