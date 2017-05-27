'use strict';

/* global Connector */

const DEFAULT_TRACK_ART = 'https://c.lagardere.cz/dance/100';

Connector.playerSelector = '.b-player';

Connector.artistSelector = '.b-player__artist';

// The `.b-player__name` element contains truncated text.
Connector.getTrack = () => $('.b-player__img img').attr('alt');

Connector.getTrackArt = () => {
	let trackArtUrl = $('.b-player__img img').attr('src');
	if (trackArtUrl !== DEFAULT_TRACK_ART) {
		return trackArtUrl;
	}

	return null;
};

Connector.isPlaying = () => {
	let playButtonEl = $('.b-player__toggle');
	return !(playButtonEl.hasClass('is-paused') ||
		playButtonEl.hasClass('is-loading'));
};
