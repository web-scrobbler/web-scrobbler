'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.artistTrackSelector = '.track-mobile-songtitle';

Connector.currentTimeSelector = '.track-pbar-lefttime';

Connector.isPlaying = function () {
	return $('.player-button-play .fa.fa-pause').is(':visible');
};
