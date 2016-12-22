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
			let inputData = $(`#${field}-input`).val();
			let labelText = $(`#${field}`).text();

			if (!inputData) {
				// Don't allow to submit empty results.
				$(`#${field}-input`).val(labelText);
				continue;
			}

			if (labelText !== inputData) {
				$(`#${field}`).text(inputData);
				isSongMetadataChanged = true;
			}
		}

		return isSongMetadataChanged;
	}

	function fillMetadataLabels(song) {
		let artist = song.processed.artist || song.parsed.artist;
		let track = song.processed.track || song.parsed.track;
		let album = song.processed.album || song.parsed.album;
		let albumArt = song.parsed.trackArt ||
			song.metadata.artistThumbUrl ||
			'../default_cover_art.png';

		$('#artist').text(artist).attr('href', song.metadata.artistUrl);
		$('#track').text(track).attr('href', song.metadata.trackUrl);
		$('#album').text(album).attr('href', song.metadata.trackUrl)
			.attr('data-hide', !album);
		$('#album-art').css('background-image', `url("${albumArt}")`);
		configHeart(song.metadata.userloved);

		for (let field of ['artist', 'track', 'album']) {
			$(`#${field}-input`).val($(`#${field}`).text());
		}
	}

	function configEditControls(song) {
		if (song.flags.isScrobbled) {
			$('#edit-link').addClass('disabled');
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
