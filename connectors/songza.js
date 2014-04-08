/*
 * @author David Sabata
 */

var lastTrackTitle = null;
var defaultDuration = 120;


/**
 * Simply gather the info, validate and submit
 */
function updateNowPlaying() {
	var artist = $('#player .miniplayer-info-artist-name a').attr('title'); 
	var track = $('#player .miniplayer-info-track-title a').attr('title');

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response) {
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: defaultDuration});
        } else {
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: defaultDuration});
        }
    });

}


/**
 * Called when some player mutation is detected
 */

// (timeout)
var trackTitleTimeout;

function onPlayerChanged() {
    var trackTitle;
    var isPaused;
    
    // grab track title/play status as soon as it's present
    if ($('#player .miniplayer-info-track-title a').attr('title')) {
        trackTitle = $('#player .miniplayer-info-track-title a').attr('title');
        isPaused = $('#player .player-wrapper').hasClass('player-state-pause');
    } else {
        trackTitleTimeout = window.setTimeout(onPlayerChanged, 10000);
    }
        
    // continue after we have the track title
    if (trackTitle) {
        // reset on pausing
        if (isPaused) {
            chrome.runtime.sendMessage({type: 'reset'});
            lastTrackTitle = '';
            return;
        }

        // detect the first mutation of track title
        if (trackTitle.length > 0 && trackTitle != lastTrackTitle) {
            lastTrackTitle = trackTitle;
            updateNowPlaying();
        }
    }
}


/**
 * Observe for mutation events - way better performance than DOMSubtreeModified
 */
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(onPlayerChanged);
});

var observeTarget = document.querySelector('#player');
var config = { childList: true, subtree: true };
observer.observe(observeTarget, config);


/**
 * The script is injected after DOMReady, so the player is probably already initialized --> trigger fake mutation
 */
onPlayerChanged();





/**
 * Reset when navigating off
 */
$(window).unload(function() {
    chrome.runtime.sendMessage({type: 'reset'});
    return true;
});


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
