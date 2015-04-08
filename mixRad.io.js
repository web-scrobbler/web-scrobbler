/*
 * Chrome-Last.fm-Scrobbler MixRadio Connector
 *
 * Tua Hoang Nguyen - hoangtua.vn[at]gmail[dot]com
 *
 * Inspired by Grooveshark Connector, written by Matt Runkle - matt[at]mrunkle[dot]com
 *
 */

/*** Configuration ***/

// Additions to this div will trigger update
MR_WATCHED_CONTAINER = "#player-metadata-primary";
MR_TRACK_SELECTOR    = "#player-metadata-primary";
MR_ARTIST_SELECTOR   = "#player-metadata-secondary";
MR_DURATION_SELECTOR = "#player-scale-stop";

// Returns the currently playing artist name
function MR_getArtist( ) {
   // Grab title element, since text portion can be truncated
   var artist = $(MR_ARTIST_SELECTOR).text();
   return MR_cleanLabel( artist );
}

// Returns the currently playing track title
// Grab title element, since text portion can be truncated
function MR_getTrack( ) {
   var track = $(MR_TRACK_SELECTOR).text();
   return MR_cleanLabel( track );
}

// Returns the song length in seconds
function MR_getDuration( ) {
   var timeArr = $(MR_DURATION_SELECTOR).text().split(":");
   return parseInt( timeArr[0] ) * 60 + parseInt( timeArr[1] );
}

// Perform some common cleanup of artist/song strings
function MR_cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
MR_LAST_TRACK = "";
MR_TIMEOUT = "";


// Validates and scrobbles the currently playing song
function MR_updateNowPlaying() {
   var title = MR_getTrack();
   var artist = MR_getArtist();
   var duration = MR_getDuration();
   var newTrack = title + " " + artist;

   // Update scrobbler if necessary
   if ( newTrack != " " && newTrack != MR_LAST_TRACK ) {
      //console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);

      MR_LAST_TRACK = newTrack;
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
function MR_resetScrobbling() {
   console.log("Resetting scrobbler.");
   chrome.runtime.sendMessage({type: 'reset'});
}

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("MixRadio scrobbling module starting up");

   // Attach listener to "recently played" song list
   $(MR_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {
      //console.log( "Update triggered" );

      var nowPlaying = MR_getTrack() + " " + MR_getArtist();

      if ( nowPlaying != " " && nowPlaying != MR_LAST_TRACK ) {
         // Stop any non-scrobbled songs (i.e. song skipped)
         if( MR_TIMEOUT != "" ) {
            clearTimeout( MR_TIMEOUT );
         }

         // Schedule the next scrobble
         MR_TIMEOUT = setTimeout( MR_updateNowPlaying, 10000 );

         return;
      }
   });

   $(window).unload(function() {
      MR_resetScrobbling();
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