'use strict';

/* global Connector */

Connector.playerSelector = '#player-container';

Connector.artistSelector = '.track-title .artist';

Connector.trackSelector = '.track-title .title';

Connector.isPlaying = function () {
	return $('.playback-button > div').attr('title') === 'Pause Track';
};
