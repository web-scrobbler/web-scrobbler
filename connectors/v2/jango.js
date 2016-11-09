'use strict';

/* global Connector */

Connector.playerSelector = '#masthead';

Connector.artistSelector = '#player_current_artist a';

Connector.trackSelector = '#current-song';

Connector.isPlaying = function () {
	return $('#btn-playpause').hasClass('pause');
};
