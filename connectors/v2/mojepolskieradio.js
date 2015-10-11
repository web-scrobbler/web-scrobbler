'use strict';

/* global Connector */

Connector.playerSelector = '#cM';

Connector.getArtist = function () {
	var text = $('.present .artist').text().trim();
	return text || null;
};

Connector.getTrack = function () {
	var text = $('.present .title').text().trim();
	return text || null;
};

Connector.isPlaying = function () {
	return $('#jwPlay').hasClass('pause');
};
