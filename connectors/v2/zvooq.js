'use strict';

/* global Connector */

Connector.playerSelector = '.topPanel';

Connector.artistTrackSelector = '.topPanelTimeline-trail > .topPanelTimeline-info .topPanelTimeline-title';

Connector.isPlaying = function () {
	return $('.topPanelPause').length;
};
