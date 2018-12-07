'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://fanburst.com/zealyn',
		playButtonSelector: '.large_track_image',
	});

	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://fanburst.com/alltrapnation',
		playButtonSelector: '.large_track_image',
	});
};
