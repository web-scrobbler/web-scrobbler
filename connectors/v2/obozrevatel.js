'use strict';

/* global Connector */

if ($('.cnt-song-lst').length > 0) {
	Connector.playerSelector = '.cnt-song-lst';

	Connector.getArtistTrack = function() {
		var text = $('.playing .song').clone().children('.like-count').remove().end().text();
		return Connector.splitArtistTrack(text);
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

	Connector.artistTrackSelector = '.cur-blk .name';

	Connector.isPlaying = function () {
		return $('.cur-blk #play').hasClass('pause');
	};

	Connector.durationSelector = '.cur-blk .total-time';
}
