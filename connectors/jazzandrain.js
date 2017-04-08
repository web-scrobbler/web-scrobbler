'use strict';

/* global Connector */

Connector.playerSelector = '#componentWrapper';

Connector.artistTrackSelector = '.fontMeasure';

Connector.isPlaying = function () {
	return $('.controls_toggle img').attr('src').indexOf('pause') !== -1;
};
