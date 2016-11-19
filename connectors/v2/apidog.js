'use strict';

/* global Connector */

Connector.playerSelector = '#headplayer';
Connector.currentTimeSelector = '#player-playedtime';
Connector.artistTrackSelector = '.headplayer-titleReal';

Connector.getArtistTrack = function () {
			var text = $(this.artistTrackSelector).first().text();
			var separator = this.findSeparator(text);

			var artist = null;
			var track = null;

			if (separator !== null) {
				artist = text.substr(0, separator.index);
				track = text.substr(separator.index + separator.length);
			}

			return {artist: artist, track: track};
		};

Connector.getDuration = function () {
			var duration = $('audio')[0].duration;
			return Math.round(duration);
		};

Connector.isPlaying = function() {
	return $('#headplayer-play').hasClass('hidden');
		};
