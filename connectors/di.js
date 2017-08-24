'use strict';

Connector.playerSelector = '#webplayer-region';

Connector.playButtonSelector = '.ico icon-play';

Connector.currentTimeSelector = '.timecode .time';

Connector.durationSelector = '.timecode .total';

Connector.getArtistTrack = () => {
	let artistWithDash = $('.artist-name').text();
	let track = $('.track-name').text();

	if (artistWithDash && track) {
		return Util.splitArtistTrack(artistWithDash + track);
	}

	return Util.emptyArtistTrack;
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
