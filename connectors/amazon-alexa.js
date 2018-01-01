'use strict';

Connector.playerSelector = '#d-content';
Connector.remainingTimeSelector  = '.d-np-time-display.remaining-time';
Connector.currentTimeSelector = '.d-np-time-display.elapsed-time';

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

Connector.albumSelector = '#d-info-text .d-sub-text-2';

Connector.isPlaying = () => {
	let songProgress = $('.d-np-progress-slider .d-slider-container .d-slider-track').attr('aria-valuenow');
	let duration = Connector.getDuration();

	// The app doesn't update the progress bar or time remaining straight away (and starts counting down from an hour). This is a workaround to avoid detecting an incorrect duration time.
	if (duration > 3600 || songProgress == 100) {
		return false;
	}
	
	return $('#d-primary-control .play').size() === 0;
}

function isPlayingLiveRadio() {
	return $('#d-secondary-control-left .disabled').size() === 1 &&
		$('#d-secondary-control-right .disabled').size() === 1;
}
