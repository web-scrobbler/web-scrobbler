/*
 * Chrome-Last.fm-Scrobbler Reddit Playlister Connector
 * 
 * based on Pandora.com Jordan Perr --- http://jperr.com --- jordan[at]jperr[dot]com
 *
 * with VERY slight modifications by lcz 
 * http://github.com/thricedotted || http://last.fm/user/thricedotted
 *
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "div#portablecontrols";

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $("span.elapsed").html().split(" - ")[1].split(":");
	return parseInt(durationArr[0])*60 + parseInt(durationArr[1]);
}


/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	allInfo = parseInfo($("div#portablecontrols h3").html());
	title = allInfo.title;
	artist = allInfo.artist;
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
		chrome.extension.sendRequest({type: 'validate', artist: artist, track: title}, function(response) {
			if (response != false) {
				chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: title, duration: duration});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
			}
		});
	}	
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log("redditplayer module starting up");

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
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
	});
});
