'use strict';

module.exports = (driver, spec) => {
	spec.shouldLoadWebsite(driver, {
		url: 'https://kollekt.fm/'
	});

	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://community.kollekt.fm/playlist/16885',
		playButtonSelector: '.fa-play'
	});
};
