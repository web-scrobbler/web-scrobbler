'use strict';

/* global Connector */

Connector.playerSelector = '#scroller';

Connector.getArtist = function () {
	var text = $('.artist').text().substring(4);
	return text || null;
};

Connector.trackSelector = '.track';

Connector.isPlaying = function () {
	return $('.play.stopped').hasClass('playing');
};
