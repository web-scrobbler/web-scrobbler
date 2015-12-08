'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = 'h1';

Connector.trackSelector = '.jp-title';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
