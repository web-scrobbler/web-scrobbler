'use strict';

module.exports = function(driver, connectorSpec) {
	// /vol or /music
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.luoo.net/music/854'
	});
	// essay
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.luoo.net/essay/915'
	});
	// musician
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.luoo.net/musician/'
	});
	// search
	connectorSpec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.luoo.net/search/?q=love&t=single',
		playButtonSelector: '.icon-search-play'
	});
};
