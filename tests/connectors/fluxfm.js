'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.fluxfm.de/stream/#fluxfm/play'
	});
};
