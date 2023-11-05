export {};

Connector.playerSelector = '#d-content';
Connector.albumSelector = '#d-info-text .d-sub-text-2';
Connector.remainingTimeSelector = '.d-np-time-display.remaining-time';
Connector.currentTimeSelector = '.d-np-time-display.elapsed-time';
Connector.trackArtSelector = '#d-album-art > #d-image img';

Connector.getArtistTrack = () => {
	if (isPlayingLiveRadio()) {
		const songTitle = Util.getTextFromSelectors(
			'.d-queue-info .song-title',
		);
		return Util.splitArtistTrack(songTitle);
	}

	const artist = Util.getTextFromSelectors('#d-info-text .d-sub-text-1');
	const track = Util.getTextFromSelectors('#d-info-text .d-main-text');
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
	if (!duration || duration > 3600) {
		return false;
	}

	return Boolean(document.querySelector('#d-primary-control .play'));
};

function isPlayingLiveRadio() {
	return (
		Boolean(
			document.querySelector('#d-secondary-control-left .disabled'),
		) &&
		Boolean(document.querySelector('#d-secondary-control-right .disabled'))
	);
}
