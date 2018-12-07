'use strict';

setupConnector();

function setupConnector() {
	if (isRadioPlayer()) {
		setupRadioPlayer();
	} else if (isMusicPlayer()) {
		setupMusicPlayer();
	} else if (isNewMusicPlayer()) {
		setupNewMusicPlayer();
	}
}

function isRadioPlayer() {
	return $('.cur-blk').length > 0;
}

function isNewMusicPlayer() {
	return $('#file_0').length > 0;
}

function isMusicPlayer() {
	return $('.cnt-song-lst').length > 0;
}

function setupNewMusicPlayer() {
	Connector.playerSelector = '#file_0';

	Connector.isPlaying = () => $('#file_0').hasClass('jp-state-playing');

	Connector.artistSelector = '#file_0 .name a:first';

	Connector.trackSelector = '#file_0 .song-name';

	Connector.getUniqueID = () => $('#file_0 .song-name').attr('href');

	Connector.currentTimeSelector = '.jp-current-time';

	Connector.durationSelector = '.jp-duration';
}

function setupMusicPlayer() {
	Connector.playerSelector = '.cnt-song-lst';

	Connector.getArtistTrack = () => {
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
