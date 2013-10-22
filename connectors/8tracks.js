/*
 * Chrome-Last.fm-Scrobbler 8tracks Connector
 * 
 * Matt Runkle - matt[at]mrunkle[dot]com
 *
 * Inspired by Pandora connector, written by Jordan Perr, jordan[at]jperr[dot]com
 */

/*** Configuration ***/

// Additions to this div will trigger update
ET_WATCHED_CONTAINER = "#now_playing div.title_artist";

// Returns the currently playing artist name
function ET_getArtist( ) {
   return ET_cleanLabel( $("#now_playing div.title_artist > span.a:first").text() );
}

// Returns the currently playing track title
function ET_getTrack( ) {
   return ET_cleanLabel( $("#now_playing div.title_artist > span.t:first").text() );
}

function ET_getAlbum( ) {
   return ET_cleanLabel( $("#now_playing div.album > span.detail:first").text() );
}

// Returns the number of pixels denoting the time expired in the song
function ET_getPixelsDone( ) {
   return parseInt( $("div#player_progress_bar_meter").width() );
}

// Returns the approx. numbers of seconds remaining
function ET_getTimeLeft( start, end ) {
   console.log( "pixels start: " + start + ", end: " + end);
   var pixelsPerSecond = end - start;
   var width = parseInt( $("div#player_progress_bar").width() );
   return (width / pixelsPerSecond) - (end / pixelsPerSecond);
}

// Perform some common cleanup of artist/song/album strings
function ET_cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
ET_LAST_TRACK = "";
ET_TIMEOUT = "";


// Gets the first mark of the progress bar and sets a 1 second delay
function ET_updateNowPlaying() {
   var pixels = ET_getPixelsDone();
   // What about songs longer than 473 secs?
   setTimeout(function() {ET_scrobble(pixels);}, 1000);
}

// Validates and scrobbles the currently playing song
function ET_scrobble(startPixels) {
   var duration = ET_getTimeLeft(startPixels, ET_getPixelsDone());
   var title = ET_getTrack();
	var artist = ET_getArtist();
   var album = ET_getAlbum();
   var newTrack = title + " " + artist;
   
	// Update scrobbler if necessary
	if ( newTrack != " " && newTrack != ET_LAST_TRACK ) {
      console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", album: " + album + ", duration: "+duration);
      
      ET_LAST_TRACK = newTrack;
      chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
         if (response != false) {
            // submit the validated song for scrobbling
            var song = response;
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, album: (album === "") ? null : album, duration: duration});
         } else {
            // on failure send nowPlaying 'unknown song'
            console.log( "Song validation failed!" );
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
         }
      });
	}
}

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("8tracks module starting up");
   
   // Attach listener to "recently played" song list
   $(ET_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
      console.log( "Update triggered" );
      
      var nowPlaying = ET_getTrack() + " " + ET_getArtist();
      
      if ( nowPlaying != " " && nowPlaying != ET_LAST_TRACK ) {
         // Stop any non-scrobbled songs (i.e. song skipped)
         if( ET_TIMEOUT != "" ) {
            clearTimeout( ET_TIMEOUT );
         }
         
         // Schedule the next scrobble
         ET_TIMEOUT = setTimeout( ET_updateNowPlaying, 10000 );
         
         return;
      }
   });

   $(window).unload(function() {      
      chrome.runtime.sendMessage({type: 'reset'});
      return true;      
   });
});

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