/*
 * Chrome-Last.fm-Scrobbler Blitzr Connector
 *
 * Raphaël Chalmé-Calvet rchalmecalvet[at]yahoo[dot]fr
 *
 * Inspired by Pandora and Grooveshark connectors,
 * written by Jordan Perr, jordan[at]jperr[dot]com and Matt Runkle, matt[at]mrunkle[dot]com
 *
 */

/*** Configuration ***/

// Additions to this div will trigger update
BL_WATCHED_CONTAINER = "#playerInfo #playerTitle";

// Returns the currently playing artist name
function BL_getArtist( ) {
   // Grab title element, since text portion can be truncated
   var artist = $("#playerInfo #playerArtists").attr('title');
   if( artist == undefined ) {
      // Fall back to text portion if title attr is empty
      artist = $("#playerInfo #playerArtists").text();
   }
   return BL_cleanLabel( artist );
}

// Returns the currently playing track title
// Grab title element, since text portion can be truncated
function BL_getTrack( ) {
   var track = $("#playerInfo #playerTitle").attr('title');
   if( track == undefined ) {
      // Fall back to text portion if title attr is empty
      track = $("#playerInfo #playerTitle").text();
   }
   return BL_cleanLabel( track );
}

// Returns the song length in seconds
function BL_getDuration( ) {
   var timeArr = $("#playerInfo #playerDuration").text().split(":");
   return parseInt( timeArr[0] ) * 60 + parseInt( timeArr[1] );
}

// Perform some common cleanup of artist/song strings
function BL_cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
BL_LAST_TRACK = "";
BL_TIMEOUT = "";


// Validates and scrobbles the currently playing song
function BL_updateNowPlaying() {
   var title = BL_getTrack();
   var artist = BL_getArtist();
   var duration = BL_getDuration();
   var newTrack = title + " " + artist;

   // Update scrobbler if necessary
   if ( newTrack != " " && newTrack != BL_LAST_TRACK && duration > 0 ) {
      //console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);

      BL_LAST_TRACK = newTrack;
      chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
         if (response != false) {
            // submit the validated song for scrobbling
            var song = response;
            chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
         } else {
            // on failure send nowPlaying 'unknown song'
            console.log( "Song validation failed!" );
            chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
         }
      });
   }
}

// Resets the plugin, cancelling any queued scrobbles
function BL_resetScrobbling() {
   console.log("Resetting scrobbler.");
   chrome.runtime.sendMessage({type: 'reset'});
}

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("Blitzr scrobbling module starting up");

   BL_getTrack();
   // Attach listener to "recently played" song list
   $(BL_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
      //console.log( "Update triggered" );

      var nowPlaying = BL_getTrack() + " " + BL_getArtist();

      if ( nowPlaying != " " && nowPlaying != BL_LAST_TRACK ) {
         // Stop any non-scrobbled sonBL (i.e. song skipped)
         if( BL_TIMEOUT != "" ) {
            clearTimeout( BL_TIMEOUT );
         }

         // Schedule the next scrobble
         BL_TIMEOUT = setTimeout( BL_updateNowPlaying, 10000 );

         return;
      }
   });

   $(window).unload(function() {
      BL_resetScrobbling();
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
