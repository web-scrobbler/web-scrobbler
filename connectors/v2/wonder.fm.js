'use strict';

/* global Connector */

Connector.playerSelector = '#menu';

Connector.getArtistTrack = function () {
			var text = $('#current_track').text();
			var separator = this.findSeparator(text);

			var artist = null;
			var track = null;

			if (separator !== null) {
				track = text.substr(0, separator.index);
				artist = text.substr(separator.index + separator.length);
			}

			return {artist: artist, track: track};
		};

Connector.isPlaying = function () {
	return $('.jp-pause').is(':visible');
};
