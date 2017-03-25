'use strict';

/* global Connector */

const DEFAULT_TRACK_ART = 'nocover.png';

Connector.playerSelector = '#player';

Connector.artistSelector = '#cc_strinfo_trackartist_asp';

Connector.trackSelector = '#cc_strinfo_tracktitle_asp';

Connector.playButtonSelector = '#asp-play';

Connector.getTrackArt = function() {
	let trackArtUrl = $('#cc_strinfo_trackimageurl_asp').attr('src');
	if (isDefaultTrackArt(trackArtUrl)) {
		return null;
	}

	return trackArtUrl;
};

function isDefaultTrackArt(trackArtUrl) {
	let trackArtFileName = trackArtUrl.split('/').pop();
	return trackArtFileName === DEFAULT_TRACK_ART;
}
