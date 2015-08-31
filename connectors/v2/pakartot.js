'use strict';

/* global Connector */

Connector.playerSelector = '.jp-gui';

Connector.getArtist = function () {
	var text = $('.jp-player-artist').text().trim();
	return text || null;
};

Connector.trackSelector = '.jp-player-title';

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
