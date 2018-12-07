'use strict';

/**
 * Artist, "Title"
 * Land of Talk, "What Was I Thinking?"
 * @type {RegEx}
 */
const titleRegEx = /(.+?),\s["'](.+)["']/;

Connector.playerSelector = '.npr-player';

Connector.currentTimeSelector = '.time-elapsed';

Connector.durationSelector = '.time-total';

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

	let rawText = $('.item-current').text();
	let result = rawText.match(titleRegEx);
	if (result) {
		artist = result[1];
		track = result[2];
	}

	return { artist, track };
};

Connector.isPlaying = () => $('.player-basic').hasClass('is-playing');
