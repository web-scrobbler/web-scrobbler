'use strict';

/* global Connector */

Connector.playerSelector = '.player_wrapper';

Connector.artistSelector = '#tx > :last-child';

Connector.getTrack = function () {
	var text = $('.songName').length ? $('.songName').text() : $($('#tx').contents()[0]).text();
	return text || null;
};

Connector.isPlaying = function () {
	return $('.playPause ').hasClass('pause');
};
