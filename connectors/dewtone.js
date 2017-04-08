'use strict';

/* global Connector */


Connector.artistTrackSelector = '#footer-player-track';

Connector.playerSelector = '#player';

Connector.isPlaying = function () {
	return $('#footer-player-play').css('display') !== 'block';
};
