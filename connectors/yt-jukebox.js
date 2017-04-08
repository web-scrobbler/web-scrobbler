'use strict';

/* global Connector */

Connector.playerSelector = '#playerControls';

Connector.artistTrackSelector = '#videoTitle';

Connector.isPlaying = function () {
	return $('.ui-slider-range').width() > 0;
};
