'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '.player--body .artist-name';

Connector.trackSelector = '.player--body .track-title span';

Connector.isPlaying = function () {
	return $('.glyphicon-pause').length;
};
