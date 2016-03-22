'use strict';

/* global Connector */

Connector.playerSelector = '.player-meta';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-title';

Connector.getTrackArt = function() {
	return $('.cover img').attr('src');
};

Connector.isPlaying = function () {
	return $('.player-play').attr('disabled') === 'disabled';
};
