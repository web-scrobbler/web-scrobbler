'use strict';

/**
 * Artist, "Title"
 * Land of Talk, "What Was I Thinking?"
 * @type {Object}
 */
const titleRegEx = /(.+?),\s["'](.+)["']/;

Connector.playerSelector = '.npr-player';

Connector.currentTimeSelector = '.time-elapsed';

Connector.durationSelector = '.time-total';

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

	const rawText = $('.audio-title').text();
	const result = rawText.match(titleRegEx);
	if (result) {
		artist = result[1];
		track = result[2];
	}

	return { artist, track };
};

Connector.isPlaying = () => $('.player-basic').hasClass('is-playing');
