'use strict';

/* global Connector */


Connector.artistSelector = '.song-artist';

Connector.trackSelector = '.song-title';

Connector.currentTimeSelector = '.seeking-time > div:first-child';

Connector.durationSelector = '.seeking-time > div:last-child';

Connector.playerSelector = 'audio-player';

Connector.getTrackArt = function () {
	var src = $('.playerAlbumArt > img').attr('src');
	return src.split('/').pop() === 'defaultAlbum.jpg' ? null : src;
};

Connector.isPlaying = function () {
	// Check pause button visibility instead of play button invisibility,
	// to avoid automatic scrobbling on startup
	return $('.pause-button').is(':visible');
};
