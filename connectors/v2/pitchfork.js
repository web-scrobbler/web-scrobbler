'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.artistSelector = '.hgroup h2';

Connector.getTrack = function () {
	var text = $('.hgroup h1').text().substring(1);
	text = text.substring(0, text.length - 1);
	return text || null;
};

Connector.isPlaying = function () {
	return $('#player-modal').hasClass('playing');
};
