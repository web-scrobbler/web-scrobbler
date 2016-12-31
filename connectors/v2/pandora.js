'use strict';

/* global Connector */

Connector.playerSelector = '#playbackControl';

Connector.trackArtImageSelector = '.playerBarArt';

Connector.albumSelector = 'a.playerBarAlbum';

Connector.artistSelector = 'a.playerBarArtist';

Connector.trackSelector = 'a.playerBarSong';

Connector.playButtonSelector = 'div.playButton';

Connector.getDuration = function () {
	return getElapsedTime() + getRemainingTime();
};

Connector.isStateChangeAllowed = function() {
	return getElapsedTime() > 0;
};

function getElapsedTime() {
	let timeStr = $('div.elapsedTime').text();
	return Connector.stringToSeconds(timeStr);
}

function getRemainingTime() {
	// Remove 'minus' sign
	let timeStr = $('div.remainingTime').text().substring(1);
	return Connector.stringToSeconds(timeStr);
}
