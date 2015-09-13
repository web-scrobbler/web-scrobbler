'use strict';

/* global Connector */

Connector.playerSelector = '.playerButton';

Connector.getArtistTrack = function () {
			var text = $('#songPlayingText').text();
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
	return $('#songPlayStop').hasClass('songPlayStopPause');
};
