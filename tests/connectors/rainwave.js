'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://rainwave.cc/',
		playButtonSelector: '.audio_icon_play'
	});
};
