/*
 * Chrome-Last.fm-Scrobbler Soundozer Connector
 *
 * Malith Senaweera
 *
 * Inspired by Pandora connector, written by Jordan Perr, jordan[at]jperr[dot]com
 *
 */

/********* Configuration: ***********/
LFM_WATCHED_CONTAINER = "span#artistInfo";

function LFM_getArtist () {
  var artist = $("span#artistInfo").text();
  return artist;
}

function LFM_getTrack () {
  var track = $("span#trackInfo").text();
  return track;
}

function LFM_getDuration () {
  var dur = $("span#tracktime").text().split(":");
  return parseInt(dur[1]) * 60 + parseInt(dur[2]);
}

/********* Connector: ***********/

var LFM_LAST_TRACK = "";
var LFM_TIMEOUT = "";

function LFM_updateNowPlaying() {
  var title = LFM_getTrack();
  var artist = LFM_getArtist();
  var duration = LFM_getDuration();
  var newTrack = title + " " + artist;

  if (newTrack != " " && newTrack != LFM_LAST_TRACK) {

    LFM_LAST_TRACK = newTrack;
    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: title}, function(response) {
      if (response != false) {
        var song = response;
        chrome.runtime.sendMessage({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
      } else {
        chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration});
        }
    });
  }
}

function LFM_resetScrobbling () {
  chrome.runtime.sendMessage({type: 'reset'});
}


$(function(){
  console.log("Soundozer scrobbling module starting up");

   // Attach listener to "recently played" song list
  $(LFM_WATCHED_CONTAINER).live('DOMSubtreeModified', function(e) {

    var nowPlaying = LFM_getTrack() + " " + LFM_getArtist();

    if ( nowPlaying != " " && nowPlaying != LFM_LAST_TRACK ) {
      // Stop any non-scrobbled songs (i.e. song skipped)
      if( LFM_TIMEOUT != "" ) {
        clearTimeout( LFM_TIMEOUT );
      }

      // Schedule the next scrobble
      LFM_TIMEOUT = setTimeout( LFM_updateNowPlaying, 10000 );
      return;
      }
   });

  $(window).unload(function() {
    LFM_resetScrobbling();
    return true;
  });
});


/* Listen for requests from scrobbler.js */
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
