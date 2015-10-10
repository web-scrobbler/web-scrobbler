/**
 * Focus@Will scrobbling
 *
 * @author kares
 */

var global = this;

//(function {

var CONTAINER_SELECTOR = '.trackDetail';
var CONTAINER_WAIT = 1500;
var LOG;//= 'Last.fm Scrobbler [focus@will]: ';

function getArtist(context) {
   var artist = $(".artist", context).text();
   if ( artist ) {
      artist = $.trim( artist );
      var match = artist.match(/(By:)?\s*(.*)/i);
      return match ? match[2] : null;
   }
   return undefined;
}

function getTrack(context) {
   var track = $(".track", context).text();
   if( track ) {
      return $.trim( track );
   }
   return undefined;
}

function parseInfo(context) {
   return { artist: getArtist(context), track: getTrack(context) };
}

var updateQueued = false;

$(function() {
   $(CONTAINER_SELECTOR).live('DOMSubtreeModified', function() {
      LOG && console.log(LOG + 'container modified');
      // NOTE: DOM event might fire up too early e.g. only .track
      // writen to DOM (yet) - need to wait a bit to make sure :
      if ( updateQueued ) return;
      updateQueued = true;
      setTimeout(function() {
         var context = $(CONTAINER_SELECTOR);
         if ( context.length > 0 ) {
            var info = parseInfo(context);
            updateNowPlaying(info);
         }
         updateQueued = false;
      }, CONTAINER_WAIT);
   });
});

var lastTrack;

function updateNowPlaying(info) {
   var artist = ( global['artist'] = info.artist );
   var track  = ( global['track'] = info.track );
   var duration = ( global['duration'] = info.duration );
   
   LOG && console.log(LOG + 'updating now playing', info);

   if ( ! artist || ! track ) return;
   if ( lastTrack === track ) return;

   lastTrack = track;
    
   chrome.runtime.sendMessage({ type: 'validate', artist: artist, track: track }, function(response) {
      LOG && console.log(LOG + 'validated song', response);
      if ( response != false ) {
         var song = response; // submit the validated song for scrobbling
         artist = song['artist']; track = song['track']; duration = song['duration'];
      } // on failure send nowPlaying 'unknown' song
      chrome.runtime.sendMessage({ type: 'nowPlaying', artist: artist, track: track, duration: duration });
   });
}

//})();