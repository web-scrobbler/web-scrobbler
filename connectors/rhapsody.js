'use strict';

// Used only to remember last song title
var clipTitle = '';

// Timeout to scrobble track after minimum time passes
var scrobbleTimeout = 30;

$(function(){
	$('#player-track-link').live('DOMSubtreeModified', function() {
		setTimeout(function(){
			updateNowPlaying();
		},scrobbleTimeout);
	});
	updateNowPlaying();
});

/**
* Called every time we load a new song
*/
function updateNowPlaying(){
	var callback = function(parsedInfo) {
		var artist   = parsedInfo.artist;
		var track    = parsedInfo.track;
		var album    = parsedInfo.album;
		var duration = parsedInfo.duration;

		if (artist === '' || track === '') {
			return;
		}

// check if the same track is being played and we have been called again
// if the same track is being played we return
		if (clipTitle === track) {
			return;
		}
		clipTitle = track;

		chrome.runtime.sendMessage({'type': 'validate', 'artist': artist, 'track': track, 'album': album}, function(response) {
			if (response !== false) {
				chrome.extension.sendMessage({'type': 'nowPlaying', 'artist': artist, 'track': track, 'album': album, 'source': 'Rhapsody'});
			}
			// on failure send nowPlaying 'unknown song'
			else {
				chrome.runtime.sendMessage({'type': 'nowPlaying', 'duration': duration});
			}
		});
	};
	parseInfo(callback);
}


function parseInfo(callback) {
	var info = {};
	info.artist = $('#player-artist #player-artist-link').text().trim();
	info.track = $('#player-track #player-track-link').text().trim();
	info.duration = $('#player-progress-frame #player-total-time').text().trim();
	callback(info);
}

/**
* Listen for requests from scrobbler.js
*/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.type) {
			// background calls this to see if the script is already injected
			case 'ping':
				sendResponse(true);
				break;
		}
	}
);
