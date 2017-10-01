'use strict';

$(document).ready(function() {
	let isEditModeEnabled = false;
	let song = null;

	function getCurrentTab() {
		return new Promise((resolve) => {
			chrome.tabs.query({
				active: true,
				lastFocusedWindow: true
			}, function(tabs) {
				resolve(tabs[0].id);
			});
		});
	}

	function getCurrentSong() {
		return sendMessageToCurrentTab('v2.getSong');
	}

	function sendMessageToCurrentTab(type, data) {
		return getCurrentTab().then((tabId) => {
			return new Promise((resolve) => {
				chrome.runtime.sendMessage({ type, data, tabId }, resolve);
			});
		});
	}

	/**
	* Song data from background script are loaded
	*/
	function onSongLoaded() {
		// no current song - should not happen, because page action with popup shows
		// only when there is a song that can be corrected
		if (song === null) {
			return;
		}

		updatePopupView();

		let isSongValid = song.flags.isValid || song.flags.isCorrectedByUser;
		setEditMode(!isSongValid);
	}

	function setEditMode(flag) {
		isEditModeEnabled = flag;

		$('#info').attr('data-hide', isEditModeEnabled);
		$('#edit').attr('data-hide', !isEditModeEnabled);
		if (isEditModeEnabled) {
			fillMetadataInputs();
			$('input').first().focus();
		}

		updateControls();
	}

	function isSongMetadataChanged() {
		if (!song.flags.isValid) {
			return true;
		}

		let fieldValueMap = getSongFieldMap();
		for (let field in fieldValueMap) {
			let fieldInputSelector = `#${field}-input`;
			let inputText = $(fieldInputSelector).val();
			if (!inputText) {
				continue;
			}

			let fieldValue = fieldValueMap[field];
			if (fieldValue !== inputText) {
				return true;
			}
		}

		return false;
	}

	function fillMetadataLabels() {
		let isSongValid = song.flags.isValid || song.flags.isCorrectedByUser;

		let fieldUrlMap = {
			artist: song.metadata.artistUrl,
			track: song.metadata.trackUrl,
			album: song.metadata.albumUrl
		};
		let fieldValuesMap = getSongFieldMap(song);

		for (let field of ['artist', 'track', 'album']) {
			let fieldValue = fieldValuesMap[field];
			let fieldLabelSelector = `#${field}`;

			let fieldUrl = fieldUrlMap[field];
			if (fieldUrl) {
				let fieldTitleTag;
				switch (field) {
					case 'artist':
						fieldTitleTag = 'infoViewArtistPage';
						break;
					case 'track':
						fieldTitleTag = 'infoViewTrackPage';
						break;
					case 'album':
						fieldTitleTag = 'infoViewAlbumPage';
						break;
				}

				$(fieldLabelSelector).attr('href', fieldUrl);
				$(fieldLabelSelector).attr('title', i18n(fieldTitleTag));
			} else {
				$(fieldLabelSelector).removeAttr('href');
			}

			// There's no sense to fill labels if song is not valid.
			// They will be filled later after submitting changes.
			if (isSongValid) {
				$(fieldLabelSelector).text(fieldValue);
			} else {
				$(fieldLabelSelector).text(null);
			}
			$(fieldLabelSelector).attr('data-hide', !fieldValue);
		}
	}

	function fillMetadataInputs() {
		let fieldValuesMap = getSongFieldMap();
		for (let field of ['artist', 'track', 'album']) {
			let fieldValue = fieldValuesMap[field];
			let fieldInputSelector = `#${field}-input`;

			$(fieldInputSelector).val(fieldValue);
		}
	}

	function fillAlbumCover() {
		$('#album-art').css('background-image', `url("${getCoverArt()}")`);
	}

	function copyInputsToLabels() {
		for (let field of ['artist', 'track', 'album']) {
			let fieldLabelSelector = `#${field}`;
			let fieldInputSelector = `#${field}-input`;

			let fieldInputValue = $(fieldInputSelector).val();

			$(fieldLabelSelector).text(fieldInputValue);
			$(fieldLabelSelector).attr('data-hide', !fieldInputValue);
		}
	}

	function configControls() {
		$('#love').off('click');
		$('#love').on('click', function() {
			let currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			let desiredLoveStatus = !currentLoveStatus;

			sendMessageToCurrentTab('v2.toggleLove', {
				isLoved: desiredLoveStatus
			}).then(() => {
				updateLovedIcon(desiredLoveStatus);
			});
		});

		if (song.flags.isScrobbled) {
			return;
		}

		if (song.flags.isCorrectedByUser) {
			$('#revert-link').off('click');
			$('#revert-link').on('click', () => {
				sendMessageToCurrentTab('v2.resetSongData');
				window.close();
			});
		}

		$('#edit-link').off('click');
		$('#swap-link').off('click');
		$('#skip-link').off('click');

		if (!song.flags.isSkipped) {
			$('#edit-link').on('click', () => {
				if (isEditModeEnabled) {
					setEditMode(false);
					correctSongInfo();
				} else {
					setEditMode(true);
				}
			});
			$('#swap-link').on('click', () => {
				swapTitleAndArtist();
			});
			$('#skip-link').on('click', () => {
				skipSong();

				configControls();
				updateControls();
			});
		}

		$('#edit input').off('keypress');
		$('#edit input').on('keypress', (e) => {
			let isEnterKey = e.keyCode === 13;
			if (isEnterKey) {
				setEditMode(false);
				correctSongInfo();
			}
		});

		$('#album-art').off('click');
		$('#album-art').on('click', () => {
			chrome.tabs.create({ url: getCoverArt() });
		});
	}

	function updateLovedIcon(isLoved) {
		$('#love').attr('last-fm-loved', isLoved);
		$('#love').attr('title', i18n(isLoved ? 'infoUnlove' : 'infoLove'));
	}

	function updatePopupView() {
		fillMetadataLabels();
		fillAlbumCover();

		configControls();
		updateControls();

		updateLovedIcon(song.metadata.userloved);
	}

	function updateControls() {
		$('#edit-link').text(i18n(isEditModeEnabled ? 'infoSubmit' : 'infoEdit'));
		$('#edit-link').attr('data-disable', song.flags.isSkipped ||
			song.flags.isScrobbled);

		$('#swap-link').text(i18n('infoSwap'));
		$('#swap-link').attr('data-hide', !isEditModeEnabled);
		$('#swap-link').attr('data-disable', song.flags.isScrobbled ||
			song.flags.isSkipped);

		$('#revert-link').text(i18n('infoRevert'));
		$('#revert-link').attr('data-hide', !song.flags.isCorrectedByUser
			|| isEditModeEnabled);
		$('#revert-link').attr('data-disable', song.flags.isScrobbled ||
			!song.flags.isCorrectedByUser);

		$('#skip-link').text(i18n('infoSkip'));
		$('#skip-link').attr('data-hide', isEditModeEnabled);
		$('#skip-link').attr('data-disable', song.flags.isSkipped ||
			song.flags.isScrobbled);

		if (song.flags.isScrobbled) {
			$('#edit-link').attr('title', i18n('infoEditUnableTitle'));
			$('#swap-link').attr('title', i18n('infoSwapUnableTitle'));
			$('#revert-link').attr('title', i18n('infoRevertUnableTitle'));
			$('#skip-link').attr('title', i18n('infoSkipUnableTitle'));
		} else if (song.flags.isSkipped) {
			$('#edit-link').attr('title', i18n('infoEditSkippedTitle'));
			$('#swap-link').attr('title', i18n('infoSwapSkippedTitle'));
			$('#skip-link').attr('title', i18n('infoSkipAlreadyTitle'));
		} else {
			$('#edit-link').attr('title', i18n('infoEditTitle'));
			$('#swap-link').attr('title', i18n('infoSwapTitle'));
			$('#revert-link').attr('title', i18n('infoRevertTitle'));
			$('#skip-link').attr('title', i18n('infoSkipTitle'));
		}
	}

	function correctSongInfo() {
		if (isSongMetadataChanged()) {
			copyInputsToLabels();
			sendMessageToCurrentTab('v2.correctSong', {
				artist: $('#artist-input').val(),
				track: $('#track-input').val(),
				album: $('#album-input').val()
			});
		}
	}

	function skipSong() {
		song.flags.isSkipped = true;
		sendMessageToCurrentTab('v2.skipSong');
	}

	function getSongFieldMap() {
		return {
			artist: song.processed.artist || song.parsed.artist,
			track: song.processed.track || song.parsed.track,
			album: song.processed.album || song.parsed.album
		};
	}

	function setupMessageListener() {
		chrome.runtime.onMessage.addListener((request) => {
			switch (request.type) {
				case 'v2.songUpdated':
					song = request.data;
					updatePopupView();
					break;
			}
		});
	}

	function getCoverArt() {
		return song.parsed.trackArt || song.metadata.artistThumbUrl ||
			'/icons/default_cover_art.png';
	}

	function swapTitleAndArtist() {
		if (song.flags.isSkipped || song.flags.isScrobbled ||
			!isEditModeEnabled) {
			return;
		}

		let title = $('#track-input').val();
		let artist = $('#artist-input').val();

		$('#track-input').val(artist);
		$('#artist-input').val(title);

		setEditMode(false);
		correctSongInfo();
	}

	function i18n(tag, ...context) {
		return chrome.i18n.getMessage(tag, context);
	}

	function main() {
		setupMessageListener();
		getCurrentSong().then((result) => {
			song = result;
			onSongLoaded();
		});
	}

	main();
});
