'use strict';

/* global Connector */

Connector.playerSelector      = '#custom-jw-player-wrapper';

Connector.artistTrackSelector = '#jw-player-text';

//Connector.playButtonSelector  = '#jw-play-button';
Connector.isPlaying = function () {
//    console.info($('#jw-play-button').text());
	return $('#jw-play-button').text() === '';
};

Connector.currentTimeSelector = '#jw-current-time';

Connector.durationSelector    = '#jw-total-time';
