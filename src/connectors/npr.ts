export {};

/**
 * Artist, "Title"
 * Land of Talk, "What Was I Thinking?"
 */
const titleRegEx = /(.+?),\s["'](.+)["']/;

Connector.playerSelector = '.npr-player';

Connector.currentTimeSelector = '.time-elapsed';

Connector.durationSelector = '.time-total';

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

	const rawText = Util.getTextFromSelectors('.audio-title');
	const result = rawText?.match(titleRegEx);
	if (result) {
		artist = result[1];
		track = result[2];
	}

	return { artist, track };
};

Connector.isPlaying = () => Util.hasElementClass('.player-basic', 'is-playing');
