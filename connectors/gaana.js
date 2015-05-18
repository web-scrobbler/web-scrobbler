/**
 * Chrome-Last.fm-Scrobbler - Gaana.com Connector
 *
 * Author: Sitesh Shrivastava [siteshshrivastava@gmail.com]
 * Changes : Vishal Ithape [vishal8492@gmail.com]
 */

// DOM Nodes to keep track for song details
var SONG_DETAILS_DOM = '#tx';
var SONG_DURATION_DOM = '.total';

// Prevent same track from being scrobbled continuously
var previousTrack = '';

// Get track name
function getTrack() {
    var trackName = $(SONG_DETAILS_DOM).html();
	if (!trackName) {
		return ;
 	}

    return trackName.substring(0, trackName.indexOf('<span')).split(' - ')[0];
}

// Get artist name
function getArtist() {
	if (!$(SONG_DETAILS_DOM).children()[1]) {
		return;
	}

	return $(SONG_DETAILS_DOM).children()[1].textContent.trim();
}

// Get track length
function getDuration() {
	if (!$(SONG_DURATION_DOM)) {
		return;
	}

    var duration = $(SONG_DURATION_DOM).text().split(':');
    return 60 * parseInt(duration[0]) + parseInt(duration[1]);
}

/*
 * Update Now playing status for a track
 * Do sanity checks for non-empty track name, artist name and track length
 * Update status when validated via call to core scrobbler
 */
function updateNowPlaying() {
    var track = getTrack();
    var artist = getArtist();
    var duration = getDuration();

    if (!artist || !track) {
        return;
    }
    if (previousTrack == track) {
        return;
    }

    previousTrack = track;

    console.log('Validating: ' + artist + ' @#@ ' + track + ' @#@ ' + duration);

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function (response) {
        if (response != false) {
            console.log('Success: ' + artist + ' - ' + track + ' - ' + duration);
            chrome.runtime.sendMessage({type: 'nowPlaying',
                artist: response.artist,
                track: response.track,
                duration: response.duration / 1000
            });
        } else {
            console.log('Failure: ' + duration);
            chrome.runtime.sendMessage({
                type: 'nowPlaying',
                duration: duration
            });
        }
    });
}

console.log('Gaana.com connector loading');

// Track enclosing <div>, id: 'mq' to observe track change
$('#mq').live('DOMSubtreeModified', function () {
    setTimeout(updateNowPlaying, 5000);
});

// Reset in case of crash / mishap
$(window).unload(function () {
    chrome.runtime.sendMessage({
        type: 'reset'
    });
    return true;
});

/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);

console.log('Gaana.com connector loaded');
