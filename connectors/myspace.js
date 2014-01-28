/*
 * Chrome-Last.fm-Scrobbler MySpace.com "new interface" Connector
 *
 * Stephen Paszt
 *
 * Derived from Pandora module by Jordan Perr and previous module by Ed Rackham
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "#nowPlaying";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $(".track .title a").contents().filter(function(){return this.nodeType == 3;})[0].nodeValue;
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $(".track .artist a").text();
}

// function that returns album of current song
function LFM_TRACK_ALBUM() {
	return $(".source span a").text();
}

var durationRegex = /[ \n]*(\d+):(\d+)[ \n]*\/[ \n]*(\d+):(\d+)[ \n]*/;
// function that returns current time and duration of current song in seconds
function LFM_CURRENT_TIME_AND_TRACK_DURATION () {
	try{
		var m = durationRegex.exec($("#nowPlaying .time").text()+$("#nowPlaying .duration").text());
		return {
			currentTime: parseInt(m[1],10)*60 + parseInt(m[2],10),
			trackDuration: parseInt(m[3],10)*60 + parseInt(m[4],10)};
	}catch(err){
		return -1;
	}
}

/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	artist = LFM_TRACK_ARTIST();
	title = LFM_TRACK_TITLE();
	timeAndDuration = LFM_CURRENT_TIME_AND_TRACK_DURATION();
	duration = timeAndDuration.trackDuration;
	currentTime = timeAndDuration.currentTime;
	album = LFM_TRACK_ALBUM();
	newTrack = title + " " + artist;
	// Update scrobbler if necessary
	if (newTrack != "" && newTrack != LFM_lastTrack){
		if (duration == 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", currentTime: "+currentTime+", duration: "+duration+", album: "+album);
		LFM_lastTrack = newTrack;
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title, album: album}, function(response) {
			if (response != false) {
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: title, currentTime: currentTime, duration: duration, album: album});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
			}
		});
	}
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log("MySpace Scrobbler module starting up");

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
