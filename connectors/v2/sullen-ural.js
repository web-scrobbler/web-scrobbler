'use strict';

/* global Connector */

Connector.playerSelector = $('#tracks-async').length ? '#tracks-async' : ($('.band-col-right').length ? '.band-col-right' : '.album-tracks');

Connector.getArtistTrack = function () {
	var text = $('.play:contains("ll")').attr('download');
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
	return $('.play:contains("ll")').length;
};
