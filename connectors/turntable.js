/*
 * Chrome-Last.fm-Scrobbler TurnTable.FM Connector
 * 
 * Matt Runkle - matt[at]mrunkle[dot]com
 *
 * Inspired by Pandora connector, written by Jordan Perr, jordan[at]jperr[dot]com
 */

/*** Configuration ***/

// Additions to this div will trigger update
TT_WATCHED_CONTAINER = "div#song-log";

// Returns the currently playing artist name
function TT_getArtist( ) {
   var details = $("div#song-log div.details span:first").html();
   return TT_cleanLabel( details.replace(/^|<span.*\d+:\d+$/g, '') );
}

// Returns the currently playing track title
function TT_getTrack( ) {
   return TT_cleanLabel( $("div#song-log div.title:first").text() );
}

// Returns the number of seconds left in the song
function TT_getTimeLeft( ) {
   var remainingArr = $("div#time-left").text().split(":");
   return parseInt( remainingArr[0] ) * 60 + parseInt( remainingArr[1] );
}

// Perform some common cleanup of artist/song strings
function TT_cleanLabel( label ) {
   label = label.replace( '&amp;', '&' );
   return $.trim( label );
}

/*** Scrobbler Interface ***/
TT_LAST_TRACK = "";
TT_TIMEOUT = "";


// Validates and scrobbles the currently playing song
function TT_updateNowPlaying() {
   var title = TT_getTrack();
	var artist = TT_getArtist();
	var duration = TT_getTimeLeft();
   var newTrack = title + " " + artist;
   
	// Update scrobbler if necessary
	if ( newTrack != " " && newTrack != TT_LAST_TRACK ) {
      //console.log("Submitting a now playing request. artist: "+artist+", title: "+title+", duration: "+duration);
      
      TT_LAST_TRACK = newTrack;
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

// Attach listener for song changes, filter out duplicate event firings
$(function(){
   console.log("TurnTable.fm module starting up");
   
   // Attach listener to "recently played" song list
   $(TT_WATCHED_CONTAINER).live('DOMNodeInserted', function(e) {
      //console.log( "Update triggered" );
      
      var nowPlaying = TT_getTrack() + " " + TT_getArtist();
      
      if ( nowPlaying != " " && nowPlaying != TT_LAST_TRACK ) {
         // Stop any non-scrobbled songs (i.e. song skipped)
         if( TT_TIMEOUT != "" ) {
            clearTimeout( TT_TIMEOUT );
         }
         
         // Schedule the next scrobble
         TT_TIMEOUT = setTimeout( TT_updateNowPlaying, 10000 );
         
         return;
      }
   });

   $(window).unload(function() {      
      chrome.runtime.sendMessage({type: 'reset'});
      return true;      
   });
});