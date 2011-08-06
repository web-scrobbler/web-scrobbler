
/*
 *
 * Chrome-Last.fm-Scrobbler TTnetMuzik.com.tr Connector by Yasin Okumus
 * v0.2
 * - Long song names problem fixed
 * - "-" char in the song names problem fixed
 * - "(Album Version)" in the song names will not scrobbling
 */
 
// track and artist will be stored
var track = '';
var artist = '';

var state = 'init';

// change element 
var player = "#playingSong";
var time = "div.time";


$(function(){
	$(player).bind('DOMSubtreeModified',function(e){
		var songHtml = $(player).html();
		
		if(songHtml.indexOf("playingSongLoading") > -1 && state != 'loading'){
			state = 'loading';
		}
		
		// track starting here
		else if(songHtml.indexOf("playingSongTitle") > -1 && state != 'playing'){
			var title = $("div.playingSongTitle").attr("title"); 
			separation = title.lastIndexOf(' - ');
			var aTrack = title.substring(0, separation);
			var anArtist = title.substring(separation + 3);
			
			parsed = cleanArtistTrack(anArtist,aTrack);
			artist = parsed['artist'];
			track = parsed['track'];
			
			state = 'playing';
			
			//start listening duration loading
			$(time).bind('DOMSubtreeModified',function(e){
				// when get duration, try scrobbling
				getDuration();
			});
			
		}	
	});
	
	   // bind page unload function to discard current "now listening"
   $(window).unload(function() {      
      
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      
      return true;      
   });
});

function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap

   track = track.replace(/\s*(Explicit Album Version)/i, ''); // (Explicit Album Version)
   track = track.replace(/\s*(Album Version)/i, ''); // (Album Version)
   track = track.replace(/\s*(Explicit Version)/i, ''); // (Explicit Version)
   track = track.replace(/\(\s*\)/, ''); // Leftovers after e.g. (official video)

   return {artist: artist, track: track};
}

function getDuration(){
		var durationDiv = $("div.time strong").text();
		//if we have duration
		if(durationDiv != ''){
			//we have duration. stop listening (unbind)
			$(time).unbind('DOMSubtreeModified');
			// "now listening"
			var duration = parseDuration(durationDiv);
			
			chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
				chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
				}
			});
		}
}

function parseDuration(match){
	try{
		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	}catch(err){
		return 0;
	}
}