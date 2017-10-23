'use strict';

module.exports = (driver, spec) => {

	// Beta player
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://beta.ccmixter.org/tree',
		playButtonSelector: '.play-button'
	});

	// TuneTrack player
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://tunetrack.net',
		playButtonSelector: '.item-play'
	});

	// cc player
	spec.shouldBehaveLikeMusicSite(driver, {
		url: 'http://ccmixter.org/view/media/remix',
		playButtonSelector: '.cc_player_button'
	});
};
