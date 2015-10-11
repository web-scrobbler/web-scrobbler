'use strict';

/* global Connector */

Connector.playerSelector = '#app';

Connector.artistTrackSelector = '#now-playing-media .bar-value';

Connector.isPlaying = function () {
	return !$('#playback-controls').hasClass('snoozed');
};
