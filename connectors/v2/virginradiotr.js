'use strict';

/* global Connector */

Connector.playerSelector = '.player';

Connector.artistTrackSelector = '.current_song';

Connector.isPlaying = function () {
	return $('.play.play_button').hasClass('stop');
};
