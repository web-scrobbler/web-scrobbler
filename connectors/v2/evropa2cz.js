'use strict';

/* global Connector */

Connector.playerSelector = '.e2-player';

Connector.artistTrackSelector = '.e2-player-meta-song';

Connector.separators = ['·'];

Connector.isPlaying = function() {
	return $('.e2-player-control-stop').is(':visible');
};
