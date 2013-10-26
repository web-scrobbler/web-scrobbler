/*
 * Chrome-Last.fm-Scrobbler 8tracks Connector
 * 
 * Matt Runkle - matt[at]mrunkle[dot]com
 *
 */

/*** Configuration ***/

// Additions to this div will trigger update
WATCHED_CONTAINER = "#tracks_played";

// Returns the currently playing artist name
function getArtist( ) {
   return cleanLabel( $("#now_playing div.title_artist > span.a:first").text() );
}

// Returns the currently playing track title
function getTrack( ) {
   return cleanLabel( $("#now_playing div.title_artist > span.t:first").text() );
}

function getAlbum( ) {
   return cleanLabel( $("#now_playing div.album > span.detail:first").text() );
}

// Returns the number of pixels denoting the time expired in the song
function getPercentDone( ) {
   var width = parseInt( $("div#player_progress_bar").width() );
   return parseInt( $("div#player_progress_bar_meter").width() ) / width;
}

// Perform some common cleanup of artist/song/album strings
function cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
LAST_TRACK = "";
TIMEOUT = "";

TIME_PERCENT = 10;
START_TIME = 0;

// Since we can't just pull the song duration from the DOM
// we need to estimate. Luckily there is a nice progress bar
function tryScrobble() {
   var ratio = getPercentDone();
   
   if ( ratio > (1/TIME_PERCENT) ) {
      // Measured enough, estimate time and scrobble
      var endTime = new Date().getTime();
      var elapsed = (endTime - START_TIME) / 1000;
      
      TIMEOUT = "";
      START_TIME = 0;
      updateNowPlaying(elapsed);
      return;
   }
   
   // Set timeout based on about how long we have left, max 50s / percent
   TIMEOUT = setTimeout( tryScrobble, Math.min(500 / ratio, 50000 / TIME_PERCENT) );
}

// Validates and scrobbles the currently playing song
function updateNowPlaying(elapsed) {
   elapsed = Math.floor(elapsed);
   var duration = elapsed * TIME_PERCENT;
   var title = getTrack();
	var artist = getArtist();
   var album = getAlbum();
   var newTrack = title + " " + artist;
   
	// Update scrobbler if necessary
	if ( newTrack != " " && newTrack != LAST_TRACK ) {
      //console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", album: " + album + ", duration: " + duration);
      
      LAST_TRACK = newTrack;
      chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
         if (response != false) {
            // submit the validated song for scrobbling
            var song = response;
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track,
               album: (album === "") ? null : album, currentTime: elapsed, duration: duration});
         } else {
            // on failure send nowPlaying 'unknown song'
            console.log( "Song validation failed!" );
            chrome.runtime.sendMessage({type: 'nowPlaying', currentTime: elapsed, duration: duration});
         }
      });
	}
}

function triggerUpdate() {
   var nowPlaying = getTrack() + " " + getArtist();
   
   if ( nowPlaying != " " && nowPlaying != LAST_TRACK ) {
      START_TIME = new Date().getTime();
      
      // Stop any non-scrobbled songs (i.e. song skipped)
      if( TIMEOUT != "" ) {
         clearTimeout( TIMEOUT );
      }
      
      // Schedule the next scrobble
      TIMEOUT = setTimeout( tryScrobble, 500 );
      
      return;
   }
}

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("8tracks module starting up");
   
   // Attach listener to "recently played" song list
   $(WATCHED_CONTAINER).live('DOMNodeInserted', function(e) {
      setTimeout( triggerUpdate, 500 );   // let player update
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