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

Connector.getArtist = function() { //grab artist and then check for fullscreen player and use page title if found
	var artist = $('.player-left .player-artist').attr('title') || null;
	if ($('body').attr('data-modal-name')) {
		Connector.playerSelector = '.dialog-fullscreen-player-now-playing';
		return $('title').text().split('-')[1].trim();
	}
	return artist;
};

Connector.getTrack = function() { //if is fullscreen player fallback to track title in fullscreen player
	return $('.player-left .player-song').text() ||
		$('.dialog-fullscreen-player-now-playing .player-song').text() || null;
};

Connector.getUniqueID = function() {
	return $('.player-left .player-song').attr('href') || $('.dialog-fullscreen-player-now-playing .type-secondary a').attr('href') || null;
};

Connector.isStateChangeAllowed = function() { //this errors out
	try {
		return !Connector.getTrack().startsWith('Thanks for listening to');
	} catch (e) {
		console.log(e.message);
	}
};
