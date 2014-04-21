/*
 * Chrome-Last.fm-Scrobbler MixCloud.com Connector
 *
 * by Stephen Paszt
 *
 * Derived from Pandora module by Jordan Perr, changed DOMSubtreeModified event handler to MutationObserver
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = 'div.player-current-audio';

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $('.current-artist .ng-binding').text();
}

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $('.current-track').text();
}

// returns true if player is paused
function isPaused() {
	return !$('.pause-state');
}

/********* Connector: ***********/

var LFM_lastTrack = '';
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	artist = LFM_TRACK_ARTIST();
	title = LFM_TRACK_TITLE();
	newTrack = 'Title: ' + title + '; Artist: ' + artist //+ ', Album: ' + album;
	// Update scrobbler if necessary
	if (newTrack != LFM_lastTrack && !isPaused() && title !== ''){
		//log('Submitting a now playing request: ' + newTrack);
		LFM_lastTrack = newTrack;
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
			if (response != false) {
				//log('Duration from validate response for ' + newTrack + ' = ' + Math.floor(response.duration / 1000));
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: Math.floor(response.duration / 1000)});
			} else { // on failure send blank now playing message so the user can correct manually (shows the question mark icon)
				chrome.runtime.sendMessage({type: 'nowPlaying'});
			}
		});
	}
	LFM_isWaiting = 0;
}

// write console messages with common prefix
function log(message) {
	console.log('[MixCloud Scrobbler Module] ' + message)
}

// Run at startup
$(function(){
	//console.log('Chrome Last.fm Scrobbler: MixCloud module starting up.');
	
	var myObserver = new window.MutationObserver(function(mutations) {
		if(LFM_isWaiting == 0){
			LFM_isWaiting = 1;
			// MixCloud remembers play position for previously listened mixes.
			// When the mix is loaded, the now playing fields will change several 
			// times until it gets to previous position.
			// Also, when the user scrubs the scrubber, the now playing fields change.
			// A 5 second delay is used to prevent multiple now playing requests.
			setTimeout(LFM_updateNowPlaying, 5000);
		}
	});
	
	$(LFM_WATCHED_CONTAINER).each(function () {
		myObserver.observe(this, { childList: true, subtree: true });
	});

	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});
});

/**
 * Listen for requests from scrobbler.js
 * Used to prevent multiple injections on a website that uses ajax navigation.
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
