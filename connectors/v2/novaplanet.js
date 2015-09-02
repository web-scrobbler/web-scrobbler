'use strict';

/* global Connector */

Connector.playerSelector = '.radio-radionova';

Connector.getArtist = function () {
	var text = $('.artist').text().trim();
	return text || null;
};

Connector.trackSelector = '.ontheair-text .title';

Connector.isPlaying = function () {
	return $('.btn_pause').is(':visible');
};
