'use strict';

module.exports = (driver, spec) => {
	// iframe
	spec.shouldLoadWebsite(driver, {
		url: 'http://www.rinoceronte.fm/player/?q=2'
	});

	// iframe
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://nowplaying.mediastre.am/station/52f95ba874f267492a000041?_=n'
	});
};
