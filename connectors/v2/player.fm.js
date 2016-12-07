'use strict';

/* global Connector */

Connector.playerSelector = '.miniplayer';

Connector.artistSelector = '.current-series-link';

Connector.trackSelector = '.current-episode-link';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
