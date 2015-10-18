'use strict';

/* global Connector */

Connector.playerSelector = '#player-inner';

Connector.artistSelector = '#artist-name';

Connector.trackSelector = '#track-title';

Connector.isPlaying = function () {
	return $('#playPause').hasClass('playing');
};
