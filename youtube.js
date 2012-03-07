// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Options
var options = {};

$(document).ready(function() {
    chrome.extension.sendRequest({type: 'getOptions'}, function(response) {
       options = response.value;
       init();
    });
});

function init() {
   // bindings to trigger song recognition on various (classic, profile) pages
   if (document.location.toString().indexOf('/watch#!v=') > -1) {
      // === AJAX page load =======================================================        

      // Hook up for changes in header (Loading... -> Artist - Title) on CLASSIC page
      $('#watch-pagetop-section').bind('DOMSubtreeModified', function(e) {      

         // simple FSM (not only) to prevent multiple calls of updateNowPlaying()                                                                

         // init ----> loading   
         if (state == 'init' && $('#watch-loading').length > 0) {      
            state = 'loading';              
            return;
         }

         // watching ----> loading
         if (state == 'watching' && 
             $('#watch-headline-title > span[title][id!=chrome-scrobbler-status]').length>0 && 
             $('#watch-headline-title > span[title][id!=chrome-scrobbler-status]').attr('title') != clipTitle
            ) {
            // fake loading state to match the next condition and reload the clip info
            state = 'loading';                    
         }

         // loading --[updateNowPlaying(), set clipTitle]--> watching
         if (state == 'loading' && $('#watch-headline-title').length > 0) {
            state = 'watching';
            clipTitle = $('#watch-headline-title > span[title][id!=chrome-scrobbler-status]').attr('title');

            updateNowPlaying();

            return;    
         }

      });     

   } else if ( $('#playnav-player').length > 0 ) {       

      // Hook up for changes in title on users profile page
      $('#playnav-video-details').bind('DOMSubtreeModified', function(e) {

         if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length > 0
               || $('#playnav-curvideo-title > a').length > 0) {

            // just check changes in the song title
            var titleEl = $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]');
            if (titleEl.length == 0)
               titleEl = $('#playnav-curvideo-title > a'); // newer version
            
            if (clipTitle != titleEl.text()) {
               updateNowPlaying();
               clipTitle = titleEl.text();
            }
         }

      });

      // fire the DOMSubtreeModified event on first pageload (the binding above is executed after full DOM load)
      $('#playnav-video-details').trigger('DOMSubtreeModified');

   } else {
      // === regular page load ====================================================

      /*
      // inject stats code
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-16968457-1']);

      (function() {
         var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
         ga.src = 'https://ssl.google-analytics.com/ga.js';
         (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
      })();
      */

      // start scrobbler
      updateNowPlaying();
   }


   // bind page unload function to discard current "now listening"
   $(window).unload(function() {      
      
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      
      return true;      
   });
}



/**
 * Parse given string into artist and track
 * @return {artist, track}
 */  
function parseInfo(artistTitle) {
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
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
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
 * Display message in front of clip title,
 * call without parameter to clean the message.
 */ 
function displayMsg(msg) {
   // consider options
   if (getOption('useYTInpage') != 1)
      return;
      
   $('#chrome-scrobbler-status').remove(); 

   if (msg) {              
      // regular page
      if ($('#watch-headline-title > span[title][id!=chrome-scrobbler-status]').length>0)         
         $('<span id="chrome-scrobbler-status" title="">'+msg+'</span>').insertBefore($('#watch-headline-title > span[title][id!=chrome-scrobbler-status]'));
      // user profile
      if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length>0)                  
         $('<span id="chrome-scrobbler-status" title="">'+msg+'</span>').insertBefore($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]'));      
   }
} 



/**
 * Called every time the player reloads
 */ 
function updateNowPlaying() {   
   
   // get the video ID
   var videoID = document.URL.match(/^[^v]+v.(.{11}).*/);
   if (videoID && videoID.length > 0)
      videoID = videoID[1];
   else
      videoID = null;
   
   // videoID from title at profile page
   if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length > 0) {
      videoID = $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').attr('onclick').toString().match(/\?v=(.{11})/);
      if (videoID && videoID.length > 0)
         videoID = videoID[1];
   }
   // videoID from title at profile page - newer version
   if ($('#playnav-curvideo-title > a').length > 0) {
      videoID = $('#playnav-curvideo-title > a').attr('href').toString().match(/\?v=(.{11})/);
      if (videoID && videoID.length > 0)
         videoID = videoID[1];
   }
   
   // something changed?
   if (!videoID) {
      console.log('If there is a YouTube player on this page, it has not been recognized. Please fill in an issue at GitHub');
      //alert('YouTube has probably changed its code. Please get newer version of the Last.fm Scrobbler extension');
      return;
   }   

   // http://code.google.com/intl/cs/apis/youtube/2.0/developers_guide_protocol_video_entries.html
   var googleURL = "http://gdata.youtube.com/feeds/api/videos/" + videoID + "?alt=json";
   
   // clear the message
   displayMsg();
   
   // Get clip info from youtube api
   chrome.extension.sendRequest({type: "xhr", url: googleURL}, function(response) {
   	var info = JSON.parse(response.text);         	
   	var parsedInfo = parseInfo(info.entry.title.$t);
      var artist = null;
      var track = null;

      // Use the #eow-title #watch-headline-show-title if available
      var track_dom = $('#eow-title').clone();
      var artist_dom = $('#watch-headline-show-title', track_dom);
      var mdata_dom = $('#watch-description-extra-info .metadata-info > span.link-like');
      if (artist_dom.length) {
        artist = artist_dom.text();
        artist_dom.remove();
        track = track_dom.text();
        parsedInfo = cleanArtistTrack(artist, track);
      }
      /*
      // Use description metadata if available
      else if ($('#watch-description-extra-info img.music-artist').length && mdata_dom.length) {
        artist = mdata_dom.text();
        track = track_dom.text();
        track.replace(artist, '');
        parsedInfo = cleanArtistTrack(artist, track);
      }*/
      else if (parsedInfo['artist'] == '') {
        parsedInfo = parseInfo(track_dom.text());
      }

      artist = parsedInfo['artist'];
      track = parsedInfo['track'];

      // get the duration from the YT API response
      var duration = '';
   	if (info.entry.media$group.media$content != undefined)
         duration = info.entry.media$group.media$content[0].duration;
      else if (info.entry.media$group.yt$duration.seconds != undefined)
         duration = info.entry.media$group.yt$duration.seconds;                	      
      
      // Validate given artist and track (even for empty strings)
      chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
         // on success send nowPlaying song
         if (response != false) {
            var song = response; // contains valid artist/track now
            // substitute the original duration with the duration of the video
            chrome.extension.sendRequest({type: 'nowPlaying', artist: song.artist, track: song.track, duration: duration});
         }
         // on failure send nowPlaying 'unknown song'
         else {
            chrome.extension.sendRequest({type: 'nowPlaying', duration: duration});
            displayMsg('Not recognized');
         }
   	});
      
   });
   
}


/**
 * Gets an value from extension's localStorage (preloaded to 'options' object because of a bug 54257)
 */
function getOption(key) {   
   return options[key];
}


/**
 * Listen for requests from scrobbler.js
 */ 
chrome.extension.onRequest.addListener(
   function(request, sender, sendResponse) {
         switch(request.type) {
            // called after track has been successfully marked as 'now playing' at the server
            case 'nowPlayingOK':
               displayMsg('Scrobbling');               
               break;
            
            // not used yet
            case 'submitOK':
               break;

            // not used yet
            case 'submitFAIL':
               //alert('submit fail');
               break; 
         }
   }
);
