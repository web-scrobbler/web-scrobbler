'use strict';

/* global Connector */
Connector.playerSelector = '.player-controls'; //playerSelector and isPlaying required
Connector.playButtonSelector = '.player-controls .play';
Connector.durationSelector = '.player-duration-duration';

Connector.isPlaying = function() {
	if ($('.player-controls .icon-play').length == 1) {
		return false;
	} else {
		return true;
	}
};

Connector.getTrackArt = function() {
	if ($('body').attr('data-modal-name')) {
		return 'https:' + $('.dialog-fullscreen-player-art').attr('src').split('?')[0] || null;
	} else {
		return 'https:' + $('.player-left .player-art img').attr('src').split('?')[0] || null;
	}
};

Connector.getArtist = function() {
	return $('.dialog-fullscreen-player-now-playing h2 a').text() || $('.player-left .player-artist').text() || null;
};

Connector.getTrack = function() {
	return $('.dialog-fullscreen-player-now-playing .player-song').text() || $('.player-left .player-song').text() || null;
};

Connector.getUniqueID = function() {
	return $('.player-left .player-song').attr('href') || $('.dialog-fullscreen-player-now-playing .type-secondary a').attr('href') || null;
};

Connector.isStateChangeAllowed = function() { //this errors on page load at first
	try {
		return !Connector.getTrack().startsWith('Thanks for listening to');
	} catch (e) {
		console.log(e.message);
	}
};
