'use strict';

/* global Connector */

Connector.playerSelector = '#plHelpers';

Connector.artistTrackSelector = '.videoTitle.noColorLink';

Connector.isPlaying = function () {
	return $('.play').hasClass('pause');
};
