'use strict';

/* global Connector */
Connector.playerSelector = '.jp-audio';

Connector.getArtist = function () {
	var text = $('.playing > .artist').text().trim();
	return text || null;
};

Connector.getTrack = function () {
	var text = $('.playing > .title').text().trim();
	return text || null;
};

Connector.playButtonSelector = '.jp-play';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';
