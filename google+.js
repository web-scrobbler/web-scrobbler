// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Glabal constant for the song container ....
var CONTAINER_SELECTOR = '#playlist-page';


$(function(){
	$(window).unload(function() {   
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      return true;      
   });
	$(CONTAINER_SELECTOR).live('DOMSubtreeModified', function(e) {

		if ($(CONTAINER_SELECTOR).length > 0) {
			updateNowPlaying();
			return;    
		}

   });
   
   // first load
   updateNowPlaying();
});

/**
 * Called every time we load a new song
 */ 
function updateNowPlaying(){
    var parsedInfo = parseInfo();
    
    if (parsedInfo == null)
       return;
    
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
    
    chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
	if (response != false) {
	    chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
	}
         // on failure send nowPlaying 'unknown song'
         else {
            chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
         }
    });
}


function parseInfo() {
    var artist   = '';
    var track    = '';
    var duration = 0;
    
    var actualEl = getActualElement();
	
	if(!actualEl || actualEl.length == 0) {
		return null;
	}
	
	var children = actualEl.children();
	
	var title = children.eq(1).find('span').text();
	var a_t = parseTitle(title);
	
	var artist = a_t.artist;
	var track = a_t.track;
	
	var duration = children.eq(2).text();
	duration = parseDuration(duration);

    return {artist: artist, track: track, duration : duration};
}


function getActualElement() {
	var playlist = $('#playlist-page');
	
	var actualEl;
    playlist.children().each(function() {
    	_this = $(this);
    	var classes = _this.attr('class').split(/\s+/);
    	if(classes.length > 1) {
    		actualEl = _this;
			return false;
		}
	});
	return actualEl;
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
 * Parse given string into artist and track
 * @return {artist, track}
 */  
function parseTitle(artistTitle) {
   var artist = '';
   var track = '';
   
   // Figure out where to split; use " - " rather than "-" 
   if (artistTitle.indexOf(' - ') > -1) {
      artist = artistTitle.substring(0, artistTitle.indexOf(' - '));
      track = artistTitle.substring(artistTitle.indexOf(' - ') + 3);
   } else if (artistTitle.indexOf('-') > -1) {
      artist = artistTitle.substring(0, artistTitle.indexOf('-'));
      track = artistTitle.substring(artistTitle.indexOf('-') + 1);      
   } else if (artistTitle.indexOf(':') > -1) {
      artist = artistTitle.substring(0, artistTitle.indexOf(':'));
      track = artistTitle.substring(artistTitle.indexOf(':') + 1);   
   } else {
      // can't parse
      return {artist:'', track:''};
   } 

   return cleanArtistTrack(artist, track);
}

function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap
   track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
   track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
   track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
   track = track.replace(/\s*video\s*clip/i, ''); // video clip
   track = track.replace(/\s+\(?live\)?$/i, ''); // live
   track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)
   track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
   track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
   track = track.replace(/^[\/\s,:;~-]+/, ''); // trim starting white chars and dash
   track = track.replace(/[\/\s,:;~-]+$/, ''); // trim trailing white chars and dash

   return {artist: artist, track: track};
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.extension.sendRequest({type: 'trackStats', text: 'Google+ YouTube Player song scrobbled'});
   
   // scrobble
   chrome.extension.sendRequest({type: 'submit'});
}



/**
 * Listen for requests from scrobbler.js
 */ 
chrome.extension.onRequest.addListener(
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