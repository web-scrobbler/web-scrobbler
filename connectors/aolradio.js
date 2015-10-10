/*
 * Chrome-Last.fm-Scrobbler AOL Radio Connector
 * 
 * Uses Jordan Perr's pandora connector as a template --- http://jperr.com --- jordan[at]jperr[dot]com
 *
 * Joe Crawford joe@artlung.com
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "div#track-metadata";

function LFM_IS_A_SONG() {
	return !$("#player-track-name").hasClass("noClick");
}

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $("#player-track-name").text();
}


// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $("#player-artist-name").text();
}

// function that returns artist of current song
function LFM_TRACK_ALBUM() {
	return $("#player-album-name").text();
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $('#total-length').text().split(":");
	return parseInt(durationArr[0], 10)*60 + parseInt(durationArr[1], 10);
}


/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	title = LFM_TRACK_TITLE();
	artist = LFM_TRACK_ARTIST();
	duration = LFM_TRACK_DURATION();
	album = LFM_TRACK_ALBUM();
	newTrack = title + " " + artist;
	isASong = LFM_IS_A_SONG();
	// Update scrobbler if necessary
	if (isASong && newTrack != " " && newTrack != LFM_lastTrack){
		if (duration === 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		console.log("submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration + ", album: " + album);
		LFM_lastTrack = newTrack;
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
			if (response !== false) {
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: title, duration: duration, album: album});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
			}
		});
	}
	LFM_isWaiting = 0;
}

// Run at startup
$(function(){
	console.log("AOL Radio module starting up");

	$(LFM_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
		//console.log("Live watcher called");
		if ($(LFM_WATCHED_CONTAINER).length > 0) {
			if(LFM_isWaiting === 0){
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
