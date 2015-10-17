'use strict';

/* global Connector */

Connector.playerSelector = '#wrap div.fixed';

Connector.getArtist = function () {
	return $('.artist').text().replace('Artist: ','');
};

Connector.getTrack = function () {
	return $('.title').text().replace('Title: ', '');
};

Connector.isPlaying = function () {
	return $('.pauseW').is(':visible');
};
