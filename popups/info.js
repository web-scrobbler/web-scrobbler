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

		var duration = song.processed.duration || song.parsed.duration;

		$('#artist').text(song.processed.artist || song.parsed.artist).attr('href', song.metadata.artistUrl);
		$('#track').text(song.processed.track || song.parsed.track).attr('href', song.metadata.trackUrl);
		$('#album').show().text(song.processed.album || song.parsed.album).attr('href', song.metadata.albumUrl).attr('data-hide',!(song.processed.album || song.parsed.album));
		$('#duration').text(MMSS(duration)).attr('data-hide',!(duration));
		$('#album-art').css('background-image', 'url("' + (song.metadata.coverArtURL || song.parsed.coverArtURL || '/icons/default_cover_art.png') + '")');
		$('#love').attr('last-fm-loved', song.metadata.userloved);
		$('#playcount').text(song.metadata.userplaycount || 0);
		$('#data > div').text(JSON.stringify(song,null,2));

		// $('#timetoscrobble').text(song.secondsToScrobble > 0 ? MMSS(song.secondsToScrobble)+" to scrobble" : "Scrobbled" );
		(function scrobbleCountdown(){
            if (song.secondsToScrobble > 0) {
			   	$('#timetoscrobble').text(MMSS(song.secondsToScrobble)+" to scrobble");
				song.secondsToScrobble--;
               	setTimeout(scrobbleCountdown, 1000);
            } else {
               	$('#timetoscrobble').text("Scrobbled");
            }
        })();

		// UI listeners
		$('#love').on('click', function() {
			var currentLoveStatus = $('#love').attr('last-fm-loved') === 'true';
			var desiredLoveStatus = !currentLoveStatus;

			chrome.runtime.sendMessage({
				type: 'v2.toggleLove',
				data: { shouldBeLoved: desiredLoveStatus },
				tabId: tabId
			}, function() {
				$('#love').attr('last-fm-loved', desiredLoveStatus);
			});
		});
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

function MMSS(str) {
	var sec_num = parseInt(str, 10); // don't forget the second param
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	var time    = +minutes+':'+seconds;
	return time;
}
