'use strict';

/* global Connector */

if ($('.audio-player').length) {
Connector.playerSelector = '.audio-player';

Connector.getArtist = function() {
	return $('.audio-player .audio-player__song').text().trim();
};

Connector.getTrack = function() {
	return $('.audio-player .audio-player__artist').text().trim();
};

Connector.playButtonSelector = '.fa-play';
} else {
	Connector.playerSelector = $('#wrap').length ? '#wrap' : '#content';

Connector.getArtistTrack = function () {
			var text = ($('span.current').length ? $('.current').parent() : $($('.bg-darken-3').length ? '.bg-darken-3' : ($('.current').length ? '.current a' : '#player h1'))).clone().children().remove().end().text().trim();
			var separator = this.findSeparator(text);

			var artist = null;
			var track = null;

			if (separator !== null) {
				artist = text.substr(0, separator.index);
				track = text.substr(separator.index + separator.length);
			}

			return {artist: artist, track: track};
		};

Connector.playButtonSelector = $('.plangular-icon-play') ? '.plangular-icon-play' : '.icon-play';
}
