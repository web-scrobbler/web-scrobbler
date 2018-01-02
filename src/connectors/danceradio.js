'use strict';

const DEFAULT_TRACK_ART = 'https://c.lagardere.cz/dance/100';

Connector.playerSelector = '.b-player';

Connector.artistSelector = '.b-player__artist';

// The `.b-player__name` element contains truncated text.
Connector.getTrack = () => $('.b-player__img img').attr('alt');

Connector.trackArtSelector = '.b-player__img img';

Connector.isTrackArtDefault = (url) => url !== DEFAULT_TRACK_ART;

Connector.isPlaying = () => {
	let playButtonEl = $('.b-player__toggle');
	return !(playButtonEl.hasClass('is-paused') ||
		playButtonEl.hasClass('is-loading'));
};
