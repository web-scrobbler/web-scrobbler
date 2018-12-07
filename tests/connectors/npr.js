'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.npr.org/sections/deceptivecadence/2017/05/19/528848600/songs-we-love-the-crossing-the-white-wind',
		playButtonSelector: '.audio-module-controls .audio-module-listen'
	});
};
