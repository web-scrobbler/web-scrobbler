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


	/**
	 * Legacy code for cases when legacy controller is loaded and active
	 */
	function legacy() {
		var popupApi = chrome.extension.getBackgroundPage().popupApi;
		var song = popupApi.getSong();

		if (song.artist !== '') {
			$('#artist').val(song.artist);
		}

		if (song.track !== '') {
			$('#track').val(song.track);
		}

		var submissionHandler = function() {
			console.log('handling legacy');
			$('#submit').attr('disabled', true);
			$('#submit').siblings().remove();

			var artist = $('#artist').val();
			var track = $('#track').val();

			var validateCB = function (res) {
				if (res === false) {
					$(this).attr('disabled', false);
					$(this).siblings().remove();
					$(this).parent().append('<span class="note">Not valid</span>');
				} else {
					// did the content script recognize at least the duration?
					if (!song.duration) {
						song.duration = res.duration;
					}

					// fill other data
					song.artist = res.artist;
					song.track = res.track;
					//chrome.extension.getBackgroundPage().song.album = res.album;

					// make the connection to last.fm service to notify
					popupApi.nowPlaying(song);

					// The minimum time is 240 seconds or half the track's total length
					// minus the time that already past
					var past = parseInt(new Date().getTime() / 1000.0) - song.startTime;
					var min_time = Math.min(240, song.duration / 2) - past;

					// Set up the timer to scrobble
					popupApi.planSubmit(min_time * 1000);

					$('#form').fadeOut(0);
					$('#valid').fadeIn(0);
				}
			};

			popupApi.validate(artist, track, validateCB);
		};

		$('#submit').click(function() {
			submissionHandler();
		});
		$('#formwrapper').submit(function() {
			submissionHandler();
		});

	}


});
