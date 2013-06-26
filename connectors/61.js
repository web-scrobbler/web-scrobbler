// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Glabal constant for the song container ....
var CONTAINER_SELECTOR = '#song_panel_title';


$(function(){   
	$(CONTAINER_SELECTOR).bind('DOMSubtreeModified', function(e) {
		// init ----> loading
		if (state == 'init' && $(CONTAINER_SELECTOR).length > 0) {
			state = 'loading';
			return;
		}
		
		// loading ---> playing
		if (state == 'loading' && $(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			state = 'init';
			return;    
    }
   });
   
   // first load
   updateNowPlaying();
   state = 'init';
});

/**
 * Called every time we load a new song
 */ 
function updateNowPlaying(){
	var parsedInfo = parseInfo($("title").text());
	artist   = parsedInfo['artist']; 		//global
	track    = parsedInfo['track'];			//global
	duration = parsedInfo['duration']; 	//global
	
	if (artist == '' || track == '' || duration == 0) {return;}
	
	chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
            if (response != false){
			chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
		}
	});
}


function parseInfo(artistTitle) {
  var artist   = '';
  var track    = '';
	var duration = 0;
	
	duration = parseDuration(artistTitle);
	 
	artistTitle = artistTitle.replace(/\(\d+:\d+\)(.)*?/g , "");
	
	// Figure out where to split; use " - " rather than "-" 
  if (artistTitle.indexOf(' - ') > -1) {
  	track = artistTitle.substring(0, artistTitle.indexOf(' - '));
    artist = artistTitle.substring(artistTitle.indexOf(' - ') + 3);
  } else if (artistTitle.indexOf('-') > -1) {
    track = artistTitle.substring(0, artistTitle.indexOf('-'));
    artist = artistTitle.substring(artistTitle.indexOf('-') + 1);      
  } else if (artistTitle.indexOf(':') > -1) {
    track = artistTitle.substring(0, artistTitle.indexOf(':'));
    artist = artistTitle.substring(artistTitle.indexOf(':') + 1);   
  } else {
    // can't parse
    return {artist:'', track:'', duration: 0};
  }
	
	artist = artist.replace(/^\s+|\s+$/g,'');
  track = track.replace(/^\s+|\s+$/g,'');
	return {artist: artist, track: track, duration : duration};
}

function parseDuration(artistTitle){
	try{
		match = artistTitle.match(/\d+:\d+/g)[0]

		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	}catch(err){
		return 0;
	}
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The sixtyone song scrobbled'});
   
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