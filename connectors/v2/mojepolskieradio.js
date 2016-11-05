'use strict';

/* global Connector */

Connector.playerSelector = '#cM';

Connector.getArtist = function () {
	var text = $('.present .artist').first().text().trim();
	return text || null;
};

Connector.getTrack = function () {
	var text = $('.present .title').first().text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return $('#jwPlay').hasClass('pause');
};
