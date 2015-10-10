/**
 * Chrome-Last.fm-Scrobbler - ReverbNation Connector
 *
 * Author: Sitesh Shrivastava [siteshshrivastava@gmail.com]
 */

// Prevent same track from being scrobbled continuously
var previousTrack = '';

// Get track name
function getTrack() {
    return jQuery("h3[data-role='title']").text();
}

// Get artist name
function getArtist() {
    return jQuery("h4[data-role='artist']").text();
}

/*
 * Update Now playing status for a track
 * Do sanity checks for non-empty track name, artist name and track length
 * Update status when validated via call to core scrobbler
 */
function updateNowPlaying() {
    var track = getTrack();
    var artist = getArtist();

    if (!artist || !track) {
        return;
    }
    if (previousTrack == track) {
        return;
    }

    previousTrack = track;

    console.log('Validating: ' + artist + ' @#@ ' + track);

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function (response) {
        if (response != false) {
            console.log('Success: ' + artist + ' @#@ ' + track);
            chrome.runtime.sendMessage({type: 'nowPlaying',
                artist: response.artist,
                track: response.track,
                duration: response.duration / 1000
            });
        } else {
            console.log('Failure: ' + artist + ' @#@ ' + track);
            chrome.runtime.sendMessage({
                type: 'nowPlaying',
                duration: 0
            });
        }
    });
}

console.log('ReverbNation connector loading');

// Track now-playing title to observe track change
jQuery("h3[data-role='title']").live('DOMSubtreeModified', function () {
    setTimeout(updateNowPlaying, 5000);
});

// Reset in case of crash / mishap
jQuery(window).unload(function () {
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

console.log('ReverbNation connector loaded');
