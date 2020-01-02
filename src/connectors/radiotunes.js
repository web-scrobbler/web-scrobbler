'use strict';

Connector.playerSelector = '#row-player-controls';

Connector.getArtistTrack = () => {
	const artist = $('.artist-name').text();
	const track = $('.track-name').text();

	if (artist && track) {
		// The 'artist' element contains dash at the end of string.
		const artistTrack = artist + track;
		return Util.splitArtistTrack(artistTrack);
	}

	return null;
};

Connector.playButtonSelector = '.icon-play';

Connector.currentTimeSelector = '.timeinfo .time';

Connector.durationSelector = '.timeinfo .total';

Connector.trackArtSelector = '#art';

Connector.getUniqueID = () => $('.vote-btn').data('track-id');
