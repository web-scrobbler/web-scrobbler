/*
 * Chrome-Last.fm-Scrobbler fizy.com Connector by Yasin Okumus
 * http://www.yasinokumus.com
 */
 
var player = "#playingSong";

$(function(){
	//if opened by song
	process();

	$(player).bind('DOMSubtreeModified', function(e){
		process();
	});
	
	$(window).unload(function() {      
		// reset the background scrobbler song data
		chrome.extension.sendRequest({type: 'reset'});
		return true;      
	});
});

function process(){
		var title = $(player).text().substring(11);
		var info = parseTitle(title);
		var artist = info['artist'];
		var track = info['track'];
		if(track != undefined && artist != undefined){
			chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
					var duration = (response['duration']/1000);
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