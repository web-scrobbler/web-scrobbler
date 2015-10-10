'use strict';

/* global Connector */

Connector.playerSelector = '.player-static';

Connector.trackArtImageSelector = '.block-header img';

Connector.artistSelector = '[data-block="player-artist-link"]';

Connector.trackSelector = '[data-block="player-song-link"]';

Connector.isPlaying = function () {
	return $('.player-play').hasClass('player-static-stream');
};
