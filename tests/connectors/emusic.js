'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.emusic.com/album/94085593/Godspeed-You-Black-Emperor/Luciferian-Towers',
		playButtonSelector: '.play__all__wrapper'
	});
};
