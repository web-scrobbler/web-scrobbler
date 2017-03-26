'use strict';

/* global Connector */

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.title:first';

Connector.isPlaying = function() {
	return $('.player-icon').attr('id') === 'pause';
};
