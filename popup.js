$(function() {

	'use strict';

	/*
   var o = '<pre>';
   for (var x in chrome.extension.getBackgroundPage().song) {
	  o += x + ' : ' + chrome.extension.getBackgroundPage().song[x] + '\n';
   }
   o += '</pre>';
   $(o).appendTo('body');
   */

	var popupApi = chrome.extension.getBackgroundPage().popupApi;
	var song = popupApi.getSong();

	if (song.artist !== '') {
		$('#artist').val(song.artist);
	}

	if (song.track !== '') {
		$('#track').val(song.track);
	}

	$('#submit').click(function() {
		$(this).attr('disabled', true);
		$(this).siblings().remove();

		var artist = $('#artist').val();
		var track = $('#track').val();

		var validateCB = function(res) {
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
	});

});
