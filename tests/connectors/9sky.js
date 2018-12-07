'use strict';

module.exports = (driver, spec) => {
	// audio
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.9sky.com/music?ids=5512'
	});
	// video
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.9sky.com/mv/detail?id=322'
	});
};
