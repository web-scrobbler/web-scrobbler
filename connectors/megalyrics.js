'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#pr_title';

Connector.timeInfoSelector = '#pr_time';

Connector.isPlaying = function () {
	return $('#pr_play').hasClass('playing');
};
