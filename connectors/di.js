'use strict';

/* global Connector, Util */

Connector.playerSelector = '#webplayer-region';

Connector.playButtonSelector = '.ico icon-play';

Connector.timeInfoSelector = '.timecode';

Connector.getArtistTrack = () => {
	let text = $('.track-name').attr('title');
	return Util.splitArtistTrack(text);
};

Connector.getTrackArt = () => {
	let trackArtUrl = $('.track-region .artwork img').attr('src');
	if (trackArtUrl) {
		// Remove 'size' param
		trackArtUrl = trackArtUrl.split('?')[0];
		return `http:${trackArtUrl}`;
	}
	return null;
};
