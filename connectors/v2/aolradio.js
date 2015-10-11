'use strict';

/* global Connector */

Connector.playerSelector = '#album-art-cover';

Connector.artistSelector = '#player-artist-name';

Connector.trackSelector = '#player-track-name';

Connector.isPlaying = function () {
	return ($('#playerPlayPauseButton div').attr('style').indexOf('background-position: -960px 0px;') !== -1) ? true : false;
};
