'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radiovolna.net/11-europa-plus.html',
	});

	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://radiovolna.net/song/605514-attention.html',
		playButtonSelector: '.jp-play',
	});
};
