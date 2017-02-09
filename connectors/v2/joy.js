'use strict';

/* global Connector */

const DEFAULT_TRACK_ART = 'no-image-50.jpg';

Connector.playerSelector = '.container';

Connector.artistSelector = '.artist';

Connector.trackSelector = '.song';

Connector.getTrackArt = function() {
	let trackArtUrl = $('.cd-art img').attr('src');
	if (isDefaultTrackArt(trackArtUrl)) {
		return null;
	}

	return trackArtUrl;
};

Connector.isPlaying = function() {
	return $('.fa-play-circle').length === 0;
};

function isDefaultTrackArt(trackArtUrl) {
	let trackArtFileName = trackArtUrl.split('/').pop();
	return trackArtFileName === DEFAULT_TRACK_ART;
}
