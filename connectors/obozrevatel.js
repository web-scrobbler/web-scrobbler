'use strict';

/* global Connector, Util */

setupConnector();

function setupConnector() {
	if (isRadioPlayer()) {
		setupRadioPlayer();
	} else if (isMusicPlayer()) {
		setupMusicPlayer();
	}
}

function isRadioPlayer() {
	return $('.cur-blk').length > 0;
}

function isMusicPlayer() {
	$('.cnt-song-lst').length > 0;
}

function setupMusicPlayer() {
	Connector.playerSelector = '.cnt-song-lst';

	Connector.getArtistTrack = function() {
		let text = $('.playing .song').clone().children('.like-count').remove().end().text();
		return Util.splitArtistTrack(text);
	};

	Connector.isPlaying = () => $('.playing .pause').length > 0;

	Connector.getCurrentTime = () => $('.playing .p-btn').attr('sec');

	Connector.getDuration = () => $('.playing .p-btn').attr('data-to_sec');
}

function setupRadioPlayer() {
	Connector.playerSelector = '.cur-blk';

	Connector.artistTrackSelector = '.cur-blk .name';

	Connector.isPlaying = () => $('.cur-blk #play').hasClass('pause');

	Connector.durationSelector = '.cur-blk .total-time';
}
