/*
 * Chrome-Last.fm-Scrobbler fizy.com / fizy.org Connector by Yasin Okumus
 * http://www.yasinokumus.com
 */
 
var player = "#nowplaying";
var playingText = "#nowPlayingText";

$(function(){
	//if opened by song
	process();

	$(player).bind('DOMSubtreeModified', function(e){
		process();
	});
	
	$(window).unload(function() {      
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;      
	});
});

function process(){
	var title = $(playingText).text().replace(/^\s*\[[^\]]+\]/, ''); // [minute-second] etc. ignored
	
   var info = parseTitle(title);
	var artist = info['artist'];
	var track = info['track'];
	if(track != undefined && artist != undefined){
		chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
			if (response != false){
				var duration = (response['duration']/1000);
				chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
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

/**
 * Clean non-informative garbage from title
 * (copied from youtube.js because some musics on fizy directly come from youtube)
 */
function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap
   track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
   track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
   track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
   track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
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