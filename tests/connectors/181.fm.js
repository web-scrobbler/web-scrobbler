'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://181fm.mystreamplayer.com/?autoplay=13'
	});
};
