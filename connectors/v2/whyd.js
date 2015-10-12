'use strict';

/* global Connector */

Connector.playerSelector = '.progressPanel';

Connector.artistTrackSelector = '#trackTitle';

Connector.isPlaying = function () {
	return $('#btnPlay').hasClass('playing');
};
