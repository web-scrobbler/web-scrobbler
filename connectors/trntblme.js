'use strict';

/* global Connector */

Connector.playerSelector = '#turntable';
Connector.isPlaying = function() {
	return $('#play-pause').hasClass('pause');
};
Connector.artistTrackSelector = '#artist-song';
Connector.currentTimeSelector = '#time-elapsed';
