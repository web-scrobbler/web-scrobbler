'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.npr.org/2017/05/11/527657111/first-listen-land-of-talk-life-after-youth',
		playButtonSelector: '.audio-module-controls .audio-module-listen'
	});
};
