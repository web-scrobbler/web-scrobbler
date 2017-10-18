'use strict';

Connector.playerSelector = '#row-player-controls';

Connector.getArtistTrack = () => {
	let artist = $('.artist-name').text();
	let track = $('.track-name').text();

	if (artist && track) {
		// The 'artist' element contains dash at the end of string.
		let artistTrack = artist + track;
		return Util.splitArtistTrack(artistTrack);
	}

	return Util.makeEmptyArtistTrack();
};

Connector.playButtonSelector = '.icon-play';

Connector.currentTimeSelector = '.timeinfo .time';

Connector.durationSelector = '.timeinfo .total';

Connector.trackArtSelector = '#art';

Connector.getUniqueID = () => $('.vote-btn').data('track-id');
