/**
 * TODOs
 *
 * - get rid of preloaded options and use getOption to query the background script (blocked by bug 54257)
 *
 */


// State for event handlers
var state = 'init';

// Used only to remember last song title
var clipTitle = '';  

// Timeout to scrobble track ater minimum time passes
var scrobbleTimeout = null;

// Preload options from the background script; hope that the call will be faster than DOM loading
var options = {};
chrome.extension.sendRequest({type: 'getOptions'}, function(response) {
   options = response.value;
});



$(function(){

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
            // By now, scrobbler.js should have info about song which has been marked
            // as 'now playing', but has not been submitted (scrobbled) yet.
            // Let's submit it before we load another clip!
            //scrobbleTrack();                     
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

         if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length > 0) {

            // just check changes in the song title
            var titleEl = $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]');
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
      // cancel the timeout
      if (scrobbleTimeout != null)
         window.clearTimeout(scrobbleTimeout);
      
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      
      return true;      
   });

});



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
      
   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');
   
   // Strip crap
   track = track.replace(/\*+[^\*]+\*+$/, ''); // **NEW**
   track = track.replace(/\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\([^\)]+\)$/, ''); // (whatever)   
   track = track.replace(/\.(avi|wmv|mpg|mpeg)$/i, ''); // video extensions
   track = track.replace(/of+icial video/i, ''); // official video       
   track = track.replace(/video[ ]?clip/i, ''); // video clip
   track = track.replace(/,?[ ]?live$/i, ''); // live
   
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
   
   if (msg) {              
      // regular page
      if ($('#watch-headline-title > span[title][id!=chrome-scrobbler-status]').length>0)         
         $('<span id="chrome-scrobbler-status" title="">'+msg+'</span>').insertBefore($('#watch-headline-title > span[title][id!=chrome-scrobbler-status]'));
      // user profile
      if ($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length>0)                  
         $('<span id="chrome-scrobbler-status" title="">'+msg+'</span>').insertBefore($('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]'));      
   } else {           
      $('#chrome-scrobbler-status').remove();            
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
   if (!videoID && $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').length > 0) {
      videoID = $('#playnav-curvideo-title > span[id!=chrome-scrobbler-status]').attr('onclick').toString().match(/\?v=(.{11})/);
      if (videoID && videoID.length > 0)
         videoID = videoID[1];
   }
   
   // something changed?
   if (!videoID) {
      alert('YouTube has probably changed its code. Please get newer version of the Last.fm Scrobbler extension');
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

      artist = null; // global!
      track = null; // global!

      // Use video footer info rather than parsed video title. If this info is present, it's always valid Artist - Track
      if ( $('div.watch-extra-info img.music-note').length == 1 && $('div.watch-extra-info .watch-extra-info-left').length >= 1 ) {
         artist = $('.watch-extra-info-left a strong').text();
         track = $('.watch-extra-info-left:last').text().replace(artist, '');
         track = track.replace(/^\s*\-\s*/, ''); // trim starting white chars and dash separating artist from track
         track = track.replace(/\s*$/, ''); // trim trailing white chars
      } else {
         artist = parsedInfo['artist'];
         track = parsedInfo['track'];
      }

      duration = ''; // global!
   	if (info.entry.media$group.media$content != undefined)
         duration = info.entry.media$group.media$content[0].duration;
      else if (info.entry.media$group.yt$duration.seconds != undefined)
         duration = info.entry.media$group.yt$duration.seconds;                	      
      
      // Validate given artist and track (even for empty strings; background script will refresh the omnibox icon)
      chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
   		if (response == true)
               chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
         else
            displayMsg('Not recognized');               		
   	});
      
   });
   
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   // stats
   chrome.extension.sendRequest({type: 'trackStats', text: 'YouTube video scrobbled'});
   
   // scrobble
   chrome.extension.sendRequest({type: 'submit'});
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
               var min_time = (240 < (duration/2)) ? 240 : (duration/2); //The minimum time is 240 seconds or half the track's total length. Duration comes from updateNowPlaying()
               
               // cancel any previous timeout
               if (scrobbleTimeout != null)
                  clearTimeout(scrobbleTimeout);
               
               // set up a new timeout
               scrobbleTimeout = setTimeout(
                  function(){
                     // Turns status message into black when half of videos time has been played, to indicate that we are past the minimum time for a scrobble.
                     //$("#chrome-scrobbler-status").addClass("scrobbled");
                     //$("#chrome-scrobbler-status").attr("title","The minimum time for a scrobble has past");
                     setTimeout(scrobbleTrack, 2000);
                  }, min_time*1000
               ); 
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
