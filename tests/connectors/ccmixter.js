'use strict';

module.exports = (driver, spec) => {

	// Beta player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://beta.ccmixter.org/tree',
		playButtonSelector: '.play-button'
	});

	// TuneTrack player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://tunetrack.net',
		playButtonSelector: '.play-btn button:contains(Pause)'
	});

	// cc player
	spec.shouldContainPlayerElement(driver, {
		url: 'http://ccmixter.org/view/media/remix',
		playButtonSelector: '.cc_player_button'
	});
};
