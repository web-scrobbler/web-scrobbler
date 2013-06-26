/*
 * Chrome-Last.fm-Scrobbler new.myspace.com Connector by Ed Rackham
 * http://edrackham.com
 */

var durationPart 	= "#nowPlaying .time";
var totalPart 		= "#nowPlaying .duration";
var trackPart 		= ".track .title a";
var artistPart  	= ".track .artist a";
var lastTrack 		= null;

$(function(){
	cancel();
});

$(durationPart).bind('DOMSubtreeModified',function(e){
	var duration = parseDuration($(durationPart).text()+$(totalPart).text());
	if(duration.current > 0){
		var artist = $(artistPart).text();
		var track = $(trackPart).text();
		if (lastTrack != track){
			lastTrack = track;
			console.log("MySpaceScrobbler: scrobbling '" + track + "' by " + artist);
			chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
					chrome.runtime.sendMessage({type: 'nowPlaying', artist: response.artist, track: response.track, duration: duration.total});
				}else{
					chrome.runtime.sendMessage({type: 'nowPlaying', duration: duration.total});	
				}
			});
		}
	}
});

var durationRegex = /[ \n]*(\d+):(\d+)[ \n]*\/[ \n]*(\d+):(\d+)[ \n]*/;
function parseDuration(match){
	try{
		var m = durationRegex.exec(match);
		return {current: parseInt(m[1],10)*60 + parseInt(m[2],10), total: parseInt(m[3],10)*60 + parseInt(m[4],10)};
	}catch(err){
		return 0;
	}
}

function cancel(){
	$(window).unload(function() {
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});
}