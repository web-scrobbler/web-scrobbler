/*
 * Chrome-Last.fm-Scrobbler Grooveshark Connector
 *
 * Matt Runkle - matt[at]mrunkle[dot]com
 *
 * Inspired by Pandora connector, written by Jordan Perr, jordan[at]jperr[dot]com
 *
 */

/*** Configuration ***/

// Additions to this div will trigger update
GS_WATCHED_CONTAINER = "div#now-playing-metadata";

// Returns the currently playing artist name
function GS_getArtist( ) {
   // Grab title element, since text portion can be truncated
   var artist = $("div#now-playing-metadata a.artist").attr('title');
   if( artist == undefined ) {
      // Fall back to text portion if title attr is empty
      artist = $("div#now-playing-metadata a.artist").text();
   }
   return GS_cleanLabel( artist );
}

// Returns the currently playing track title
// Grab title element, since text portion can be truncated
function GS_getTrack( ) {
   var track = $("div#now-playing-metadata a.song").attr('title');
   if( track == undefined ) {
      // Fall back to text portion if title attr is empty
      track = $("div#now-playing-metadata a.song").text();
   }
   return GS_cleanLabel( track );
}

// Returns the song length in seconds
function GS_getDuration( ) {
   var timeArr = $("span#time-total").text().split(":");
   return parseInt( timeArr[0] ) * 60 + parseInt( timeArr[1] );
}

// Perform some common cleanup of artist/song strings
function GS_cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
GS_LAST_TRACK = "";
GS_TIMEOUT = "";


// Validates and scrobbles the currently playing song
function GS_updateNowPlaying() {
   var title = GS_getTrack();
   var artist = GS_getArtist();
   var duration = GS_getDuration();
   var newTrack = title + " " + artist;

   // Update scrobbler if necessary
   if ( newTrack != " " && newTrack != GS_LAST_TRACK ) {
      //console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);

      GS_LAST_TRACK = newTrack;
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
function GS_resetScrobbling() {
   console.log("Resetting scrobbler.");
   chrome.runtime.sendMessage({type: 'reset'});
}

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("Grooveshark scrobbling module starting up");

   // Attach listener to "recently played" song list
   $(GS_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
      //console.log( "Update triggered" );

      var nowPlaying = GS_getTrack() + " " + GS_getArtist();

      if ( nowPlaying != " " && nowPlaying != GS_LAST_TRACK ) {
         // Stop any non-scrobbled songs (i.e. song skipped)
         if( GS_TIMEOUT != "" ) {
            clearTimeout( GS_TIMEOUT );
         }

         // Schedule the next scrobble
         GS_TIMEOUT = setTimeout( GS_updateNowPlaying, 10000 );

         return;
      }
   });

   $(window).unload(function() {
      GS_resetScrobbling();
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