'use strict';

function setupPlaylistPlayer() {
	Connector.playerSelector = '#playerContainer';

	Connector.artistTrackSelector = '#jp_playlist_1 .ovr';

	Connector.isPlaying = () => $('.jp-pause').is(':visible');
}

function setupRadioPlayer() {
	Connector.playerSelector = '#radio-player';

	Connector.artistSelector = '.playing .artist';

	Connector.trackSelector = '.playing .song';

	Connector.playButtonSelector = '.icon-player-play';

	Connector.currentTimeSelector = '.jp-current-time';

	Connector.durationSelector = '.jp-duration';

	Connector.getUniqueID = () => {
		let idMatch = /\/(\d+)\.mp3/.exec($('audio').attr('src'));
		return idMatch ? idMatch[1] : null;
	};

}

function isPlaylistPlayer() {
	return $('body').hasClass('pl');
}

// Example: http://daytrotter.com/radio.html?playlistid=1239601&trackid=4893828
function isRadioPlayer() {
	return $('body').hasClass('radio');
}

function setupConnector() {
	if (isPlaylistPlayer()) {
		setupPlaylistPlayer();
	} else if (isRadioPlayer()) {
		setupRadioPlayer();
	} else {
		console.warn('Daytrotter connector: unknown player');
	}
}

setupConnector();
