'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.anghami.com/playlist/14',
		playButtonSelector: '.icon-play-circle'
	});
};
