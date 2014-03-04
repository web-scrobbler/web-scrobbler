
// remember urls to detect ajax pageloads (using history API)
var lastUrl = '';


// we will observe changes at the main player element
// which changes (amongst others) on ajax navigation
var target = null;
var feather = false;
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // detect first mutation that happens after url has changed
        if (lastUrl != location.href) {
            lastUrl = location.href;
            updateNowPlaying();
        }
    });
});


var config = { attributes: true };

target = document.querySelector('#plex');
if (!target) {
    feather = true;
    updateNowPlaying();
}
else {
    observer.observe(target, config);
}
// bind page unload function to discard current "now listening"
$(window).unload(function() {

    // reset the background scrobbler song data
    chrome.runtime.sendMessage({type: 'reset'});

    return true;
});

// changes to the DOM in this container will trigger an update.
LFM_WATCHED_CONTAINER = "#plex";

// function that returns title of current song
function LFM_TRACK_TITLE() {
	return $("#plex.music-player.player-controls.now-playing.now-playing-title").contents().filter(function(){return this.nodeType == 3;})[0].nodeValue;
}

// function that returns artist of current song
function LFM_TRACK_ARTIST() {
	return $("#plex.music-player.player-controls.now-playing.now-playing-subtitle").text();
}

// function that returns album of current song
function LFM_TRACK_ALBUM() {
	return $("#plex.scroll-container minimal-scrollbar.container-fluid.details.details-row row-fluid.album-metadata details -metadata.album-title").text();
}

var durationRegex = /[ \n]*(\d+):(\d+)[ \n]*\/[ \n]*(\d+):(\d+)[ \n]*/;
// function that returns current time and duration of current song in seconds
function LFM_CURRENT_TIME_AND_TRACK_DURATION () {
	try{
		var m = durationRegex.exec($("#plex.music-player.player-controls.now-playing.player-controls.player-controls-right.player-time .player-current-time").text()+$("#plex.music-player.player-controls.now-playing.player-controls.player-controls-right.player-time .player-duration").text());
		return {
			currentTime: parseInt(m[1],10)*60 + parseInt(m[2],10),
			trackDuration: parseInt(m[3],10)*60 + parseInt(m[4],10)};
	}catch(err){
		return -1;
	}
}
/**
 * Called every time the player reloads
 */
function updateNowPlaying() {

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
   });

}



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
