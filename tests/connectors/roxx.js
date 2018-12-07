'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://roxx.gr/radio/',
		playButtonSelector: '.icon-play'
	});
};
