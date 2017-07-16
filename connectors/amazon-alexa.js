'use strict';

Connector.playerSelector = '#d-content';

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

Connector.isPlaying = () => $('#d-primary-control .play').size() === 0;

function isPlayingLiveRadio() {
	return $('#d-secondary-control-left .disabled').size() === 1 &&
		$('#d-secondary-control-right .disabled').size() === 1;
}
