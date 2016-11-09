'use strict';

/* global Connector */

if ($('.cnt-song-lst').length > 0) {
	Connector.playerSelector = '.cnt-song-lst';

	Connector.getArtistTrack = function() {
		var text = $('.playing .song').clone().children('.like-count').remove().end().text();
		var separator = Connector.findSeparator(text);

		if (separator === null || text.length === 0) {
			return {artist: null, track: null};
		}

		var artist =  text.substr(0, separator.index).trim();
		var track = text.substr(separator.index + separator.length).trim();

		return {artist: artist, track: track};
	};

	Connector.isPlaying = function () {
		return $('.playing .pause').length > 0;
	};

	Connector.getCurrentTime = function() {
		return $('.playing .p-btn').attr('sec');
	};

	Connector.getDuration = function() {
		return $('.playing .p-btn').attr('data-to_sec');
	};
} else if ($('.cur-blk').length > 0) {
	Connector.playerSelector = '.cur-blk';

	Connector.getArtistTrack = function() {
		var text = $('.cur-blk .name').text();
		var separator = Connector.findSeparator(text);

		if (separator === null || text.length === 0) {
			return {artist: null, track: null};
		}

		var artist =  text.substr(0, separator.index).trim();
		var track = text.substr(separator.index + separator.length).trim();

		return {artist: artist, track: track};
	};

	Connector.isPlaying = function () {
		return $('.cur-blk #play').hasClass('pause');
	};

	Connector.durationSelector = '.cur-blk .total-time';
}
