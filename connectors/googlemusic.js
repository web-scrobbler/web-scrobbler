// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Glabal constant for the song container ....
var CONTAINER_SELECTOR = '#playerSongInfo';


$(function(){   
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {

		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;    
		}

   });
   
   //console.log("Last.fm Scrobbler: starting Google Music connector")
   
   // first load
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */ 
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    artist   = parsedInfo['artist']; 	//global
    track    = parsedInfo['track'];	//global
    duration = parsedInfo['duration']; 	//global
	
    if (artist == '' || track == '' || duration == 0) {return;}
    
    // check if the same track is being played and we have been called again
    // if the same track is being played we return
    if (clipTitle == track) {
	return;
    }
    clipTitle = track;
    
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
	if (response != false) {
	    chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
	}
         // on failure send nowPlaying 'unknown song'
         else {
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
         }
    });
}


function parseInfo() {
    var artist   = '';
    var track    = '';
    var duration = 0;

    // Get artist and song names
    var artistValue = $("div#player-artist").text();
    var trackValue = $("div#playerSongTitle").text();
    var durationValue = $("div#time_container_duration").text();
    
    try {
        if (null != artistValue) {
            artist = artistValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != trackValue) {
            track = trackValue.replace(/^\s+|\s+$/g,'');
        }
        if (null != durationValue) {
            duration = parseDuration(durationValue);
        }
    } catch(err) {
        return {artist: '', track: '', duration: 0};
    }
    
    //console.log("artist: " + artist + ", track: " + track + ", duration: " + duration);

    return {artist: artist, track: track, duration: duration};
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
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Google Music song scrobbled'});
   
   // scrobble
   chrome.runtime.sendMessage({type: 'submit'});
}



/**
 * Listen for requests from scrobbler.js
 */ 
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch(request.type) {
    	// called after track has been successfully marked as 'now playing' at the server
      case 'nowPlayingOK':
         /*
        var min_time = (240 < (duration/2)) ? 240 : (duration/2); //The minimum time is 240 seconds or half the track's total length. Duration comes from updateNowPlaying()
        
				// cancel any previous timeout
        if (scrobbleTimeout != null)
      		clearTimeout(scrobbleTimeout);
               
       		// set up a new timeout
        	scrobbleTimeout = setTimeout(function(){setTimeout(scrobbleTrack, 2000);}, min_time*1000); 
            */
          break;
            
        // not used yet
        case 'submitOK':
       		break;

        // not used yet
        case 'submitFAIL':
          break; 
    }
	}
);