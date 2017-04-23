'use strict';

/* global Connector */

Connector.playerSelector = '#cM';

Connector.getArtist = function () {
	return $('.present .artist').first().text();
};

Connector.getTrack = function () {
	return $('.present .title').first().text();
};

Connector.isPlaying = function () {
	return $('#jwPlay').hasClass('pause');
};
