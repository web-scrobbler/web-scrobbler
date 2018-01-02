'use strict';

Connector.playerSelector = '.footer_player';

Connector.getArtistTrack = () => {
	let track = $('#footer_player_track').text();
	let artistTrack = Util.splitArtistTrack(track);

	if (Util.isArtistTrackEmpty(artistTrack)) {
		let artist = $('#footer_player_artist').text();
		return { artist, track };
	}

	return artistTrack;
};

Connector.isPlaying = () => $('#footer_play_button').hasClass('playing');
