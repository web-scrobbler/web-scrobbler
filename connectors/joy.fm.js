'use strict';

/* global Connector */

const DEFAULT_TRACK_ART = 'no-image-50.jpg';

Connector.playerSelector = '.container';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.song';

Connector.trackArtSelector = '.cd-art img';

Connector.isTrackArtDefault = (url) => url.endsWith(DEFAULT_TRACK_ART);

Connector.isPlaying = function() {
	return $('.fa-play-circle').length === 0;
};
