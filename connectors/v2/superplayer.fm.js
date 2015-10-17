'use strict';

/* global Connector */

Connector.playerSelector = '#content';

Connector.getArtist = function () {
	var text = $('[data-value=artist]').text().trim();
	return text || null;
};

Connector.getTrack = function () {
	var text = $('[data-value=name]').text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return !$('[data-action="pause"]').hasClass('active');
};
