/*
 *
 * Chrome-Last.fm-Scrobbler TTnetMuzik.com.tr Connector by Yasin Okumus
 * http://www.yasinokumus.com
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
      chrome.runtime.sendMessage({type: 'reset'});
      
      return true;      
   });
});

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

function getDuration(){
		var durationDiv = $("div.time strong").text();
		//if we have duration
		if(durationDiv != ''){
			//we have duration. stop listening (unbind)
			$(time).unbind('DOMSubtreeModified');
			// "now listening"
			var duration = parseDuration(durationDiv);
			
			chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
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