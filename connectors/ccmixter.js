'use strict';

setupConnector();

function setupConnector() {
	if (isBetaPlayer()) {
		setupBetaPlayer();
	} else {
		setupH5Player();
	}
}

function isBetaPlayer() {
	return $('.fa').length > 0;
}

function setupBetaPlayer() {
	Connector.playerSelector = '.audio-player';

	Connector.isPlaying = () => $('.fa-pause, .fa-stop').length > 0;

	Connector.getUniqueID = () => {
		let text = $(`${Connector.playerSelector} .upload-link`).attr('href');
		return text.split('/').pop();
	};

	Connector.trackSelector = `${Connector.playerSelector} .upload-link span`;

	Connector.artistSelector = `${Connector.playerSelector} .people-link span`;
}

function setupH5Player() {
	$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

	Connector.getCurrentPlayer = () => {
		let containers = document.querySelectorAll('.upload_info, .box, .trr');
		return Array.from(containers).find((e) => {
			let a = e.querySelector('audio');
			return !!a && !a.paused;
		});
	};

	Connector.isPlaying = () => !!Connector.getCurrentPlayer();

	Connector.getUniqueID = () => {
		let text = $('.cc_file_link', Connector.getCurrentPlayer()).attr('href') || location.pathname;
		return text.split('/').pop();
	};

	Connector.getTrack = () => {
		return $('.cc_file_link', Connector.getCurrentPlayer()).text() || $('h1').text();
	};

	Connector.getArtist = () => {
		return $('.cc_user_link', Connector.getCurrentPlayer()).text();
	};

	Connector.getCurrentTime = () => $('audio', Connector.getCurrentPlayer())[0].currentTime;

	Connector.getDuration = () => $('audio', Connector.getCurrentPlayer())[0].duration;
}
