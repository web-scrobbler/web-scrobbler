'use strict';

setupConnector();

function setupConnector() {
	if (isBetaPlayer()) {
		setupBetaPlayer();
	} else if (isTuneTrackPlayer()) {
		setupTuneTrackPlayer();
	} else {
		setupH5Player();
	}
}

function isBetaPlayer() {
	return $('.fa').length > 0;
}

function isTuneTrackPlayer() {
	return $('#playback-controls-container').length > 0;
}

function setupBetaPlayer() {
	Connector.playerSelector = '.audio-player';

	Connector.isPlaying = () => {
		return $('.fa-pause, .fa-stop').length > 0 &&
			$('.position').css('width').slice(0, -2) > 0;
	};

	Connector.getUniqueID = () => {
		let text = $(`${Connector.playerSelector} .upload-link`).attr('href');
		return text.split('/').pop();
	};

	Connector.trackSelector = `${Connector.playerSelector} .upload-link span`;

	Connector.artistSelector = `${Connector.playerSelector} .people-link span`;
}

function setupTuneTrackPlayer() {
	Connector.playerSelector = '#playback-controls-container';

	Connector.isPlaying = () => {
		return $('.pause-btn').length > 0 &&
			$('.position').css('width').slice(0, -2) > 0;
	};

	Connector.getUniqueID = () => {
		let text = $(`${Connector.trackSelector} a`).attr('href');
		return text && /\/(\d+)-?/g.exec(text).pop();
	};

	Connector.trackSelector = '#track-title';

	Connector.artistSelector = '#track-artist';

	// if the track is uploaded by a ccMixter user, the album will be
	// shown as 'ccMixter' and the track art as the user's avatar, this
	// function helps to filter them
	Connector.isSingle = () => null;

	Connector.getTrackArt = () => {
		if (!Connector.isSingle()) {
			return $('#current-item-artwork-thumb').attr('src');
		}
	};

	Connector.getAlbum = () => {
		let album = $('#track-album a').text();
		if (album) {
			if (album !== 'ccMixter') {
				return album;
			}
			Connector.isSingle = () => true;

		}
	};
}

function setupH5Player() {
	$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

	Connector.getCurrentPlayer = () => {
		let containers = document.querySelectorAll('.upload_info, .box, .trr');
		return Array.from(containers).find((e) => {
			let a = e.querySelector('audio');
			return !!a &&
				!a.paused;
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
