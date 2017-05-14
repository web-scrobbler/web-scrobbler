'use strict';

module.exports = (driver, spec) => {
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'https://lyricstraining.com/play/ed-sheeran/shape-of-you/HbW8nMdnrb#a7w',
		playButtonSelector: '.uix-icon-play2'
	});
};
