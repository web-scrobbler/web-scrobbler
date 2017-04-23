'use strict';

/* global Connector */

Connector.playerSelector = '.drawer-content';
Connector.isPlaying = function() {
	return $('.pulse-hover-play').hasClass('stop');
};
Connector.artistTrackSelector = '.pulse-info h3';
