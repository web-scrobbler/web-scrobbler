'use strict';

/* global Connector */

var DEFAULT_TRACK_ART_URL = 'http://c.wrzuta.pl/wi470/cbab02ab001342d756010226';

Connector.playerSelector = '#content';

Connector.getArtistTrack = function() {
	var text = $('.playlist-position.active a.js-file-link').attr('title');
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index);
		track = text.substr(separator.index + separator.length);
	}

	return {artist: artist, track: track};
};

Connector.getUniqueID = function() {
	return $('.playlist-position.active a.js-file-link').attr('data-key');
};

Connector.getTrackArt = function() {
	var trackArt = $('.playlist-position.active .file-img');
	if (trackArt) {
		var trackArtUrl = trackArt.attr('src');
		if (trackArtUrl !== DEFAULT_TRACK_ART_URL) {
			return trackArtUrl;
		}
	}

	return null;
};

Connector.durationSelector = '.playlist-position.active .position-time';

Connector.isPlaying = function () {
	return $('.npp-container').hasClass('playing');
};
