'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://deltaradiouk.co.uk/popout-player'
	});
};
