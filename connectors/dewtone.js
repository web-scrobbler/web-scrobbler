'use strict';

Connector.artistTrackSelector = '#footer-player-track';

Connector.playerSelector = '#player';

Connector.isPlaying = function () {
	return $('#footer-player-play').css('display') !== 'block';
};
