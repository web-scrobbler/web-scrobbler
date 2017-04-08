'use strict';

/* global Connector */

const DEFAULT_TRACK_ART = 'nocover.png';

Connector.playerSelector = '#player';

Connector.artistSelector = '#trackartist';

Connector.trackSelector = '#tracktitle';

Connector.playButtonSelector = '#asp-play';

Connector.getTrackArt = function() {
	let trackArtUrl = $('#trackimageurl').attr('src');
	if (isDefaultTrackArt(trackArtUrl)) {
		return null;
	}

	return trackArtUrl;
};

function isDefaultTrackArt(trackArtUrl) {
	let trackArtFileName = trackArtUrl.split('/').pop();
	return trackArtFileName === DEFAULT_TRACK_ART;
}
