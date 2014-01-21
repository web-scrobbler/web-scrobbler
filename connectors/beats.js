// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';

// Timeout to scrobble track after minimum time passes
var scrobbleTimeout = 30;

// Glabal constant for the song container ....

var CONTAINER_SELECTOR = "#app__transport .transport__detail";


$(function(){
	$("title").live('DOMSubtreeModified', function(e) {
		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;
		}	
   });
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */
function updateNowPlaying(){
    var parsedInfo = parseInfo();
	
    artist   = parsedInfo['artist']; 	//global
    track    = parsedInfo['track'];	//global
    //album    = parsedInfo['album']; //Not available
    //duration = parsedInfo['duration']; //Not available	//global

    if (artist == '' || track == '') {return;}

    // check if the same track is being played and we have been called again
    // if the same track is being played we return
    if (clipTitle == track) {
		return;
    }
    clipTitle = track;
	
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
      if (response != false) {
          chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track});
      }
      // on failure send nowPlaying 'unknown song'
      else {
         chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
      }
    });
}


function parseInfo() {
    $detail = $(CONTAINER_SELECTOR + " > .artist-track-target");
	
	var artist   = '';
    var track    = '';
    var album    = '';
    var duration = 0;

    // Get artist and song names
    var artistValue = $detail.find(".artist").text();
    var trackValue = $detail.find(".track").text();
    //var albumValue = Not available at this time
    //var durationValue = Not available at this time

    try {
        if (null != artistValue) {
            artist = artistValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != trackValue) {
            track = trackValue.replace(/^\s+|\s+$/g,'');
        }
        // if (null != albumValue) {
            // album = albumValue.replace(/^\s+|\s+$/g,'');
        // }
        // if (null != durationValue) {
            // duration = parseDuration(durationValue);
        // }
    } catch(err) {
        return {artist: '', track: '', duration: 0};
    }

    return {artist: artist, track: track};
}

function parseDuration(artistTitle) {
	try {
		match = artistTitle.match(/\d+:\d+/g)[0]

		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	} catch(err){
		return 0;
	}
}


/**
 * Simply request the scrobbler.js to submit song previously specified by calling updateNowPlaying()
 */
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Beats Music song scrobbled'});

   // scrobble
   chrome.runtime.sendMessage({type: 'submit'});
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