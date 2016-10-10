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

Connector.isPlaying = function () {
	return $('.jp-play').css('display') === 'none';
};

Connector.getCurrentTime = function() {
	var currentTimeStr = $('.jp-current-time').text().trim();
	return Connector.stringToSeconds(currentTimeStr);
};

Connector.getDuration = function() {
	var durationStr = $('.jp-duration').text().trim();
	return Connector.stringToSeconds(durationStr);
};
