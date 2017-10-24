'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://jetsetradio.live/',
		playButtonSelector: 'body'
	});
};
