'use strict';

setupConnector();

function setupConnector() {
	if (isCcPlayer()) {
		setupCcPlayer();
	} else if (isBetaPlayer()) {
		setupBetaPlayer();
	} else if (isTuneTrackPlayer()) {
		setupTuneTrackPlayer();
	}
}

function isCcPlayer() {
	return $('[id^=_ep_], .playerdiv').length > 0;
}

function setupCcPlayer() {
	setupCcPlayerCommonProperties();

	if (isFlashPlayer()) {
		setupFlashPlayer();
	} else if (isH5Player()) {
		setupH5Player();
	}

	function setupCcPlayerCommonProperties() {
		Connector.playerSelector = '[id$=_player]';

		// Track item containers
		Connector.getCurrentPlayer = () => {
			let containers = Array.from($('.upload_info, .box, .trr'));
			return containers.find((container) => {
				if (isFlashPlayer()) {
					return $('.cc_player_play:visible', container).length > 0;
				} else if (isH5Player()) {
					let audio = container.querySelector('audio');
					return !!audio &&
						!audio.paused;
				}
			});
		};

		Connector.getUniqueID = () => {
			let text = $('.cc_file_link', Connector.getCurrentPlayer()).attr('href') ||
				location.pathname;	// Alternative for song pages
			return text.split('/').pop();
		};

		Connector.getTrack = () => {
			return $('.cc_file_link', Connector.getCurrentPlayer()).text() ||
				$('h1').text();	// Alternative for song pages
		};

		Connector.getArtist = () => {
			return $('.cc_user_link', Connector.getCurrentPlayer()).text();
		};
	}

	function isFlashPlayer() {
		return $('.cc_player_button').length > 0;
	}

	function isH5Player() {
		return $('audio').length > 0;
	}

	function setupFlashPlayer() {
		Connector.isPlaying = () => {
			let position = $('[id$=_slider]').css('width');
			return $('.cc_player_play:visible').length > 0 &&
				!!position &&
				position.slice(0, -2) < 99;
		};
	}

	function setupH5Player() {
		$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

		Connector.isPlaying = () => !!Connector.getCurrentPlayer();

		Connector.getCurrentTime = () => $('audio', Connector.getCurrentPlayer())[0].currentTime;

		Connector.getDuration = () => $('audio', Connector.getCurrentPlayer())[0].duration;
	}
}


function isBetaPlayer() {
	return $('.fa').length > 0;
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

function isTuneTrackPlayer() {
	return $('#playback-controls-container').length > 0;
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
