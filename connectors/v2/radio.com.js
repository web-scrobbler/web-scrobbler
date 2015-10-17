'use strict';

/* global Connector */

Connector.playerSelector = '.album-container';

Connector.artistSelector = '.current .track-history-content h4';

Connector.getTrack = function () {
	var text = $('.current .track-history-content h3').text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return $('.play-pause-container').hasClass('stop');
};
