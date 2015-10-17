'use strict';

/* global Connector */

Connector.playerSelector = '#controlbar > :first-child';

Connector.artistTrackSelector = '.title .player-content-color';

Connector.isPlaying = function () {
	return $('.icon-putpat-pause').length;
};
