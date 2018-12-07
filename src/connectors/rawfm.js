'use strict';

Connector.playerSelector = '.holder';

Connector.getArtistTrack = () => {
	let artist = $('#song_info h2').text();
	let track = $('#song_info h3').text();

	if (artist === 'rawPlayer' || artist === 'loading...') {
		return Util.makeEmptyArtistTrack();
	}
	if (track === 'Standard Definition Audio' || track === 'High Definition Audio') {
		return Util.makeEmptyArtistTrack();
	}
	return { artist, track };
};

Connector.isPlaying = () => $('#play1 img').attr('src').includes('stop');
