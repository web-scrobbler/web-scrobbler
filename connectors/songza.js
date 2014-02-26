/*
 * @author David Sabata
 */

var lastTrackTitle = null;
var defaultDuration = 120;


/**
 * Simply gather the info, validate and submit
 */
function updateNowPlaying() {
	var artist = $('#player .player-state-display-info .szi-artist').text();
	var track = $('#player .player-state-display-info .szi-title').text();

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
function onPlayerChanged() {
    var trackTitle = $('#player .player-state .player-state-display-song').text().trim();
    var isPaused = $('#player .sz-player').hasClass('sz-player-play-state-pause');

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


/**
 * Observe for mutation events - way better performance than DOMSubtreeModified
 */
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(onPlayerChanged);
});

var observeTarget = document.querySelector('#player .sz-player');
var config = { childList: true };
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
