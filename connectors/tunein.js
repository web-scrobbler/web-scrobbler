/**
 * Chrome-Last.fm-Scrobbler - TuneIn Connector
 *
 * Author: Sitesh Shrivastava [siteshshrivastava@gmail.com]
 */

// DOM Nodes to keep track for song details
var SONG_DETAILS_DOM = '#nowPlayingInfo .line1';

// Prevent same track from being scrobbled continuously
var previousTrack = '';

// Get track name
function getTrack() {
    return $(SONG_DETAILS_DOM).text().split(' - ')[0];
}

// Get artist name
function getArtist() {
    return $(SONG_DETAILS_DOM).text().split(' - ')[1];
}

/**
 * Get track length
 * Track duration information is unavailable on page. Setting default to 60 seconds
 */
function getDuration() {
    return 60;
}

/**
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
            chrome.runtime.sendMessage({type: 'nowPlaying',
                artist: response.artist,
                track: response.track,
                duration: response.duration / 1000
            });
            console.log('Success: ' + artist + ' @#@ ' + track + ' @#@ ' + response.duration / 1000);
        } else {
            console.log('Failure: ' + duration);
            chrome.runtime.sendMessage({
                type: 'nowPlaying',
                duration: duration
            });
        }
    });
}

console.log('TuneIn connector loading');

// Track enclosing <div>, class: 'line1' to observe track change
$(document).bind('DOMSubtreeModified', SONG_DETAILS_DOM, function () {
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

console.log('TuneIn connector loaded');
