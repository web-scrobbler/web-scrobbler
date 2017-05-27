'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://www.radiobonton.cz/cs/index.shtml',
		playButtonSelector: '#playtoggle'
	});
};
