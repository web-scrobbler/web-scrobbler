'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://patari.pk/home/playlist/58306f6cce80293542c09c43',
		playButtonSelector: '#controls img:first-child'
	});
};
