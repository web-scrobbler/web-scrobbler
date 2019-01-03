'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://www.thatstation.net/listen-live/',
		playButtonSelector: 'button.fa-play'
	});
};
