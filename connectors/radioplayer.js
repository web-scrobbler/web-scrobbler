/**
 * Connector for RadioPlayer enabled streams (http://www.radioplayer.co.uk/)
 * Made by Jiminald
 * Based loosely on the Google Music connector by Sharjeel Aziz
 */

// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Global constant for the song container ....
var CONTAINER_SELECTOR = '#live-strip';


$(function(){   
  $(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {
		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;    
		}
   });
   
   // first load
   updateNowPlaying();
   
   $(window).unload(function() {

      // reset the background scrobbler song data
      // chrome.runtime.sendMessage({type: 'reset'});

      return true;
   });
});

/**
 * Called every time we load a new song
 */ 
function updateNowPlaying(){
  var parsedInfo = parseInfo($(".scrolling-text").text());
  artist   = parsedInfo['artist']; 	//global
  track    = parsedInfo['track']; //global
  duration = parsedInfo['duration'];	//global
	
  if (artist == '' || track == '') {return;}
    
  // check if the same track is being played and we have been called again
  // if the same track is being played we return
  if (clipTitle == track) 
  {
    return;
  }

  clipTitle = track;
  
  chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
	  if (response != false) {
      chrome.runtime.sendMessage({type : 'nowPlaying', artist: artist, track: track, duration: duration});
    }
    // on failure send nowPlaying 'unknown song'
    else {
      //chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
    }
  });
}

function parseInfo(artistTitle) {
  var artist   = '';
  var track    = '';
  var duration = 90; // As there is no time, we default to 90 seconds (Saves 2 alerts popping up on track change)
   
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
    return {artist:'', track:'', duration: duration};
  }
  
  artist = artist.replace(/^\s+|\s+$/g,'');
  track = track.replace(/^\s+|\s+$/g,'');

  // console.log("artist: " + artist + ", track: " + track);

  return {artist: artist, track: track, duration: duration};
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The RadioPlayer song scrobbled'});
   // scrobble
   // chrome.runtime.sendMessage({type: 'submit'});
}



/**
 * Listen for requests from scrobbler.js
 */ 
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  switch(request.type) {
    	// called after track has been successfully marked as 'now playing' at the server
        case 'nowPlayingOK':
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
