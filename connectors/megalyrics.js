/*
 * Chrome-Last.fm-Scrobbler Megalyrics.ru connector by Dunaeva Natalia 
 * https://github.com/plushsteel
 * http://www.lastfm.ru/user/SlaveOfBeauty
 * 
 * (based on Pandora.com connector by Jordan Perr)
 *
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "#ui_title_bar";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	link = $("#ui_song_title").html();
	res = link.replace(/<b>.*<\/b> - /g,'');
	return res;
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
  res = $("#ui_song_title b").text();
	return res;
}

// function that returns duration of current song in seconds
// called at begining of song
function LFM_TRACK_DURATION() {
	durationArr = $("#ui_time").text().split('/')[1].split(":");
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
  //console.log(title,artist,duration);
	newTrack = title + " " + artist;
	// Update scrobbler if necessary
	if (newTrack != "" && newTrack != LFM_lastTrack){
		if (duration == 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		//console.log("submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);
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
	//console.log("Megalyrics module starting up");
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

