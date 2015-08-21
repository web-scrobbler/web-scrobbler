'use strict';

/* global Connector */

Connector.playerSelector = '.cur-blk';

Connector.separators = [' -             '];

Connector.getArtistTrack = function () {
	var text = $('.name').text().substring(12);
	text = text.substring(0, text.length - 1);
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
