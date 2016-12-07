'use strict';

/* global Connector */

Connector.playerSelector = '#d-content';

var isPlayingLiveRadio = function() {
	if ($('#d-secondary-control-left .disabled').size() === 1 && $('#d-secondary-control-right .disabled').size() === 1) {
		return 'true';
	} else {
		return 'false';
	}
};

Connector.getArtist = function() {
	if (isPlayingLiveRadio() === 'true') {
		var songTitle =  $('.d-queue-info .song-title').text();
		if (songTitle.indexOf('-') === -1) {
			//Maybe ad or program, so ignore
			return null;
		}
		var results = songTitle.split('-');
		return results[0];
	} else {
		return $('#d-info-text .d-sub-text-1').text();
	}
};

Connector.getTrack = function() {
	if (isPlayingLiveRadio() === 'true') {
		var songTitle =  $('.d-queue-info .song-title').text();
		if (songTitle.indexOf('-') === -1) {
			//Maybe ad or program, so ignore
			return null;
		}
		var results = songTitle.split('-');
		return results[1];
	} else {
		return $('#d-info-text .d-main-text').text();
	}
};

Connector.isPlaying = function () {
	return $('#d-primary-control .play').size() === 0;
};
