'use strict';

/* global Connector */

function setupPlaylistPlayer() {
	Connector.playerSelector = '#playerContainer';

	Connector.artistTrackSelector = '#jp_playlist_1 .ovr';

	Connector.isPlaying = function () {
		return $('.jp-pause').is(':visible');
	};
}

function setupRadioPlayer() {
	Connector.playerSelector = '#radio-player';

	Connector.artistSelector = '.playing .artist';

	Connector.trackSelector = '.playing .song';

	Connector.playButtonSelector = '.icon-player-play';

	Connector.currentTimeSelector = '.jp-current-time';

	Connector.durationSelector = '.jp-duration';

	Connector.isStateChangeAllowed = function() {
		return Connector.getCurrentTime() > 0;
	};
}

function isPlaylistPlayer() {
	return $('body').hasClass('pl');
}

/**
 * Example: http://www.daytrotter.com/radio.html?playlistid=1239601&trackid=4893828
 */
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
