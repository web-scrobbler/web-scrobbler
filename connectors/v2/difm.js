'use strict';

/* global Connector */

Connector.playerSelector = '.track-region > div';

Connector.getArtistTrack = function () {
			var text = $('.track-name').attr('title');
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
	return $('.ico.icon-pause').length;
};
