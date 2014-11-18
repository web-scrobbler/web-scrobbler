/*
 * Chrome-Last.fm-Scrobbler music.douban.com/programme/* page Connector
 *
 *
 * fakelbst myj226[at]gmail.com
 * 2013-08-30
 */
var lastTrack = null;

$(function(){
	$(window).unload(function() {
		// reset the background scrobbler song data
		chrome.runtime.sendMessage({type: 'reset'});
		return true;
	});

	$("div#play-start").click(function(){
		$('#timer').bind('DOMNodeInserted', function(e){
            var currectTrack = $('#main').text();
            if(lastTrack !== currectTrack){
                lastTrack = currectTrack;
                setTimeout(updateNowPlaying, 500);
            }

            $('#play-pause').click(function(){
                chrome.runtime.sendMessage({type: "reset"});
                return;
            });
		})
	})
});

function updateNowPlaying(){
    var totalSecondValue = $('#timer').text();
    if(totalSecondValue){
        totalSecondValue = totalSecondValue.substring(3);
        var timer = +totalSecondValue.split(':')[0]*60 + +totalSecondValue.split(':')[1];
        duration = timer;
    }
    var parsedInfo = parseInfo();
    artist = parsedInfo['artist'];
    track  = parsedInfo['track'];

    chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
        if (response != false) {
            chrome.extension.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
        console.log({type: 'nowPlaying', artist: artist, track: track, duration: duration});
        }
    });
}

function parseInfo(){
    var artist = '';
    var track = '';

    var artistAndTrack = $('#main').text();
    track = artistAndTrack.split(' - ')[0];
    if(track.charAt(2) === ' '){
        track = track.substring(2);
    }else if(track.charAt(3) === ' '){
        track = track.substring(3);
    }else if(track.charAt(4) === ' '){
        track = track.substring(4);
    }
    artist = artistAndTrack.split(' - ')[1];

    return {artist: artist, track: track};
}



/**
 * Listen for requests from scrobbler.js
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.type) {

            // background calls this to see if the script is already injected
            case 'ping':
                sendResponse(true);
                break;
        }
    }
);
