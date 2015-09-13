'use strict';

/* global Connector */

Connector.playerSelector = '#player .pl-wpar2';

Connector.getArtistTrack = function () {
	var text = $('.now-playing').text().substring(6);
	text = text.substring(0, text.length - 8);
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return $('#play').hasClass('pause');
};
