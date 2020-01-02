'use strict';

Connector.playerSelector = '#d-content';
Connector.albumSelector = '#d-info-text .d-sub-text-2';
Connector.remainingTimeSelector = '.d-np-time-display.remaining-time';
Connector.currentTimeSelector = '.d-np-time-display.elapsed-time';
Connector.trackArtSelector = '#d-album-art > #d-image img';

Connector.getArtistTrack = () => {
	if (isPlayingLiveRadio()) {
		const songTitle = $('.d-queue-info .song-title').text();
		return Util.splitArtistTrack(songTitle);
	}

	const artist = $('#d-info-text .d-sub-text-1').text();
	const track = $('#d-info-text .d-main-text').text();
	return { artist, track };
};

Connector.isPlaying = () => {
	const duration = Connector.getDuration();

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
