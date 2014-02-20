/**
 * Chrome-Last.fm-Scrobbler - Gaana.com Connector
 *
 * Author: Sitesh Shrivastava [siteshshrivastava@gmail.com]
 */

// DOM Nodes to keep track for song details
var SONG_DETAILS_DOM = '#tx';
var SONG_DURATION_DOM = '.total';

// Prevent same track from being scrobbled continuously
var previousTrack = '';

// Get track name
function getTrack() {
    return $(SONG_DETAILS_DOM).text().split(' - ')[0];
}

// Get artist name
function getArtist() {
    return $(SONG_DETAILS_DOM).text().split(' - ')[2].split(' , ').sort()[0];
}

// Get track length
function getDuration() {
    var duration = $(SONG_DURATION_DOM).text().split(':');
    return 60 * duration[0] + duration[1];
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

    if (artist == '' || track == '') {
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
                artist: artist,
                track: track,
                duration: duration
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

// Track <TITLE> to observe change in track
$("title").live('DOMSubtreeModified', function () {
    setTimeout(updateNowPlaying, 5000);
});

// Reset in case of crash / mishap
$(window).unload(function () {
    chrome.runtime.sendMessage({
        type: 'reset'
    });
    return true;
});

console.log('Gaana.com connector loaded');