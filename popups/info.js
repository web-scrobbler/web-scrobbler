'use strict';

$(document).ready(function() {
	console.log(chrome.extension.getBackgroundPage());

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
				chrome.runtime.sendMessage({type, data, tabId}, resolve);
			});
		});
	}

	/**
	* Song data from background script are loaded
	*/
	function onSongLoaded() {
		console.log(song);
		// no current song - should not happen, because page action with popup shows
		// only when there is a song that can be corrected
		if (song === null) {
			return;
		}

		configControls();
		updateControls();
		updateViews();

		updateLovedIcon(song.metadata.userloved);

		let isSongValid = song.flags.isLastfmValid || song.flags.isCorrectedByUser;
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
		let isSongValid = song.flags.isLastfmValid || song.flags.isCorrectedByUser;

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
				$(fieldLabelSelector).attr('href', fieldUrl);
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
		let albumArt = song.parsed.trackArt ||
			song.metadata.artistThumbUrl ||
			'../default_cover_art.png';

		$('#album-art').css('background-image', `url("${albumArt}")`);
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
		$('#love').on('click', function() {
			var currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			var desiredLoveStatus = !currentLoveStatus;

			sendMessageToCurrentTab('v2.toggleLove', {
				shouldBeLoved: desiredLoveStatus
			}).then(() => {
				updateLovedIcon(desiredLoveStatus);
			});
		});

		if (song.flags.isScrobbled) {
			return;
		}

		$('#edit-link').on('click', () => {
			if (isEditModeEnabled) {
				setEditMode(false);
				correctSongInfo();
			} else {
				setEditMode(true);
			}
		});
		if (song.flags.isCorrectedByUser) {
			$('#revert-link').on('click', () => {
				sendMessageToCurrentTab('v2.resetSongData');
				window.close();
			});
		} else {
			$('#revert-link').attr('data-hide', true);
		}

		$('#edit input').keypress((e) => {
			let isEnterKey = e.keyCode === 13;
			if (isEnterKey) {
				setEditMode(false);
				correctSongInfo();
			}
		});
	}

	function updateLovedIcon(isLoved) {
		$('#love').attr('last-fm-loved', isLoved);
		$('#love').attr('title', isLoved ? 'unlove song' : 'love song');
	}

	function updateViews() {
		fillMetadataLabels();
		fillAlbumCover();
	}

	function updateControls() {
		$('#edit-link').text(isEditModeEnabled ? 'Submit' : 'Edit');

		if (song.flags.isScrobbled) {
			$('#edit-link').addClass('disabled');
			if (song.flags.isCorrectedByUser) {
				$('#revert-link').addClass('disabled');
			} else {
				$('#revert-link').attr('data-hide', true);
			}
		} else {
			let isRevertHidden = !song.flags.isCorrectedByUser || isEditModeEnabled;
			$('#revert-link').attr('data-hide', isRevertHidden);
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
				case 'v2.onSongUpdated':
					song = request.data;
					updateViews();
					updateControls();
					break;
			}
		});
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
