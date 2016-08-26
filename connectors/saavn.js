/**
 * Chrome-Last.fm-Scrobbler - Saavn.com Connector
 *
 * Original Author: Mayank Meghwanshi [mayankmeghwanshi@gmail.com]
 * Testing, Fixes, Refactor: Shadab Zafar [dufferzafar0@gmail.com]
 *
 * Saavn.com's now playing bar does not have Artist's name
 * but there is a link to the Track's information - so we make an
 * Ajax call and extract artist information.
 */

// DOM Nodes to keep track for song details
var DOM_TRACK_NAME = '#player-track-name';
var DOM_TRACK_DURATION = '#track-time';

// Prevent same track from being scrobbled continuously
var previousTrack = '';
var previousURL = '';

// Get track name
function getTrack() {
    var trackName = $(DOM_TRACK_NAME + ' a').text();
    if (!trackName) {
        return ;
    }

    return trackName;
}

// Get track length
function getDuration() {
    if (!$(DOM_TRACK_DURATION)) {
        return;
    }

    var duration = $(DOM_TRACK_DURATION).text().split(':');
    return 60 * parseInt(duration[0]) + parseInt(duration[1]);
}

function updateNowPlaying() {

    var track = getTrack();
    var duration = getDuration();

    // Extract Track's URL to find artist information
    var trackURL = $(DOM_TRACK_NAME + ' a').attr("onclick");
    trackURL = trackURL.split(',')[1].slice(2, -3);

    // Prevent redundant Ajax calls
    if(trackURL == previousURL){
        return;
    }
    else{
        previousURL = trackURL;
    }

    $.ajax({
      url: trackURL,
      context: document.body,
    }).done(function(trackDetailsHTML) {

        // Use jQuery to parse the HTML
        var trackDetailsDOM = $(trackDetailsHTML);
        var artist = trackDetailsDOM.find('.page-meta-group > .meta-list')[0].textContent

        console.log('Validating: ' + artist + ' - ' + track + ' - ' + duration);

        if (!artist || !track || previousTrack == track) {
            return;
        }

        previousTrack = track;

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
    });
}

console.log('Saavn.com connector loading');

// Track enclosing <div>, id: 'now-playing' to observe track change
$('#now-playing').on('DOMSubtreeModified', function () {
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

console.log('Saavn.com connector loaded');
