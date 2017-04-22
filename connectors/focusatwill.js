'use strict';

/* global Connector */

Connector.playerSelector = '#scroller';

Connector.getArtist = function () {
	return $('.artist').text().substring(4);
};

Connector.trackSelector = '.track';

Connector.isPlaying = function () {
	return $('.play.stopped').hasClass('playing');
};
