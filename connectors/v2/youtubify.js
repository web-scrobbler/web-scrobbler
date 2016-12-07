'use strict';

/* global Connector */

Connector.playerSelector = '#player-controls';

Connector.artistSelector = '.current-track .info .artist-name';

Connector.trackSelector = '.current-track .info .track-name';

Connector.trackArtImageSelector = '.current-track img';

Connector.durationSelector = '.track-length';

Connector.currentTimeSelector = '.elapsed-time';

Connector.isPlaying = function() {
	return $('#player-controls .icon-pause').is(':visible');
};
