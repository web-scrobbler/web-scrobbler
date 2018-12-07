'use strict';

module.exports = function(driver, connectorSpec) {
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://bemusic.vebto.com/album/12/Twenty+One+Pilots/Blurryface',
		playButtonSelector: '.play-button'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://groovemp3.com/album/Twenty+One+Pilots/Blurryface',
		playButtonSelector: '.actions .icon.icon-play'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://ytmp3.fun/album/93700/Yowler/Black+Dog+In+My+Path',
		playButtonSelector: '.actions .icon.icon-play'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://music-hub.ca/Player/album/148/snavs/lonely+street',
		playButtonSelector: '.play-button'
	});

	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://loud.zone/artist/5095/The+Beatles',
		playButtonSelector: '.icon-play'
	});
};
