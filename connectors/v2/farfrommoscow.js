'use strict';

/* global Connector */

Connector.playerSelector = '.global-content';

Connector.isPlaying = function () {
	return $('.player-buttonPause').length ? true : $('.Artist-Mini-Playing').length;
};

Connector.getArtistTrack = function () {
	var artist = $('.AR-wrap:has(.Artist-Mini-Playing) .AR-name').length ? $('.AR-wrap:has(.Artist-Mini-Playing) .AR-name').text() : $(':has(.Artist-Mini-Playing) > div > .Artist-link').text();
	var track = $('.Artist-Mini-Playing').attr('title');
	if (artist.length) {return {artist: artist, track: track};}

	var text = $('.player:has(.player-buttonPause) .player-name span').text();
	var separator = this.findSeparator(text);

	artist = null;
	track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index).trim();
		track = text.substr(separator.index + separator.length).trim();
	}

	return {artist: artist, track: track};
};
