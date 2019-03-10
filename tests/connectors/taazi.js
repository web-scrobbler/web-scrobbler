'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://taazi.com/discover',
		playButtonSelector: '.mejs__playpause-button'
	});
};
