/**
 * Connector for Belgian radio-streaming website Radioplus.be
 * Made by Jonas
 * Based loosely on the Google Music connector by Sharjeel Aziz
 */

// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Global constant for the song container ....
var CONTAINER_SELECTOR = '.item\\+0';


$(function(){   
  $(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {
		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;    
		}
   });
   
   console.log("Last.fm Scrobbler: starting Radioplus.be connector")
   
   // first load
   updateNowPlaying();
   
   $(window).unload(function() {

      // reset the background scrobbler song data
      chrome.runtime.sendMessage({type: 'reset'});

      return true;
   });
});

/**
 * Called every time we load a new song
 */ 
function updateNowPlaying(){
  var parsedInfo = parseInfo();
  artist   = parsedInfo['artist']; 	//global
  track    = parsedInfo['track'];	//global
	
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
      chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track});
    }
    // on failure send nowPlaying 'unknown song'
    else {
      //chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
    }
  });
}


function parseInfo() {
  var artist   = '';
  var track    = '';
  var duration = 0;
  
  // Get artist and song names
  var artistValue = $(CONTAINER_SELECTOR + " .summary .artist").text(); //combinedValue[0];
  var trackParent = $(CONTAINER_SELECTOR + " .summary .song").text(); //combinedValue[1];
    
  try {
    if (null != artistValue) {
      artist = artistValue.replace(/^\s+|\s+$/g,'');
    }
    if (null != trackParent) {
      track = trackParent.replace(/^\s+|\s+$/g,'');
    }
  } catch(err) {
    return {artist: '', track: ''};
  }
  
  //console.log("artist: " + artist + ", track: " + track + ", divContents: " + divContents);
	
  return {artist: artist, track: track};
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.runtime.sendMessage({type: 'trackStats', text: 'The Radio+ song scrobbled'});
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
