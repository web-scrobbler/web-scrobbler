
/*
 *
 * Chrome-Last.fm-Scrobbler TTnetMuzik.com.tr Connector by Yasin Okumus
 *
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
			var title = $("div.playingSongTitle").text();
			
			track = title.substring(0, title.indexOf(' - '));
			artist = title.substring(title.indexOf(' - ') + 3);
			
			state = 'playing';
			
			//start listening duration loading
			$(time).bind('DOMSubtreeModified',function(e){
				// when get duration, try scrobbling
				getDuration();
			});
			
		}	
	});
});

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