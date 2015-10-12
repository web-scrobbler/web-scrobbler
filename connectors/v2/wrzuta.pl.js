'use strict';

/* global Connector */

Connector.playerSelector = '.npp-skin';

Connector.artistTrackSelector = '.title';

Connector.isPlaying = function () {
	return $('.play').hasClass('playing');
};
