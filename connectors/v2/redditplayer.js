'use strict';

/* global Connector */

Connector.playerSelector = 'body';

Connector.getArtistTrack = function () {
		var text = $('#portablecontrols h3').text().replace(' [ buffering... ]', '');
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
	return $('.playing').length > 0;
};
