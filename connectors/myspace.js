/*
 * Chrome-Last.fm-Scrobbler MySpace.com Connector by Yasin Okumus
 * http://www.yasinokumus.com
 */

var durationPart = ".duration";
var trackPart = ".songTitle";
var artistPart  = ".bandName";

$(function(){
	// bind page unload function to discard current "now listening"
	cancel();
});

$(document).ready(function(){

      console.log('DOCUMENT READY');

      // show disabled icon
      chrome.runtime.sendMessage({type: 'reportDisabled'}, function(response){
         console.log(response);
      });

      console.log('REQUEST SENT');

      /* reenable after fix
	$(durationPart).bind('DOMSubtreeModified',function(e){
		var duration = parseDuration($(durationPart).text());
		// if track list deleted
		if(duration == 0){
			cancel();
		}
		else if(duration > 90){
			var artist = $(artistPart).text();
			var track = $(trackPart).text();
			chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
				if (response != false){
					chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
				}
			});
		}
	});
      */
});

function parseDuration(match){
	try{
		mins    = match.substring(0, match.indexOf(':'));
		seconds = match.substring(match.indexOf(':')+1);
		return parseInt(mins*60) + parseInt(seconds);
	}catch(err){
		return 0;
	}
}

function cancel(){
	$(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});
}