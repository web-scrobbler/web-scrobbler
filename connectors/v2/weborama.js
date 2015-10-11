'use strict';

/* global Connector */

Connector.playerSelector = '.h22 > tbody > tr';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#song';

Connector.isPlaying = function () {
	return $('.play').length;
};
