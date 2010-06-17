
if (document.location.toString().indexOf('/watch#!v=') > -1) {
   // === AJAX page load =======================================================
   
   // State for event handlers
   var state = 'init';    
   var clipTitle = '';    
   
   // Hook up for changes in header (Loading... -> Artist - Title)
   $('#watch-pagetop-section').bind('DOMSubtreeModified', function(e) {      
      
      // simple FSM (not only) to prevent multiple calls of updateNowPlaying()                                                                
   
      // init ----> loading   
      if (state == 'init' && $('#watch-loading').length > 0) {      
         state = 'loading';              
         return;
      }
      
      // watching ----> loading
      if (state == 'watching' && $('#watch-headline-title > span[title]').length>0 && $('#watch-headline-title > span[title]').attr('title') != clipTitle) {
         // fake loading state to match the next condition and reload the clip info
         state = 'loading';
         // By now, scrobbler.js should have info about song which has been marked
         // as 'now playing', but has not been submitted (scrobbled) yet.
         // Let's submit it before we load another clip!
         scrobbleTrack();                     
      }
      
      // loading --[updateNowPlaying(), set clipTitle]--> watching
      if (state == 'loading' && $('#watch-headline-title').length > 0) {
         state = 'watching';
         clipTitle = $('#watch-headline-title > span[title]').attr('title');
                  
         updateNowPlaying();
         
         return;    
      }
             
   });


} else {
   // === regular page load ====================================================
   updateNowPlaying();
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
      artist = artistTitle.split(' - ')[0];
      track = artistTitle.split(' - ')[1];
   } else if (artistTitle.indexOf('-') > -1) {
      artist = artistTitle.split('-')[0];
      track = artistTitle.split('-')[1];      
   } else if (artistTitle.indexOf(':') > -1) {
      artist = artistTitle.split(':')[0];
      track = artistTitle.split(':')[1];   
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
   if (msg) {   
      if ($('#watch-headline-title > span[title]').length>0)
         $('<span id="chrome-scrobbler-status">'+msg+'</span>').insertBefore($('#watch-headline-title > span[title]'));
   } else {
      $('#chrome-scrobbler-status').remove();            
   }
} 



/**
 * Called every time the player reloads
 */ 
function updateNowPlaying() {
   // clear the message
   displayMsg();
   
   var videoID = document.URL.replace(/^[^v]+v.(.{11}).*/,"$1");
   var googleURL = "http://gdata.youtube.com/feeds/api/videos/" + videoID + "?alt=json";
   
   // Get clip info from youtube api
   chrome.extension.sendRequest({type: "xhr", url: googleURL}, function(response) {
   	var info = JSON.parse(response.text);
         	
   	var parsedInfo = parseInfo(info.entry.title.$t);
   	
   	var artist = parsedInfo['artist'];
   	var track = parsedInfo['track'];      	
   	
   	var duration = '';
   	if (info.entry.media$group.media$content != undefined)
         duration = info.entry.media$group.media$content[0].duration;
      else if (info.entry.media$group.yt$duration.seconds != undefined)
         duration = info.entry.media$group.yt$duration.seconds;             
   	
   	if (artist == '' || track == '') {
         displayMsg('Not recognized:');
         return;      
      }   	  
   	
      // Validate given artist and track       
      chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
   		if (response == true)
            chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
         else
            displayMsg('Not recognized:');
            //console.log('Not recognized: "'+artist+'" - "'+track+'"');               		
   	});
      
   });
   
}


/**
 * Simply request the scrobbler.js to submit song previusly specified by calling updateNowPlaying()
 */ 
function scrobbleTrack() {
   chrome.extension.sendRequest({type: 'submit'});      
}


/**
 * Listen for requests from scrobbler.js
 */ 
chrome.extension.onRequest.addListener(
   function(request, sender, sendResponse) {
         switch(request.type) {
            // called after track has been successfully marked as 'now playing' at the server
            case 'nowPlayingOK':
               displayMsg('Scrobbling:');         
               break;
            
            // not used yet
            case 'submitOK':
            case 'submitFAIL':
               break; 
         }
   }
);
