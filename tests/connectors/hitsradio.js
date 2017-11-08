'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://hitsradio.com',
		playButtonSelector: 'li.flex a.ng-binding:eq(0)'
	});
};
