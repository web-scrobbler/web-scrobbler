'use strict';

/* global Connector */

Connector.playerSelector = '#content';

Connector.getArtistTrack = function() {
	var text = $('.playlist-position.active a.js-file-link').attr('title');
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.durationSelector = '.playlist-position.active .position-time';

Connector.isPlaying = function () {
	return $('.npp-container').hasClass('playing');
};
