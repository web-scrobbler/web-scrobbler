'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.getTrackArt = function() {
	return $('#playerBarArt').attr('src') ||
		$('#playingAlbumArt').attr('src') || null;
};

Connector.artistSelector = '#player-artist';

Connector.getTrack = function() {
	return $('#currently-playing-title').text() ||
		$('#player-song-title').text() || null;
};

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = function() {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};

Connector.isStateChangeAllowed = function() {
	return Connector.getArtist() !== 'Subscribe to go ad-free';
};
