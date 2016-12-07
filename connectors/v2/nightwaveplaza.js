'use strict';

/* global Connector */

Connector.playerSelector = '.player-meta';

Connector.artistSelector = '.track-artist';

Connector.trackSelector = '.track-title';

Connector.trackArtImageSelector = '.cover img';

Connector.isPlaying = function () {
	return $('.player-play').attr('disabled') === 'disabled';
};
