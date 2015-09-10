'use strict';

/* global Connector */

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.playing .sc-title';

Connector.isPlaying = function () {
	return $('.sc-remote-link').hasClass('playing');
};
