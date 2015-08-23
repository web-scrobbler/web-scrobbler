'use strict';

/* global Connector */

Connector.playerSelector = '.cur-blk';

Connector.getArtistTrack = function () {
	var text = $('.name').text();
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index).trim();
		track = text.substr(separator.index + separator.length).trim();
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return $('#play').hasClass('pause');
};
