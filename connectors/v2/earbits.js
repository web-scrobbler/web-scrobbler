'use strict';

/* global Connector */

Connector.playerSelector = '#audio-controls';

Connector.getArtist = function () {
	var text = $('.name-slider .artist-name').text().substring(5);
	return text || null;
};

Connector.trackSelector = '.name-slider .track-name';

Connector.isPlaying = function () {
	return $('.btn-playpause').hasClass('btn-pause');
};
