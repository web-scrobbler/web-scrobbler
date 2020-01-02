'use strict';

Connector.playerSelector = '.holder';

Connector.getArtistTrack = () => {
	const artist = $('#song_info h2').text();
	const track = $('#song_info h3').text();

	if (artist === 'rawPlayer' || artist === 'loading...') {
		return null;
	}
	if (track === 'Standard Definition Audio' || track === 'High Definition Audio') {
		return null;
	}
	return { artist, track };
};

Connector.isPlaying = () => $('#play1 img').attr('src').includes('stop');
