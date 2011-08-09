/*
 * Chrome-Last.fm-Scrobbler GrooveShark.com Connector by Yasin Okumus
 * http://www.yasinokumus.com
 */
 
var duration = '';
var prevDur = 0;
var prevTrack ='';

var player = "#player_duration"

var songInfo;

$(function(){
	$(player).bind('DOMSubtreeModified',function(e){
		var playerHtml = $(player).html();
		
		if(playerHtml != '' && duration != playerHtml && parseDuration(playerHtml) > 90){
			duration = playerHtml;
			var song = $(".currentSongLink").attr("title");
			var artist = $("a.artist").attr("title");
			songInfo = {artist: artist, song:song, duration:duration};
			updateNowPlaying(songInfo);
			
		}
	});
	
	// bind page unload function to discard current "now listening"
   $(window).unload(function() {      
      
      // reset the background scrobbler song data
      chrome.extension.sendRequest({type: 'reset'});
      
      return true;      
   });
});

function updateNowPlaying(songInfo){
	var track = songInfo['song'];
	var artist = songInfo['artist'];
	var duration = parseDuration(songInfo['duration']);
	
	// if not same song then update
	if(prevTrack != track){
		scrob({artist:artist, track:track, duration:duration});
		prevTrack = track;
		prevDur = duration;
	} 
	//is same song, check duration; if big duration difference of the same song, then update else ignore
	else if(prevDur < duration-10 || prevDur > duration) {
		scrob({artist:artist, track:track, duration:duration});
		prevDur = duration;
	}
}

function scrob(songInfo){
	var artist = songInfo['artist'];
	var track = songInfo['track'];
	var duration = songInfo['duration'];
	chrome.extension.sendRequest({type: 'validate', artist: artist, track: track}, function(response) {
		if (response != false){
			chrome.extension.sendRequest({type: 'nowPlaying', artist: artist, track: track, duration: duration});
		}
	});
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