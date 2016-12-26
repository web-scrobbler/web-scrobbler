'use strict';

$(document).ready(function() {
	console.log(chrome.extension.getBackgroundPage());

	let isEditModeEnabled = false;

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
	function onSongLoaded(song) {
		console.log(song);
		// no current song - should not happen, because page action with popup shows
		// only when there is a song that can be corrected
		if (song === null) {
			return;
		}

		configHeart(song.metadata.userloved);
		configEditControls(song);
		fillMetadataLabels(song);

		let isSongValid = song.flags.isLastfmValid || song.flags.isCorrectedByUser;
		setEditMode(!isSongValid);
	}

	function setEditMode(flag) {
		isEditModeEnabled = flag;

		$('#info').attr('data-hide', isEditModeEnabled);
		$('#edit').attr('data-hide', !isEditModeEnabled);

		$('#edit-link').text(isEditModeEnabled ? 'Submit' : 'Edit');
	}

	function updateMetadataLabels() {
		let isSongMetadataChanged = false;

		for (let field of ['artist', 'track', 'album']) {
			let fieldLabelSelector = `#${field}`;
			let fieldInputSelector = `#${field}-input`;

			let inputText = $(fieldInputSelector).val();
			let labelText = $(fieldLabelSelector).text();

			// FIXME: remove this dirty hack
			if (!inputText) {
				// Don't allow to submit empty results.
				$(fieldInputSelector).val(labelText);
				continue;
			}

			if (labelText !== inputText) {
				$(fieldLabelSelector).text(inputText);
				$(fieldLabelSelector).attr('data-hide', !inputText);
				isSongMetadataChanged = true;
			}
		}

		return isSongMetadataChanged;
	}

	function fillMetadataLabels(song) {
		let albumArt = song.parsed.trackArt ||
			song.metadata.artistThumbUrl ||
			'../default_cover_art.png';

		$('#album-art').css('background-image', `url("${albumArt}")`);

		let isSongValid = song.flags.isLastfmValid || song.flags.isCorrectedByUser;

		let fieldUrlMap = {
			artist: song.metadata.artistUrl,
			track: song.metadata.trackUrl,
			album: song.metadata.albumUrl
		};
		let fieldValuesMap = {
			artist: song.processed.artist || song.parsed.artist,
			track: song.processed.track || song.parsed.track,
			album: song.processed.album || song.parsed.album
		};

		for (let field of ['artist', 'track', 'album']) {
			let fieldValue = fieldValuesMap[field];
			let fieldUrl = fieldUrlMap[field];

			console.log(fieldValue);

			let fieldLabelSelector = `#${field}`;
			let fieldInputSelector = `#${field}-input`;

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
			$(fieldInputSelector).val(fieldValue);
		}
	}

	function configEditControls(song) {
		if (song.flags.isScrobbled) {
			$('#edit-link').addClass('disabled');
			if (song.flags.isCorrectedByUser) {
				$('#revert-link').addClass('disabled');
			} else {
				$('#revert-link').attr('data-hide', true);
			}
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

	function configHeart(userloved) {
		$('#love').attr('last-fm-loved', userloved);
		$('#love').attr('title', userloved ? 'unlove song' : 'love song');
		// UI listeners
		$('#love').on('click', function() {
			var currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			var desiredLoveStatus = !currentLoveStatus;

			sendMessageToCurrentTab('v2.toggleLove',  {
				shouldBeLoved: desiredLoveStatus
			}).then(() => {
				configHeart(desiredLoveStatus);
			});
		});
	}

	function correctSongInfo() {
		if (updateMetadataLabels()) {
			sendMessageToCurrentTab('v2.correctSong', {
				artist: $('#artist-input').val(),
				track: $('#track-input').val(),
				album: $('#album-input').val()
			});
		}
	}

	function main() {
		sendMessageToCurrentTab('v2.getSong').then(onSongLoaded);
	}

	main();
});
