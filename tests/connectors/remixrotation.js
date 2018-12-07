'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://remixrotation.com/channels/pop.html',
		playButtonSelector: '#playMediaMaster'
	});
};
