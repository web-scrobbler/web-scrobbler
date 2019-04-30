'use strict';

Connector.playerSelector = '#d-content';
Connector.albumSelector = '#d-info-text .d-sub-text-2';
Connector.remainingTimeSelector = '.d-np-time-display.remaining-time';
Connector.currentTimeSelector = '.d-np-time-display.elapsed-time';
Connector.trackArtSelector = '#d-album-art > #d-image img';

Connector.getDuration = () => {
	let elapsed = Util.stringToSeconds($(Connector.currentTimeSelector).text());
	let remaining = -Util.stringToSeconds($(Connector.remainingTimeSelector).text());
	return (remaining + elapsed);
};

Connector.getRemainingTime = () => {
	let remaining = -Util.stringToSeconds($(Connector.remainingTimeSelector).text());
	return remaining;
};

Connector.getArtistTrack = () => {
	if (isPlayingLiveRadio()) {
		let songTitle = $('.d-queue-info .song-title').text();
		return Util.splitArtistTrack(songTitle);
	}

	let artist = $('#d-info-text .d-sub-text-1').text();
	let track = $('#d-info-text .d-main-text').text();
	return { artist, track };
};

Connector.isPlaying = () => {
	let duration = Connector.getDuration();

	/*
	 * The app doesn't update the remaining and elapsed times straight away
	 * when changing songs. The remaining time rolls over and starts counting
	 * down from an hour. This is a workaround to avoid detecting an incorrect
	 * duration time.
	 */
	if (duration > 3600) {
		return false;
	}

	return $('#d-primary-control .play').length === 0;
};

function isPlayingLiveRadio() {
	return $('#d-secondary-control-left .disabled').length === 1 &&
		$('#d-secondary-control-right .disabled').length === 1;
}
