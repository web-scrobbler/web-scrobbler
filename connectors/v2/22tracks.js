'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.artistTrackSelector = '.player__progress__title';

Connector.isPlaying = function () {
	return $('.icon-pause').length;
};
