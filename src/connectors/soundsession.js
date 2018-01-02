'use strict';

setupConnector();

function setupConnector() {
	['#notice-track', '#playlist'].forEach(function(playerSelector, index) {
		if ($(playerSelector).length) {
			Connector.playerSelector = playerSelector;
			if (0 === index) {
				setupCenterPlayer();
			} else {
				setupStationPlayer();
			}
		}
	});
}

function setupCenterPlayer() {
	$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

	Connector.isPlaying = () => {
		const audio = $('audio').get(0);
		return audio.currentTime && !audio.paused && !audio.ended;
	};

	Connector.trackSelector = '.notice-track-name';

	Connector.artistSelector = '.notice-track-singer';
}

function setupStationPlayer() {
	Connector.artistTrackSelector = '#playlist li:nth-child(1) a';
}
