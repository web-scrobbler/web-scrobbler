/* Template from Chrome-Last.fm-Scrobbler Pandora.com "new interface" Connector by Jordan Perr --- http://jperr.com --- jordan[at]jperr[dot]com
 * 
 * Vevo Modifications by Thiago Barbato --- @thiagobbt
 *
 * @todo Implement track duration, they are all assumed 200secs long
 *
 * Feel free to contact me about bugs on twitter or even fix them yourself :)
 *
 */

/********* Configuration: ***********/

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "div.info-panel";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $("h1.songname").html().split("-")[0].replace(/ $/, "");
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return document.getElementsByClassName("artists")[0].innerHTML.replace( /<[^<]+?>/g, "");
}

// function that returns duration of current song in seconds
// called at begining of song

function LFM_TRACK_DURATION() {
	//I couldn't manage to get the duration from the video, so it assumes it is 200 seconds long
	//if you think you can do it here is the JSONP URL that has the video info "http//api.vevo.com/mobile/v1/video/' + document.URL.split("/")[6] + '.jsonp"
	return 200;
}


/********* Connector: ***********/

var LFM_lastTrack = "";
var LFM_isWaiting = 0;

function LFM_updateNowPlaying(){
	// Acquire data from page
	var song = new Object();
	song.track = LFM_TRACK_TITLE();
	song.artist = LFM_TRACK_ARTIST();
	song.duration = LFM_TRACK_DURATION();
	newTrack = song.track + " " + song.artist;
	//console.log("variables set ", song.track, song.artist, song.duration, newTrack);
	// Update scrobbler if necessary
	if (newTrack != "" && newTrack != LFM_lastTrack){
		if (song.duration == 0) {
			// Nasty workaround for delayed duration visiblity with skipped tracks.
			setTimeout(LFM_updateNowPlaying, 5000);
			return 0;
		}
		//console.log("submitting a now playing request. artist: "+song.artist+", title: "+song.track+", duration: "+song.duration);
		LFM_lastTrack = newTrack;
		chrome.extension.sendRequest({type: 'validate', artist: song.artist, track: song.track}, function(response) {
			if (response != false) {
				chrome.extension.sendRequest({type: 'nowPlaying', artist: song.artist, track: song.track, duration: song.duration});
			} else { // on failure send nowPlaying 'unknown song'
				chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
			}
		});
	}	
	LFM_isWaiting = 0;
}


// Run at startup
setTimeout(function(){


	console.log("Vevo module starting up");
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
},500);;