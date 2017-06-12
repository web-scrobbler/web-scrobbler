'use strict';

/* global Connector, Util */

Connector.playerSelector = '#row-player-controls';

Connector.getArtistTrack = () => {
	let artist = $('.artist-name').text();
	let track = $('.track-name').text();

	if (artist && track) {
		// The 'artist' element contains dash at the end of string.
		let artistTrack = artist + track;
		return Util.splitArtistTrack(artistTrack);
	}

	return Util.emptyArtistTrack;
};

Connector.isPlaying = () => {
	return $('#webplayer-region').attr('data-state') === 'playing';
};
