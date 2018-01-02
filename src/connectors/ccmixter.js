'use strict';

setupConnector();

function setupConnector() {
	setupCommonProperties();

	if (isCcPlayer()) {
		setupCcPlayer();
	} else if (isBetaPlayer()) {
		setupBetaPlayer();
	} else if (isTuneTrackPlayer()) {
		setupTuneTrackPlayer();
	}
}

function setupCommonProperties() {
	// Track item containers
	Connector.getCurrentPlayer = () => {
		let containers = Array.from($('.upload_info, .box, .trr, .tile, .tracklist-item, .tree-head'));
		return containers.find((container) =>
			Connector.testCurrentPlayer(container));
	};

	// eslint-disable-next-line no-unused-vars
	Connector.testCurrentPlayer = (container) => false;
}

function isCcPlayer() {
	return $('[id^=_ep_], #tabs').length > 0;
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

		Connector.getUniqueID = () => {
			let text = $('.cc_file_link', Connector.getCurrentPlayer()).attr('href') ||
				location.pathname;	// Alternative for song pages
			return text && text.split('/').pop();
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

		Connector.testCurrentPlayer = (container) => {
			return $('.cc_player_play:visible', container).length > 0;
		};
	}

	function setupH5Player() {
		$('audio').bind('playing pause timeupdate', Connector.onStateChanged);

		Connector.testCurrentPlayer = (container) => {
			let audio = container.querySelector('audio');
			return audio &&
				!audio.paused;
		};

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
		let position = $('.position').css('width');
		return position ?
			$('.fa-pause').length > 0 && position.slice(0, -2) > 0 :
			$('.fa-stop').length > 0;
	};

	Connector.testCurrentPlayer = (container) => {
		return $('.fa-stop', container).length > 0;
	};

	Connector.getUniqueID = () => {
		let text = $('.upload-link', $('.audio-player')[0] ||
						Connector.getCurrentPlayer() || {}).attr('href') ||
				location.pathname;	// Alternative for song pages
		return text && text.split('/').pop();
	};

	Connector.getTrack = () => {
		return $('.upload-link span', $('.audio-player')[0] ||
						Connector.getCurrentPlayer() || {}).text() ||
				$('.tree-head h3').text();	// Alternative for song pages
	};

	Connector.getArtist = () => {
		return $('.people-link span', $('.audio-player')[0] ||
						Connector.getCurrentPlayer() || {}).text();
	};
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
		return null;
	};

	Connector.getAlbum = () => {
		let album = $('#track-album a').text();
		if (album) {
			if (album !== 'ccMixter') {
				return album;
			}
			Connector.isSingle = () => true;

		}
		return null;
	};
}
