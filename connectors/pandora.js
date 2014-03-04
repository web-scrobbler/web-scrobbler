/*
 * Chrome-Last.fm-Scrobbler Pandora.com "new interface" Connector
 *
 * Jordan Perr --- http://jperr.com --- jordan[at]jperr[dot]com
 *
 * You can use this as a template for other connectors.
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "div.nowplaying";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $("a.playerBarSong").text();
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $("a.playerBarArtist").text();
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $("div.remainingTime").html().split("-")[1].split(":");
	return parseInt(durationArr[0])*60 + parseInt(durationArr[1]);
}


/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	title = LFM_TRACK_TITLE();
	artist = LFM_TRACK_ARTIST();
	duration = LFM_TRACK_DURATION();
	newTrack = title + " " + artist;
	// Update scrobbler if necessary
	if (newTrack != "" && newTrack != LFM_lastTrack){
		if (duration == 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		console.log("submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);
		LFM_lastTrack = newTrack;
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
			if (response != false) {
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: title, duration: duration});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
			}
		});
	}
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log("Pandora module starting up");

	$(LFM_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
		//console.log("Live watcher called");
		if ($(LFM_WATCHED_CONTAINER).length > 0) {
			if(LFM_isWaiting == 0){
				LFM_isWaiting = 1;
				setTimeout(LFM_updateNowPlaying, 10000);
			}
			return;
		}
	});

	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});
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