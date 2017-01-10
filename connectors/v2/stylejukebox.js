'use strict';

/* global Connector */


Connector.artistSelector = '.song-artist';

Connector.trackSelector = '.song-title';

Connector.currentTimeSelector = '.seeking-time > div:first-child';

Connector.durationSelector = '.seeking-time > div:last-child';

Connector.playerSelector = 'audio-player';

Connector.trackArtImageSelector = '.playerAlbumArt > img';

Connector.isPlaying = function () {
	// Check pause button visibility instead of play button invisibility,
	// to avoid automatic scrobbling on startup
	return $('.pause-button').is(':visible');
};
