'use strict';

$(document).ready(function() {
	console.log(chrome.extension.getBackgroundPage());

	// trick to get current tab ID
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {
		var tab = tabs[0];
		onTabReady(tab.id);
	});

	/**
	* Tab ID is resolved callback
	*/
	function onTabReady(tabId) {
		console.log('onTabReady(' + tabId + ')');
		// ask background for current song info
		chrome.runtime.sendMessage({
			type: 'v2.getSong',
			tabId: tabId
		}, function(response) {
			// false means legacy mode
			if (response === false) {
				legacy();
			} else {
				onSongLoaded(tabId, response);
			}
		});
	}

	/**
	* Song data from background script are loaded
	*/
	function onSongLoaded(tabId, song) {
		console.log('onSongLoaded(' + tabId + ', song)');
		console.log(song);
		// no current song - should not happen, because page action with popup shows
		// only when there is a song that can be corrected
		if (song === null) {
			return;
		}

		$('#artist').text(song.processed.artist || song.parsed.artist).attr('href', song.metadata.artistUrl);
		$('#track').text(song.processed.track || song.parsed.track).attr('href', song.metadata.trackUrl);
		$('#album-art').css('background-image', 'url("' + (song.parsed.trackArt || song.metadata.artistThumbUrl || '../default_cover_art.png') + '")');
		configHeart(song.metadata.userloved);

		// UI listeners
		$('#love').on('click', function() {
			var currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			var desiredLoveStatus = !currentLoveStatus;

			chrome.runtime.sendMessage({
				type: 'v2.toggleLove',
				data: { shouldBeLoved: desiredLoveStatus },
				tabId: tabId
			}, function() {
				configHeart(desiredLoveStatus);
			});
		});
	}

	function configHeart(userloved) {
		$('#love').attr('last-fm-loved', userloved);
		$('#love').attr('title', userloved ? 'unlove song' : 'love song');
	}

	/**
	* Legacy code for cases when legacy controller is loaded and active
	*/
	function legacy() {
		console.log('legacy()');
		var popupApi = chrome.extension.getBackgroundPage().popupApi;
		var song = popupApi.getSong();

		if (song.artist === '' || song.track === '') {
			top.location = 'change.html';
		}

	}

});
