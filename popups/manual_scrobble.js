'use strict';

$(function() {

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
		// ask background for current song info
		chrome.runtime.sendMessage({
			type: 'v2.getSong',
			tabId: tabId
		}, function(response) {
			onSongLoaded(tabId, response);
		});
	}

	/**
	 * Song data from background script are loaded
	 */
	function onSongLoaded(tabId, song) {
		// no current song - should not happen, because page action with popup shows
		// only when there is a song that can be corrected
		if (song === null) {
			return;
		}

		$('#artist').val(song.processed.artist || song.parsed.artist);
		$('#track').val(song.processed.track || song.parsed.track);

		var submissionHandler = function() {
			$('#submit').attr('disabled', true);
			$('#submit').siblings().remove();

			var data = {
				artist: $('#artist').val(),
				track: $('#track').val()
			};

			chrome.runtime.sendMessage({
				type: 'v2.correctSong',
				tabId: tabId,
				data: data
			});

			// show green tick even if the song may not be valid - we have no way of knowing yet
			$('#form').fadeOut(0);
			$('#valid').fadeIn(0);
		};

		// submission works for both click and enter key (using form wrapper)
		$('#submit').click(function() {
			submissionHandler();
		});
		$('#formwrapper').submit(function() {
			submissionHandler();
		});

	}
});
