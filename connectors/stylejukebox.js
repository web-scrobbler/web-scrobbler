'use strict';

const DEFAULT_TRACK_ART = 'defaultAlbum.jpg';

Connector.artistSelector = '.song-artist';

Connector.trackSelector = '.song-title';

Connector.currentTimeSelector = '.seeking-time > div:first-child';

Connector.durationSelector = '.seeking-time > div:last-child';

Connector.playerSelector = 'audio-player';

Connector.trackArtSelector = '.playerAlbumArt > img';

Connector.isTrackArtDefault = (url) => url.endsWith(DEFAULT_TRACK_ART);

Connector.isPlaying = function () {
	// Check pause button visibility instead of play button invisibility,
	// to avoid automatic scrobbling on startup
	return $('.pause-button').is(':visible');
};
