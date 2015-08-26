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

		(function scrobbleCountdown(){
			if (typeof song.secondsToScrobble === 'undefined') {
				$('#timetoscrobble').text('Can\'t scrobble');
			} else if (song.secondsToScrobble > 0) {
				$('#timetoscrobble').text(MMSS(song.secondsToScrobble)+' to scrobble');
				song.secondsToScrobble--;
				setTimeout(scrobbleCountdown, 1000);
			} else if(song.secondsToScrobble <= 0 || song.flags.isScrobbled === true) {
				$('#timetoscrobble').text('Scrobbled');
			}
		})();

		// UI listeners
		var $editableEl = $('.editable');
		var $editBtn = $('.edit');
		var $loveBtn = $('#love');


		$loveBtn.on('click', function() {
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

		$editBtn.on('click', function() {
			// Find an editable element which is before the edit button
			var editElem = $(this).prevAll('.editable:first');
			if(editElem.length !== 0) {
				if(editElem.hasClass('edit-mode') === false) {
					startEditing(editElem);
				}
			}
		});

		$editableEl
			.on('keydown', function(e) {
				if($(this).hasClass('edit-mode') === true) {
					if(e.which === 9 || e.which === 13) {
						console.log(e.which);
						e.preventDefault();

						// Finish editing the current element and pass on to the next one
						var editNext = $(this).nextAll('.editable:first');
						if(editNext.length !== 0) {
							startEditing(editNext);
						}
						$(this).blur();
					}
				}
				return e.which != 13;
			})
			.on('blur', function() {
				// If clicking off (but NOT tabbing away), submit the data
				if($(this).hasClass('edit-mode') === true) {
					finishEditing($(this));
				}
			});

		function startEditing(editElem) {
			editElem.attr('contenteditable',true);
			editElem.toggleClass('edit-mode', true);
			editElem.focus();
		}

		function finishEditing(editElem) {
			var cleansedText = editElem.text().replace(/\n/g,' ');
			editElem.text(cleansedText);
			editElem.toggleClass('edit-mode', false);
			editElem.attr('contenteditable', null);
			if($('.edit-mode').toArray().length === 0) {
				saveCorrectedInfo();
			}
		}

		function saveCorrectedInfo() {
			chrome.runtime.sendMessage({
				type: 'v2.correctSong',
				data: {
					artist: $('#artist').text(),
					track: $('#track').text()
				},
				tabId: tabId
			}, function() {
				// Then refresh the popup
				onTabReady(tabId);
			});
		}
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

	if (hours   < 10) {hours   = '0'+hours;}
	if (minutes < 10) {minutes = '0'+minutes;}
	if (seconds < 10) {seconds = '0'+seconds;}
	var time    = +minutes+':'+seconds;
	return time;
}
