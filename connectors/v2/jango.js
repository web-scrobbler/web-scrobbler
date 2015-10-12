'use strict';

/* global Connector */

Connector.playerSelector = '#masthead';

Connector.artistSelector = '#player_current_artist a';

Connector.getTrack = function () {
	var text = $('#current-song').text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return $('#btn-playpause').hasClass('pause');
};
