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
	return $("a.playerBarSong").html();
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $("a.playerBarArtist").html();
}

// function that returns album of current song (not used)
function LFM_TRACK_ALBUM() {
	return $("a.playerBarAlbum").html();
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $("div.remainingTime").html().split("-")[1].split(":");
	return parseInt(durationArr[0])*60 + parseInt(durationArr[1]);
}


/********* Connector: ***********/

var LFM_lastTrack = "";

function LFM_updateNowPlaying(){
	console.log("LFM_updateNowPlaying()");
	title = LFM_TRACK_TITLE();
	artist = LFM_TRACK_ARTIST();
	album = LFM_TRACK_ALBUM();
	duration = LFM_TRACK_DURATION();
	newTrack = title + " " + artist;
	if (newTrack != "" && newTrack != LFM_lastTrack){
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
}

$(function(){

	console.log("Pandora module starting up");

	$(LFM_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
		console.log("Live watcher called");
		if ($(LFM_WATCHED_CONTAINER).length > 0) {
			LFM_updateNowPlaying();
			return;    
		}
	});

	LFM_updateNowPlaying();

});
