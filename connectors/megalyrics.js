'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#pr_title';

Connector.currentTimeSelector = '#pr_position';

Connector.getDuration = function() {
	var timeStr = $('#pr_time').text();
	return timeStr.split('/')[1];
};

Connector.isPlaying = function () {
	return $('#pr_play').hasClass('playing');
};
