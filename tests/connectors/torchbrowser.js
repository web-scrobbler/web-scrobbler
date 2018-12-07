'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://music.torchbrowser.com/',
		playButtonSelector: '.item_play_button'
	});
};
