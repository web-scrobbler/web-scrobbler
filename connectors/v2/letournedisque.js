'use strict';

/* global Connector */

Connector.playerSelector = '.lecteur';

Connector.artistSelector = '.artiste .inside_call';

Connector.getTrack = function () {
	var text = $('.info-text .name').text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return $('.playing').length;
};
