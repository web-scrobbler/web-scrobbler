/*
 * Chrome-Last.fm-Scrobbler FFTunes.com Connector by Yasin Okumus
 * http://www.yasinokumus.com
 */

var player = "#info";
var durationDiv = "#timeDuration";
var playingState = "#playingNow";
var state = "init";

$(function(){
	$(durationDiv).bind('DOMSubtreeModified',function(e){
		if(state=="init"){
			var playing = $(player).text();
			
			var durDiv = $(durationDiv).text();
			var separator = durDiv.indexOf("/");
			var duration = durDiv.substring(separator+2);
			
			if(playing != '' && duration != '' && duration != '00:00'){
				process(playing,duration);
				
				state = "done";
			}
		}
		//when the next song started automatically
		else if(state == 'done'){
			var durDiv = $(durationDiv).text();
			var separator = durDiv.indexOf("/");
			var duration = durDiv.substring(separator+2);
			if(duration == '00:00'){
				state = 'init';
			}
		}
		
	});
	//new song started by force
	$(playingState).bind('DOMSubtreeModified',function(e){
		if(state == 'done'){
			state='init';
		}
	});
	
	// bind page unload function to discard current "now listening"
	$(window).unload(function() {      
      
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      
      return true;      
	});
});

function process(title,time){
	var parsedTitle = parseTitle(title);
	
	if(parsedTitle){
		var artist = parsedTitle['artist'];
		var track = parsedTitle['track'];
		var duration = parseDuration(time); 
		chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
			if (response != false){
			chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
			}
		});
	}
}

function parseTitle(artistTitle){
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
      return false;
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

function parseDuration(match){
	try{
		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	}catch(err){
		return 0;
	}
}