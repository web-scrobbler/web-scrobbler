'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#display-title';

Connector.durationSelector = '#display-time-total';

Connector.trackArtImageSelector = '#player-cover';

Connector.isPlaying = function() {
	return !$('#player').hasClass('player_paused');
};
