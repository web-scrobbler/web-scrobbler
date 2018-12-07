'use strict';

module.exports = function(driver, connectorSpec) {
	// radio player
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://vagalume.fm/',
		playButtonSelector: '.ion-play'
	});
	// video player, albums
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.vagalume.com.br/coldplay/discografia/',
		playButtonSelector: '.btn.play'
	});
	// video player, single
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.vagalume.com.br/sam-smith/too-good-at-goodbyes.html',
		playButtonSelector: '.btn.play'
	});
	// video player, playlist
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://meu.vagalume.com.br/sitevagalume/playlist/6123243/',
		playButtonSelector: '.vBtn.play'
	});
	// video site, list songs FM
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.vagalume.com.br/radio/coca-cola-fm/'
	});
};
