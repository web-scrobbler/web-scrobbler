'use strict';

function setupPlaylistPlayer() {
	Connector.playerSelector = '#audio_player_section';

	Connector.artistSelector = '#hpPlayer-bandName';

	Connector.trackSelector = '#hpPlayer-trackName';

	Connector.albumSelector = '#hpPlayer-albumName';

	Connector.trackArtSelector = '#hpPlayer-img';

	Connector.currentTimeSelector = '#hpPlayer-currentTimeText';

	Connector.durationSelector = '#hpPlayer-trackLengthString';

	Connector.playButtonSelector = '#hpPlayer-play';
}

function isPlaylist() {
	return $('#audio_player_section audio').attr('id') === 'hpPlayer-player';
}

function setupAlbumPlayer() {
	Connector.playerSelector = '#audio_player_section';

	Connector.artistSelector = 'section a.genres';

	Connector.trackSelector = '#albumPlayer-trackName';

	Connector.albumSelector = '#albumPlayer-albumName';

	Connector.trackArtSelector = '.cc-profile-photo .visible-xs img';

	Connector.currentTimeSelector = '#albumPlayer-currentTimeText';

	Connector.durationSelector = '#albumPlayer-trackLengthString';

	Connector.playButtonSelector = '#albumPlayer-play';
}

function isAlbum() {
	return $('#audio_player_section audio').attr('id') === 'albumPlayer-player';
}

function setupBandPagePlayer() {
	Connector.playerSelector = '#audio_player_section';

	Connector.artistSelector = 'h1';

	Connector.trackSelector = '#bandPlayer-trackName';

	Connector.albumSelector = '#bandPlayer-albumName';

	Connector.trackArtSelector = '.cc-profile-photo .visible-xs img';

	Connector.currentTimeSelector = '#bandPlayer-currentTimeText';

	Connector.durationSelector = '#bandPlayer-trackLengthString';

	Connector.playButtonSelector = '#bandPlayer-play';
}

function isBandPage() {
	return $('#audio_player_section audio').attr('id') === 'bandPlayer-player';
}

function setupConnector() {
	if (isPlaylist()) {
		setupPlaylistPlayer();
	} else if (isAlbum()) {
		setupAlbumPlayer();
	} else if (isBandPage()) {
		setupBandPagePlayer();
	} else {
		console.log('FairPriceMusic connector: unknown player');
	}
}

setupConnector();
