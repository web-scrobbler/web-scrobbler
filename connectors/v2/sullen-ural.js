'use strict';

/* global Connector */

Connector.playerSelector = '.album-tracks';

Connector.getArtistTrack = function () {
	var artist = null;
	var track = null;

	var text = $('.play:contains("ll")').attr('download');
	if (text) {
		var separator = this.findSeparator(text);

		if (separator !== null) {
			artist = text.substr(0, separator.index);
			track = text.substr(separator.index + separator.length);
		}
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return $('.play:contains("ll")').length > 0;
};
