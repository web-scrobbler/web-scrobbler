'use strict';

/* global Connector */

Connector.playerSelector = '#plex';

Connector.artistSelector = '.grandparent-title';

Connector.trackSelector = '.title-container .item-title';

Connector.currentTimeSelector = '.player-position';

Connector.durationSelector = '.player-duration';

Connector.isPlaying = function () {
	return $('.player .play-btn').hasClass('hidden') || false;
};

Connector.getTrackArt = function () {
	return $('.player .media-poster').data('imageUrl') || null;
};

Connector.getAlbum = function () {
	return $('.player .media-poster').data('parentTitle') || null;
};
